import { Coin as GrpcCoin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'

export * from './exchange'
export * from './pagination'

export interface Coin {
  denom: string
  amount: string
}

export enum StreamOperation {
  Insert = 'insert',
  Delete = 'delete',
  Replace = 'replace',
  Update = 'update',
  Invalidate = 'invalidate',
}

export { GrpcCoin }
