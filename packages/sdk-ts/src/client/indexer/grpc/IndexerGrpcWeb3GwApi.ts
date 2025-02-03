import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import {
  DEFAULT_GAS_LIMIT,
  DEFAULT_BRIDGE_FEE_DENOM,
  DEFAULT_BRIDGE_FEE_PRICE,
} from '@injectivelabs/utils'
import { IndexerModule } from '../types/index.js'
import {
  ErrorType,
  TransactionException,
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
} from '@injectivelabs/exceptions'
import { InjectiveExchangeRpc } from '@injectivelabs/indexer-proto-ts'
import { CosmosBaseV1Beta1Coin } from '@injectivelabs/core-proto-ts'
import { IndexerGrpcTransactionApi } from './IndexerGrpcTransactionApi.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcWeb3GwApi extends IndexerGrpcTransactionApi {
  protected module: string = IndexerModule.Web3Gw

  constructor(endpoint: string) {
    super(endpoint)
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
    chainId: EthereumChainId
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
    const txFeeAmount = CosmosBaseV1Beta1Coin.Coin.create()
    txFeeAmount.denom = feeDenom
    txFeeAmount.amount = feePrice

    const cosmosTxFee = InjectiveExchangeRpc.CosmosTxFee.create()
    cosmosTxFee.price = [txFeeAmount]

    if (!estimateGas) {
      cosmosTxFee.gas = gasLimit.toString()
    }

    const prepareTxRequest = InjectiveExchangeRpc.PrepareEip712Request.create()
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

    if (eip712Version) {
      prepareTxRequest.eip712Wrapper = eip712Version
    }

    if (accountNumber) {
      prepareTxRequest.accountNumber = accountNumber.toString()
    }

    if (sequence) {
      prepareTxRequest.sequence = sequence.toString()
    }

    try {
      const response = await this.client.PrepareEip712(prepareTxRequest)

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveExchangeRpc.GrpcWebError) {
        throw new TransactionException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'PrepareEip712',
          contextModule: 'Web3Gateway',
          type: e.type,
        })
      }

      throw new TransactionException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Web3Gateway.PrepareEip712',
        type: ErrorType.Web3Gateway,
      })
    }
  }
}
