import { ChainId, EthereumChainId } from '@injectivelabs/ts-types';
export declare const injUsdtSpotMarket: {
    marketId: string;
    marketStatus: string;
    ticker: string;
    baseDenom: string;
    quoteDenom: string;
    quoteToken: {
        name: string;
        address: string;
        symbol: string;
        logo: string;
        decimals: number;
        coinGeckoId: string;
    };
    baseToken: {
        name: string;
        address: string;
        symbol: string;
        logo: string;
        decimals: number;
        coinGeckoId: string;
    };
    makerFeeRate: string;
    takerFeeRate: string;
    serviceProviderFee: string;
    minPriceTickSize: string;
    minQuantityTickSize: string;
};
export declare const injUsdtDerivativeMarket: {
    oracleBase: string;
    oracleQuote: string;
    oracleType: string;
    initialMarginRatio: string;
    maintenanceMarginRatio: string;
    isPerpetual: boolean;
    marketId: string;
    marketStatus: string;
    ticker: string;
    quoteDenom: string;
    makerFeeRate: string;
    takerFeeRate: string;
    serviceProviderFee: string;
    minPriceTickSize: number;
    minQuantityTickSize: number;
    perpetualMarketInfo: {
        hourlyFundingRateCap: string;
        hourlyInterestRate: string;
        nextFundingTimestamp: number;
        fundingInterval: number;
    };
    perpetualMarketFunding: {
        cumulativeFunding: string;
        cumulativePrice: string;
        lastTimestamp: number;
    };
};
export declare const mockFactory: {
    ethereumAddress: string;
    injectiveAddress: string;
    injectiveAddress2: string;
    validatorAddress: string;
    validatorAddress2: string;
    derivativeMarketId: string;
    spotMarketId: string;
    subaccountId: string;
    subaccountId2: string;
    injUsdtSpotMarket: {
        marketId: string;
        marketStatus: string;
        ticker: string;
        baseDenom: string;
        quoteDenom: string;
        quoteToken: {
            name: string;
            address: string;
            symbol: string;
            logo: string;
            decimals: number;
            coinGeckoId: string;
        };
        baseToken: {
            name: string;
            address: string;
            symbol: string;
            logo: string;
            decimals: number;
            coinGeckoId: string;
        };
        makerFeeRate: string;
        takerFeeRate: string;
        serviceProviderFee: string;
        minPriceTickSize: string;
        minQuantityTickSize: string;
    };
    injUsdtDerivativeMarket: {
        oracleBase: string;
        oracleQuote: string;
        oracleType: string;
        initialMarginRatio: string;
        maintenanceMarginRatio: string;
        isPerpetual: boolean;
        marketId: string;
        marketStatus: string;
        ticker: string;
        quoteDenom: string;
        makerFeeRate: string;
        takerFeeRate: string;
        serviceProviderFee: string;
        minPriceTickSize: number;
        minQuantityTickSize: number;
        perpetualMarketInfo: {
            hourlyFundingRateCap: string;
            hourlyInterestRate: string;
            nextFundingTimestamp: number;
            fundingInterval: number;
        };
        perpetualMarketFunding: {
            cumulativeFunding: string;
            cumulativePrice: string;
            lastTimestamp: number;
        };
    };
    orderHash: string;
    orderHash2: string;
    MAX_TIMEOUT_HEIGHT: number;
    eip712Tx: {
        tx: {
            chainId: ChainId;
            ethereumChainId: EthereumChainId;
            accountNumber: string;
            sequence: string;
            timeoutHeight: string;
            memo: string;
        };
        eip712: {
            chainId: ChainId;
            ethereumChainId: EthereumChainId;
            accountNumber: number;
            sequence: number;
            timeoutHeight: number;
            memo: string;
        };
    };
};
//# sourceMappingURL=index.d.ts.map