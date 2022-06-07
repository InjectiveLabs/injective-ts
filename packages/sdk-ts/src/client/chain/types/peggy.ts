import { Params as GrpcPeggyParams } from '@injectivelabs/chain-api/injective/peggy/v1/genesis_pb'
import { Coin } from '@injectivelabs/ts-types'

export interface PeggyModuleParams extends GrpcPeggyParams.AsObject {
  valsetReward?: Coin
}

export { GrpcPeggyParams }
