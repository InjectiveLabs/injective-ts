"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const store2_1 = __importDefault(require("store2"));
class LocalStorage {
    constructor(namespace) {
        this.storage = store2_1.default.namespace(namespace);
    }
    get(key, defaultValue = {}) {
        return this.storage.get(key) || defaultValue;
    }
    has(key) {
        return this.storage.has(key);
    }
    set(key, value) {
        this.storage.set(key, value);
    }
    remove(key) {
        this.storage.remove(key);
    }
    clear() {
        this.storage.clear();
    }
}
exports.default = LocalStorage;
//# sourceMappingURL=LocalStorage.js.map