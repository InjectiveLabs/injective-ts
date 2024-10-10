export declare const prepareEip712: <T>(messages: T) => {
    endpoints: import("@injectivelabs/networks").NetworkEndpoints;
    eip712Args: {
        msgs: (T & any[]) | T[];
        fee: {
            amount: {
                amount: string;
                denom: string;
            }[];
            gas: string;
            payer: string;
            granter: string;
            feePayer: string;
        };
        tx: {
            chainId: import("packages/ts-types/dist/cjs").ChainId;
            ethereumChainId: import("packages/ts-types/dist/cjs").EthereumChainId;
            accountNumber: string;
            sequence: string;
            timeoutHeight: string;
            memo: string;
        };
        ethereumChainId: import("packages/ts-types/dist/cjs").EthereumChainId;
    };
    prepareEip712Request: {
        chainId: import("packages/ts-types/dist/cjs").EthereumChainId;
        message: any[];
        address: string;
        ethereumChainId: import("packages/ts-types/dist/cjs").EthereumChainId;
        accountNumber: number;
        sequence: number;
        timeoutHeight: number;
        memo: string;
    };
};
//# sourceMappingURL=msgs.d.ts.map