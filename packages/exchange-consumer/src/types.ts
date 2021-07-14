import { MarketStatusMap as GrpcMarketStatus } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { InsuranceFund as GrpcInsuranceFund } from '@injectivelabs/exchange-api/injective_insurance_rpc_pb'
import { Oracle as GrpcOracle } from '@injectivelabs/exchange-api/injective_oracle_rpc_pb'

export interface StreamStatusResponse {
  details: string
  code: number
  metadata: any
}

export { GrpcMarketStatus, GrpcOracle, GrpcInsuranceFund }
