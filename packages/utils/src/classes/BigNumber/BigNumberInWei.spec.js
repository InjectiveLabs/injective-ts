"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BigNumberInWei_1 = __importDefault(require("./BigNumberInWei"));
describe('bigNumberInWei', () => {
    it('should convert base to wei', () => {
        expect(new BigNumberInWei_1.default(1000000000000000000).toBase().toFixed()).toBe('1');
    });
});
//# sourceMappingURL=BigNumberInWei.spec.js.map