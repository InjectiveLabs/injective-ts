import * as InjectiveAccountsRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb'
import { InjectiveAccountsRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerAccountStreamTransformer } from '../../transformers/index.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type BalanceStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerAccountStreamTransformer.balanceStreamCallback
  >,
) => void

export class IndexerGrpcAccountStreamV2 {
  private client: InjectiveAccountsRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveAccountsRPCClient(this.transport)
  }

  /**
   * Stream subaccount balance updates
   * @param params.subaccountId - The subaccount ID to stream balance for
   * @param params.callback - Called for each balance update
   * @returns StreamSubscription
   */
  streamSubaccountBalance({
    subaccountId,
    callback,
  }: {
    subaccountId: string
    callback: BalanceStreamCallbackV2
  }): StreamSubscription {
    if (!subaccountId) {
      throw new Error('subaccountId is required')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveAccountsRpcPb.StreamSubaccountBalanceRequest.create()
    request.subaccountId = subaccountId

    return createStreamSubscriptionV2(
      (abortSignal) =>
        this.client.streamSubaccountBalance(request, { abort: abortSignal }),
      (response) => {
        const transformed =
          IndexerAccountStreamTransformer.balanceStreamCallback(response)
        callback(transformed)
      },
    )
  }
}
