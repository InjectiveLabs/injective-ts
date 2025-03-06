import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import {
  DEFAULT_GAS_LIMIT,
  DEFAULT_EXCHANGE_LIMIT,
  DEFAULT_BRIDGE_FEE_DENOM,
  DEFAULT_BRIDGE_FEE_PRICE,
} from '@injectivelabs/utils'
import { recoverTypedSignaturePubKey } from '../../../utils/transaction.js'
import { IndexerModule } from '../types/index.js'
import {
  ErrorType,
  UnspecifiedErrorCode,
  TransactionException,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../base/BaseIndexerGrpcWebConsumer.js'
import { InjectiveExchangeRpc } from '@injectivelabs/indexer-proto-ts'
import {
  CosmosTxV1Beta1Tx,
  CosmosBaseV1Beta1Coin,
} from '@injectivelabs/core-proto-ts'

interface PrepareTxArgs {
  address: AccountAddress
  chainId: EthereumChainId
  message: any
  estimateGas?: boolean
  gasLimit?: number
  memo?: string | number
  timeoutHeight?: number
  feeDenom?: string
  feePrice?: string
}

/**
 * @category Indexer Grpc API
 * @deprecated use IndexerGrpcWeb3GwApi
 */
export class IndexerGrpcTransactionApi {
  protected module: string = IndexerModule.Transaction

  protected client: InjectiveExchangeRpc.InjectiveExchangeRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveExchangeRpc.InjectiveExchangeRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async prepareTxRequest(args: PrepareTxArgs) {
    const {
      address,
      chainId,
      message,
      memo,
      estimateGas = true,
      gasLimit = DEFAULT_GAS_LIMIT,
      feeDenom = DEFAULT_BRIDGE_FEE_DENOM,
      feePrice = DEFAULT_BRIDGE_FEE_PRICE,
      timeoutHeight,
    } = args
    const txFeeAmount = CosmosBaseV1Beta1Coin.Coin.create()
    txFeeAmount.denom = feeDenom
    txFeeAmount.amount = feePrice

    const cosmosTxFee = InjectiveExchangeRpc.CosmosTxFee.create()
    cosmosTxFee.price = [txFeeAmount]

    if (!estimateGas) {
      cosmosTxFee.gas = gasLimit.toString()
    }

    const prepareTxRequest = InjectiveExchangeRpc.PrepareTxRequest.create()
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
      if (e instanceof InjectiveExchangeRpc.GrpcWebError) {
        throw new TransactionException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'PrepareTx',
          contextModule: 'Web3Gateway',
          type: e.type,
        })
      }

      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Web3Gateway.PrepareTx',
        type: ErrorType.Web3Gateway,
      })
    }
  }

  async prepareExchangeTxRequest(args: PrepareTxArgs) {
    return this.prepareTxRequest({
      ...args,
      gasLimit: args.gasLimit || DEFAULT_EXCHANGE_LIMIT,
    })
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
    const txFeeAmount = CosmosBaseV1Beta1Coin.Coin.create()
    txFeeAmount.denom = feeDenom
    txFeeAmount.amount = feePrice

    const cosmosTxFee = InjectiveExchangeRpc.CosmosTxFee.create()
    cosmosTxFee.price = [txFeeAmount]

    if (!estimateGas) {
      cosmosTxFee.gas = gasLimit.toString()
    }

    const prepareTxRequest =
      InjectiveExchangeRpc.PrepareCosmosTxRequest.create()
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
      if (e instanceof InjectiveExchangeRpc.GrpcWebError) {
        throw new TransactionException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          type: e.type,
          contextCode: e.code,
          context: 'Web3Gateway.CosmosPrepareTx',
        })
      }

      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Web3Gateway.CosmosPrepareTx',
        type: ErrorType.Web3Gateway,
      })
    }
  }

  /**
   * Keep in mind that the transaction is just added
   * to the mempool, we need to query the transaction hash
   * if we want to ensure that the transaction is included
   * in the block
   */
  async broadcastTxRequest({
    signature,
    chainId,
    message,
    txResponse,
  }: {
    signature: string
    chainId: EthereumChainId
    useCorrectEIP712Hash?: boolean
    txResponse: InjectiveExchangeRpc.PrepareTxResponse
    message: Record<string, any>
  }) {
    const parsedTypedData = JSON.parse(txResponse.data)
    const publicKeyHex = recoverTypedSignaturePubKey(parsedTypedData, signature)

    const cosmosPubKey = InjectiveExchangeRpc.CosmosPubKey.create()
    cosmosPubKey.type = txResponse.pubKeyType
    cosmosPubKey.key = publicKeyHex

    parsedTypedData.message.msgs = null

    const broadcastTxRequest = InjectiveExchangeRpc.BroadcastTxRequest.create()
    broadcastTxRequest.mode = 'sync'
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
      if (e instanceof InjectiveExchangeRpc.GrpcWebError) {
        throw new TransactionException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          type: e.type,
          contextCode: e.code,
          context: 'Web3Gateway.BroadcastTx',
        })
      }

      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Web3Gateway.BroadcastTx',
        type: ErrorType.Web3Gateway,
      })
    }
  }

  /**
   * Keep in mind that the transaction is just added
   * to the mempool, we need to query the transaction hash
   * if we want to ensure that the transaction is included
   * in the block
   */
  async broadcastCosmosTxRequest({
    address,
    signature,
    txRaw,
    pubKey,
  }: {
    address: string
    signature: string // base64
    txRaw: CosmosTxV1Beta1Tx.TxRaw
    pubKey: {
      type: string
      value: string // base64
    }
  }) {
    const pubKeyInHex = Buffer.from(pubKey.value, 'base64').toString('hex')
    const signatureInHex = Buffer.from(signature, 'base64').toString('hex')
    const cosmosPubKey = InjectiveExchangeRpc.CosmosPubKey.create()
    cosmosPubKey.type = pubKey.type
    cosmosPubKey.key = `0x${pubKeyInHex}`

    txRaw.signatures = []

    const broadcastTxRequest =
      InjectiveExchangeRpc.BroadcastCosmosTxRequest.create()
    broadcastTxRequest.senderAddress = address
    broadcastTxRequest.pubKey = cosmosPubKey
    broadcastTxRequest.signature = `0x${signatureInHex}`
    broadcastTxRequest.tx = CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish()

    try {
      const response = await this.client.BroadcastCosmosTx(broadcastTxRequest)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw new TransactionException(e.toOriginalError(), {
          code: grpcErrorCodeToErrorCode(e.code),
          type: e.type,
          contextCode: e.code,
          context: 'Web3Gateway.BroadcastCosmosTx',
        })
      }

      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Web3Gateway.BroadcastCosmosTx',
        type: ErrorType.Web3Gateway,
      })
    }
  }

  async fetchFeePayer() {
    const request = InjectiveExchangeRpc.GetFeePayerRequest.create()

    try {
      const response = await this.client.GetFeePayer(request)

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveExchangeRpc.GrpcWebError) {
        throw new TransactionException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          type: e.type,
          context: 'Web3Gateway.FeePayer',
        })
      }

      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Web3Gateway.FeePayer',
        type: ErrorType.Web3Gateway,
      })
    }
  }
}
