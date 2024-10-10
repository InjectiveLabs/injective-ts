"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigNumberWeiToBase = exports.bigNumberBaseToWei = void 0;
const bignumber_js_1 = require("bignumber.js");
const bigNumberBaseToWei = (value, decimals = 18) => new bignumber_js_1.BigNumber(value).multipliedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
exports.bigNumberBaseToWei = bigNumberBaseToWei;
const bigNumberWeiToBase = (value, decimals = 18) => new bignumber_js_1.BigNumber(value).dividedBy(new bignumber_js_1.BigNumber(10).pow(decimals));
exports.bigNumberWeiToBase = bigNumberWeiToBase;
//# sourceMappingURL=utils.js.map