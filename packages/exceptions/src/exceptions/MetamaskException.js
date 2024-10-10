"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetamaskException = void 0;
const exception_1 = require("../exception");
const types_1 = require("../types");
const maps_1 = require("../utils/maps");
const removeMetamaskFromErrorString = (message) => message
    .replaceAll('Metamask', '')
    .replaceAll('MetaMask', '')
    .replaceAll('Metamask:', '');
class MetamaskException extends exception_1.ConcreteException {
    constructor(error, context) {
        super(error, context);
        this.errorClass = 'MetamaskException';
        this.type = types_1.ErrorType.WalletError;
    }
    parse() {
        const { message } = this;
        this.setMessage((0, maps_1.mapMetamaskMessage)(removeMetamaskFromErrorString(message)));
    }
}
exports.MetamaskException = MetamaskException;
//# sourceMappingURL=MetamaskException.js.map