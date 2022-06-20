import {
  GrpcBinaryOptionsMarketInfo,
  BinaryOptionsMarket,
} from '../types/binary-options'
import { GrpcTokenMeta, ExchangeTokenMeta } from '../types/exchange'
import {
  MarketsResponse as BinaryOptionsMarketsResponse,
  MarketResponse as BinaryOptionsMarketResponse,
} from '@injectivelabs/exchange-api/injective_binary_options_exchange_rpc_pb'

export class ExchangeGrpcBinaryOptionsTransformer {
  static grpcTokenMetaToTokenMeta(
    tokenMeta: GrpcTokenMeta | undefined,
  ): ExchangeTokenMeta | undefined {
    if (!tokenMeta) {
      return
    }

    return {
      name: tokenMeta.getName(),
      address: tokenMeta.getAddress(),
      symbol: tokenMeta.getSymbol(),
      logo: tokenMeta.getLogo(),
      decimals: tokenMeta.getDecimals(),
      updatedAt: tokenMeta.getUpdatedAt(),
      coinGeckoId: '',
    }
  }

  static marketResponseToMarket(response: BinaryOptionsMarketResponse) {
    const market = response.getMarket()!

    return ExchangeGrpcBinaryOptionsTransformer.grpcMarketToMarket(market)
  }

  static marketsResponseToMarkets(response: BinaryOptionsMarketsResponse) {
    const markets = response.getMarketsList()

    return ExchangeGrpcBinaryOptionsTransformer.grpcMarketsToMarkets(markets)
  }

  static grpcMarketToMarket(
    market: GrpcBinaryOptionsMarketInfo,
  ): BinaryOptionsMarket {
    return {
      marketId: market.getMarketId(),
      marketStatus: market.getMarketStatus(),
      ticker: market.getTicker(),
      oracleSymbol: market.getOracleSymbol(),
      oracleProvider: market.getOracleProvider(),
      oracleType: market.getOracleType(),
      oracleScaleFactor: market.getOracleScaleFactor(),
      expirationTimestamp: market.getExpirationTimestamp(),
      settlementTimestamp: market.getSettlementTimestamp(),
      quoteDenom: market.getQuoteDenom(),
      quoteToken: ExchangeGrpcBinaryOptionsTransformer.grpcTokenMetaToTokenMeta(
        market.getQuoteTokenMeta(),
      ),
      makerFeeRate: market.getMakerFeeRate(),
      takerFeeRate: market.getTakerFeeRate(),
      serviceProviderFee: market.getServiceProviderFee(),
      minPriceTickSize: market.getMinPriceTickSize(),
      minQuantityTickSize: market.getMinQuantityTickSize(),
      settlementPrice: market.getSettlementPrice(),
    }
  }

  static grpcMarketsToMarkets(
    markets: GrpcBinaryOptionsMarketInfo[],
  ): BinaryOptionsMarket[] {
    return markets.map((market) =>
      ExchangeGrpcBinaryOptionsTransformer.grpcMarketToMarket(market),
    )
  }
}
