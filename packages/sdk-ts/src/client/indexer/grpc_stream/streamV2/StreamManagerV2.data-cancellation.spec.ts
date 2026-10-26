import { StreamManagerV2 } from './StreamManagerV2.js'
import type { StreamSubscription } from '../../../../types/index.js'

const createSubscription = (): StreamSubscription => ({
  unsubscribe: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
})

describe('StreamManagerV2 data-event cancellation', () => {
  it.each(['stop', 'abort', 'destroy'] as const)(
    'does not dispatch data listeners after %s',
    (method) => {
      const controller = new AbortController()
      const onData = vi.fn()
      const listener = vi.fn()
      const manager = new StreamManagerV2({
        id: method,
        streamFactory: createSubscription,
        signal: controller.signal,
        onData,
      })
      manager.start()

      if (method === 'abort') {
        controller.abort()
      } else {
        manager[method]()
      }

      manager.on('data', listener)
      manager.emit('data', { stale: true })

      expect(onData).not.toHaveBeenCalled()
      expect(listener).not.toHaveBeenCalled()
      manager.destroy()
    },
  )

  it('does not dispatch more data listeners when onData aborts synchronously', () => {
    const controller = new AbortController()
    const onData = vi.fn(() => controller.abort())
    const listener = vi.fn()
    const manager = new StreamManagerV2({
      id: 'abort-in-onData',
      streamFactory: createSubscription,
      signal: controller.signal,
      onData,
    })
    manager.on('data', listener)
    manager.start()

    manager.emit('data', { value: 1 })

    expect(onData).toHaveBeenCalledOnce()
    expect(listener).not.toHaveBeenCalled()
    manager.destroy()
  })

  it('does not dispatch an old payload to a replacement connection', () => {
    let manager: StreamManagerV2<{ value: number }>
    const onData = vi.fn(() => {
      if (onData.mock.calls.length === 1) {
        manager.stop()
        manager.start()
      }
    })
    const listener = vi.fn()
    manager = new StreamManagerV2({
      id: 'replace-in-onData',
      streamFactory: createSubscription,
      onData,
    })
    manager.on('data', listener)
    manager.start()

    manager.emit('data', { value: 1 })
    expect(listener).not.toHaveBeenCalled()
    manager.emit('data', { value: 2 })

    expect(listener).toHaveBeenCalledExactlyOnceWith({ value: 2 })
    manager.destroy()
  })
})
