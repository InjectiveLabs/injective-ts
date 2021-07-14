import { CosmosCoin as GrpcCosmosCoin } from '@injectivelabs/exchange-api/injective_accounts_rpc_pb'

export * from './subaccount'

export interface StreamStatusResponse {
  details: string
  code: number
  metadata: any
}

export { GrpcCosmosCoin }
