"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrustWalletException = void 0;
const exception_1 = require("../exception");
const types_1 = require("../types");
const maps_1 = require("../utils/maps");
const removeTrustWalletFromErrorString = (message) => message
    .replaceAll('TrustWallet', '')
    .replaceAll('Trust Wallet', '')
    .replaceAll('Trustwallet', '')
    .replaceAll('TrustWallet:', '')
    .replaceAll('Trust Wallet:', '');
class TrustWalletException extends exception_1.ConcreteException {
    constructor(error, context) {
        super(error, context);
        this.errorClass = 'TrustWalletException';
        this.type = types_1.ErrorType.WalletError;
    }
    parse() {
        const { message } = this;
        this.setMessage((0, maps_1.mapMetamaskMessage)(removeTrustWalletFromErrorString(message)));
    }
}
exports.TrustWalletException = TrustWalletException;
//# sourceMappingURL=TrustWalletException.js.map