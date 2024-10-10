"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpRequestException = void 0;
const exception_1 = require("../exception");
const types_1 = require("../types");
class HttpRequestException extends exception_1.ConcreteException {
    constructor(error, context) {
        super(error, context);
        this.errorClass = 'HttpRequestException';
        this.method = types_1.HttpRequestMethod.Get;
        this.type = types_1.ErrorType.HttpRequest;
        this.method = context
            ? context.method || types_1.HttpRequestMethod.Get
            : types_1.HttpRequestMethod.Get;
    }
}
exports.HttpRequestException = HttpRequestException;
//# sourceMappingURL=HttpRequestException.js.map