import { RpcError } from '@protobuf-ts/runtime-rpc'
import * as Pb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_pricer_rpc_pb'
import { InjectiveRfqPricerRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_pricer_rpc_pb.client'
import { StreamManagerV2 } from './StreamManagerV2.js'
import { IndexerGrpcRfqPricerStreamV2 } from './IndexerGrpcRfqPricerStreamV2.js'
import type { RFQPricing } from '../../types/index.js'

const snapshot = Pb.PricingStreamResponse.create({
  marketId: 'market',
  ts: 123n,
  markPrice: '99.00',
  tiers: [{ notionalUsd: 237n, bid: '', ask: '100', ageMs: 2n }],
})
const expected = {
  marketId: 'market',
  timestamp: 123,
  markPrice: '99.00',
  tiers: [{ notionalUsd: 237, bid: '', ask: '100', ageMs: 2 }],
}

describe('IndexerGrpcRfqPricerStreamV2', () => {
  const stream = new IndexerGrpcRfqPricerStreamV2('http://localhost:1')

  afterEach(() => {
    vi.useRealTimers()
  })

  it('forwards constructor metadata as outgoing HTTP headers', async () => {
    const fetch = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('', {
        headers: {
          'content-type': 'application/grpc-web-text',
          'grpc-status': '0',
        },
      }),
    )
    const stream = new IndexerGrpcRfqPricerStreamV2('http://localhost:1', {
      'x-trace-id': 'rfq-pricer-test',
    })
    const subscription = stream.streamPricing({
      marketIds: ['market'],
      callback: () => {},
    })

    try {
      expect(fetch).toHaveBeenCalledOnce()
      const headers = new Headers(fetch.mock.calls[0][1]?.headers)
      expect(headers.get('x-trace-id')).toBe('rfq-pricer-test')
      await new Promise<void>((resolve, reject) => {
        subscription.on('complete', resolve)
        subscription.on('error', reject)
      })
    } finally {
      subscription.unsubscribe()
    }
  })

  it('delivers snapshots, withdrawals, and restoration without filtering', async () => {
    vi.spyOn(
      InjectiveRfqPricerRPCClient.prototype,
      'pricingStream',
    ).mockReturnValue({
      responses: (async function* () {
        yield snapshot
        yield Pb.PricingStreamResponse.create({
          marketId: 'market',
          ts: 124n,
          markPrice: '99.00',
        })
        yield snapshot
      })(),
    } as any)
    const callback = vi.fn()
    const subscription = stream.streamPricing({
      marketIds: ['market'],
      callback,
    })
    await vi.waitFor(() => expect(callback).toHaveBeenCalledTimes(3))
    expect(callback.mock.calls.map(([value]) => value)).toEqual([
      expected,
      { marketId: 'market', timestamp: 124, markPrice: '99.00', tiers: [] },
      expected,
    ])
    subscription.unsubscribe()
  })

  it.each([0, 51])('rejects %i markets without opening a stream', (count) => {
    const pricingStream = vi.spyOn(
      InjectiveRfqPricerRPCClient.prototype,
      'pricingStream',
    )
    expect(() =>
      stream.streamPricing({
        marketIds: Array(count).fill('market'),
        callback: () => {},
      }),
    ).toThrow('marketIds must contain between 1 and 50 entries')
    expect(pricingStream).not.toHaveBeenCalled()
  })

  it.each([1, 50])(
    'forwards %i markets and returns a subscription',
    (count) => {
      const pricingStream = vi
        .spyOn(InjectiveRfqPricerRPCClient.prototype, 'pricingStream')
        .mockReturnValue({ responses: (async function* () {})() } as any)
      const marketIds = Array.from({ length: count }, (_, i) => `market-${i}`)
      const subscription = stream.streamPricing({
        marketIds,
        callback: () => {},
      })
      expect(pricingStream.mock.calls[0][0]).toMatchObject({ marketIds })
      expect(pricingStream.mock.calls[0][1]?.abort).toBeInstanceOf(AbortSignal)
      expect(typeof subscription.unsubscribe).toBe('function')
      subscription.unsubscribe()
    },
  )

  it('validates callbacks before opening a stream', () => {
    const pricingStream = vi.spyOn(
      InjectiveRfqPricerRPCClient.prototype,
      'pricingStream',
    )
    expect(() =>
      stream.streamPricing({ marketIds: ['market'], callback: null as any }),
    ).toThrow('callback must be a function')
    expect(pricingStream).not.toHaveBeenCalled()
  })

  it('does not open a pre-aborted stream', () => {
    const controller = new AbortController()
    controller.abort()
    const pricingStream = vi.spyOn(
      InjectiveRfqPricerRPCClient.prototype,
      'pricingStream',
    )
    const subscription = stream.streamPricing({
      marketIds: ['market'],
      callback: () => {},
      signal: controller.signal,
    })
    expect(pricingStream).not.toHaveBeenCalled()
    expect(subscription.cancelled).toBe(true)
  })

  it.each(['abort', 'unsubscribe'])(
    'stops delivery on %s and aborts the transport',
    async (mode) => {
      const controller = new AbortController()
      let transportSignal: AbortSignal | undefined
      let release!: () => void
      const gate = new Promise<void>((resolve) => {
        release = resolve
      })
      vi.spyOn(
        InjectiveRfqPricerRPCClient.prototype,
        'pricingStream',
      ).mockImplementation((_request, options) => {
        transportSignal = options?.abort
        return {
          responses: (async function* () {
            yield snapshot
            await gate
            yield snapshot
          })(),
        } as any
      })
      const callback = vi.fn()
      const subscription = stream.streamPricing({
        marketIds: ['market'],
        callback,
        signal: controller.signal,
      })
      const error = vi.fn()
      const complete = vi.fn()
      subscription.on('error', error)
      subscription.on('complete', complete)
      await vi.waitFor(() => expect(callback).toHaveBeenCalledOnce())
      if (mode === 'abort') controller.abort()
      else subscription.unsubscribe()
      release()
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(transportSignal?.aborted).toBe(true)
      expect(subscription.cancelled).toBe(true)
      expect(callback).toHaveBeenCalledOnce()
      expect(error).not.toHaveBeenCalled()
      expect(complete).not.toHaveBeenCalled()
    },
  )

  it.each(['error', 'complete'])(
    'reconnects through StreamManagerV2 after %s',
    async (terminal) => {
      vi.useFakeTimers()
      const signals: AbortSignal[] = []
      const pricingStream = vi
        .spyOn(InjectiveRfqPricerRPCClient.prototype, 'pricingStream')
        .mockImplementation((_request, options) => {
          const signal = options!.abort!
          const attempt = signals.push(signal)
          return {
            responses: (async function* () {
              yield snapshot
              if (attempt === 1) {
                if (terminal === 'error')
                  throw new RpcError('connection lost', 'UNAVAILABLE')
                return
              }
              await new Promise<void>((resolve) =>
                signal.addEventListener('abort', () => resolve(), {
                  once: true,
                }),
              )
            })(),
          } as any
        })
      const onData = vi.fn()
      const manager: StreamManagerV2<RFQPricing> =
        new StreamManagerV2<RFQPricing>({
          id: 'rfq-pricer',
          streamFactory: () =>
            stream.streamPricing({
              marketIds: ['market'],
              callback: (data) => manager.emit('data', data),
            }),
          onData,
          retryConfig: {
            initialDelayMs: 100,
            maxDelayMs: 100,
            persistent: false,
          },
        })
      try {
        manager.start()
        await vi.advanceTimersByTimeAsync(0)
        expect(onData).toHaveBeenCalledTimes(1)
        await vi.advanceTimersByTimeAsync(100)
        expect(pricingStream).toHaveBeenCalledTimes(2)
        expect(onData).toHaveBeenCalledTimes(2)
        expect(onData).toHaveBeenLastCalledWith(expected)
        expect(signals[0].aborted).toBe(true)
        manager.stop()
        expect(signals[1].aborted).toBe(true)
        await vi.advanceTimersByTimeAsync(1000)
        expect(pricingStream).toHaveBeenCalledTimes(2)
      } finally {
        manager.destroy()
      }
    },
  )
})
