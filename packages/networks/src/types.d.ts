import { ChainId, EthereumChainId } from '@injectivelabs/ts-types';
export declare enum Network {
    MainnetK8s = "mainnetK8s",
    MainnetLB = "mainnetLB",
    Mainnet = "mainnet",
    MainnetSentry = "mainnetSentry",
    MainnetOld = "mainnetOld",
    Staging = "staging",
    Internal = "internal",
    TestnetK8s = "testnetK8s",
    TestnetOld = "testnetOld",
    TestnetSentry = "testnetSentry",
    Testnet = "testnet",
    Devnet1 = "devnet1",
    Devnet2 = "devnet2",
    Devnet = "devnet",
    Local = "local"
}
export type NetworkEndpoints = {
    indexer: string;
    grpc: string;
    rest: string;
    rpc?: string;
    cacheGrpc?: string;
    cacheRest?: string;
    chronos?: string;
    web3gw?: string;
    explorer?: string;
};
export type UrlEndpoints = NetworkEndpoints; /** Deprecated */
export type ChainInfo = {
    feeDenom: string;
    chainId: ChainId;
    env: string;
    ethereumChainId?: EthereumChainId;
};
//# sourceMappingURL=types.d.ts.map