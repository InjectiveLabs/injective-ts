"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BigNumber_1 = __importDefault(require("./BigNumber"));
const utils_1 = require("./utils");
class BigNumberInBase extends BigNumber_1.default {
    static make(number) {
        return new BigNumberInBase(number);
    }
    minus(n, base) {
        return new BigNumberInBase(super.minus(n, base));
    }
    plus(n, base) {
        return new BigNumberInBase(super.plus(n, base));
    }
    dividedBy(n, base) {
        return new BigNumberInBase(super.dividedBy(n, base));
    }
    div(n, base) {
        return new BigNumberInBase(super.div(n, base));
    }
    multipliedBy(n, base) {
        return new BigNumberInBase(super.multipliedBy(n, base));
    }
    times(n, base) {
        return new BigNumberInBase(super.times(n, base));
    }
    pow(n, base) {
        return new BigNumberInBase(super.pow(n, base));
    }
    toWei(decimals = 18) {
        return (0, utils_1.bigNumberBaseToWei)(this, decimals);
    }
}
exports.default = BigNumberInBase;
//# sourceMappingURL=BigNumberInBase.js.map