"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExactDecimalsFromNumber = exports.getSignificantDecimalsFromNumber = void 0;
const classes_1 = require("./classes");
const $BigNumber = classes_1.BigNumber.clone({ ROUNDING_MODE: classes_1.BigNumber.ROUND_DOWN });
const getSignificantDecimalsFromNumber = (number) => {
    if (Math.floor(new $BigNumber(number).toNumber()) === number) {
        return 0;
    }
    const parts = new $BigNumber(number).toFixed().split('.');
    const [, decimals] = parts;
    /** Number doesn't have decimals */
    if (!decimals) {
        return 0;
    }
    return decimals.length;
};
exports.getSignificantDecimalsFromNumber = getSignificantDecimalsFromNumber;
const getExactDecimalsFromNumber = (number) => {
    if (!number.toString().includes('.')) {
        return 0;
    }
    if (Number(number) % 1 === 0) {
        return 0;
    }
    const [, decimals] = number.toString().split('.');
    if (!decimals) {
        return 0;
    }
    return decimals.length;
};
exports.getExactDecimalsFromNumber = getExactDecimalsFromNumber;
//# sourceMappingURL=numbers.js.map