import { Coin as GrpcCoin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { TxRaw } from '@injectivelabs/core-proto-ts/cosmos/tx/v1beta1/tx'

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

export { GrpcCoin, DirectSignResponse, TxRaw }
