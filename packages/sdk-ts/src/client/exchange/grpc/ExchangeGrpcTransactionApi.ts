import {
  PrepareTxRequest,
  PrepareTxResponse,
  BroadcastTxRequest,
  BroadcastTxResponse,
  CosmosTxFee,
  CosmosPubKey,
} from '@injectivelabs/exchange-api/injective_exchange_rpc_pb'
import { InjectiveExchangeRPC } from '@injectivelabs/exchange-api/injective_exchange_rpc_pb_service'
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

/**
 * @category Exchange Grpc API
 */
export class ExchangeGrpcTransactionApi extends BaseConsumer {
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
    memo?: string
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
      prepareTxRequest.setMemo(memo)
    }

    try {
      const response = await this.request<
        PrepareTxRequest,
        PrepareTxResponse,
        typeof InjectiveExchangeRPC.PrepareTx
      >(prepareTxRequest, InjectiveExchangeRPC.PrepareTx)

      return response
    } catch (e: any) {
      throw new Error(e.message)
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
    memo?: string
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
      prepareTxRequest.setMemo(memo)
    }

    try {
      const response = await this.request<
        PrepareTxRequest,
        PrepareTxResponse,
        typeof InjectiveExchangeRPC.PrepareTx
      >(prepareTxRequest, InjectiveExchangeRPC.PrepareTx)

      return response
    } catch (e: any) {
      throw new Error(e.message)
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
    broadcastTxRequest.setMode('sync')
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
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
