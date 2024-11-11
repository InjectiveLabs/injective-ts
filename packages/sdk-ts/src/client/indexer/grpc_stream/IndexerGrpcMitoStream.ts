import { StreamStatusResponse } from '../types/index.js'
import { IndexerGrpcMitoStreamTransformer } from '../transformers/index.js'
import { getGrpcIndexerWebImpl } from '../../base/BaseIndexerGrpcWebConsumer.js'
import { Subscription } from 'rxjs'
import { MitoApi } from '@injectivelabs/mito-proto-ts'

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
 */
export class IndexerGrpcMitoStream {
  protected client: MitoApi.MitoAPIClientImpl

  constructor(endpoint: string) {
    this.client = new MitoApi.MitoAPIClientImpl(getGrpcIndexerWebImpl(endpoint))
  }

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
    const request = MitoApi.StreamTransfersRequest.create()

    if (vault) {
      request.vault = vault
    }

    if (account) {
      request.account = account
    }

    const subscription = this.client.StreamTransfers(request).subscribe({
      next(response: MitoApi.StreamTransfersResponse) {
        callback(
          IndexerGrpcMitoStreamTransformer.transfersStreamCallback(response),
        )
      },
      error(err) {
        if (onStatusCallback) {
          onStatusCallback(err)
        }
      },
      complete() {
        if (onEndCallback) {
          onEndCallback()
        }
      },
    })

    return subscription as unknown as Subscription
  }

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
    const request = MitoApi.StreamVaultRequest.create()

    if (vault) {
      request.vault = vault
    }

    const subscription = this.client.StreamVault(request).subscribe({
      next(response: MitoApi.StreamVaultResponse) {
        callback(IndexerGrpcMitoStreamTransformer.vaultStreamCallback(response))
      },
      error(err) {
        if (onStatusCallback) {
          onStatusCallback(err)
        }
      },
      complete() {
        if (onEndCallback) {
          onEndCallback()
        }
      },
    })

    return subscription as unknown as Subscription
  }

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
    const request = MitoApi.StreamHolderSubscriptionRequest.create()
    request.holderAddress = holderAddress

    if (vaultAddress) {
      request.vaultAddress = vaultAddress
    }

    if (stakingContractAddress) {
      request.stakingContractAddress = stakingContractAddress
    }

    const subscription = this.client
      .StreamHolderSubscription(request)
      .subscribe({
        next(response: MitoApi.StreamHolderSubscriptionResponse) {
          callback(
            IndexerGrpcMitoStreamTransformer.vaultHolderSubscriptionStreamCallback(
              response,
            ),
          )
        },
        error(err) {
          if (onStatusCallback) {
            onStatusCallback(err)
          }
        },
        complete() {
          if (onEndCallback) {
            onEndCallback()
          }
        },
      })

    return subscription as unknown as Subscription
  }

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
    const request = MitoApi.StreamStakingRewardByAccountRequest.create()
    request.staker = staker
    request.stakingContractAddress = stakingContractAddress

    const subscription = this.client
      .StreamStakingRewardByAccount(request)
      .subscribe({
        next(response: MitoApi.StreamStakingRewardByAccountResponse) {
          callback(
            IndexerGrpcMitoStreamTransformer.stakingRewardByAccountStreamCallback(
              response,
            ),
          )
        },
        error(err) {
          if (onStatusCallback) {
            onStatusCallback(err)
          }
        },
        complete() {
          if (onEndCallback) {
            onEndCallback()
          }
        },
      })

    return subscription as unknown as Subscription
  }

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
    const request = MitoApi.StreamHistoricalStakingRequest.create()
    request.staker = staker
    request.stakingContractAddress = stakingContractAddress

    const subscription = this.client
      .StreamHistoricalStaking(request)
      .subscribe({
        next(response: MitoApi.StreamHistoricalStakingResponse) {
          callback(
            IndexerGrpcMitoStreamTransformer.historicalStakingStreamCallback(
              response,
            ),
          )
        },
        error(err) {
          if (onStatusCallback) {
            onStatusCallback(err)
          }
        },
        complete() {
          if (onEndCallback) {
            onEndCallback()
          }
        },
      })

    return subscription as unknown as Subscription
  }
}
