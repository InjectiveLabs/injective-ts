"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OkxWalletException = void 0;
const exception_1 = require("../exception");
const types_1 = require("../types");
const maps_1 = require("../utils/maps");
const removeOkxWalletFromErrorString = (message) => message
    .replaceAll('OkxWallet', '')
    .replaceAll('Okx', '')
    .replaceAll('OkxWallet:', '');
class OkxWalletException extends exception_1.ConcreteException {
    constructor(error, context) {
        super(error, context);
        this.errorClass = 'OkxWalletException';
        this.type = types_1.ErrorType.WalletError;
    }
    parse() {
        const { message } = this;
        this.setMessage((0, maps_1.mapMetamaskMessage)(removeOkxWalletFromErrorString(message)));
    }
}
exports.OkxWalletException = OkxWalletException;
//# sourceMappingURL=OkxWalletException.js.map