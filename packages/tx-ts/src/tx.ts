import { StdFee } from '@cosmjs/amino'
import { Keccak } from 'sha3'
import {
  TxBody,
  SignDoc,
  SignerInfo,
  AuthInfo,
  ModeInfo,
  Fee,
  TxRaw,
} from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { SignMode } from '@injectivelabs/chain-api/cosmos/tx/signing/v1beta1/signing_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { PubKey as CosmosPubKey } from '@injectivelabs/chain-api/cosmos/crypto/secp256k1/keys_pb'
import { PubKey } from '@injectivelabs/chain-api/injective/crypto/v1beta1/ethsecp256k1/keys_pb'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { createAny, createAnyMessage } from './utils'

export const SIGN_DIRECT = SignMode.SIGN_MODE_DIRECT

export const getPublicKey = ({
  chainId,
  key,
}: {
  chainId: string
  key: string
}) => {
  let proto
  let path

  if (chainId.startsWith('injective')) {
    proto = new PubKey()
    path = '/injective.crypto.v1beta1.ethsecp256k1.PubKey'
  } else if (chainId.startsWith('evmos')) {
    proto = new PubKey()
    path = '/ethermint.crypto.v1.ethsecp256k1.PubKey'
  } else {
    proto = new CosmosPubKey()
    path = '/cosmos.crypto.secp256k1.PubKey'
  }

  proto.setKey(Buffer.from(key, 'base64'))

  return createAny(proto.serializeBinary(), path)
}

export const createBody = ({
  message,
  memo,
}: {
  message: {
    type: string
    message: any
  }
  memo: string
}) => {
  const txBody = new TxBody()
  txBody.setMessagesList([
    createAnyMessage({
      value: message.message,
      type: message.type,
    }),
  ])
  txBody.setMemo(memo)

  return txBody
}

export const createFee = ({
  fee,
  gasLimit,
}: {
  fee: { amount: string; denom: string }
  gasLimit: number
}) => {
  const feeAmount = new Coin()
  feeAmount.setAmount(fee.amount)
  feeAmount.setDenom(fee.denom)

  const feeProto = new Fee()
  feeProto.setGasLimit(gasLimit)
  feeProto.setAmountList([feeAmount])

  return feeProto
}

export const createSignerInfo = ({
  chainId,
  publicKey,
  sequence,
  mode,
}: {
  chainId: string
  publicKey: string
  sequence: number
  mode: number
}) => {
  const pubKey = getPublicKey({ chainId, key: publicKey })

  const single = new ModeInfo.Single()
  single.setMode(mode as any)

  const modeInfo = new ModeInfo()
  modeInfo.setSingle(single)

  const signerInfo = new SignerInfo()
  signerInfo.setPublicKey(pubKey)
  signerInfo.setSequence(sequence)
  signerInfo.setModeInfo(modeInfo)

  return signerInfo
}

export const createAuthInfo = ({
  signerInfo,
  fee,
}: {
  signerInfo: SignerInfo
  fee: Fee
}) => {
  const authInfo = new AuthInfo()
  authInfo.setSignerInfosList([signerInfo])
  authInfo.setFee(fee)

  return authInfo
}

export const createSigDoc = ({
  bodyBytes,
  authInfoBytes,
  chainId,
  accountNumber,
}: {
  bodyBytes: Uint8Array
  authInfoBytes: Uint8Array
  chainId: string
  accountNumber: number
}) => {
  const signDoc = new SignDoc()
  signDoc.setAccountNumber(accountNumber)
  signDoc.setChainId(chainId)
  signDoc.setBodyBytes(bodyBytes)
  signDoc.setAuthInfoBytes(authInfoBytes)

  return signDoc
}

export const createTransaction = ({
  message,
  memo,
  fee,
  pubKey,
  sequence,
  accountNumber,
  chainId,
}: {
  message: {
    type: string
    message: any
  }
  memo: string
  fee: StdFee
  pubKey: string
  sequence: number
  accountNumber: number
  chainId: string
}) => {
  const body = createBody({ message, memo })
  const feeMessage = createFee({
    fee: fee.amount[0],
    gasLimit: parseInt(fee.gas, 10),
  })

  const signInfo = createSignerInfo({
    chainId,
    sequence,
    mode: SIGN_DIRECT,
    publicKey: pubKey,
  })

  const authInfo = createAuthInfo({
    signerInfo: signInfo,
    fee: feeMessage,
  })

  const signDoc = createSigDoc({
    bodyBytes: body.serializeBinary(),
    authInfoBytes: authInfo.serializeBinary(),
    chainId,
    accountNumber,
  })

  const hash = new Keccak(256)
  hash.update(Buffer.from(signDoc.serializeBinary()))
  const toSign = hash.digest('binary')

  const txRaw = new TxRaw()
  txRaw.setAuthInfoBytes(authInfo.serializeBinary())
  txRaw.setBodyBytes(body.serializeBinary())

  return {
    txRaw,
    signDoc,
    accountNumber,
    bodyBytes: body.serializeBinary(),
    authInfoBytes: authInfo.serializeBinary(),
    signBytes: toSign.toString('base64'),
  }
}

export const createTxRaw = (signatureResponse: DirectSignResponse) => {
  const txRaw = new TxRaw()
  txRaw.setAuthInfoBytes(signatureResponse.signed.authInfoBytes)
  txRaw.setBodyBytes(signatureResponse.signed.bodyBytes)
  txRaw.setSignaturesList([signatureResponse.signature.signature])

  return txRaw
}
