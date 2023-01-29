import { Params as GrpcPeggyParams } from '@injectivelabs/core-proto-ts/injective/peggy/v1/genesis'
import { Coin } from '@injectivelabs/ts-types'

export interface PeggyModuleParams extends GrpcPeggyParams {
  valsetReward: Coin
}

export { GrpcPeggyParams }
