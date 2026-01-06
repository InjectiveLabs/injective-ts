import * as InjectiveExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_exchange_rpc_pb'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import {
  DEFAULT_GAS_LIMIT,
  DEFAULT_BRIDGE_FEE_DENOM,
  DEFAULT_BRIDGE_FEE_PRICE,
} from '@injectivelabs/utils'
import { IndexerModule } from '../types/index.js'
import { stringToUint8Array } from '../../../utils/encoding.js'
import { safeBigIntStringify } from '../../../utils/helpers.js'
import { IndexerGrpcTransactionApi } from './IndexerGrpcTransactionApi.js'
import type { EvmChainId, AccountAddress } from '@injectivelabs/ts-types'
import type { GrpcWebTransportAdditionalOptions } from '../../../types'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcWeb3GwApi extends IndexerGrpcTransactionApi {
  protected module: string = IndexerModule.Web3Gw

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    super(endpoint, options)
  }

  async prepareEip712Request({
    address,
    chainId,
    message,
    memo,
    sequence,
    accountNumber,
    estimateGas = false,
    gasLimit = DEFAULT_GAS_LIMIT,
    feeDenom = DEFAULT_BRIDGE_FEE_DENOM,
    feePrice = DEFAULT_BRIDGE_FEE_PRICE,
    timeoutHeight,
    eip712Version = 'v1',
  }: {
    address: AccountAddress
    chainId: EvmChainId
    message: any
    estimateGas?: boolean
    gasLimit?: number
    memo?: string | number
    timeoutHeight?: number
    feeDenom?: string
    feePrice?: string
    sequence?: number
    accountNumber?: number
    eip712Version?: string
  }) {
    const txFeeAmount = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: feeDenom,
      amount: feePrice,
    })

    const cosmosTxFee = InjectiveExchangeRpcPb.CosmosTxFee.create()
    cosmosTxFee.price = [txFeeAmount]

    if (!estimateGas) {
      cosmosTxFee.gas = BigInt(gasLimit)
    }

    const prepareTxRequest =
      InjectiveExchangeRpcPb.PrepareEip712Request.create()
    prepareTxRequest.chainId = BigInt(chainId)
    prepareTxRequest.signerAddress = address
    prepareTxRequest.fee = cosmosTxFee

    const arrayOfMessages = Array.isArray(message) ? message : [message]
    const messagesList = arrayOfMessages.map((message) =>
      stringToUint8Array(safeBigIntStringify(message)),
    )

    prepareTxRequest.msgs = messagesList

    if (timeoutHeight !== undefined) {
      prepareTxRequest.timeoutHeight = BigInt(timeoutHeight)
    }

    if (memo) {
      prepareTxRequest.memo = typeof memo === 'number' ? memo.toString() : memo
    }

    if (eip712Version) {
      prepareTxRequest.eip712Wrapper = eip712Version
    }

    if (accountNumber) {
      prepareTxRequest.accountNumber = BigInt(accountNumber)
    }

    if (sequence) {
      prepareTxRequest.sequence = BigInt(sequence)
    }

    const response = await this.executeGrpcCall<
      InjectiveExchangeRpcPb.PrepareEip712Request,
      InjectiveExchangeRpcPb.PrepareEip712Response
    >(
      prepareTxRequest,
      (this as any).client.prepareEip712.bind((this as any).client),
    )

    return response
  }
}
