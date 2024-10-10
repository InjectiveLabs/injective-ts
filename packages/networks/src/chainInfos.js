"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localChainInfo = exports.devnetChainInfo = exports.testnetChainInfo = exports.mainnetChainInfo = void 0;
const ts_types_1 = require("@injectivelabs/ts-types");
const utils_1 = require("@injectivelabs/utils");
exports.mainnetChainInfo = {
    feeDenom: utils_1.INJ_DENOM,
    chainId: ts_types_1.ChainId.Mainnet,
    ethereumChainId: ts_types_1.EthereumChainId.Mainnet,
    env: 'mainnet',
};
exports.testnetChainInfo = {
    feeDenom: utils_1.INJ_DENOM,
    chainId: ts_types_1.ChainId.Testnet,
    ethereumChainId: ts_types_1.EthereumChainId.Sepolia,
    env: 'testnet',
};
exports.devnetChainInfo = {
    feeDenom: utils_1.INJ_DENOM,
    chainId: ts_types_1.ChainId.Devnet,
    ethereumChainId: ts_types_1.EthereumChainId.Sepolia,
    env: 'devnet',
};
exports.localChainInfo = {
    feeDenom: utils_1.INJ_DENOM,
    chainId: ts_types_1.ChainId.Mainnet,
    ethereumChainId: ts_types_1.EthereumChainId.Mainnet,
    env: 'local',
};
//# sourceMappingURL=chainInfos.js.map