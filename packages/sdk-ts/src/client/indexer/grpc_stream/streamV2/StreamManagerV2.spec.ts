import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { it, vi, expect, describe, afterEach, beforeEach } from 'vitest'
import { StreamManagerV2 } from './StreamManagerV2.js'
import { StreamState, StreamDisconnectReason } from '../../../../types/index.js'
import { IndexerGrpcDerivativesStreamV2 } from './IndexerGrpcDerivativesStreamV2.js'
import type { Mock } from 'vitest'
import type {
  StreamError,
  StreamSubscription,
} from '../../../../types/index.js'

describe('StreamManagerV2', () => {
  let mockSubscription: StreamSubscription & {
    _errorHandler?: (error: StreamError) => void
    _completeHandler?: () => void
  }
  let streamFactory: () => StreamSubscription
  let onDataCallback: Mock<(data: any) => void>

  beforeEach(() => {
    vi.useFakeTimers()

    mockSubscription = {
      unsubscribe: vi.fn(),
      on: vi.fn((event, handler) => {
        // Store handlers for testing
        if (event === 'error') mockSubscription._errorHandler = handler
        if (event === 'complete') mockSubscription._completeHandler = handler
      }),
      off: vi.fn(),
      _errorHandler: undefined,
      _completeHandler: undefined,
    } as any

    onDataCallback = vi.fn()

    streamFactory = vi.fn(() => mockSubscription)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with default config', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      expect(manager.getId()).toBe('test-stream')
      expect(manager.getState()).toBe(StreamState.Idle)
    })
  })

  describe('state transitions', () => {
    it('should transition from idle to connecting to connected', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      const stateChanges: any[] = []
      manager.on('state:change', (payload) => stateChanges.push(payload))

      manager.start()

      expect(stateChanges).toHaveLength(2)
      expect(stateChanges[0]).toEqual({
        from: StreamState.Idle,
        to: StreamState.Connecting,
      })
      expect(stateChanges[1]).toEqual({
        from: StreamState.Connecting,
        to: StreamState.Connected,
      })
      expect(manager.getState()).toBe(StreamState.Connected)
    })

    it('should transition to reconnecting on stream error', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      const stateChanges: any[] = []
      manager.on('state:change', (payload) => stateChanges.push(payload))

      manager.start()

      // Simulate error from subscription
      const streamError: StreamError = {
        code: 14,
        details: 'Connection lost',
      }
      mockSubscription._errorHandler?.(streamError)

      // Should transition to Reconnecting
      expect(manager.getState()).toBe(StreamState.Reconnecting)
      expect(stateChanges).toContainEqual({
        from: StreamState.Connected,
        to: StreamState.Reconnecting,
      })

      manager.stop()
    })

    it('should transition to stopped on user stop', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      manager.start()
      manager.stop()

      expect(manager.getState()).toBe(StreamState.Stopped)
    })
  })

  describe('retry logic', () => {
    it('should retry with exponential backoff', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
        retryConfig: {
          enabled: true,
          maxAttempts: 3,
          initialDelayMs: 1000,
          maxDelayMs: 10000,
          backoffMultiplier: 2,
          persistent: false,
        },
      })

      const retryEvents: any[] = []
      manager.on('retry', (payload) => retryEvents.push(payload))

      // Start and fail - initial attempt
      vi.mocked(streamFactory).mockImplementationOnce(() => {
        throw new Error('Connection failed')
      })

      manager.start()

      // Should have one error from initial attempt
      expect(streamFactory).toHaveBeenCalledTimes(1)

      // Fast forward to trigger first retry
      vi.advanceTimersByTime(1000)

      // Should have scheduled and executed first retry
      expect(retryEvents).toHaveLength(1)
      expect(retryEvents[0]).toEqual({
        attempt: 1,
        delayMs: 1000,
        nextBackoff: 2000,
      })

      // Should have attempted second connection
      expect(streamFactory).toHaveBeenCalledTimes(2)
    })

    it('should respect maxAttempts', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
        retryConfig: {
          enabled: true,
          maxAttempts: 2,
          initialDelayMs: 100,
          maxDelayMs: 1000,
          backoffMultiplier: 2,
          persistent: false,
        },
      })

      const errorEvents: any[] = []
      manager.on('error', (payload) => errorEvents.push(payload))

      // Always fail
      vi.mocked(streamFactory).mockImplementation(() => {
        throw new Error('Always fails')
      })

      manager.start() // Initial attempt fails (error emitted)

      // Fast forward through all retries
      vi.advanceTimersByTime(100) // First retry (error emitted)
      vi.advanceTimersByTime(200) // Second retry (error emitted)

      // After maxAttempts exhausted, should emit "Max retries reached" error
      // Total errors: 3 from failed attempts + 1 "max retries reached" = 4
      const maxRetriesError = errorEvents.find((e) =>
        e.message.includes('Max retries'),
      )
      expect(maxRetriesError).toBeTruthy()
      expect(maxRetriesError.message).toContain('Max retries (2) reached')
      expect(manager.getState()).toBe(StreamState.Stopped)
    })

    it('should use persistent mode after exhausting backoff', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
        retryConfig: {
          enabled: true,
          maxAttempts: 2,
          initialDelayMs: 100,
          maxDelayMs: 1000,
          backoffMultiplier: 2,
          persistent: true,
        },
      })

      const retryEvents: any[] = []
      manager.on('retry', (payload) => retryEvents.push(payload))

      // Always fail
      vi.mocked(streamFactory).mockImplementation(() => {
        throw new Error('Always fails')
      })

      manager.start() // Initial attempt

      // Fast forward through exponential backoff
      vi.advanceTimersByTime(100) // First retry (attempt 1)
      vi.advanceTimersByTime(200) // Second retry (attempt 2)
      vi.advanceTimersByTime(1000) // Persistent retry (attempt 3)

      // Should now be in persistent mode (keeps retrying at maxDelayMs)
      expect(retryEvents.length).toBeGreaterThanOrEqual(3)
      expect(retryEvents[2]).toEqual({
        attempt: 3,
        delayMs: 1000, // maxDelayMs
        nextBackoff: 1000, // Still maxDelayMs in persistent mode
      })
    })

    it('should reset retry count after successful connection', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      // First attempt fails
      vi.mocked(streamFactory).mockImplementationOnce(() => {
        throw new Error('First failure')
      })

      manager.start()
      vi.advanceTimersByTime(1000) // Trigger retry

      // Second attempt succeeds
      vi.mocked(streamFactory).mockImplementationOnce(() => mockSubscription)

      vi.advanceTimersByTime(2000) // Trigger retry

      expect(streamFactory).toHaveBeenCalledTimes(2)
      expect(manager.getState()).toBe(StreamState.Connected)
    })
  })

  describe('event emission', () => {
    it('should emit connect event on successful connection', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      const connectEvents: any[] = []
      manager.on('connect', (payload) => connectEvents.push(payload))

      manager.start()

      expect(connectEvents).toHaveLength(1)
      expect(connectEvents[0]).toEqual({
        isReconnect: false,
        attempt: 0,
      })
    })

    it('should emit disconnect event with reason', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      const disconnectEvents: any[] = []
      manager.on('disconnect', (payload) => disconnectEvents.push(payload))

      manager.start()
      manager.stop()

      expect(disconnectEvents).toHaveLength(1)
      expect(disconnectEvents[0]).toEqual({
        reason: StreamDisconnectReason.UserStopped,
        willRetry: false,
        attempt: 0,
      })
    })

    it('should emit data event on stream response', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      const dataEvents: any[] = []
      manager.on('data', (payload) => dataEvents.push(payload))

      manager.start()

      // Simulate data using proper emit pattern
      // In real usage, the stream callback would call manager.emit('data', response)
      const testData = { price: '100', quantity: '10' }
      manager.emit('data', testData)

      expect(dataEvents).toHaveLength(1)
      expect(dataEvents[0]).toEqual(testData)
      expect(onDataCallback).toHaveBeenCalledWith(testData)
    })

    it('should emit error event on stream error', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      const errorEvents: any[] = []
      manager.on('error', (payload) => errorEvents.push(payload))

      const error = new Error('Stream error')
      vi.mocked(streamFactory).mockImplementationOnce(() => {
        throw error
      })

      manager.start()

      expect(errorEvents).toHaveLength(1)
      expect(errorEvents[0].message).toBe('Stream error')
      expect(errorEvents[0].details).toBe(error.stack)
    })

    it('should handle subscription error events', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      const errorEvents: any[] = []
      const disconnectEvents: any[] = []
      manager.on('error', (payload) => errorEvents.push(payload))
      manager.on('disconnect', (payload) => disconnectEvents.push(payload))

      manager.start()

      // Simulate error from subscription
      const streamError: StreamError = {
        code: 14,
        details: 'UNAVAILABLE',
      }
      mockSubscription._errorHandler?.(streamError)

      expect(errorEvents).toHaveLength(1)
      expect(errorEvents[0].message).toBe('UNAVAILABLE')
      expect(manager.getState()).toBe(StreamState.Reconnecting)
      expect(disconnectEvents[0].reason).toBe(
        StreamDisconnectReason.NetworkError,
      )
    })

    it('should handle subscription complete events', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      const disconnectEvents: any[] = []
      manager.on('disconnect', (payload) => disconnectEvents.push(payload))

      manager.start()

      // Simulate stream completion
      mockSubscription._completeHandler?.()

      expect(disconnectEvents).toHaveLength(1)
      expect(disconnectEvents[0].reason).toBe(
        StreamDisconnectReason.StreamEnded,
      )
      expect(manager.getState()).toBe(StreamState.Reconnecting)
    })
  })

  describe('gRPC error code mapping', () => {
    it('should map gRPC error codes to disconnect reasons', () => {
      const testCases = [
        { code: 14, expected: StreamDisconnectReason.NetworkError },
        { code: 4, expected: StreamDisconnectReason.Timeout },
        { code: 16, expected: StreamDisconnectReason.AuthenticationError },
        { code: 1, expected: StreamDisconnectReason.UserStopped },
        { code: 99, expected: StreamDisconnectReason.StreamError },
      ]

      testCases.forEach(({ code, expected }) => {
        const manager = new StreamManagerV2({
          id: 'test-stream',
          streamFactory,
          onData: onDataCallback,
        })

        const disconnectEvents: any[] = []
        manager.on('disconnect', (payload) => disconnectEvents.push(payload))

        manager.start()

        // Simulate error with specific code
        const streamError: StreamError = {
          code,
          details: `Error ${code}`,
        }
        mockSubscription._errorHandler?.(streamError)

        expect(disconnectEvents[0].reason).toBe(expected)
        manager.stop()
      })
    })

    it('should map network errors (code 14) and trigger retry', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      manager.start()

      const streamError: StreamError = {
        code: 14,
        details: 'Network unavailable',
      }
      mockSubscription._errorHandler?.(streamError)

      expect(manager.getState()).toBe(StreamState.Reconnecting)
    })

    it('should map timeout errors (code 4) and trigger retry', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      manager.start()

      const streamError: StreamError = {
        code: 4,
        details: 'Deadline exceeded',
      }
      mockSubscription._errorHandler?.(streamError)

      expect(manager.getState()).toBe(StreamState.Reconnecting)
    })

    it('should map authentication errors (code 16) and trigger retry', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      manager.start()

      const streamError: StreamError = {
        code: 16,
        details: 'Unauthenticated',
      }
      mockSubscription._errorHandler?.(streamError)

      expect(manager.getState()).toBe(StreamState.Reconnecting)
    })

    it('should not retry on user cancelled (code 1)', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      const disconnectEvents: any[] = []
      manager.on('disconnect', (payload) => disconnectEvents.push(payload))

      manager.start()

      const streamError: StreamError = {
        code: 1,
        details: 'Cancelled',
      }
      mockSubscription._errorHandler?.(streamError)

      expect(manager.getState()).toBe(StreamState.Stopped)
      expect(disconnectEvents[0].willRetry).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle multiple start calls gracefully', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      const warnEvents: any[] = []
      manager.on('warn', (payload) => warnEvents.push(payload))

      manager.start()
      manager.start() // Second call

      expect(warnEvents).toHaveLength(1)
      expect(warnEvents[0].message).toContain('already started')
      expect(streamFactory).toHaveBeenCalledTimes(1)
    })

    it('should handle callback errors gracefully', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
      })

      const errorEvents: any[] = []
      manager.on('error', (payload) => errorEvents.push(payload))

      // Callback throws error
      onDataCallback.mockImplementationOnce(() => {
        throw new Error('Callback error')
      })

      manager.start()

      // Emit data which will trigger the callback
      manager.emit('data', 'test-data')

      expect(errorEvents).toHaveLength(1)
      expect(errorEvents[0].message).toBe('Callback error')
    })

    it('should handle stop during retry', () => {
      const manager = new StreamManagerV2({
        id: 'test-stream',
        streamFactory,
        onData: onDataCallback,
        retryConfig: {
          enabled: true,
          maxAttempts: 3,
          initialDelayMs: 1000,
          maxDelayMs: 5000,
          backoffMultiplier: 2,
          persistent: true,
        },
      })

      // Fail first attempt
      vi.mocked(streamFactory).mockImplementationOnce(() => {
        throw new Error('First failure')
      })

      manager.start()

      // Stop during retry delay
      vi.advanceTimersByTime(500)
      manager.stop()

      expect(manager.getState()).toBe(StreamState.Stopped)
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      vi.useRealTimers()
    })

    afterEach(() => {
      vi.useFakeTimers()
    })

    it('should connect to real derivatives markets stream', async () => {
      const endpoints = getNetworkEndpoints(Network.MainnetSentry)
      const derivativesStream = new IndexerGrpcDerivativesStreamV2(
        endpoints.indexer,
      )

      const dataReceived: any[] = []
      const onData = (response: any) => {
        dataReceived.push(response)
      }

      const manager = new StreamManagerV2({
        id: 'derivatives-markets-stream',
        streamFactory: () =>
          derivativesStream.streamMarkets({
            callback: (response) => {
              manager.emit('data', response)
            },
          }),
        onData,
        retryConfig: {
          enabled: false,
        },
      })

      const connectEvents: any[] = []
      manager.on('connect', (payload) => connectEvents.push(payload))

      manager.start()

      // Wait for connection and optionally data
      const result = await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          resolve('timeout')
        }, 5000)

        manager.on('data', () => {
          clearTimeout(timeout)
          resolve('data')
        })
      })

      // Connection should succeed
      expect(manager.getState()).toBe(StreamState.Connected)
      expect(connectEvents).toHaveLength(1)

      // Data may or may not be received depending on market activity
      if (result === 'data') {
        expect(dataReceived.length).toBeGreaterThan(0)
      }

      manager.stop()
    }, 10000)

    it('should handle stream lifecycle correctly with real endpoint', async () => {
      const endpoints = getNetworkEndpoints(Network.MainnetSentry)
      const derivativesStream = new IndexerGrpcDerivativesStreamV2(
        endpoints.indexer,
      )

      const manager = new StreamManagerV2({
        id: 'lifecycle-test-stream',
        streamFactory: () =>
          derivativesStream.streamMarkets({
            callback: (response) => {
              manager.emit('data', response)
            },
          }),
        onData: () => {},
        retryConfig: {
          enabled: false,
        },
      })

      const stateChanges: any[] = []
      const disconnectEvents: any[] = []

      manager.on('state:change', (payload) => stateChanges.push(payload))
      manager.on('disconnect', (payload) => disconnectEvents.push(payload))

      // Start stream
      manager.start()

      // Wait for connection
      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, 5000)
        manager.on('connect', () => {
          clearTimeout(timeout)
          resolve('connected')
        })
      })

      expect(manager.getState()).toBe(StreamState.Connected)
      expect(stateChanges).toContainEqual({
        from: StreamState.Idle,
        to: StreamState.Connecting,
      })
      expect(stateChanges).toContainEqual({
        from: StreamState.Connecting,
        to: StreamState.Connected,
      })

      // Stop stream
      manager.stop()

      expect(manager.getState()).toBe(StreamState.Stopped)
      expect(disconnectEvents).toHaveLength(1)
      expect(disconnectEvents[0].reason).toBe(
        StreamDisconnectReason.UserStopped,
      )
      expect(disconnectEvents[0].willRetry).toBe(false)
    }, 10000)

    it('should handle destroy() cleanup properly', async () => {
      const endpoints = getNetworkEndpoints(Network.MainnetSentry)
      const derivativesStream = new IndexerGrpcDerivativesStreamV2(
        endpoints.indexer,
      )

      const manager = new StreamManagerV2({
        id: 'destroy-test-stream',
        streamFactory: () =>
          derivativesStream.streamMarkets({
            callback: (response) => {
              manager.emit('data', response)
            },
          }),
        onData: () => {},
        retryConfig: {
          enabled: false,
        },
      })

      let eventCount = 0
      manager.on('data', () => {
        eventCount++
      })

      manager.start()

      // Wait for connection
      await new Promise((resolve) => {
        const timeout = setTimeout(resolve, 5000)
        manager.on('connect', () => {
          clearTimeout(timeout)
          resolve('connected')
        })
      })

      expect(manager.getState()).toBe(StreamState.Connected)

      // Destroy should stop stream and remove listeners
      manager.destroy()

      expect(manager.getState()).toBe(StreamState.Stopped)

      // Wait a bit to ensure no more events are emitted
      const countBeforeWait = eventCount
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Event count should not increase after destroy
      expect(eventCount).toBe(countBeforeWait)
    }, 10000)
  })
})
