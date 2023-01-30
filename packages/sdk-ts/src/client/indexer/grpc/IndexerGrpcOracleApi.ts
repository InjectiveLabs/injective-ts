import {
  InjectiveOracleRPCClientImpl,
  OracleListRequest,
  PriceRequest,
} from '@injectivelabs/indexer-proto-ts/injective_oracle_rpc'
import { IndexerGrpcOracleTransformer } from '../transformers/IndexerGrpcOracleTransformer'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { GrpcWebError } from '@injectivelabs/indexer-proto-ts/injective_explorer_rpc'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcOracleApi {
  protected module: string = IndexerModule.Oracle

  protected client: InjectiveOracleRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveOracleRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchOracleList() {
    const request = OracleListRequest.create()

    try {
      const response = await this.client.OracleList(request)

      return IndexerGrpcOracleTransformer.oraclesResponseToOracles(response)
    } catch (e: unknown) {
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
    const request = PriceRequest.create()

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
      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
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
    const request = PriceRequest.create()

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

      if (e instanceof GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
