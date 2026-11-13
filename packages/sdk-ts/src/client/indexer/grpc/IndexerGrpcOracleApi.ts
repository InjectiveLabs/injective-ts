import { isAbortError } from '@injectivelabs/utils'
import { throwIfAborted } from '@injectivelabs/utils'
import * as InjectiveOracleRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb'
import { InjectiveOracleRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerGrpcOracleTransformer } from '../transformers/IndexerGrpcOracleTransformer.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type { OraclePriceV2Filter } from '../types/oracle.js'
import type { DerivativeMarket } from '../types/derivatives.js'

export function derivativeMarketsToOraclePriceV2Filters(
  markets: DerivativeMarket[],
): OraclePriceV2Filter[] {
  return markets.flatMap((market) => {
    if (!('oracleBase' in market) || !('oracleQuote' in market)) {
      return []
    }

    return [
      {
        oracleType: market.oracleType,
        baseSymbol: market.oracleBase,
        quoteSymbol: market.oracleQuote,
        oracleScaleFactor: market.oracleScaleFactor,
      },
    ]
  })
}

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcOracleApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Oracle

  private get client() {
    return this.initClient(InjectiveOracleRPCClient)
  }

  async fetchOracleList(options?: RequestOptions) {
    throwIfAborted(options?.signal)
    const request = InjectiveOracleRpcPb.OracleListRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveOracleRpcPb.OracleListRequest,
      InjectiveOracleRpcPb.OracleListResponse
    >(request, this.client.oracleList.bind(this.client), options)

    return IndexerGrpcOracleTransformer.oraclesResponseToOracles(response)
  }

  async fetchOraclePrice(
    {
      baseSymbol,
      quoteSymbol,
      oracleScaleFactor,
      oracleType,
    }: {
      baseSymbol: string
      quoteSymbol: string
      oracleType: string
      oracleScaleFactor?: number
    },
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request = InjectiveOracleRpcPb.PriceRequest.create()

    request.baseSymbol = baseSymbol
    request.quoteSymbol = quoteSymbol
    request.oracleType = oracleType

    if (oracleScaleFactor) {
      request.oracleScaleFactor = oracleScaleFactor
    }

    const response = await this.executeGrpcCall<
      InjectiveOracleRpcPb.PriceRequest,
      InjectiveOracleRpcPb.PriceResponse
    >(request, this.client.price.bind(this.client), options)

    return response
  }

  async fetchOraclePriceV2(
    filters: OraclePriceV2Filter[],
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request = InjectiveOracleRpcPb.PriceV2Request.create()

    request.filters = filters.map((filter) => {
      const pricePayload = InjectiveOracleRpcPb.PricePayloadV2.create()

      pricePayload.baseSymbol = filter.baseSymbol
      pricePayload.quoteSymbol = filter.quoteSymbol
      pricePayload.oracleType = filter.oracleType
      pricePayload.oracleScaleFactor = filter.oracleScaleFactor

      return pricePayload
    })

    const response = await this.executeGrpcCall<
      InjectiveOracleRpcPb.PriceV2Request,
      InjectiveOracleRpcPb.PriceV2Response
    >(request, this.client.priceV2.bind(this.client), options)

    return IndexerGrpcOracleTransformer.priceV2ResponseToPriceV2(response)
  }

  async fetchOraclePriceNoThrow(
    {
      baseSymbol,
      quoteSymbol,
      oracleScaleFactor,
      oracleType,
    }: {
      baseSymbol: string
      quoteSymbol: string
      oracleType: string
      oracleScaleFactor?: number
    },
    options?: RequestOptions,
  ) {
    throwIfAborted(options?.signal)
    const request = InjectiveOracleRpcPb.PriceRequest.create()

    request.baseSymbol = baseSymbol
    request.quoteSymbol = quoteSymbol
    request.oracleType = oracleType

    if (oracleScaleFactor) {
      request.oracleScaleFactor = oracleScaleFactor
    }

    try {
      const response = await this.executeGrpcCall<
        InjectiveOracleRpcPb.PriceRequest,
        InjectiveOracleRpcPb.PriceResponse
      >(request, this.client.price.bind(this.client), options)

      return response
    } catch (e: unknown) {
      if (isAbortError(e)) {
        throw e
      }
      if ((e as any).message.includes('object not found')) {
        return {
          price: '0',
        }
      }

      throw e
    }
  }
}
