"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerException = void 0;
const exception_1 = require("../exception");
const types_1 = require("../types");
const helpers_1 = require("../utils/helpers");
class LedgerException extends exception_1.ConcreteException {
    constructor(error, context) {
        super(error, context);
        this.errorClass = 'LedgerException';
        this.type = types_1.ErrorType.WalletError;
    }
    parse() {
        const { message } = this;
        if ((0, helpers_1.isCommonLockedError)(message)) {
            this.setMessage('Please ensure your Ledger is connected, unlocked and your Ethereum app is open.');
        }
        if (message.includes('No device selected.')) {
            this.setMessage('Please make sure your Ledger device is connected, unlocked and your Ethereum app is open');
        }
        if (message.includes('Unable to set device configuration.')) {
            this.setMessage('Please restart your Ledger device and try connecting again');
        }
        if (message.includes('Cannot read properties of undefined')) {
            this.setMessage('Please make sure your Ledger device is connected');
        }
        if (message.toLowerCase().includes('locked')) {
            this.setMessage('Please make sure your Ledger device is connected, unlocked and your Ethereum app is open');
        }
        if (message.includes('Condition of use not satisfied') ||
            message.includes('0x6985')) {
            this.setMessage('The request has been rejected');
        }
        if (message.includes('U2F browser support is needed for Ledger.')) {
            this.setMessage('Please use the latest Chrome/Firefox browser versions to connect with your Ledger device');
        }
    }
}
exports.LedgerException = LedgerException;
//# sourceMappingURL=LedgerException.js.map