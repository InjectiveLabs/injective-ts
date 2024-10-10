import { Awaited } from './types';
export declare const sleep: (timeout: number) => Promise<void>;
/**
 * When we want to execute the promises in batch
 */
export declare const awaitAll: <T, S>(array: T[], callback: (item: T) => Promise<S>) => Promise<Awaited<S>[]>;
/**
 * When we want to execute the promises one by one
 * and not all in batch as with await Promise.all()
 */
export declare const awaitForAll: <T, S>(array: T[], callback: (item: T) => Promise<S>) => Promise<S[]>;
export declare const splitArrayToChunks: <T>({ array, chunkSize, filter, }: {
    array: T[];
    chunkSize: number;
    filter?: ((item: T) => boolean) | undefined;
}) => T[][];
export declare const getStdFeeForToken: (token?: {
    denom: string;
    decimals: number;
}, gasPrice?: string, gasLimit?: string) => {
    amount: {
        denom: string;
        amount: string;
    }[];
    gas: string;
};
export declare const getStdFeeFromObject: (args?: {
    gas?: string | number;
    payer?: string;
    granter?: string;
    gasPrice?: string | number;
    feePayer?: string;
}) => {
    amount: {
        denom: string;
        amount: string;
    }[];
    gas: string;
    payer: string | undefined; /** for Web3Gateway fee delegation */
    granter: string | undefined;
    feePayer: string | undefined;
};
export declare const getDefaultStdFee: () => {
    amount: {
        amount: string;
        denom: string;
    }[];
    gas: string;
    payer: string;
    granter: string;
    feePayer: string;
};
export declare const getStdFeeFromString: (gasPrice: string) => {
    amount: {
        denom: string;
        amount: string;
    }[];
    gas: string;
    payer: string | undefined; /** for Web3Gateway fee delegation */
    granter: string | undefined;
    feePayer: string | undefined;
};
export declare const getStdFee: (args?: string | {
    gas?: string | number;
    payer?: string;
    granter?: string;
    gasPrice?: string | number;
    feePayer?: string;
}) => {
    amount: {
        denom: string;
        amount: string;
    }[];
    gas: string;
    payer: string | undefined; /** for Web3Gateway fee delegation */
    granter: string | undefined;
    feePayer: string | undefined;
};
//# sourceMappingURL=helpers.d.ts.map