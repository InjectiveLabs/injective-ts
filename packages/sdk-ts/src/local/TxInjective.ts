import { Any } from 'google-protobuf/google/protobuf/any_pb'
import {
  TxBody,
  ModeInfo,
  Fee,
  SignerInfo,
  AuthInfo,
  SignDoc,
  TxRaw,
} from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { SignMode } from '@injectivelabs/chain-api/cosmos/tx/signing/v1beta1/signing_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { BigNumber } from '@injectivelabs/utils'
import crypto from 'crypto'
import { Msgs } from '../core/msgs'
import {
  DEFAULT_FEE_DENOM,
  DEFAULT_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
} from '../utils'
import { BaseAccount } from '../classes/BaseAccount'
import { PubKey } from '@injectivelabs/chain-api/injective/crypto/v1beta1/ethsecp256k1/keys_pb'

export interface TxInjectiveParams {
  msgs: Msgs | Msgs[]
  memo?: string
  address: string
  feePrice?: string
  feeDenom?: string
  gasLimit?: number
  chainId: string
  baseAccount: BaseAccount
}

export class TxInjective {
  public tx: TxInjectiveParams

  public signature?: string | Uint8Array

  constructor(tx: TxInjectiveParams) {
    this.tx = tx
  }

  get packedMsgs() {
    const { tx } = this
    const msgs = Array.isArray(tx.msgs) ? tx.msgs : [tx.msgs]
    const packedMsgs = msgs.map((msg) => {
      const amino = msg.toDirectSign()

      const packedMessage = new Any()
      packedMessage.setTypeUrl(amino.type)
      packedMessage.setValue(amino.message.serializeBinary())

      return packedMessage
    })

    return packedMsgs
  }

  get txBody() {
    const { tx, packedMsgs } = this

    const txBody = new TxBody()
    txBody.setMessagesList(packedMsgs)
    txBody.setMemo(tx.memo || '')
    txBody.setTimeoutHeight(0)

    return txBody
  }

  get authInfo() {
    const { tx } = this
    const { baseAccount } = tx

    // TODO: gas limit based on the message type (lower limit for exchange messages)
    const gasLimit = tx.gasLimit || DEFAULT_GAS_LIMIT
    const feePrice = tx.feePrice || DEFAULT_GAS_PRICE
    const feeDenom = tx.feeDenom || DEFAULT_FEE_DENOM

    const feeAmount = new Coin()
    feeAmount.setAmount(new BigNumber(gasLimit).times(feePrice).toString())
    feeAmount.setDenom(feeDenom)

    const fee = new Fee()
    fee.setGasLimit(gasLimit)
    fee.setAmountList([feeAmount])

    const publicKey = new PubKey()
    publicKey.setKey(baseAccount.pubKey.key)

    const packedPublicKey = new Any()
    packedPublicKey.setTypeUrl(baseAccount.pubKey.type)
    packedPublicKey.setValue(
      Buffer.from(publicKey.serializeBinary()).toString('base64'),
    )

    const modeSingleDirect = new ModeInfo.Single()
    modeSingleDirect.setMode(SignMode.SIGN_MODE_DIRECT)

    const modeInfo = new ModeInfo()
    modeInfo.setSingle(modeSingleDirect)

    const signerInfo = new SignerInfo()
    signerInfo.setPublicKey(packedPublicKey)
    signerInfo.setModeInfo(modeInfo)
    signerInfo.setSequence(baseAccount.sequence)

    const authInfo = new AuthInfo()
    authInfo.setSignerInfosList([signerInfo])
    authInfo.setFee(fee)

    return authInfo
  }

  get signDoc() {
    const { tx, txBody, authInfo } = this
    const { baseAccount } = tx

    const signDoc = new SignDoc()
    signDoc.setBodyBytes(txBody.serializeBinary())
    signDoc.setAuthInfoBytes(authInfo.serializeBinary())
    signDoc.setChainId(tx.chainId)
    signDoc.setAccountNumber(baseAccount.accountNumber)

    return signDoc
  }

  get signBytes() {
    return this.signDoc.serializeBinary()
  }

  withSignature(signature: string | Uint8Array) {
    this.signature = signature

    return this
  }

  toTxRaw() {
    const { signature, txBody, authInfo } = this

    const txRaw = new TxRaw()
    txRaw.setBodyBytes(txBody.serializeBinary())
    txRaw.setAuthInfoBytes(authInfo.serializeBinary())

    if (signature) {
      txRaw.setSignaturesList([signature])
    }

    return txRaw
  }

  getTxHash() {
    return crypto
      .createHash('sha256')
      .update(this.toTxRaw().serializeBinary())
      .digest('hex')
  }
}
