import { Network, ChainInfo, NetworkEndpoints } from './types';
export declare const networkEndpoints: Record<Network, NetworkEndpoints>;
export declare const chainInfos: Record<Network, ChainInfo>;
export declare const getNetworkEndpoints: (network: Network) => NetworkEndpoints;
/**
 * @deprecated - use getNetworkChainInfo instead
 * @param network de
 * @returns
 */
export declare const getChainInfoForNetwork: (network: Network) => ChainInfo;
export declare const getNetworkChainInfo: (network: Network) => ChainInfo;
export declare const getNetworkInfo: (network: Network) => ChainInfo & NetworkEndpoints;
export declare const isMainnet: (network: Network) => boolean;
export declare const isDevnet: (network: Network) => boolean;
export declare const isTestnet: (network: Network) => boolean;
export declare const isTestnetOrDevnet: (network: Network) => boolean;
//# sourceMappingURL=network.d.ts.map