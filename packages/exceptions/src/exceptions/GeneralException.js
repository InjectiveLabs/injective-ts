"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralException = void 0;
const exception_1 = require("../exception");
class GeneralException extends exception_1.ConcreteException {
    constructor() {
        super(...arguments);
        this.errorClass = 'GeneralException';
    }
}
exports.GeneralException = GeneralException;
//# sourceMappingURL=GeneralException.js.map