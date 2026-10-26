import StreamManager, { StreamManagerCleanupError } from './StreamManager.js'

function getThrown(callback: () => void): unknown {
  try {
    callback()
  } catch (error) {
    return error
  }

  throw new Error('Expected callback to throw')
}

describe('StreamManager', () => {
  it('cancels streams that expose cancel handles', () => {
    const manager = new StreamManager<string>()
    const cancel = vi.fn()

    manager.set({ cancel }, 'cancel-style')
    manager.cancel('cancel-style')

    expect(cancel).toHaveBeenCalledTimes(1)
    expect(manager.exists('cancel-style')).toBe(false)
  })

  it('unsubscribes streams that expose unsubscribe handles', () => {
    const manager = new StreamManager<string>()
    const unsubscribe = vi.fn()

    manager.set({ unsubscribe }, 'subscribe-style')
    manager.cancelAll()

    expect(unsubscribe).toHaveBeenCalledTimes(1)
    expect(manager.exists('subscribe-style')).toBe(false)
  })

  it('supports mixed handles in cancelAll and cancelIfExists', () => {
    const manager = new StreamManager<string>()
    const cancel = vi.fn()
    const unsubscribe = vi.fn()

    manager.set({ cancel }, 'a')
    manager.set({ unsubscribe }, 'b')

    manager.cancelIfExists('a')
    manager.cancelIfExists('missing')
    manager.cancelAll()

    expect(cancel).toHaveBeenCalledTimes(1)
    expect(unsubscribe).toHaveBeenCalledTimes(1)
    expect(manager.exists('b')).toBe(false)
  })

  it('falls back to abort handles', () => {
    const manager = new StreamManager<string>()
    const abort = vi.fn()

    manager.set({ abort }, 'abort-style')
    manager.cancel('abort-style')

    expect(abort).toHaveBeenCalledTimes(1)
  })

  it('attempts every teardown when the first one throws and preserves the error', () => {
    const manager = new StreamManager<string>()
    const teardownError = new Error('cancel failed')
    const cancel = vi.fn(() => {
      throw teardownError
    })
    const unsubscribe = vi.fn()
    const abort = vi.fn()

    manager.set({ cancel }, 'cancel-style')
    manager.set({ unsubscribe }, 'subscribe-style')
    manager.set({ abort }, 'abort-style')

    const thrown = getThrown(() => manager.cancelAll())

    expect(thrown).toBe(teardownError)
    expect(cancel).toHaveBeenCalledTimes(1)
    expect(unsubscribe).toHaveBeenCalledTimes(1)
    expect(abort).toHaveBeenCalledTimes(1)
    expect(manager.exists('cancel-style')).toBe(false)
    expect(manager.exists('subscribe-style')).toBe(false)
    expect(manager.exists('abort-style')).toBe(false)
  })

  it('reports every teardown error without skipping later cleanup', () => {
    const manager = new StreamManager<string>()
    const firstError = new Error('cancel failed')
    const secondError = new Error('unsubscribe failed')
    const cancel = vi.fn(() => {
      throw firstError
    })
    const unsubscribe = vi.fn(() => {
      throw secondError
    })
    const abort = vi.fn()

    manager.set({ cancel }, 'cancel-style')
    manager.set({ unsubscribe }, 'subscribe-style')
    manager.set({ abort }, 'abort-style')

    const thrown = getThrown(() => manager.cancelAll())

    expect(thrown).toBeInstanceOf(StreamManagerCleanupError)
    expect((thrown as StreamManagerCleanupError).errors).toEqual([
      firstError,
      secondError,
    ])
    expect((thrown as StreamManagerCleanupError).message).toContain(
      'cancel failed',
    )
    expect((thrown as StreamManagerCleanupError).message).toContain(
      'unsubscribe failed',
    )
    expect(abort).toHaveBeenCalledTimes(1)
    expect(manager.exists('cancel-style')).toBe(false)
    expect(manager.exists('subscribe-style')).toBe(false)
    expect(manager.exists('abort-style')).toBe(false)
  })

  it('keeps streams registered reentrantly during cancelAll', () => {
    const manager = new StreamManager<string>()
    const reentrantCancel = vi.fn()
    const cancel = vi.fn(() => {
      manager.set({ cancel: reentrantCancel }, 'reentrant')
    })

    manager.set({ cancel }, 'first')

    manager.cancelAll()

    expect(manager.exists('reentrant')).toBe(true)

    manager.cancel('reentrant')

    expect(reentrantCancel).toHaveBeenCalledTimes(1)
  })

  it('cancels every handle without throwing when cancelAll teardown succeeds', () => {
    const manager = new StreamManager<string>()
    const cancel = vi.fn()
    const unsubscribe = vi.fn()
    const abort = vi.fn()

    manager.set({ cancel }, 'cancel-style')
    manager.set({ unsubscribe }, 'subscribe-style')
    manager.set({ abort }, 'abort-style')

    expect(() => manager.cancelAll()).not.toThrow()

    expect(cancel).toHaveBeenCalledTimes(1)
    expect(unsubscribe).toHaveBeenCalledTimes(1)
    expect(abort).toHaveBeenCalledTimes(1)
    expect(manager.exists('cancel-style')).toBe(false)
    expect(manager.exists('subscribe-style')).toBe(false)
    expect(manager.exists('abort-style')).toBe(false)
  })
})
