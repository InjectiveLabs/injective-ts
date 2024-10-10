"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class HttpClient {
    constructor(endpoint, options = {
        headers: {
            'Content-Type': 'application/json',
        },
    }) {
        this.config = {};
        this.client = axios_1.default.create(Object.assign({ baseURL: endpoint, timeout: 15000 }, options));
        this.config = {};
    }
    setConfig(config) {
        this.config = config;
        return this;
    }
    get(endpoint, params = {}) {
        return this.client.get(endpoint, Object.assign({ params }, this.config));
    }
    post(endpoint, data = {}) {
        return this.client.post(endpoint, data, this.config);
    }
    put(endpoint, data = {}) {
        return this.client.put(endpoint, data, this.config);
    }
    delete(endpoint, params = {}) {
        return this.client.delete(endpoint, Object.assign({ params }, this.config));
    }
}
exports.default = HttpClient;
//# sourceMappingURL=HttpClient.js.map