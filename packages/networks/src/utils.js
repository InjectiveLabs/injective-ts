"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetPriceServiceForNetwork = exports.getPeggyGraphQlEndpointForNetwork = exports.getInjNameReverseResolverContractForNetwork = exports.getInjNameRegistryContractForNetwork = exports.getIncentivesContractForNetwork = exports.getCw20SwapContractForNetwork = exports.getCw20AdapterContractForNetwork = exports.CW20_CODE_IDS_BY_NETWORK = void 0;
const constants_1 = require("./constants");
const network_1 = require("./network");
const types_1 = require("./types");
const CW20_CODE_IDS_BY_NETWORK = (network = types_1.Network.Mainnet) => {
    if ((0, network_1.isTestnet)(network)) {
        return ['25'];
    }
    return ['28', '5', '42'];
};
exports.CW20_CODE_IDS_BY_NETWORK = CW20_CODE_IDS_BY_NETWORK;
const getCw20AdapterContractForNetwork = (network = types_1.Network.Mainnet) => {
    return constants_1.CW20_ADAPTER_CONTRACT_BY_NETWORK[network] !== undefined
        ? constants_1.CW20_ADAPTER_CONTRACT_BY_NETWORK[network]
        : constants_1.CW20_ADAPTER_CONTRACT_BY_NETWORK[types_1.Network.Mainnet];
};
exports.getCw20AdapterContractForNetwork = getCw20AdapterContractForNetwork;
const getCw20SwapContractForNetwork = (network = types_1.Network.Mainnet) => {
    return constants_1.CW20_SWAP_CONTRACT_BY_NETWORK[network] !== undefined
        ? constants_1.CW20_SWAP_CONTRACT_BY_NETWORK[network]
        : constants_1.CW20_SWAP_CONTRACT_BY_NETWORK[types_1.Network.Mainnet];
};
exports.getCw20SwapContractForNetwork = getCw20SwapContractForNetwork;
const getIncentivesContractForNetwork = (network = types_1.Network.Mainnet) => {
    return constants_1.INCENTIVES_CONTRACT_BY_NETWORK[network] !== undefined
        ? constants_1.INCENTIVES_CONTRACT_BY_NETWORK[network]
        : constants_1.INCENTIVES_CONTRACT_BY_NETWORK[types_1.Network.Mainnet];
};
exports.getIncentivesContractForNetwork = getIncentivesContractForNetwork;
const getInjNameRegistryContractForNetwork = (network = types_1.Network.Mainnet) => {
    return constants_1.INJ_NAME_REGISTRY_CONTRACT_BY_NETWORK[network] !== undefined
        ? constants_1.INJ_NAME_REGISTRY_CONTRACT_BY_NETWORK[network]
        : constants_1.INJ_NAME_REGISTRY_CONTRACT_BY_NETWORK[types_1.Network.Mainnet];
};
exports.getInjNameRegistryContractForNetwork = getInjNameRegistryContractForNetwork;
const getInjNameReverseResolverContractForNetwork = (network = types_1.Network.Mainnet) => {
    return constants_1.INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_NETWORK[network] !== undefined
        ? constants_1.INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_NETWORK[network]
        : constants_1.INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_NETWORK[types_1.Network.Mainnet];
};
exports.getInjNameReverseResolverContractForNetwork = getInjNameReverseResolverContractForNetwork;
const getPeggyGraphQlEndpointForNetwork = (network) => {
    return constants_1.PEGGY_GRAPH_URL_BY_NETWORK[network] !== undefined
        ? constants_1.PEGGY_GRAPH_URL_BY_NETWORK[network]
        : constants_1.PEGGY_GRAPH_URL_BY_NETWORK[types_1.Network.Mainnet];
};
exports.getPeggyGraphQlEndpointForNetwork = getPeggyGraphQlEndpointForNetwork;
const getAssetPriceServiceForNetwork = (network) => {
    return constants_1.ASSET_PRICE_URL_BY_NETWORK[network] !== undefined
        ? constants_1.ASSET_PRICE_URL_BY_NETWORK[network]
        : constants_1.ASSET_PRICE_URL_BY_NETWORK[types_1.Network.Mainnet];
};
exports.getAssetPriceServiceForNetwork = getAssetPriceServiceForNetwork;
//# sourceMappingURL=utils.js.map