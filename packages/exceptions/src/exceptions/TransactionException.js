"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionException = void 0;
const exception_1 = require("../exception");
const types_1 = require("../types");
const maps_1 = require("../utils/maps");
class TransactionException extends exception_1.ConcreteException {
    constructor(error, context) {
        super(error, context);
        this.errorClass = 'TransactionException';
        this.type = types_1.ErrorType.ChainError;
    }
    parse() {
        const { message, context, contextModule, contextCode } = this;
        const { code, message: parsedMessage, contextModule: parsedContextModule, } = (0, maps_1.mapFailedTransactionMessage)(message, { contextCode, contextModule });
        this.setContext(context || 'Unknown');
        this.setMessage(parsedMessage);
        this.setContextCode(code);
        this.setOriginalMessage((0, maps_1.parseErrorMessage)(message));
        if (parsedContextModule) {
            this.setContextModule(parsedContextModule);
        }
    }
}
exports.TransactionException = TransactionException;
//# sourceMappingURL=TransactionException.js.map