"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CosmosWalletException = void 0;
const exception_1 = require("../exception");
const types_1 = require("../types");
class CosmosWalletException extends exception_1.ConcreteException {
    constructor(error, context) {
        super(error, context);
        this.errorClass = 'CosmosWalletException';
        this.type = types_1.ErrorType.WalletError;
    }
}
exports.CosmosWalletException = CosmosWalletException;
//# sourceMappingURL=CosmosWalletException.js.map