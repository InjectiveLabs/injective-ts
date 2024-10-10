"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletException = void 0;
const exception_1 = require("../exception");
class WalletException extends exception_1.ConcreteException {
    constructor() {
        super(...arguments);
        this.errorClass = 'WalletException';
    }
}
exports.WalletException = WalletException;
//# sourceMappingURL=WalletException.js.map