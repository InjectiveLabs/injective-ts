import {
  OracleListRequest,
  OracleListResponse,
  PriceRequest,
  PriceResponse,
} from '@injectivelabs/exchange-api/injective_oracle_rpc_pb'
import { InjectiveOracleRPC } from '@injectivelabs/exchange-api/injective_oracle_rpc_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import BaseConsumer from '../BaseConsumer'

export class OracleConsumer extends BaseConsumer {
  async oracles() {
    const request = new OracleListRequest()

    try {
      const response = await this.request<
        OracleListRequest,
        OracleListResponse,
        typeof InjectiveOracleRPC.OracleList
      >(request, InjectiveOracleRPC.OracleList)

      return response.getOraclesList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async price({
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

      return response.getPrice()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
