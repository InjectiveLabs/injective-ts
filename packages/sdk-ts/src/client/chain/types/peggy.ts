import { Coin } from '@injectivelabs/ts-types'

// TODO: Import from InjectivePeggyV1Beta1Params
export type GrpcPeggyParams = {
  peggyId: string
  contractSourceHash: string
  bridgeEthereumAddress: string
  bridgeChainId: string
  signedValsetsWindow: string
  signedBatchesWindow: string
  signedClaimsWindow: string
  targetBatchTimeout: string
  averageBlockTime: string
  averageEthereumBlockTime: string
  slashFractionValset: Uint8Array
  slashFractionBatch: Uint8Array
  slashFractionClaim: Uint8Array
  slashFractionConflictingClaim: Uint8Array
  unbondSlashingValsetsWindow: string
  slashFractionBadEthSignature: Uint8Array
  cosmosCoinDenom: string
  cosmosCoinErc20Contract: string
  claimSlashingEnabled: boolean
  bridgeContractStartHeight: string
  valsetReward: Coin | undefined
}

export interface PeggyModuleParams extends GrpcPeggyParams {
  valsetReward: Coin
}
