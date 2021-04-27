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
    this.streams.forEach((stream) => {
      stream.cancel()
    })

    this.streams = new Map()
  }

  cancel(streamKey: T) {
    if (!this.streams.has(streamKey)) {
      throw new Error(`Stream ${streamKey} is not found`)
    }

    this.streams.get(streamKey).cancel()
    this.streams.delete(streamKey)
  }

  cancelIfExists(streamKey: T) {
    if (!this.streams.has(streamKey)) {
      return
    }

    this.streams.get(streamKey).cancel()
    this.streams.delete(streamKey)
  }
}
