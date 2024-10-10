"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_STD_FEE_BY_DENOM = exports.DEFAULT_STD_FEE = exports.DEFAULT_TIMESTAMP_TIMEOUT_MS = exports.DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS = exports.DEFAULT_BLOCK_TIME_IN_SECONDS = exports.DEFAULT_BLOCK_TIMEOUT_HEIGHT = exports.DEFAULT_BRIDGE_FEE_AMOUNT = exports.DEFAULT_BRIDGE_FEE_PRICE = exports.DEFAULT_BRIDGE_FEE_DENOM = exports.DEFAULT_EXCHANGE_LIMIT = exports.DEFAULT_GAS_PRICE = exports.DEFAULT_IBC_GAS_LIMIT = exports.DEFAULT_GAS_LIMIT = exports.DEFAULT_FEE_DENOM = exports.INJECTIVE_DENOM = exports.INJ_DENOM = exports.ZERO_ADDRESS = void 0;
const BigNumber_1 = __importDefault(require("./classes/BigNumber/BigNumber"));
exports.ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
exports.INJ_DENOM = 'inj';
exports.INJECTIVE_DENOM = 'inj';
exports.DEFAULT_FEE_DENOM = 'inj';
exports.DEFAULT_GAS_LIMIT = 400000;
exports.DEFAULT_IBC_GAS_LIMIT = 300000;
exports.DEFAULT_GAS_PRICE = 160000000;
exports.DEFAULT_EXCHANGE_LIMIT = 200000;
exports.DEFAULT_BRIDGE_FEE_DENOM = 'inj';
exports.DEFAULT_BRIDGE_FEE_PRICE = '160000000';
exports.DEFAULT_BRIDGE_FEE_AMOUNT = '200000000000000';
exports.DEFAULT_BLOCK_TIMEOUT_HEIGHT = 120;
exports.DEFAULT_BLOCK_TIME_IN_SECONDS = 0.7;
exports.DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS = Math.floor(exports.DEFAULT_BLOCK_TIMEOUT_HEIGHT * exports.DEFAULT_BLOCK_TIME_IN_SECONDS * 1000);
exports.DEFAULT_TIMESTAMP_TIMEOUT_MS = 60 * 1000 * 3;
exports.DEFAULT_STD_FEE = {
    amount: [
        {
            amount: new BigNumber_1.default(exports.DEFAULT_GAS_LIMIT)
                .times(exports.DEFAULT_GAS_PRICE)
                .toString(),
            denom: 'inj',
        },
    ],
    gas: exports.DEFAULT_GAS_LIMIT.toString(),
    payer: '',
    granter: '',
    feePayer: '',
};
const DEFAULT_STD_FEE_BY_DENOM = (denom = 'inj') => ({
    amount: [
        {
            denom,
            amount: new BigNumber_1.default(exports.DEFAULT_GAS_LIMIT)
                .times(exports.DEFAULT_GAS_PRICE)
                .toString(),
        },
    ],
    gas: exports.DEFAULT_GAS_LIMIT.toString(),
});
exports.DEFAULT_STD_FEE_BY_DENOM = DEFAULT_STD_FEE_BY_DENOM;
//# sourceMappingURL=constants.js.map