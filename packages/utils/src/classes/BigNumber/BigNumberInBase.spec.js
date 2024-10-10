"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BigNumberInBase_1 = __importDefault(require("./BigNumberInBase"));
describe('bigNumberInBase', () => {
    it('should convert base to wei', () => {
        expect(new BigNumberInBase_1.default(1).toWei().toFixed()).toBe('1000000000000000000');
    });
});
//# sourceMappingURL=BigNumberInBase.spec.js.map