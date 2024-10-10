export declare const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export declare const INJ_DENOM = "inj";
export declare const INJECTIVE_DENOM = "inj";
export declare const DEFAULT_FEE_DENOM = "inj";
export declare const DEFAULT_GAS_LIMIT = 400000;
export declare const DEFAULT_IBC_GAS_LIMIT = 300000;
export declare const DEFAULT_GAS_PRICE = 160000000;
export declare const DEFAULT_EXCHANGE_LIMIT = 200000;
export declare const DEFAULT_BRIDGE_FEE_DENOM = "inj";
export declare const DEFAULT_BRIDGE_FEE_PRICE = "160000000";
export declare const DEFAULT_BRIDGE_FEE_AMOUNT = "200000000000000";
export declare const DEFAULT_BLOCK_TIMEOUT_HEIGHT = 120;
export declare const DEFAULT_BLOCK_TIME_IN_SECONDS = 0.7;
export declare const DEFAULT_TX_BLOCK_INCLUSION_TIMEOUT_IN_MS: number;
export declare const DEFAULT_TIMESTAMP_TIMEOUT_MS: number;
export declare const DEFAULT_STD_FEE: {
    amount: {
        amount: string;
        denom: string;
    }[];
    gas: string;
    payer: string;
    granter: string;
    feePayer: string;
};
export declare const DEFAULT_STD_FEE_BY_DENOM: (denom?: string) => {
    amount: {
        denom: string;
        amount: string;
    }[];
    gas: string;
};
//# sourceMappingURL=constants.d.ts.map