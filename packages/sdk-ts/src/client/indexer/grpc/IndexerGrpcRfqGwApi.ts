import * as InjectiveRfqGwRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_gw_rpc_pb'
import { InjectiveRfqGwRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_gw_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcRfqGwTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { RFQSettlementUnfilledActionType } from '../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcRfqGwApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.RfqGw

  private get client() {
    return this.initClient(InjectiveRfqGwRPCClient)
  }

  async fetchPrepareAutoSign({
    cid,
    margin,
    expiry,
    clientId,
    marketId,
    quantity,
    direction,
    worstPrice,
    takerAddress,
    autosignPubKey,
    unfilledAction,
    autosignAddress,
    subaccountNonce,
    quotesWaitTimeMs,
    autosignAccountNumber,
    feePayerAccountNumber,
    autosignAccountSequence,
    feePayerAccountSequence,
  }: {
    cid?: string
    margin: string
    expiry?: number
    clientId: string
    marketId: string
    quantity: string
    direction: string
    worstPrice: string
    takerAddress?: string
    autosignPubKey: string
    autosignAddress: string
    subaccountNonce?: number
    quotesWaitTimeMs?: number
    autosignAccountNumber?: number
    feePayerAccountNumber?: number
    autosignAccountSequence?: number
    feePayerAccountSequence?: number
    unfilledAction?: RFQSettlementUnfilledActionType
  }) {
    const request = InjectiveRfqGwRpcPb.RFQGwPrepareAutoSignRequestType.create()

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

    if (autosignAddress) {
      request.autosignAddress = autosignAddress
    }

    if (autosignPubKey) {
      request.autosignPubKey = autosignPubKey
    }

    if (autosignAccountNumber) {
      request.autosignAccountNumber = BigInt(autosignAccountNumber)
    }

    if (autosignAccountSequence) {
      request.autosignAccountSequence = BigInt(autosignAccountSequence)
    }

    if (feePayerAccountNumber) {
      request.feePayerAccountNumber = BigInt(feePayerAccountNumber)
    }

    if (feePayerAccountSequence) {
      request.feePayerAccountSequence = BigInt(feePayerAccountSequence)
    }

    if (takerAddress) {
      request.takerAddress = takerAddress
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

    const requestMessage = InjectiveRfqGwRpcPb.PrepareAutoSignRequest.create()
    requestMessage.request = request

    const response = await this.executeGrpcCall<
      InjectiveRfqGwRpcPb.PrepareAutoSignRequest,
      InjectiveRfqGwRpcPb.PrepareAutoSignResponse
    >(requestMessage, this.client.prepareAutoSign.bind(this.client), {
      noRetry: true,
    })

    return IndexerGrpcRfqGwTransformer.prepareAutoSignResponseToResponse(
      response,
    )
  }
}
