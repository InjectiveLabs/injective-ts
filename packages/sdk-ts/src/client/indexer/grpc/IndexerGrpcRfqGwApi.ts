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
    simulate,
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
    simulate?: boolean
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

    request.clientId = clientId
    request.marketId = marketId
    request.direction = direction
    request.margin = margin
    request.quantity = quantity
    request.worstPrice = worstPrice
    request.autosignAddress = autosignAddress
    request.autosignPubKey = autosignPubKey

    if (simulate !== undefined) {
      request.simulate = simulate
    }

    if (autosignAccountNumber !== undefined) {
      request.autosignAccountNumber = BigInt(autosignAccountNumber)
    }

    if (autosignAccountSequence !== undefined) {
      request.autosignAccountSequence = BigInt(autosignAccountSequence)
    }

    if (feePayerAccountNumber !== undefined) {
      request.feePayerAccountNumber = BigInt(feePayerAccountNumber)
    }

    if (feePayerAccountSequence !== undefined) {
      request.feePayerAccountSequence = BigInt(feePayerAccountSequence)
    }

    if (takerAddress) {
      request.takerAddress = takerAddress
    }

    if (expiry !== undefined) {
      request.expiry = BigInt(expiry)
    }

    if (quotesWaitTimeMs !== undefined) {
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

  async fetchPrepare({
    cid,
    margin,
    expiry,
    clientId,
    marketId,
    quantity,
    direction,
    simulate,
    worstPrice,
    takerPubKey,
    takerAddress,
    unfilledAction,
    subaccountNonce,
    quotesWaitTimeMs,
    takerAccountNumber,
    feePayerAccountNumber,
    takerAccountSequence,
    feePayerAccountSequence,
  }: {
    cid?: string
    margin: string
    expiry?: number
    clientId: string
    marketId: string
    quantity: string
    direction: string
    simulate?: boolean
    worstPrice: string
    takerAddress: string
    takerPubKey: string
    subaccountNonce?: number
    quotesWaitTimeMs?: number
    takerAccountNumber?: number
    feePayerAccountNumber?: number
    takerAccountSequence?: number
    feePayerAccountSequence?: number
    unfilledAction?: RFQSettlementUnfilledActionType
  }) {
    const request = InjectiveRfqGwRpcPb.RFQGwPrepareRequestType.create()

    request.clientId = clientId
    request.marketId = marketId
    request.direction = direction
    request.margin = margin
    request.quantity = quantity
    request.worstPrice = worstPrice
    request.takerAddress = takerAddress
    request.takerPubKey = takerPubKey

    if (simulate !== undefined) {
      request.simulate = simulate
    }

    if (takerAccountNumber !== undefined) {
      request.takerAccountNumber = BigInt(takerAccountNumber)
    }

    if (takerAccountSequence !== undefined) {
      request.takerAccountSequence = BigInt(takerAccountSequence)
    }

    if (feePayerAccountNumber !== undefined) {
      request.feePayerAccountNumber = BigInt(feePayerAccountNumber)
    }

    if (feePayerAccountSequence !== undefined) {
      request.feePayerAccountSequence = BigInt(feePayerAccountSequence)
    }

    if (expiry !== undefined) {
      request.expiry = BigInt(expiry)
    }

    if (quotesWaitTimeMs !== undefined) {
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
    >(requestMessage, this.client.prepare.bind(this.client), {
      noRetry: true,
    })

    return IndexerGrpcRfqGwTransformer.prepareResponseToResponse(response)
  }

  async fetchPrepareEip712({
    cid,
    gas,
    margin,
    expiry,
    clientId,
    marketId,
    quantity,
    direction,
    simulate,
    worstPrice,
    ethChainId,
    takerPubKey,
    takerAddress,
    eip712Wrapper,
    unfilledAction,
    subaccountNonce,
    quotesWaitTimeMs,
    takerAccountNumber,
    feePayerAccountNumber,
    takerAccountSequence,
    feePayerAccountSequence,
  }: {
    cid?: string
    gas?: number
    margin: string
    expiry?: number
    clientId: string
    marketId: string
    quantity: string
    direction: string
    simulate?: boolean
    worstPrice: string
    ethChainId?: number
    takerAddress: string
    takerPubKey: string
    eip712Wrapper?: string
    subaccountNonce?: number
    quotesWaitTimeMs?: number
    takerAccountNumber?: number
    feePayerAccountNumber?: number
    takerAccountSequence?: number
    feePayerAccountSequence?: number
    unfilledAction?: RFQSettlementUnfilledActionType
  }) {
    const request = InjectiveRfqGwRpcPb.RFQGwPrepareEip712RequestType.create()

    request.clientId = clientId
    request.marketId = marketId
    request.direction = direction
    request.margin = margin
    request.quantity = quantity
    request.worstPrice = worstPrice
    request.takerAddress = takerAddress
    request.takerPubKey = takerPubKey

    if (simulate !== undefined) {
      request.simulate = simulate
    }

    if (takerAccountNumber !== undefined) {
      request.takerAccountNumber = BigInt(takerAccountNumber)
    }

    if (takerAccountSequence !== undefined) {
      request.takerAccountSequence = BigInt(takerAccountSequence)
    }

    if (feePayerAccountNumber !== undefined) {
      request.feePayerAccountNumber = BigInt(feePayerAccountNumber)
    }

    if (feePayerAccountSequence !== undefined) {
      request.feePayerAccountSequence = BigInt(feePayerAccountSequence)
    }

    if (expiry !== undefined) {
      request.expiry = BigInt(expiry)
    }

    if (quotesWaitTimeMs !== undefined) {
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

    if (ethChainId !== undefined) {
      request.ethChainId = BigInt(ethChainId)
    }

    if (eip712Wrapper) {
      request.eip712Wrapper = eip712Wrapper
    }

    if (gas !== undefined) {
      request.gas = BigInt(gas)
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

  async fetchPrepareEip712AutoSign({
    cid,
    gas,
    margin,
    expiry,
    clientId,
    marketId,
    quantity,
    direction,
    simulate,
    worstPrice,
    ethChainId,
    takerAddress,
    autosignPubKey,
    eip712Wrapper,
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
    gas?: number
    margin: string
    expiry?: number
    clientId: string
    marketId: string
    quantity: string
    direction: string
    simulate?: boolean
    worstPrice: string
    ethChainId?: number
    takerAddress?: string
    autosignPubKey: string
    eip712Wrapper?: string
    autosignAddress: string
    subaccountNonce?: number
    quotesWaitTimeMs?: number
    autosignAccountNumber?: number
    feePayerAccountNumber?: number
    autosignAccountSequence?: number
    feePayerAccountSequence?: number
    unfilledAction?: RFQSettlementUnfilledActionType
  }) {
    const request =
      InjectiveRfqGwRpcPb.RFQGwPrepareEip712AutoSignRequestType.create()

    request.clientId = clientId
    request.marketId = marketId
    request.direction = direction
    request.margin = margin
    request.quantity = quantity
    request.worstPrice = worstPrice
    request.autosignAddress = autosignAddress
    request.autosignPubKey = autosignPubKey

    if (simulate !== undefined) {
      request.simulate = simulate
    }

    if (autosignAccountNumber !== undefined) {
      request.autosignAccountNumber = BigInt(autosignAccountNumber)
    }

    if (autosignAccountSequence !== undefined) {
      request.autosignAccountSequence = BigInt(autosignAccountSequence)
    }

    if (feePayerAccountNumber !== undefined) {
      request.feePayerAccountNumber = BigInt(feePayerAccountNumber)
    }

    if (feePayerAccountSequence !== undefined) {
      request.feePayerAccountSequence = BigInt(feePayerAccountSequence)
    }

    if (takerAddress) {
      request.takerAddress = takerAddress
    }

    if (expiry !== undefined) {
      request.expiry = BigInt(expiry)
    }

    if (quotesWaitTimeMs !== undefined) {
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

    if (ethChainId !== undefined) {
      request.ethChainId = BigInt(ethChainId)
    }

    if (eip712Wrapper) {
      request.eip712Wrapper = eip712Wrapper
    }

    if (gas !== undefined) {
      request.gas = BigInt(gas)
    }

    const requestMessage =
      InjectiveRfqGwRpcPb.PrepareEip712AutoSignRequest.create()
    requestMessage.request = request

    const response = await this.executeGrpcCall<
      InjectiveRfqGwRpcPb.PrepareEip712AutoSignRequest,
      InjectiveRfqGwRpcPb.PrepareEip712AutoSignResponse
    >(requestMessage, this.client.prepareEip712AutoSign.bind(this.client), {
      noRetry: true,
    })

    return IndexerGrpcRfqGwTransformer.prepareEip712AutoSignResponseToResponse(
      response,
    )
  }
}
