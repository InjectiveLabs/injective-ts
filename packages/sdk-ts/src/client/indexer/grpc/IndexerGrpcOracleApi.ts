import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveOracleRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcOracleTransformer } from '../transformers/IndexerGrpcOracleTransformer.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcOracleApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Oracle

  protected client: InjectiveOracleRpc.InjectiveOracleRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveOracleRpc.InjectiveOracleRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchOracleList() {
    const request = InjectiveOracleRpc.OracleListRequest.create()

    try {
      const response = await this.retry<InjectiveOracleRpc.OracleListResponse>(
        () => this.client.OracleList(request),
      )

      return IndexerGrpcOracleTransformer.oraclesResponseToOracles(response)
    } catch (e: unknown) {
      if (e instanceof InjectiveOracleRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
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
      const response = await this.retry<InjectiveOracleRpc.PriceResponse>(() =>
        this.client.Price(request),
      )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveOracleRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
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
      const response = await this.retry<InjectiveOracleRpc.PriceResponse>(() =>
        this.client.Price(request),
      )

      return response
    } catch (e: unknown) {
      if ((e as any).message.includes('object not found')) {
        return {
          price: '0',
        }
      }

      if (e instanceof InjectiveOracleRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
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
