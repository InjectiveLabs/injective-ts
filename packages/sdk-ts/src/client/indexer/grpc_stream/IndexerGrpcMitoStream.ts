import * as MitoApiPb from '@injectivelabs/mito-proto-ts-v2/generated/goadesign_goagen_mito_api_pb'
import { MitoAPIClient } from '@injectivelabs/mito-proto-ts-v2/generated/goadesign_goagen_mito_api_pb.client'
import { createStreamSubscription } from './streamHelpers.js'
import { GrpcWebRpcTransport } from '../../base/GrpcWebRpcTransport.js'
import { IndexerGrpcMitoStreamTransformer } from '../transformers/index.js'
import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../types/index.js'

export type TransfersStreamCallback = (
  response: ReturnType<
    typeof IndexerGrpcMitoStreamTransformer.transfersStreamCallback
  >,
) => void

export type VaultStreamCallback = (
  response: ReturnType<
    typeof IndexerGrpcMitoStreamTransformer.vaultStreamCallback
  >,
) => void

export type VaultHolderSubscriptionStreamCallback = (
  response: ReturnType<
    typeof IndexerGrpcMitoStreamTransformer.vaultHolderSubscriptionStreamCallback
  >,
) => void

export type StakingRewardByAccountStreamCallback = (
  response: ReturnType<
    typeof IndexerGrpcMitoStreamTransformer.stakingRewardByAccountStreamCallback
  >,
) => void

export type HistoricalStakingStreamCallback = (
  response: ReturnType<
    typeof IndexerGrpcMitoStreamTransformer.historicalStakingStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 * @description Provides streaming access to Mito vault data from Injective Indexer
 */
export class IndexerGrpcMitoStream {
  private client: MitoAPIClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new MitoAPIClient(this.transport)
  }

  /**
   * Stream vault transfers
   * @param params - Stream parameters
   * @param params.vault - Optional vault address to filter
   * @param params.account - Optional account address to filter
   * @param params.callback - Called for each transfer update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamTransfers({
    vault,
    account,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    vault?: string
    account?: string
    callback: TransfersStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
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

    return createStreamSubscription(
      stream,
      (response: MitoApiPb.StreamTransfersResponse) => {
        callback(
          IndexerGrpcMitoStreamTransformer.transfersStreamCallback(response),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream vault information
   * @param params - Stream parameters
   * @param params.vault - Optional vault address to filter
   * @param params.callback - Called for each vault update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamVault({
    vault,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    vault?: string
    callback: VaultStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = MitoApiPb.StreamVaultRequest.create()

    if (vault) {
      request.vault = vault
    }

    const stream = this.client.streamVault(request)

    return createStreamSubscription(
      stream,
      (response: MitoApiPb.StreamVaultResponse) => {
        callback(IndexerGrpcMitoStreamTransformer.vaultStreamCallback(response))
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream vault holder subscriptions
   * @param params - Stream parameters
   * @param params.holderAddress - The holder address to stream subscriptions for
   * @param params.vaultAddress - Optional vault address to filter
   * @param params.stakingContractAddress - Optional staking contract address to filter
   * @param params.callback - Called for each subscription update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamVaultHolderSubscriptions({
    holderAddress,
    vaultAddress,
    stakingContractAddress,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    holderAddress: string
    vaultAddress?: string
    stakingContractAddress?: string
    callback: VaultHolderSubscriptionStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
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

    return createStreamSubscription(
      stream,
      (response: MitoApiPb.StreamHolderSubscriptionResponse) => {
        callback(
          IndexerGrpcMitoStreamTransformer.vaultHolderSubscriptionStreamCallback(
            response,
          ),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream staking rewards by account
   * @param params - Stream parameters
   * @param params.staker - The staker address to stream rewards for
   * @param params.stakingContractAddress - The staking contract address
   * @param params.callback - Called for each reward update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamStakingRewardsByAccount({
    staker,
    callback,
    onEndCallback,
    onStatusCallback,
    stakingContractAddress,
  }: {
    staker: string
    stakingContractAddress: string
    callback: StakingRewardByAccountStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
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

    return createStreamSubscription(
      stream,
      (response: MitoApiPb.StreamStakingRewardByAccountResponse) => {
        callback(
          IndexerGrpcMitoStreamTransformer.stakingRewardByAccountStreamCallback(
            response,
          ),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream historical staking data
   * @param params - Stream parameters
   * @param params.staker - The staker address to stream data for
   * @param params.stakingContractAddress - The staking contract address
   * @param params.callback - Called for each historical staking update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamHistoricalStaking({
    staker,
    stakingContractAddress,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    staker: string
    stakingContractAddress: string
    callback: HistoricalStakingStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
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

    return createStreamSubscription(
      stream,
      (response: MitoApiPb.StreamHistoricalStakingResponse) => {
        callback(
          IndexerGrpcMitoStreamTransformer.historicalStakingStreamCallback(
            response,
          ),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }
}
