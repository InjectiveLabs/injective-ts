"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StreamManager {
    constructor() {
        this.streams = new Map();
    }
    set(stream, streamKey) {
        if (this.streams.has(streamKey)) {
            throw new Error(`Stream ${streamKey} already exists`);
        }
        this.streams.set(streamKey, stream);
    }
    get(streamKey) {
        if (!this.streams.has(streamKey)) {
            throw new Error(`Stream ${streamKey} is not found`);
        }
        return this.streams.get(streamKey);
    }
    exists(streamKey) {
        return this.streams.has(streamKey);
    }
    cancelAll() {
        this.streams.forEach((stream) => {
            stream.cancel();
        });
        this.streams = new Map();
    }
    cancel(streamKey) {
        if (!this.streams.has(streamKey)) {
            throw new Error(`Stream ${streamKey} is not found`);
        }
        this.streams.get(streamKey).cancel();
        this.streams.delete(streamKey);
    }
    cancelIfExists(streamKey) {
        if (!this.streams.has(streamKey)) {
            return;
        }
        this.streams.get(streamKey).cancel();
        this.streams.delete(streamKey);
    }
}
exports.default = StreamManager;
//# sourceMappingURL=StreamManager.js.map