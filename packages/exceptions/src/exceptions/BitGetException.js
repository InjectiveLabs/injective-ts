"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitGetException = void 0;
const exception_1 = require("../exception");
const types_1 = require("../types");
const maps_1 = require("../utils/maps");
const removeBitGetFromErrorString = (message) => message
    .replaceAll('BitGet', '')
    .replaceAll('Bitget:', '')
    .replaceAll('Bitkeep:', '');
class BitGetException extends exception_1.ConcreteException {
    constructor(error, context) {
        super(error, context);
        this.errorClass = 'BitGetException';
        this.type = types_1.ErrorType.WalletError;
    }
    parse() {
        const { message } = this;
        this.setMessage((0, maps_1.mapMetamaskMessage)(removeBitGetFromErrorString(message)));
    }
}
exports.BitGetException = BitGetException;
//# sourceMappingURL=BitGetException.js.map