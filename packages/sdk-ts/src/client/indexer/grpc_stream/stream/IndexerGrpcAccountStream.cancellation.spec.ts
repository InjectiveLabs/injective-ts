import { IndexerGrpcAccountStream } from './IndexerGrpcAccountStream.js'

const subaccountId = '0x00'

const createIdleStream = (signal: AbortSignal) => ({
  responses: (async function* idleStream() {
    await new Promise<void>((resolve) => {
      if (signal.aborted) {
        resolve()

        return
      }

      signal.addEventListener('abort', () => resolve(), { once: true })
    })
  })(),
})

describe('IndexerGrpcAccountStream cancellation', () => {
  it('passes an idle transport signal that aborts on unsubscribe', () => {
    const streamSubaccountBalance = vi.fn(
      (_request: unknown, options: { abort: AbortSignal }) =>
        createIdleStream(options.abort),
    )
    const stream = new IndexerGrpcAccountStream('https://example.invalid')
    ;(stream as any).client = { streamSubaccountBalance }

    const subscription = stream.streamSubaccountBalance({
      subaccountId,
      callback: () => {},
    })

    const [, options] = streamSubaccountBalance.mock.calls[0]

    expect(options.abort).toBeDefined()
    expect(options.abort.aborted).toBe(false)

    subscription.unsubscribe()

    expect(options.abort.aborted).toBe(true)
  })

  it('aborts the transport when the caller signal aborts', async () => {
    const controller = new AbortController()
    const streamSubaccountBalance = vi.fn(
      (_request: unknown, options: { abort: AbortSignal }) =>
        createIdleStream(options.abort),
    )
    const onEnd = vi.fn()
    const onStatus = vi.fn()
    const stream = new IndexerGrpcAccountStream('https://example.invalid')
    ;(stream as any).client = { streamSubaccountBalance }

    const subscription = stream.streamSubaccountBalance({
      subaccountId,
      callback: () => {},
      onEndCallback: onEnd,
      onStatusCallback: onStatus,
      signal: controller.signal,
    })

    const [, options] = streamSubaccountBalance.mock.calls[0]

    controller.abort('stop')

    expect(options.abort.aborted).toBe(true)
    expect(subscription.cancelled).toBe(true)
    expect(onEnd).not.toHaveBeenCalled()
    expect(onStatus).not.toHaveBeenCalled()
  })

  it('does not create a transport when the caller signal is pre-aborted', () => {
    const controller = new AbortController()
    const streamSubaccountBalance = vi.fn()
    const stream = new IndexerGrpcAccountStream('https://example.invalid')
    ;(stream as any).client = { streamSubaccountBalance }

    controller.abort()

    const subscription = stream.streamSubaccountBalance({
      subaccountId,
      callback: () => {},
      signal: controller.signal,
    })

    expect(streamSubaccountBalance).not.toHaveBeenCalled()
    expect(subscription.cancelled).toBe(true)
  })
})
