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
import { AccountDetails } from '../types/auth'

export interface InjectiveTxParams {
  msg: Msgs | Msgs[]
  memo?: string
  address: string
  feePrice?: string
  feeDenom?: string
  gasLimit?: number
  chainId: string
}

export class InjectiveTx {
  private accountDetails: AccountDetails

  private tx: InjectiveTxParams

  constructor({
    tx,
    accountDetails,
  }: {
    tx: InjectiveTxParams
    accountDetails: AccountDetails
  }) {
    this.accountDetails = accountDetails
    this.tx = tx
  }

  get packedMsgs() {
    const { tx } = this
    const msgs = Array.isArray(tx.msg) ? tx.msg : [tx.msg]
    const packedMsgs = msgs.map((msg) => {
      const amino = msg.toAmino()

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
    const { tx, accountDetails } = this

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

    const packedPublicKey = new Any()
    packedPublicKey.setTypeUrl(accountDetails.pubKey.type)
    packedPublicKey.setValue(accountDetails.pubKey.key)

    const modeSingleDirect = new ModeInfo.Single()
    modeSingleDirect.setMode(SignMode.SIGN_MODE_DIRECT)

    const modeInfo = new ModeInfo()
    modeInfo.setSingle(modeSingleDirect)

    const signerInfo = new SignerInfo()
    signerInfo.setPublicKey(packedPublicKey)
    signerInfo.setModeInfo(modeInfo)
    signerInfo.setSequence(accountDetails.sequence)

    const authInfo = new AuthInfo()
    authInfo.setSignerInfosList([signerInfo])
    authInfo.setFee(fee)

    return authInfo
  }

  get signDoc() {
    const { tx, txBody, authInfo, accountDetails } = this

    const signDoc = new SignDoc()
    signDoc.setBodyBytes(txBody.serializeBinary())
    signDoc.setAuthInfoBytes(authInfo.serializeBinary())
    signDoc.setChainId(tx.chainId)
    signDoc.setAccountNumber(accountDetails.accountNumber)

    return signDoc
  }

  toTxRaw(signature: string) {
    const { txBody, authInfo } = this

    const txRaw = new TxRaw()
    txRaw.setBodyBytes(txBody.serializeBinary())
    txRaw.setAuthInfoBytes(authInfo.serializeBinary())
    txRaw.setSignaturesList([signature])

    return txRaw
  }

  static getTxHash(txRaw: TxRaw) {
    return crypto
      .createHash('sha256')
      .update(txRaw.serializeBinary())
      .digest('hex')
  }
}
