import { GrpcException } from '@injectivelabs/exceptions'
import {
  CreateDerivativeOrderRequest,
  CreateDerivativeOrderResponse,
  DerivativeOrderbookRequest,
  DerivativeOrderbookResponse,
  DerivativeOrder as DerivativeOrderForRequest,
  CreateTECTransactionRequest,
  SignedTransaction,
  CreateTECTransactionResponse,
  ExchangeDomain,
} from '@injectivelabs/exchange-api/injective_exchange_rpc_pb'
import { InjectiveExchangeRPC } from '@injectivelabs/exchange-api/injective_exchange_rpc_pb_service'
import BaseConsumer from '../BaseConsumer'

export class ExchangeConsumer extends BaseConsumer {
  async getOrderbookFromExchangeApi(marketId: string) {
    const queryOrderbookRequest = new DerivativeOrderbookRequest()
    queryOrderbookRequest.setMarketId(marketId)

    try {
      const response = await this.request<
        DerivativeOrderbookRequest,
        DerivativeOrderbookResponse,
        typeof InjectiveExchangeRPC.DerivativeOrderbook
      >(queryOrderbookRequest, InjectiveExchangeRPC.DerivativeOrderbook)

      return {
        longs: response.getLongsList(),
        shorts: response.getShortsList(),
      }
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async createOrder(order: any /* TODO: SignedDerivativeOrder */) {
    const createDerivativeOrderRequest = new CreateDerivativeOrderRequest()

    const derivativeOrder = new DerivativeOrderForRequest()
    derivativeOrder.setChainId(order.chainId)
    derivativeOrder.setExchangeAddress(order.exchangeAddress)
    derivativeOrder.setMakerAddress(order.makerAddress)
    derivativeOrder.setTakerAddress(order.takerAddress)
    derivativeOrder.setFeeRecipientAddress(order.feeRecipientAddress)
    derivativeOrder.setSenderAddress(order.senderAddress)
    derivativeOrder.setMakerAssetAmount(order.makerAssetAmount.toString())
    derivativeOrder.setTakerAssetAmount(order.takerAssetAmount.toString())
    derivativeOrder.setMakerFee(order.makerFee.toString())
    derivativeOrder.setTakerFee(order.takerFee.toString())
    derivativeOrder.setExpirationTimeSeconds(
      order.expirationTimeSeconds.toString(),
    )
    derivativeOrder.setSalt(order.salt.toString())
    derivativeOrder.setMakerAssetData(order.makerAssetData)
    derivativeOrder.setTakerAssetData(order.takerAssetData)
    derivativeOrder.setMakerFeeAssetData(order.makerFeeAssetData)
    derivativeOrder.setTakerFeeAssetData(order.takerFeeAssetData)
    derivativeOrder.setSignature(order.signature.toString())

    createDerivativeOrderRequest.setOrder(derivativeOrder)

    try {
      return await this.request<
        CreateDerivativeOrderRequest,
        CreateDerivativeOrderResponse,
        typeof InjectiveExchangeRPC.CreateDerivativeOrder
      >(
        createDerivativeOrderRequest,
        InjectiveExchangeRPC.CreateDerivativeOrder,
      )
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async createTECTransaction(
    transaction: any /* TODO: SignedZeroExTransaction */,
  ) {
    const createTECTransactionRequest = new CreateTECTransactionRequest()
    const tecTransaction = new SignedTransaction()
    const tecTransactionDomain = new ExchangeDomain()

    tecTransactionDomain.setChainId(transaction.domain.chainId.toString())
    tecTransactionDomain.setVerifyingContract(
      transaction.domain.verifyingContract,
    )

    tecTransaction.setDomain(tecTransactionDomain)
    tecTransaction.setData(transaction.data)
    tecTransaction.setExpirationTimeSeconds(
      transaction.expirationTimeSeconds.toString(),
    )
    tecTransaction.setGasPrice(transaction.gasPrice.toString())
    tecTransaction.setSalt(transaction.salt.toString())
    tecTransaction.setSignature(transaction.signature)
    tecTransaction.setSignerAddress(transaction.signerAddress)

    createTECTransactionRequest.setSignedTransaction(tecTransaction)

    try {
      return await this.request<
        CreateTECTransactionRequest,
        CreateTECTransactionResponse,
        typeof InjectiveExchangeRPC.CreateTECTransaction
      >(createTECTransactionRequest, InjectiveExchangeRPC.CreateTECTransaction)
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }
}
