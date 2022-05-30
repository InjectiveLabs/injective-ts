import {
  OracleListRequest,
  OracleListResponse,
  PriceRequest,
  PriceResponse,
} from '@injectivelabs/exchange-api/injective_oracle_rpc_pb'
import { InjectiveOracleRPC } from '@injectivelabs/exchange-api/injective_oracle_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'

export class ExchangeGrpcOracleApi extends BaseConsumer {
  async fetchOracleList() {
    const request = new OracleListRequest()

    try {
      const response = await this.request<
        OracleListRequest,
        OracleListResponse,
        typeof InjectiveOracleRPC.OracleList
      >(request, InjectiveOracleRPC.OracleList)

      return response
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

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
