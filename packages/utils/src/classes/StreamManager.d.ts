export default class StreamManager<T> {
    private streams;
    set(stream: any, streamKey: T): void;
    get(streamKey: T): any;
    exists(streamKey: T): boolean;
    cancelAll(): void;
    cancel(streamKey: T): void;
    cancelIfExists(streamKey: T): void;
}
//# sourceMappingURL=StreamManager.d.ts.map