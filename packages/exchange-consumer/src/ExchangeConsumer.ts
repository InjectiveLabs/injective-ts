import { grpc } from '@improbable-eng/grpc-web'
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
  PrepareTxRequest,
  PrepareTxResponse,
  BroadcastTxRequest,
  BroadcastTxResponse,
  CosmosTxFee,
  CosmosPubKey,
} from '@injectivelabs/exchange-api/injective_exchange_rpc_pb'
import { InjectiveExchangeRPC } from '@injectivelabs/exchange-api/injective_exchange_rpc_pb_service'
import { ChainId, AccountAddress } from '@injectivelabs/ts-types'

import { recoverTypedSignaturePubKey } from '@injectivelabs/utils'

export class ExchangeConsumer {
  private endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  async prepareTxRequest({
    address,
    chainId,
    message,
  }: {
    address: AccountAddress
    chainId: ChainId
    message: any
  }) {
    const gasLimit = 200000 // TODO
    const cosmosTxFee = new CosmosTxFee()
    cosmosTxFee.setGas(gasLimit)

    const prepareTxRequest = new PrepareTxRequest()
    prepareTxRequest.setChainId(chainId)
    prepareTxRequest.setSignerAddress(address)
    prepareTxRequest.setFee(cosmosTxFee)
    prepareTxRequest.addMsgs(Buffer.from(JSON.stringify(message), 'utf8'))

    try {
      const response = await this.request<
        PrepareTxRequest,
        PrepareTxResponse,
        typeof InjectiveExchangeRPC.PrepareTx
      >(prepareTxRequest, InjectiveExchangeRPC.PrepareTx)

      return response
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

  async broadcastTxRequest({
    pubKeyType,
    signature,
    typedData,
    chainId,
    message,
  }: {
    pubKeyType: string
    signature: string
    typedData: string
    chainId: ChainId
    message: Record<string, any>
  }) {
    const parsedTypedData = JSON.parse(typedData)
    const publicKeyHex = recoverTypedSignaturePubKey(parsedTypedData, signature)
    parsedTypedData.message.msgs = null
    const txBytes = Buffer.from(JSON.stringify(parsedTypedData.message), 'utf8')
    const broadcastTxRequest = new BroadcastTxRequest()
    broadcastTxRequest.setMode('block')

    const cosmosPubKey = new CosmosPubKey()
    cosmosPubKey.setType(pubKeyType)
    cosmosPubKey.setKey(publicKeyHex)

    broadcastTxRequest.setChainId(chainId)
    broadcastTxRequest.setPubKey(cosmosPubKey)
    broadcastTxRequest.setSignature(signature)
    broadcastTxRequest.setTx(txBytes)
    broadcastTxRequest.setMsgsList([
      Buffer.from(JSON.stringify(message), 'utf8'),
    ])

    try {
      const response = await this.request<
        BroadcastTxRequest,
        BroadcastTxResponse,
        typeof InjectiveExchangeRPC.BroadcastTx
      >(broadcastTxRequest, InjectiveExchangeRPC.BroadcastTx)

      return response.toObject()
    } catch (e) {
      throw new GrpcException(e.message)
    }
  }

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

  private request<
    TRequest extends grpc.ProtobufMessage,
    TResponse extends grpc.ProtobufMessage,
    S extends grpc.UnaryMethodDefinition<TRequest, TResponse>
  >(request: TRequest, service: S): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      grpc.unary(service, {
        request,
        host: this.endpoint,
        onEnd: (res) => {
          const { statusMessage, status, message } = res

          if (status === grpc.Code.OK && message) {
            resolve(message as TResponse)
          }

          reject(new GrpcException(statusMessage))
        },
      })
    })
  }
}
