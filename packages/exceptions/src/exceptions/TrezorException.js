"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrezorException = void 0;
const exception_1 = require("../exception");
const types_1 = require("../types");
class TrezorException extends exception_1.ConcreteException {
    constructor(error, context) {
        super(error, context);
        this.errorClass = 'TrezorException';
        this.type = types_1.ErrorType.WalletError;
    }
}
exports.TrezorException = TrezorException;
//# sourceMappingURL=TrezorException.js.map