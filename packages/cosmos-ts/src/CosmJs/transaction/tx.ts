import { StdFee } from '@cosmjs/amino'
import { Keccak } from 'sha3'
import {
  TxBody,
  TxRaw,
  SignDoc,
  SignerInfo,
  AuthInfo,
  ModeInfo,
  Fee,
} from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { SignMode } from '@injectivelabs/chain-api/cosmos/tx/signing/v1beta1/signing_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import Long from 'long'
import { PubKey as CosmosPubKey } from '@injectivelabs/chain-api/cosmos/crypto/secp256k1/keys_pb'
import { PubKey } from '@injectivelabs/chain-api/injective/crypto/v1beta1/ethsecp256k1/keys_pb'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { createAny, createAnyMessage } from './utils'

export const SIGN_DIRECT = SignMode.SIGN_MODE_DIRECT
export const LEGACY_AMINO = SignMode.SIGN_MODE_LEGACY_AMINO_JSON

export const getPublicKey = ({ algo, key }: { algo: string; key: string }) => {
  const publicKey =
    algo === 'secp256k1'
      ? {
          proto: new CosmosPubKey(),
          path: '/cosmos.crypto.vbeta1.secp256k1.PubKey',
        }
      : {
          proto: new PubKey(),
          path: '/injective.crypto.v1beta1.ethsecp256k1.PubKey',
        }

  const pubkeyProto = publicKey.proto
  pubkeyProto.setKey(key)

  return createAny(
    Buffer.from(pubkeyProto.serializeBinary()).toString('base64'),
    publicKey.path,
  )
}

export const createBody = ({
  message,
  memo,
}: {
  message: {
    type: string
    value: any
  }
  memo: string
}) => {
  const txBody = new TxBody()
  txBody.setMessagesList([createAnyMessage(message)])
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
  algo,
  publicKey,
  sequence,
  mode,
}: {
  algo: string
  publicKey: string
  sequence: number
  mode: number
}) => {
  const pubKey = getPublicKey({ algo, key: publicKey })

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
  algo,
  pubKey,
  sequence,
  accountNumber,
  chainId,
}: {
  message: {
    type: string
    value: any
  }
  memo: string
  fee: StdFee
  algo: string
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

  // AMINO
  const signInfoAmino = createSignerInfo({
    algo,
    sequence,
    publicKey: pubKey,
    mode: LEGACY_AMINO,
  })

  const authInfoAmino = createAuthInfo({
    signerInfo: signInfoAmino,
    fee: feeMessage,
  })

  const signDocAmino = createSigDoc({
    bodyBytes: body.serializeBinary(),
    authInfoBytes: authInfoAmino.serializeBinary(),
    chainId,
    accountNumber,
  })

  const hashAmino = new Keccak(256)
  hashAmino.update(Buffer.from(signDocAmino.serializeBinary()))
  const toSignAmino = hashAmino.digest('binary')

  // SignDirect
  const signInfoDirect = createSignerInfo({
    algo,
    sequence,
    mode: SIGN_DIRECT,
    publicKey: pubKey,
  })

  const authInfoDirect = createAuthInfo({
    signerInfo: signInfoDirect,
    fee: feeMessage,
  })

  const signDocDirect = createSigDoc({
    bodyBytes: body.serializeBinary(),
    authInfoBytes: authInfoDirect.serializeBinary(),
    chainId,
    accountNumber,
  })

  const hashDirect = new Keccak(256)
  hashDirect.update(Buffer.from(signDocDirect.serializeBinary()))
  const toSignDirect = hashDirect.digest('binary')

  return {
    legacyAmino: {
      body,
      chainId,
      accountNumber: new Long(accountNumber),
      bodyBytes: body.serializeBinary(),
      authInfoBytes: authInfoAmino.serializeBinary(),
      authInfo: authInfoAmino,
      signBytes: toSignAmino.toString('base64'),
    },
    signDirect: {
      body,
      chainId,
      accountNumber: new Long(accountNumber),
      bodyBytes: body.serializeBinary(),
      authInfoBytes: authInfoDirect.serializeBinary(),
      authInfo: authInfoDirect,
      signBytes: toSignDirect.toString('base64'),
    },
  }
}

export const createSignedTx = (signatureResponse: DirectSignResponse) => {
  const txRaw = new TxRaw()
  txRaw.setAuthInfoBytes(signatureResponse.signed.authInfoBytes)
  txRaw.setBodyBytes(signatureResponse.signed.bodyBytes)
  txRaw.setSignaturesList([signatureResponse.signature.signature])

  return txRaw
}
