import {
  PrepareTxRequest,
  PrepareTxResponse,
  PrepareCosmosTxRequest,
  PrepareCosmosTxResponse,
  BroadcastCosmosTxRequest,
  BroadcastCosmosTxResponse,
  BroadcastTxRequest,
  BroadcastTxResponse,
  CosmosTxFee,
  CosmosPubKey,
} from '@injectivelabs/indexer-api/injective_exchange_rpc_pb'
import { InjectiveExchangeRPC } from '@injectivelabs/indexer-api/injective_exchange_rpc_pb_service'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import {
  DEFAULT_GAS_LIMIT,
  DEFAULT_EXCHANGE_LIMIT,
  DEFAULT_BRIDGE_FEE_DENOM,
  DEFAULT_BRIDGE_FEE_PRICE,
} from '@injectivelabs/utils'
import BaseConsumer from '../../BaseGrpcConsumer'
import { recoverTypedSignaturePubKey } from '../../../utils/transaction'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  Web3GatewayTransactionException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcTransactionApi extends BaseConsumer {
  protected module: string = IndexerModule.Transaction

  async prepareTxRequest({
    address,
    chainId,
    message,
    memo,
    estimateGas = true,
    gasLimit = DEFAULT_GAS_LIMIT,
    feeDenom = DEFAULT_BRIDGE_FEE_DENOM,
    feePrice = DEFAULT_BRIDGE_FEE_PRICE,
    timeoutHeight,
  }: {
    address: AccountAddress
    chainId: EthereumChainId
    message: any
    estimateGas?: boolean
    gasLimit?: number
    memo?: string | number
    timeoutHeight?: number
    feeDenom?: string
    feePrice?: string
  }) {
    const txFeeAmount = new Coin()
    txFeeAmount.setDenom(feeDenom)
    txFeeAmount.setAmount(feePrice)

    const cosmosTxFee = new CosmosTxFee()
    cosmosTxFee.setPriceList([txFeeAmount])

    if (!estimateGas) {
      cosmosTxFee.setGas(gasLimit)
    }

    const prepareTxRequest = new PrepareTxRequest()
    prepareTxRequest.setChainId(chainId)
    prepareTxRequest.setSignerAddress(address)
    prepareTxRequest.setFee(cosmosTxFee)

    const arrayOfMessages = Array.isArray(message) ? message : [message]
    for (const message of arrayOfMessages) {
      prepareTxRequest.addMsgs(Buffer.from(JSON.stringify(message), 'utf8'))
    }

    if (timeoutHeight !== undefined) {
      prepareTxRequest.setTimeoutHeight(timeoutHeight)
    }

    if (memo) {
      prepareTxRequest.setMemo(
        typeof memo === 'number' ? memo.toString() : memo,
      )
    }

    try {
      const response = await this.request<
        PrepareTxRequest,
        PrepareTxResponse,
        typeof InjectiveExchangeRPC.PrepareTx
      >(prepareTxRequest, InjectiveExchangeRPC.PrepareTx)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw new Web3GatewayTransactionException(e.toOriginalError(), {
          code: e.code,
          type: e.type,
          contextModule: e.contextModule,
        })
      }

      throw new Web3GatewayTransactionException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async prepareCosmosTxRequest({
    memo,
    address,
    message,
    estimateGas = true,
    gasLimit = DEFAULT_GAS_LIMIT,
    feeDenom = DEFAULT_BRIDGE_FEE_DENOM,
    feePrice = DEFAULT_BRIDGE_FEE_PRICE,
    timeoutHeight,
  }: {
    address: string
    message: any
    estimateGas?: boolean
    gasLimit?: number
    memo?: string | number
    timeoutHeight?: number
    feeDenom?: string
    feePrice?: string
  }) {
    const txFeeAmount = new Coin()
    txFeeAmount.setDenom(feeDenom)
    txFeeAmount.setAmount(feePrice)

    const cosmosTxFee = new CosmosTxFee()
    cosmosTxFee.setPriceList([txFeeAmount])

    if (!estimateGas) {
      cosmosTxFee.setGas(gasLimit)
    }

    const prepareTxRequest = new PrepareCosmosTxRequest()
    prepareTxRequest.setFee(cosmosTxFee)
    prepareTxRequest.setSenderAddress(address)

    const arrayOfMessages = Array.isArray(message) ? message : [message]
    for (const message of arrayOfMessages) {
      prepareTxRequest.addMsgs(Buffer.from(JSON.stringify(message), 'utf8'))
    }

    if (timeoutHeight !== undefined) {
      prepareTxRequest.setTimeoutHeight(timeoutHeight)
    }

    if (memo) {
      prepareTxRequest.setMemo(
        typeof memo === 'number' ? memo.toString() : memo,
      )
    }

    try {
      const response = await this.request<
        PrepareCosmosTxRequest,
        PrepareCosmosTxResponse,
        typeof InjectiveExchangeRPC.PrepareCosmosTx
      >(prepareTxRequest, InjectiveExchangeRPC.PrepareCosmosTx)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw new Web3GatewayTransactionException(e.toOriginalError(), {
          code: e.code,
          type: e.type,
          contextModule: e.contextModule,
        })
      }

      throw new Web3GatewayTransactionException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async prepareExchangeTxRequest({
    address,
    chainId,
    message,
    memo,
    estimateGas = true,
    gasLimit = DEFAULT_EXCHANGE_LIMIT,
    feeDenom = DEFAULT_BRIDGE_FEE_DENOM,
    feePrice = DEFAULT_BRIDGE_FEE_PRICE,
    timeoutHeight,
    delegatedFee,
  }: {
    address: AccountAddress
    chainId: EthereumChainId
    message: any
    estimateGas?: boolean
    gasLimit?: number
    memo?: string | number
    feeDenom?: string
    feePrice?: string
    timeoutHeight?: number
    delegatedFee?: boolean
  }) {
    const txFeeAmount = new Coin()
    txFeeAmount.setDenom(feeDenom)
    txFeeAmount.setAmount(feePrice)

    const cosmosTxFee = new CosmosTxFee()
    cosmosTxFee.setPriceList([txFeeAmount])

    if (delegatedFee !== undefined) {
      cosmosTxFee.setDelegateFee(delegatedFee)
    }

    if (!estimateGas) {
      cosmosTxFee.setGas(gasLimit)
    }

    const prepareTxRequest = new PrepareTxRequest()
    prepareTxRequest.setChainId(chainId)
    prepareTxRequest.setSignerAddress(address)
    prepareTxRequest.setFee(cosmosTxFee)

    const arrayOfMessages = Array.isArray(message) ? message : [message]
    for (const message of arrayOfMessages) {
      prepareTxRequest.addMsgs(Buffer.from(JSON.stringify(message), 'utf8'))
    }

    if (timeoutHeight !== undefined) {
      prepareTxRequest.setTimeoutHeight(timeoutHeight)
    }

    if (memo) {
      prepareTxRequest.setMemo(
        typeof memo === 'number' ? memo.toString() : memo,
      )
    }

    try {
      const response = await this.request<
        PrepareTxRequest,
        PrepareTxResponse,
        typeof InjectiveExchangeRPC.PrepareTx
      >(prepareTxRequest, InjectiveExchangeRPC.PrepareTx)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw new Web3GatewayTransactionException(e.toOriginalError(), {
          code: e.code,
          type: e.type,
          contextModule: e.contextModule,
        })
      }

      throw new Web3GatewayTransactionException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async broadcastTxRequest({
    signature,
    chainId,
    message,
    txResponse,
  }: {
    signature: string
    chainId: EthereumChainId
    useCorrectEIP712Hash?: boolean
    txResponse: PrepareTxResponse
    message: Record<string, any>
  }) {
    const parsedTypedData = JSON.parse(txResponse.getData())
    const publicKeyHex = recoverTypedSignaturePubKey(parsedTypedData, signature)

    const cosmosPubKey = new CosmosPubKey()
    cosmosPubKey.setType(txResponse.getPubKeyType())
    cosmosPubKey.setKey(publicKeyHex)

    parsedTypedData.message.msgs = null

    const broadcastTxRequest = new BroadcastTxRequest()
    broadcastTxRequest.setMode('block')
    broadcastTxRequest.setChainId(chainId)
    broadcastTxRequest.setPubKey(cosmosPubKey)
    broadcastTxRequest.setSignature(signature)
    broadcastTxRequest.setTx(
      Buffer.from(JSON.stringify(parsedTypedData.message), 'utf8'),
    )
    broadcastTxRequest.setFeePayer(txResponse.getFeePayer())
    broadcastTxRequest.setFeePayerSig(txResponse.getFeePayerSig())

    const arrayOfMessages = Array.isArray(message) ? message : [message]
    const messagesList = arrayOfMessages.map((message) =>
      Buffer.from(JSON.stringify(message), 'utf8'),
    )
    broadcastTxRequest.setMsgsList(messagesList)

    try {
      const response = await this.request<
        BroadcastTxRequest,
        BroadcastTxResponse,
        typeof InjectiveExchangeRPC.BroadcastTx
      >(broadcastTxRequest, InjectiveExchangeRPC.BroadcastTx)

      return response.toObject()
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw new Web3GatewayTransactionException(e.toOriginalError(), {
          code: e.code,
          type: e.type,
          contextModule: e.contextModule,
        })
      }

      throw new Web3GatewayTransactionException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async broadcastCosmosTxRequest({
    address,
    signature,
    txRaw,
    pubKey,
  }: {
    address: string
    signature: string // base64
    txRaw: TxRaw
    pubKey: {
      type: string
      value: string // base64
    }
  }) {
    const pubKeyInHex = Buffer.from(pubKey.value, 'base64').toString('hex')
    const signatureInHex = Buffer.from(signature, 'base64').toString('hex')
    const cosmosPubKey = new CosmosPubKey()
    cosmosPubKey.setType(pubKey.type)
    cosmosPubKey.setKey(`0x${pubKeyInHex}`)

    txRaw.clearSignaturesList()

    const broadcastTxRequest = new BroadcastCosmosTxRequest()
    broadcastTxRequest.setSenderAddress(address)
    broadcastTxRequest.setPubKey(cosmosPubKey)
    broadcastTxRequest.setSignature(`0x${signatureInHex}`)
    broadcastTxRequest.setTx(txRaw.serializeBinary())

    console.log(Buffer.from(txRaw.serializeBinary()).toString('hex'))

    try {
      const response = await this.request<
        BroadcastCosmosTxRequest,
        BroadcastCosmosTxResponse,
        typeof InjectiveExchangeRPC.BroadcastCosmosTx
      >(broadcastTxRequest, InjectiveExchangeRPC.BroadcastCosmosTx)

      return response.toObject()
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw new Web3GatewayTransactionException(e.toOriginalError(), {
          code: e.code,
          type: e.type,
          contextModule: e.contextModule,
        })
      }

      throw new Web3GatewayTransactionException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
