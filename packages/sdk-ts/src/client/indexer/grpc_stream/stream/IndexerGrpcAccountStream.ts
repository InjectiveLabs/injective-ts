import * as InjectiveAccountsRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb'
import { InjectiveAccountsRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb.client'
import { createStreamSubscription } from './streamHelpers.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerAccountStreamTransformer } from '../../transformers/index.js'
import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../../types/index.js'

export type BalanceStreamCallback = (
  response: ReturnType<
    typeof IndexerAccountStreamTransformer.balanceStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 * @description Provides streaming access to account data from the Injective Indexer
 */
export class IndexerGrpcAccountStream {
  private client: InjectiveAccountsRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveAccountsRPCClient(this.transport)
  }

  /**
   * Stream subaccount balance updates
   * @param params - Stream parameters
   * @param params.subaccountId - The subaccount ID to stream balance for
   * @param params.callback - Called for each balance update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamSubaccountBalance({
    subaccountId,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    subaccountId: string
    callback: BalanceStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (!subaccountId) {
      throw new Error('subaccountId is required')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveAccountsRpcPb.StreamSubaccountBalanceRequest.create()
    request.subaccountId = subaccountId

    const stream = this.client.streamSubaccountBalance(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveAccountsRpcPb.StreamSubaccountBalanceResponse) => {
        callback(
          IndexerAccountStreamTransformer.balanceStreamCallback(response),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }
}
