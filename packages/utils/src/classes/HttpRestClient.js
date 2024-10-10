"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const exceptions_1 = require("@injectivelabs/exceptions");
const http_status_codes_1 = require("http-status-codes");
const HttpClient_1 = __importDefault(require("./HttpClient"));
const getErrorMessage = (error, endpoint) => {
    if (!error.response) {
        return `The request to ${endpoint} has failed.`;
    }
    return error.response.data
        ? error.response.data.message || error.response.data
        : error.response.statusText;
};
/**
 * @hidden
 */
class HttpRestClient {
    constructor(endpoint, options = {}) {
        this.client = new HttpClient_1.default(endpoint, options);
        this.endpoint = endpoint;
    }
    setConfig(config) {
        this.client.setConfig(config);
        return this;
    }
    get(endpoint, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.client.get(endpoint, params);
            }
            catch (e) {
                const error = e;
                if (axios_1.default.isAxiosError(error)) {
                    if (error.code === 'ECONNABORTED') {
                        throw new exceptions_1.HttpRequestException(new Error(error.message), {
                            code: http_status_codes_1.StatusCodes.REQUEST_TOO_LONG,
                            context: endpoint,
                            method: exceptions_1.HttpRequestMethod.Get,
                        });
                    }
                    const message = getErrorMessage(error, endpoint);
                    throw new exceptions_1.HttpRequestException(new Error(message), {
                        context: endpoint,
                        code: error.response
                            ? error.response.status
                            : http_status_codes_1.StatusCodes.BAD_REQUEST,
                        method: exceptions_1.HttpRequestMethod.Get,
                    });
                }
                throw new exceptions_1.HttpRequestException(new Error(error.message), {
                    code: exceptions_1.UnspecifiedErrorCode,
                    context: endpoint,
                    contextModule: exceptions_1.HttpRequestMethod.Get,
                });
            }
        });
    }
    post(endpoint, params = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.client.post(endpoint, params);
            }
            catch (e) {
                const error = e;
                if (axios_1.default.isAxiosError(error)) {
                    if (error.code === 'ECONNABORTED') {
                        throw new exceptions_1.HttpRequestException(new Error(error.message), {
                            code: http_status_codes_1.StatusCodes.REQUEST_TOO_LONG,
                            method: exceptions_1.HttpRequestMethod.Post,
                        });
                    }
                    const message = getErrorMessage(error, endpoint);
                    throw new exceptions_1.HttpRequestException(new Error(message), {
                        code: error.response
                            ? error.response.status
                            : http_status_codes_1.StatusCodes.BAD_REQUEST,
                        context: endpoint,
                        contextModule: exceptions_1.HttpRequestMethod.Post,
                    });
                }
                throw new exceptions_1.HttpRequestException(new Error(error.message), {
                    code: exceptions_1.UnspecifiedErrorCode,
                    context: endpoint,
                    contextModule: exceptions_1.HttpRequestMethod.Post,
                });
            }
        });
    }
}
exports.default = HttpRestClient;
//# sourceMappingURL=HttpRestClient.js.map