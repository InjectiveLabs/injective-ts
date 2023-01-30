import {
  InjectiveExchangeRPCClientImpl,
  PrepareTxRequest,
  PrepareTxResponse,
  PrepareCosmosTxRequest,
  GetFeePayerRequest,
  BroadcastCosmosTxRequest,
  BroadcastTxRequest,
  CosmosTxFee,
  CosmosPubKey,
} from '@injectivelabs/indexer-proto-ts/injective_exchange_rpc'
import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import {
  DEFAULT_GAS_LIMIT,
  DEFAULT_EXCHANGE_LIMIT,
  DEFAULT_BRIDGE_FEE_DENOM,
  DEFAULT_BRIDGE_FEE_PRICE,
} from '@injectivelabs/utils'
import { recoverTypedSignaturePubKey } from '../../../utils/transaction'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  TransactionException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { TxRaw } from '@injectivelabs/core-proto-ts/cosmos/tx/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcTransactionApi {
  protected module: string = IndexerModule.Transaction

  protected client: InjectiveExchangeRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveExchangeRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

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
    const txFeeAmount = Coin.create()
    txFeeAmount.denom = feeDenom
    txFeeAmount.amount = feePrice

    const cosmosTxFee = CosmosTxFee.create()
    cosmosTxFee.price = [txFeeAmount]

    if (!estimateGas) {
      cosmosTxFee.gas = gasLimit.toString()
    }

    const prepareTxRequest = PrepareTxRequest.create()
    prepareTxRequest.chainId = chainId.toString()
    prepareTxRequest.signerAddress = address
    prepareTxRequest.fee = cosmosTxFee

    const arrayOfMessages = Array.isArray(message) ? message : [message]
    const messagesList = arrayOfMessages.map((message) =>
      Buffer.from(JSON.stringify(message), 'utf8'),
    )

    prepareTxRequest.msgs = messagesList

    if (timeoutHeight !== undefined) {
      prepareTxRequest.timeoutHeight = timeoutHeight.toString()
    }

    if (memo) {
      prepareTxRequest.memo = typeof memo === 'number' ? memo.toString() : memo
    }

    try {
      const response = await this.client.PrepareTx(prepareTxRequest)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw new TransactionException(e.toOriginalError(), {
          code: e.code,
          type: e.type,
        })
      }

      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
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
    const txFeeAmount = Coin.create()
    txFeeAmount.denom = feeDenom
    txFeeAmount.amount = feePrice

    const cosmosTxFee = CosmosTxFee.create()
    cosmosTxFee.price = [txFeeAmount]

    if (!estimateGas) {
      cosmosTxFee.gas = gasLimit.toString()
    }

    const prepareTxRequest = PrepareCosmosTxRequest.create()
    prepareTxRequest.fee = cosmosTxFee
    prepareTxRequest.senderAddress = address

    const arrayOfMessages = Array.isArray(message) ? message : [message]
    const messagesList = arrayOfMessages.map((message) =>
      Buffer.from(JSON.stringify(message), 'utf8'),
    )

    prepareTxRequest.msgs = messagesList

    if (timeoutHeight !== undefined) {
      prepareTxRequest.timeoutHeight = timeoutHeight.toString()
    }

    if (memo) {
      prepareTxRequest.memo = typeof memo === 'number' ? memo.toString() : memo
    }

    try {
      const response = await this.client.PrepareCosmosTx(prepareTxRequest)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw new TransactionException(e.toOriginalError(), {
          code: e.code,
          type: e.type,
        })
      }

      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
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
    const txFeeAmount = Coin.create()
    txFeeAmount.denom = feeDenom
    txFeeAmount.amount = feePrice

    const cosmosTxFee = CosmosTxFee.create()
    cosmosTxFee.price = [txFeeAmount]

    if (delegatedFee !== undefined) {
      cosmosTxFee.delegateFee = delegatedFee
    }

    if (!estimateGas) {
      cosmosTxFee.gas = gasLimit.toString()
    }

    const prepareTxRequest = PrepareTxRequest.create()
    prepareTxRequest.chainId = chainId.toString()
    prepareTxRequest.signerAddress = address
    prepareTxRequest.fee = cosmosTxFee

    const arrayOfMessages = Array.isArray(message) ? message : [message]
    const messagesList = arrayOfMessages.map((message) =>
      Buffer.from(JSON.stringify(message), 'utf8'),
    )

    prepareTxRequest.msgs = messagesList

    if (timeoutHeight !== undefined) {
      prepareTxRequest.timeoutHeight = timeoutHeight.toString()
    }

    if (memo) {
      prepareTxRequest.memo = typeof memo === 'number' ? memo.toString() : memo
    }

    try {
      const response = await this.client.PrepareTx(prepareTxRequest)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw new TransactionException(e.toOriginalError(), {
          code: e.code,
          type: e.type,
        })
      }

      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
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
    const parsedTypedData = JSON.parse(txResponse.data)
    const publicKeyHex = recoverTypedSignaturePubKey(parsedTypedData, signature)

    const cosmosPubKey = CosmosPubKey.create()
    cosmosPubKey.type = txResponse.pubKeyType
    cosmosPubKey.key = publicKeyHex

    parsedTypedData.message.msgs = null

    const broadcastTxRequest = BroadcastTxRequest.create()
    broadcastTxRequest.mode = 'block'
    broadcastTxRequest.chainId = chainId.toString()
    broadcastTxRequest.pubKey = cosmosPubKey
    broadcastTxRequest.signature = signature
    broadcastTxRequest.tx = Buffer.from(
      JSON.stringify(parsedTypedData.message),
      'utf8',
    )

    broadcastTxRequest.feePayer = txResponse.feePayer
    broadcastTxRequest.feePayerSig = txResponse.feePayerSig

    const arrayOfMessages = Array.isArray(message) ? message : [message]

    const messagesList = arrayOfMessages.map((message) =>
      Buffer.from(JSON.stringify(message), 'utf8'),
    )

    broadcastTxRequest.msgs = messagesList

    try {
      const response = await this.client.BroadcastTx(broadcastTxRequest)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw new TransactionException(e.toOriginalError(), {
          code: e.code,
          type: e.type,
        })
      }

      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
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
    const cosmosPubKey = CosmosPubKey.create()
    cosmosPubKey.type = pubKey.type
    cosmosPubKey.key = `0x${pubKeyInHex}`

    txRaw.signatures = []

    const broadcastTxRequest = BroadcastCosmosTxRequest.create()
    broadcastTxRequest.senderAddress = address
    broadcastTxRequest.pubKey = cosmosPubKey
    broadcastTxRequest.signature = `0x${signatureInHex}`
    broadcastTxRequest.tx = TxRaw.encode(txRaw).finish()

    try {
      const response = await this.client.BroadcastCosmosTx(broadcastTxRequest)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw new TransactionException(e.toOriginalError(), {
          code: e.code,
          type: e.type,
        })
      }

      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
      })
    }
  }

  async fetchFeePayer() {
    const request = GetFeePayerRequest.create()

    try {
      const response = await this.client.GetFeePayer(request)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw new TransactionException(e.toOriginalError(), {
          code: e.code,
          type: e.type,
        })
      }

      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
      })
    }
  }
}
