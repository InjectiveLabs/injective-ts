import {
  OracleListRequest,
  OracleListResponse,
  PriceRequest,
  PriceResponse,
} from '@injectivelabs/exchange-api/injective_oracle_rpc_pb'
import { InjectiveOracleRPC } from '@injectivelabs/exchange-api/injective_oracle_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ExchangeGrpcOracleTransformer } from '../transformers/ExchangeGrpcOracleTransformer'

/**
 * @category Exchange Grpc API
 */
export class ExchangeGrpcOracleApi extends BaseConsumer {
  async fetchOracleList() {
    const request = new OracleListRequest()

    try {
      const response = await this.request<
        OracleListRequest,
        OracleListResponse,
        typeof InjectiveOracleRPC.OracleList
      >(request, InjectiveOracleRPC.OracleList)

      return ExchangeGrpcOracleTransformer.oraclesResponseToOracles(response)
    } catch (e: any) {
      throw new Error(e.message)
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
    const request = new PriceRequest()
    request.setBaseSymbol(baseSymbol)
    request.setQuoteSymbol(quoteSymbol)
    request.setOracleType(oracleType)

    if (oracleScaleFactor) {
      request.setOracleScaleFactor(oracleScaleFactor)
    }

    try {
      const response = await this.request<
        PriceRequest,
        PriceResponse,
        typeof InjectiveOracleRPC.Price
      >(request, InjectiveOracleRPC.Price)

      return response.toObject()
    } catch (e: any) {
      throw new Error(e.message)
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
    const request = new PriceRequest()
    request.setBaseSymbol(baseSymbol)
    request.setQuoteSymbol(quoteSymbol)
    request.setOracleType(oracleType)

    if (oracleScaleFactor) {
      request.setOracleScaleFactor(oracleScaleFactor)
    }

    try {
      const response = await this.request<
        PriceRequest,
        PriceResponse,
        typeof InjectiveOracleRPC.Price
      >(request, InjectiveOracleRPC.Price)

      return response.toObject()
    } catch (e: any) {
      if (e.message.includes('object not found')) {
        return {
          price: '0',
        }
      }

      throw new Error(e.message)
    }
  }
}
