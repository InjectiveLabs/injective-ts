import type * as InjectiveEvmV1LogPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/log_pb.mjs'
import type * as InjectiveEvmV1ParamsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/params_pb.mjs'
import type * as InjectiveEvmV1ChainConfigPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/chain_config_pb.mjs'

export interface EvmLog {
  address: string
  topics: string[]
  data: Uint8Array
  blockNumber: string
  txHash: string
  txIndex: string
  blockHash: string
  index: string
  removed: boolean
}

export interface EvmBlobConfig {
  target: string
  max: string
  baseFeeUpdateFraction: string
}

export interface EvmBlobScheduleConfig {
  cancun?: EvmBlobConfig
  prague?: EvmBlobConfig
  osaka?: EvmBlobConfig
  verkle?: EvmBlobConfig
}

export interface EvmChainConfig {
  homesteadBlock: string
  daoForkBlock: string
  daoForkSupport: boolean
  eip150Block: string
  eip150Hash: string
  eip155Block: string
  eip158Block: string
  byzantiumBlock: string
  constantinopleBlock: string
  petersburgBlock: string
  istanbulBlock: string
  muirGlacierBlock: string
  berlinBlock: string
  londonBlock: string
  arrowGlacierBlock: string
  grayGlacierBlock: string
  mergeNetsplitBlock: string
  shanghaiTime: string
  cancunTime: string
  pragueTime: string
  eip155ChainId: string
  blobScheduleConfig?: EvmBlobScheduleConfig
}

export interface EvmParams {
  evmDenom: string
  enableCreate: boolean
  enableCall: boolean
  extraEips: string[]
  chainConfig?: EvmChainConfig
  allowUnprotectedTxs: boolean
  authorizedDeployers: string[]
  permissioned: boolean
}

export type GrpcEvmLog = InjectiveEvmV1LogPb.Log
export type GrpcEvmParams = InjectiveEvmV1ParamsPb.Params

export type GrpcEvmChainConfig = InjectiveEvmV1ChainConfigPb.ChainConfig
export type GrpcEvmBlobScheduleConfig =
  InjectiveEvmV1ChainConfigPb.BlobScheduleConfig
export type GrpcEvmBlobConfig = InjectiveEvmV1ChainConfigPb.BlobConfig
