"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3Exception = void 0;
const exception_1 = require("../exception");
const types_1 = require("../types");
class Web3Exception extends exception_1.ConcreteException {
    constructor(error, context) {
        super(error, context);
        this.errorClass = 'Web3Exception';
        this.type = types_1.ErrorType.Web3;
    }
}
exports.Web3Exception = Web3Exception;
//# sourceMappingURL=Web3Exception.js.map