import {
  MarketsRequest as BinaryOptionsMarketsRequest,
  MarketsResponse as BinaryOptionsMarketsResponse,
  MarketRequest as BinaryOptionsMarketRequest,
  MarketResponse as BinaryOptionsMarketResponse,
} from '@injectivelabs/exchange-api/injective_binary_options_exchange_rpc_pb'
import { InjectiveBinaryOptionsExchangeRPC } from '@injectivelabs/exchange-api/injective_binary_options_exchange_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ExchangeGrpcBinaryOptionsTransformer } from '../transformers/ExchangeGrpcBinaryOptionsTransformer'

export class ExchangeGrpcBinaryOptionsApi extends BaseConsumer {
  async fetchMarkets(params?: { marketStatus?: string; quoteDenom?: string }) {
    const { marketStatus, quoteDenom } = params || {}

    const request = new BinaryOptionsMarketsRequest()

    if (marketStatus) {
      request.setMarketStatus(marketStatus)
    }
    if (quoteDenom) {
      request.setQuoteDenom(quoteDenom)
    }

    try {
      const response = await this.request<
        BinaryOptionsMarketsRequest,
        BinaryOptionsMarketsResponse,
        typeof InjectiveBinaryOptionsExchangeRPC.Markets
      >(request, InjectiveBinaryOptionsExchangeRPC.Markets)

      return ExchangeGrpcBinaryOptionsTransformer.marketsResponseToMarkets(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchMarket(marketId: string) {
    const request = new BinaryOptionsMarketRequest()

    request.setMarketId(marketId)

    try {
      const response = await this.request<
        BinaryOptionsMarketRequest,
        BinaryOptionsMarketResponse,
        typeof InjectiveBinaryOptionsExchangeRPC.Market
      >(request, InjectiveBinaryOptionsExchangeRPC.Market)

      return ExchangeGrpcBinaryOptionsTransformer.marketResponseToMarket(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
