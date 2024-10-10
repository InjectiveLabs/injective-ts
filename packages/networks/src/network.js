"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTestnetOrDevnet = exports.isTestnet = exports.isDevnet = exports.isMainnet = exports.getNetworkInfo = exports.getNetworkChainInfo = exports.getChainInfoForNetwork = exports.getNetworkEndpoints = exports.chainInfos = exports.networkEndpoints = void 0;
const chainInfos_1 = require("./chainInfos");
const endpoints_1 = require("./endpoints");
const types_1 = require("./types");
exports.networkEndpoints = {
    [types_1.Network.MainnetLB]: endpoints_1.endpointsMainnetLB,
    [types_1.Network.MainnetK8s]: endpoints_1.endpointsMainnetK8s,
    [types_1.Network.MainnetSentry]: endpoints_1.endpointsMainnetSentry,
    [types_1.Network.MainnetOld]: endpoints_1.endpointsMainnetOld,
    [types_1.Network.Staging]: endpoints_1.endpointsStaging,
    [types_1.Network.Mainnet]: endpoints_1.endpointsMainnet,
    [types_1.Network.Internal]: endpoints_1.endpointsInternal,
    [types_1.Network.Devnet]: endpoints_1.endpointsDevnet,
    [types_1.Network.Devnet1]: endpoints_1.endpointsDevnet1,
    [types_1.Network.Devnet2]: endpoints_1.endpointsDevnet2,
    [types_1.Network.Testnet]: endpoints_1.endpointsTestnet,
    [types_1.Network.TestnetK8s]: endpoints_1.endpointsTestnetK8s,
    [types_1.Network.TestnetOld]: endpoints_1.endpointsTestnetOld,
    [types_1.Network.TestnetSentry]: endpoints_1.endpointsTestnetSentry,
    [types_1.Network.Local]: endpoints_1.endpointsLocal,
};
exports.chainInfos = {
    [types_1.Network.MainnetLB]: chainInfos_1.mainnetChainInfo,
    [types_1.Network.MainnetK8s]: chainInfos_1.mainnetChainInfo,
    [types_1.Network.MainnetSentry]: chainInfos_1.mainnetChainInfo,
    [types_1.Network.MainnetOld]: chainInfos_1.mainnetChainInfo,
    [types_1.Network.Staging]: chainInfos_1.mainnetChainInfo,
    [types_1.Network.Mainnet]: chainInfos_1.mainnetChainInfo,
    [types_1.Network.Internal]: chainInfos_1.mainnetChainInfo,
    [types_1.Network.Devnet]: chainInfos_1.devnetChainInfo,
    [types_1.Network.Devnet1]: chainInfos_1.devnetChainInfo,
    [types_1.Network.Devnet2]: chainInfos_1.devnetChainInfo,
    [types_1.Network.Testnet]: chainInfos_1.testnetChainInfo,
    [types_1.Network.TestnetOld]: chainInfos_1.testnetChainInfo,
    [types_1.Network.TestnetK8s]: chainInfos_1.testnetChainInfo,
    [types_1.Network.TestnetSentry]: chainInfos_1.testnetChainInfo,
    [types_1.Network.Local]: chainInfos_1.localChainInfo,
};
const getNetworkEndpoints = (network) => exports.networkEndpoints[network];
exports.getNetworkEndpoints = getNetworkEndpoints;
/**
 * @deprecated - use getNetworkChainInfo instead
 * @param network de
 * @returns
 */
const getChainInfoForNetwork = (network) => exports.chainInfos[network];
exports.getChainInfoForNetwork = getChainInfoForNetwork;
const getNetworkChainInfo = (network) => exports.chainInfos[network];
exports.getNetworkChainInfo = getNetworkChainInfo;
const getNetworkInfo = (network) => (Object.assign(Object.assign({}, exports.chainInfos[network]), exports.networkEndpoints[network]));
exports.getNetworkInfo = getNetworkInfo;
const isMainnet = (network) => [
    types_1.Network.Staging,
    types_1.Network.Mainnet,
    types_1.Network.MainnetOld,
    types_1.Network.MainnetK8s,
    types_1.Network.MainnetSentry,
    types_1.Network.Internal,
    types_1.Network.MainnetLB,
].includes(network);
exports.isMainnet = isMainnet;
const isDevnet = (network) => [types_1.Network.Devnet, types_1.Network.Devnet1, types_1.Network.Devnet2, types_1.Network.Local].includes(network);
exports.isDevnet = isDevnet;
const isTestnet = (network) => [
    types_1.Network.Testnet,
    types_1.Network.TestnetOld,
    types_1.Network.TestnetK8s,
    types_1.Network.TestnetSentry,
].includes(network);
exports.isTestnet = isTestnet;
const isTestnetOrDevnet = (network) => (0, exports.isDevnet)(network) || (0, exports.isTestnet)(network);
exports.isTestnetOrDevnet = isTestnetOrDevnet;
//# sourceMappingURL=network.js.map