function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return String(error)
}

/**
 * Portable aggregate for multiple teardown failures raised by
 * `StreamManager.cancelAll`.
 *
 * Native `AggregateError` is not guaranteed on the SDK's ES2018 runtime
 * target, so this error mirrors its useful surface (`errors` and an aggregate
 * message) without requiring it. A single teardown failure is rethrown as-is
 * to preserve the original error identity, while multiple failures expose the
 * complete ordered list here.
 */
export class StreamManagerCleanupError extends Error {
  readonly errors: unknown[]

  constructor(errors: unknown[]) {
    super(
      `Failed to cancel ${errors.length} streams: ${errors
        .map(getErrorMessage)
        .join('; ')}`,
    )

    this.name = 'StreamManagerCleanupError'
    this.errors = errors
  }
}

/**
 * StreamManager - Simple registry for managing multiple V1 stream subscriptions by key
 *
 * This is a lightweight utility for storing and canceling multiple V1 RxJS-based streams.
 * It accepts both cancel()-style handles and RxJS unsubscribe()-style subscriptions.
 * For V2 streams with advanced lifecycle management and retry logic, use StreamManagerV2.
 */
export default class StreamManager<T> {
  private streams: Map<T, any> = new Map()

  set(stream: any, streamKey: T) {
    if (this.streams.has(streamKey)) {
      throw new Error(`Stream ${streamKey} already exists`)
    }

    this.streams.set(streamKey, stream)
  }

  get(streamKey: T) {
    if (!this.streams.has(streamKey)) {
      throw new Error(`Stream ${streamKey} is not found`)
    }

    return this.streams.get(streamKey)
  }

  exists(streamKey: T): boolean {
    return this.streams.has(streamKey)
  }

  cancelAll() {
    const streams = Array.from(this.streams.values())
    this.streams = new Map()

    const errors: unknown[] = []

    streams.forEach((stream) => {
      try {
        this.cancelStream(stream)
      } catch (error) {
        errors.push(error)
      }
    })

    if (errors.length === 1) {
      throw errors[0]
    }

    if (errors.length > 1) {
      throw new StreamManagerCleanupError(errors)
    }
  }

  cancel(streamKey: T) {
    if (!this.streams.has(streamKey)) {
      throw new Error(`Stream ${streamKey} is not found`)
    }

    const stream = this.streams.get(streamKey)
    this.streams.delete(streamKey)
    this.cancelStream(stream)
  }

  cancelIfExists(streamKey: T) {
    if (!this.streams.has(streamKey)) {
      return
    }

    const stream = this.streams.get(streamKey)
    this.streams.delete(streamKey)
    this.cancelStream(stream)
  }

  private cancelStream(stream: any): void {
    if (!stream) {
      return
    }

    if (typeof stream.cancel === 'function') {
      stream.cancel()

      return
    }

    if (typeof stream.unsubscribe === 'function') {
      stream.unsubscribe()

      return
    }

    if (typeof stream.abort === 'function') {
      stream.abort()
    }
  }
}
