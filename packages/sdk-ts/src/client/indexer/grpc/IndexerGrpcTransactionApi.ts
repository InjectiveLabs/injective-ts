import {
  ErrorType,
  UnspecifiedErrorCode,
  TransactionException,
} from '@injectivelabs/exceptions'
import * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb.mjs'
import * as InjectiveExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_exchange_rpc_pb'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import { InjectiveExchangeRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_exchange_rpc_pb.client'
import {
  DEFAULT_GAS_LIMIT,
  DEFAULT_EXCHANGE_LIMIT,
  DEFAULT_BRIDGE_FEE_DENOM,
  DEFAULT_BRIDGE_FEE_PRICE,
} from '@injectivelabs/utils'
import { IndexerModule } from '../types/index.js'
import { recoverTypedSignaturePubKey } from '../../../utils/transaction.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { EvmChainId, AccountAddress } from '@injectivelabs/ts-types'

interface PrepareTxArgs {
  address: AccountAddress
  chainId: EvmChainId
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
export class IndexerGrpcTransactionApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Transaction

  private client: InjectiveExchangeRPCClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectiveExchangeRPCClient(this.transport)
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
    const txFeeAmount = CosmosBaseV1Beta1CoinPb.Coin.create()
    txFeeAmount.denom = feeDenom
    txFeeAmount.amount = feePrice

    const cosmosTxFee = InjectiveExchangeRpcPb.CosmosTxFee.create()
    cosmosTxFee.price = [txFeeAmount]

    if (!estimateGas) {
      cosmosTxFee.gas = BigInt(gasLimit)
    }

    const prepareTxRequest = InjectiveExchangeRpcPb.PrepareTxRequest.create()
    prepareTxRequest.chainId = BigInt(chainId)
    prepareTxRequest.signerAddress = address
    prepareTxRequest.fee = cosmosTxFee

    const arrayOfMessages = Array.isArray(message) ? message : [message]
    const messagesList = arrayOfMessages.map((message) =>
      Buffer.from(JSON.stringify(message), 'utf8'),
    )

    prepareTxRequest.msgs = messagesList

    if (timeoutHeight !== undefined) {
      prepareTxRequest.timeoutHeight = BigInt(timeoutHeight)
    }

    if (memo) {
      prepareTxRequest.memo = typeof memo === 'number' ? memo.toString() : memo
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeRpcPb.PrepareTxRequest,
      InjectiveExchangeRpcPb.PrepareTxResponse
    >(prepareTxRequest, this.client.prepareTx.bind(this.client))

    return response
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
    const txFeeAmount = CosmosBaseV1Beta1CoinPb.Coin.create()
    txFeeAmount.denom = feeDenom
    txFeeAmount.amount = feePrice

    const cosmosTxFee = InjectiveExchangeRpcPb.CosmosTxFee.create()
    cosmosTxFee.price = [txFeeAmount]

    if (!estimateGas) {
      cosmosTxFee.gas = BigInt(gasLimit)
    }

    const prepareTxRequest =
      InjectiveExchangeRpcPb.PrepareCosmosTxRequest.create()
    prepareTxRequest.fee = cosmosTxFee
    prepareTxRequest.senderAddress = address

    const arrayOfMessages = Array.isArray(message) ? message : [message]
    const messagesList = arrayOfMessages.map((message) =>
      Buffer.from(JSON.stringify(message), 'utf8'),
    )

    prepareTxRequest.msgs = messagesList

    if (timeoutHeight !== undefined) {
      prepareTxRequest.timeoutHeight = BigInt(timeoutHeight)
    }

    if (memo) {
      prepareTxRequest.memo = typeof memo === 'number' ? memo.toString() : memo
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeRpcPb.PrepareCosmosTxRequest,
      InjectiveExchangeRpcPb.PrepareCosmosTxResponse
    >(prepareTxRequest, this.client.prepareCosmosTx.bind(this.client))

    return response
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
    chainId: EvmChainId
    useCorrectEIP712Hash?: boolean
    txResponse: InjectiveExchangeRpcPb.PrepareTxResponse
    message: Record<string, any>
  }) {
    const parsedTypedData = JSON.parse(txResponse.data)
    let publicKeyHex: string
    try {
      publicKeyHex = await recoverTypedSignaturePubKey(
        parsedTypedData,
        signature,
      )
    } catch (e: any) {
      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Web3Gateway.RecoverTypedSignaturePubKey',
        type: ErrorType.Web3Gateway,
      })
    }

    const cosmosPubKey = InjectiveExchangeRpcPb.CosmosPubKey.create()
    cosmosPubKey.type = txResponse.pubKeyType
    cosmosPubKey.key = publicKeyHex

    parsedTypedData.message.msgs = null

    const broadcastTxRequest =
      InjectiveExchangeRpcPb.BroadcastTxRequest.create()
    broadcastTxRequest.mode = 'sync'
    broadcastTxRequest.chainId = BigInt(chainId)
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

    const response = await this.executeGrpcCall<
      InjectiveExchangeRpcPb.BroadcastTxRequest,
      InjectiveExchangeRpcPb.BroadcastTxResponse
    >(broadcastTxRequest, this.client.broadcastTx.bind(this.client))

    return response
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
    txRaw: CosmosTxV1Beta1TxPb.TxRaw
    pubKey: {
      type: string
      value: string // base64
    }
  }) {
    const pubKeyInHex = Buffer.from(pubKey.value, 'base64').toString('hex')
    const signatureInHex = Buffer.from(signature, 'base64').toString('hex')
    const cosmosPubKey = InjectiveExchangeRpcPb.CosmosPubKey.create()
    cosmosPubKey.type = pubKey.type
    cosmosPubKey.key = `0x${pubKeyInHex}`

    txRaw.signatures = []

    const broadcastTxRequest =
      InjectiveExchangeRpcPb.BroadcastCosmosTxRequest.create()
    broadcastTxRequest.senderAddress = address
    broadcastTxRequest.pubKey = cosmosPubKey
    broadcastTxRequest.signature = `0x${signatureInHex}`
    broadcastTxRequest.tx = CosmosTxV1Beta1TxPb.TxRaw.toBinary(txRaw)

    const response = await this.executeGrpcCall<
      InjectiveExchangeRpcPb.BroadcastCosmosTxRequest,
      InjectiveExchangeRpcPb.BroadcastCosmosTxResponse
    >(broadcastTxRequest, this.client.broadcastCosmosTx.bind(this.client))

    return response
  }

  async fetchFeePayer() {
    const request = InjectiveExchangeRpcPb.GetFeePayerRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveExchangeRpcPb.GetFeePayerRequest,
      InjectiveExchangeRpcPb.GetFeePayerResponse
    >(request, this.client.getFeePayer.bind(this.client))

    return response
  }
}
