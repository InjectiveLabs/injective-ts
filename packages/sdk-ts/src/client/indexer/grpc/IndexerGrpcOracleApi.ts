import { IndexerGrpcOracleTransformer } from '../transformers/IndexerGrpcOracleTransformer'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { InjectiveOracleRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcOracleApi {
  protected module: string = IndexerModule.Oracle

  protected client: InjectiveOracleRpc.InjectiveOracleRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveOracleRpc.InjectiveOracleRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchOracleList() {
    const request = InjectiveOracleRpc.OracleListRequest.create()

    try {
      const response = await this.client.OracleList(request)

      return IndexerGrpcOracleTransformer.oraclesResponseToOracles(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveOracleRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'OracleList',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'OracleList',
        contextModule: this.module,
      })
    }
  }

  async fetchOraclePrice({
    baseSymbol,
    quoteSymbol,
    oracleScaleFactor,
    oracleType,
  }: {
    baseSymbol: string
    quoteSymbol: string
    oracleType: string
    oracleScaleFactor?: number
  }) {
    const request = InjectiveOracleRpc.PriceRequest.create()

    request.baseSymbol = baseSymbol
    request.quoteSymbol = quoteSymbol
    request.oracleType = oracleType

    if (oracleScaleFactor) {
      request.oracleScaleFactor = oracleScaleFactor
    }

    try {
      const response = await this.client.Price(request)

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveOracleRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Price',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Price',
        contextModule: this.module,
      })
    }
  }

  async fetchOraclePriceNoThrow({
    baseSymbol,
    quoteSymbol,
    oracleScaleFactor,
    oracleType,
  }: {
    baseSymbol: string
    quoteSymbol: string
    oracleType: string
    oracleScaleFactor?: number
  }) {
    const request = InjectiveOracleRpc.PriceRequest.create()

    request.baseSymbol = baseSymbol
    request.quoteSymbol = quoteSymbol
    request.oracleType = oracleType

    if (oracleScaleFactor) {
      request.oracleScaleFactor = oracleScaleFactor
    }

    try {
      const response = await this.client.Price(request)

      return response
    } catch (e: unknown) {
      if ((e as any).message.includes('object not found')) {
        return {
          price: '0',
        }
      }

      if (e instanceof InjectiveOracleRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Price',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Price',
        contextModule: this.module,
      })
    }
  }
}
