import * as InjectiveOracleRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb'
import { InjectiveOracleRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerGrpcOracleTransformer } from '../transformers/IndexerGrpcOracleTransformer.js'
import type { GrpcCallOptions } from '../../../types/index.js'
/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcOracleApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Oracle

  private get client() {
    return this.initClient(InjectiveOracleRPCClient)
  }

  async fetchOracleList(options?: GrpcCallOptions) {
    const request = InjectiveOracleRpcPb.OracleListRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveOracleRpcPb.OracleListRequest,
      InjectiveOracleRpcPb.OracleListResponse
    >(request, this.client.oracleList.bind(this.client), options?.signal)

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
    options?: GrpcCallOptions,
  ) {
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
    >(request, this.client.price.bind(this.client), options?.signal)

    return response
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
    options?: GrpcCallOptions,
  ) {
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
      >(request, this.client.price.bind(this.client), options?.signal)

      return response
    } catch (e: unknown) {
      if ((e as any).message.includes('object not found')) {
        return {
          price: '0',
        }
      }

      throw e
    }
  }
}
