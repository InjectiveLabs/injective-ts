import * as InjectiveRfqGwRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_gw_rpc_pb'
import { InjectiveRfqGwRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_gw_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcRfqGwTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcRfqGwApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.RfqGw

  private get client() {
    return this.initClient(InjectiveRfqGwRPCClient)
  }

  async fetchPrepare({
    cid,
    margin,
    expiry,
    clientId,
    marketId,
    quantity,
    direction,
    worstPrice,
    takerPubKey,
    takerAddress,
    unfilledAction,
    subaccountNonce,
    quotesWaitTimeMs,
    takerAccountNumber,
    takerAccountSequence,
  }: {
    cid?: string
    margin: string
    expiry?: number
    clientId: string
    marketId: string
    quantity: string
    direction: string
    worstPrice: string
    takerPubKey: string
    takerAddress: string
    subaccountNonce?: number
    quotesWaitTimeMs?: number
    takerAccountNumber?: number
    takerAccountSequence?: number
    unfilledAction?: {
      limit?: { price: string }
      market?: {}
    }
  }) {
    const request = InjectiveRfqGwRpcPb.RFQGwPrepareRequestType.create()

    if (clientId) {
      request.clientId = clientId
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (direction) {
      request.direction = direction
    }

    if (margin) {
      request.margin = margin
    }

    if (quantity) {
      request.quantity = quantity
    }

    if (worstPrice) {
      request.worstPrice = worstPrice
    }

    if (takerAddress) {
      request.takerAddress = takerAddress
    }

    if (takerPubKey) {
      request.takerPubKey = takerPubKey
    }

    if (takerAccountNumber) {
      request.takerAccountNumber = BigInt(takerAccountNumber)
    }

    if (takerAccountSequence) {
      request.takerAccountSequence = BigInt(takerAccountSequence)
    }

    if (expiry) {
      request.expiry = BigInt(expiry)
    }

    if (quotesWaitTimeMs) {
      request.quotesWaitTimeMs = BigInt(quotesWaitTimeMs)
    }

    if (unfilledAction) {
      const action =
        InjectiveRfqGwRpcPb.RFQSettlementUnfilledActionType.create()

      if (unfilledAction.limit) {
        action.limit = unfilledAction.limit
      }

      if (unfilledAction.market) {
        action.market = unfilledAction.market
      }

      request.unfilledAction = action
    }

    if (subaccountNonce !== undefined) {
      request.subaccountNonce = subaccountNonce
    }

    if (cid) {
      request.cid = cid
    }

    const requestMessage = InjectiveRfqGwRpcPb.PrepareRequest.create()
    requestMessage.request = request

    const response = await this.executeGrpcCall<
      InjectiveRfqGwRpcPb.PrepareRequest,
      InjectiveRfqGwRpcPb.PrepareResponse
    >(requestMessage, this.client.prepare.bind(this.client))

    return IndexerGrpcRfqGwTransformer.prepareResponseToPrepareResponse(
      response,
    )
  }
}
