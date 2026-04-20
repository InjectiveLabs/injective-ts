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
    >(requestMessage, this.client.prepare.bind(this.client), { noRetry: true })

    return IndexerGrpcRfqGwTransformer.prepareResponseToPrepareResponse(
      response,
    )
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
    autosignAccountSequence,
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
    autosignAccountSequence?: number
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

  async fetchPrepareEip712({
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
    unfilledAction?: RFQSettlementUnfilledActionType
  }) {
    const request = InjectiveRfqGwRpcPb.RFQGwPrepareEip712RequestType.create()

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

    const requestMessage = InjectiveRfqGwRpcPb.PrepareEip712Request.create()
    requestMessage.request = request

    const response = await this.executeGrpcCall<
      InjectiveRfqGwRpcPb.PrepareEip712Request,
      InjectiveRfqGwRpcPb.PrepareEip712Response
    >(requestMessage, this.client.prepareEip712.bind(this.client), {
      noRetry: true,
    })

    return IndexerGrpcRfqGwTransformer.prepareEip712ResponseToResponse(response)
  }
}
