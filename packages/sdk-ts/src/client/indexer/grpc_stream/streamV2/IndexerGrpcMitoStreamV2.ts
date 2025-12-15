import * as MitoApiPb from '@injectivelabs/mito-proto-ts-v2/generated/goadesign_goagen_mito_api_pb'
import { MitoAPIClient } from '@injectivelabs/mito-proto-ts-v2/generated/goadesign_goagen_mito_api_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerGrpcMitoStreamTransformer } from '../../transformers/index.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type TransfersStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerGrpcMitoStreamTransformer.transfersStreamCallback
  >,
) => void

export type VaultStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerGrpcMitoStreamTransformer.vaultStreamCallback
  >,
) => void

export type VaultHolderSubscriptionStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerGrpcMitoStreamTransformer.vaultHolderSubscriptionStreamCallback
  >,
) => void

export type StakingRewardByAccountStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerGrpcMitoStreamTransformer.stakingRewardByAccountStreamCallback
  >,
) => void

export type HistoricalStakingStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerGrpcMitoStreamTransformer.historicalStakingStreamCallback
  >,
) => void

export class IndexerGrpcMitoStreamV2 {
  private client: MitoAPIClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new MitoAPIClient(this.transport)
  }

  /**
   * Stream vault transfers
   * @param params.vault - Optional vault address to filter
   * @param params.account - Optional account address to filter
   * @param params.callback - Called for each transfer update
   * @returns StreamSubscription
   */
  streamTransfers({
    vault,
    account,
    callback,
  }: {
    vault?: string
    account?: string
    callback: TransfersStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = MitoApiPb.StreamTransfersRequest.create()

    if (vault) {
      request.vault = vault
    }

    if (account) {
      request.account = account
    }

    const stream = this.client.streamTransfers(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerGrpcMitoStreamTransformer.transfersStreamCallback(response)
      callback(transformed)
    })
  }

  /**
   * Stream vault information
   * @param params.vault - Optional vault address to filter
   * @param params.callback - Called for each vault update
   * @returns StreamSubscription
   */
  streamVault({
    vault,
    callback,
  }: {
    vault?: string
    callback: VaultStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = MitoApiPb.StreamVaultRequest.create()

    if (vault) {
      request.vault = vault
    }

    const stream = this.client.streamVault(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerGrpcMitoStreamTransformer.vaultStreamCallback(response)
      callback(transformed)
    })
  }

  /**
   * Stream vault holder subscriptions
   * @param params.holderAddress - The holder address to stream subscriptions for
   * @param params.vaultAddress - Optional vault address to filter
   * @param params.stakingContractAddress - Optional staking contract address to filter
   * @param params.callback - Called for each subscription update
   * @returns StreamSubscription
   */
  streamVaultHolderSubscriptions({
    holderAddress,
    vaultAddress,
    stakingContractAddress,
    callback,
  }: {
    holderAddress: string
    vaultAddress?: string
    stakingContractAddress?: string
    callback: VaultHolderSubscriptionStreamCallbackV2
  }): StreamSubscription {
    if (!holderAddress) {
      throw new Error('holderAddress is required')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = MitoApiPb.StreamHolderSubscriptionRequest.create()
    request.holderAddress = holderAddress

    if (vaultAddress) {
      request.vaultAddress = vaultAddress
    }

    if (stakingContractAddress) {
      request.stakingContractAddress = stakingContractAddress
    }

    const stream = this.client.streamHolderSubscription(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerGrpcMitoStreamTransformer.vaultHolderSubscriptionStreamCallback(
          response,
        )
      callback(transformed)
    })
  }

  /**
   * Stream staking rewards by account
   * @param params.staker - The staker address to stream rewards for
   * @param params.stakingContractAddress - The staking contract address
   * @param params.callback - Called for each reward update
   * @returns StreamSubscription
   */
  streamStakingRewardsByAccount({
    staker,
    stakingContractAddress,
    callback,
  }: {
    staker: string
    stakingContractAddress: string
    callback: StakingRewardByAccountStreamCallbackV2
  }): StreamSubscription {
    if (!staker) {
      throw new Error('staker is required')
    }
    if (!stakingContractAddress) {
      throw new Error('stakingContractAddress is required')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = MitoApiPb.StreamStakingRewardByAccountRequest.create()
    request.staker = staker
    request.stakingContractAddress = stakingContractAddress

    const stream = this.client.streamStakingRewardByAccount(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerGrpcMitoStreamTransformer.stakingRewardByAccountStreamCallback(
          response,
        )
      callback(transformed)
    })
  }

  /**
   * Stream historical staking data
   * @param params.staker - The staker address to stream data for
   * @param params.stakingContractAddress - The staking contract address
   * @param params.callback - Called for each historical staking update
   * @returns StreamSubscription
   */
  streamHistoricalStaking({
    staker,
    stakingContractAddress,
    callback,
  }: {
    staker: string
    stakingContractAddress: string
    callback: HistoricalStakingStreamCallbackV2
  }): StreamSubscription {
    if (!staker) {
      throw new Error('staker is required')
    }
    if (!stakingContractAddress) {
      throw new Error('stakingContractAddress is required')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = MitoApiPb.StreamHistoricalStakingRequest.create()
    request.staker = staker
    request.stakingContractAddress = stakingContractAddress

    const stream = this.client.streamHistoricalStaking(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerGrpcMitoStreamTransformer.historicalStakingStreamCallback(
          response,
        )
      callback(transformed)
    })
  }
}
