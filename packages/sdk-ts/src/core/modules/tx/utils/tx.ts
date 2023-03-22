import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { PubKey } from '@injectivelabs/chain-api/cosmos/crypto/secp256k1/keys_pb'
import { PubKey as CosmosPubKey } from '@injectivelabs/chain-api/cosmos/crypto/secp256k1/keys_pb'
import { createAny, createAnyMessage } from './helpers'
import { MsgArg } from '../types'
import {
  TxBody,
  SignDoc,
  SignerInfo,
  AuthInfo,
  ModeInfo,
  Fee,
  TxRaw,
} from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { SignModeMap } from '@injectivelabs/chain-api/cosmos/tx/signing/v1beta1/signing_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { SignDoc as CosmosSignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { ExtensionOptionsWeb3Tx } from '@injectivelabs/chain-api/injective/types/v1beta1/tx_ext_pb'
import { EthereumChainId } from '@injectivelabs/ts-types'

export const getPublicKey = ({
  chainId,
  key,
}: {
  chainId: string
  key: string | Any
}) => {
  if (key instanceof Any) {
    return key
  }

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
  memo = '',
  timeoutHeight,
}: {
  message: MsgArg | MsgArg[]
  memo?: string
  timeoutHeight?: number
}) => {
  const messages = Array.isArray(message) ? message : [message]

  const txBody = new TxBody()
  txBody.setMessagesList(
    messages.map((message) =>
      createAnyMessage({
        value: message.message,
        type: message.type,
      }),
    ),
  )
  txBody.setMemo(memo)

  if (timeoutHeight) {
    txBody.setTimeoutHeight(timeoutHeight)
  }

  return txBody
}

export const createFee = ({
  fee,
  payer,
  gasLimit,
}: {
  fee: { amount: string; denom: string }
  payer?: string
  gasLimit: number
}) => {
  const feeAmount = new Coin()
  feeAmount.setAmount(fee.amount)
  feeAmount.setDenom(fee.denom)

  const feeProto = new Fee()
  feeProto.setGasLimit(gasLimit)
  feeProto.setAmountList([feeAmount])

  if (payer) {
    feeProto.setPayer(payer)
  }

  return feeProto
}

export const createSigners = ({
  chainId,
  mode,
  signers,
}: {
  chainId: string
  signers: { pubKey: string | Any; sequence: number }[]
  mode: SignModeMap[keyof SignModeMap]
}) => {
  return signers.map((s) =>
    createSignerInfo({
      mode,
      chainId,
      publicKey: s.pubKey,
      sequence: s.sequence,
    }),
  )
}

export const createSignerInfo = ({
  chainId,
  publicKey,
  sequence,
  mode,
}: {
  chainId: string
  publicKey: string | Any
  sequence: number
  mode: SignModeMap[keyof SignModeMap]
}) => {
  const pubKey = getPublicKey({ chainId, key: publicKey })

  const single = new ModeInfo.Single()
  single.setMode(mode)

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
  signerInfo: SignerInfo[]
  fee: Fee
}) => {
  const authInfo = new AuthInfo()
  authInfo.setSignerInfosList(signerInfo)
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

export const createCosmosSignDocFromTransaction = (args: {
  txRaw: TxRaw
  chainId: string
  accountNumber: number
}) => {
  return CosmosSignDoc.fromPartial({
    bodyBytes: args.txRaw.getBodyBytes_asU8(),
    authInfoBytes: args.txRaw.getAuthInfoBytes_asU8(),
    accountNumber: args.accountNumber,
    chainId: args.chainId,
  })
}

export const createTxRawEIP712 = (
  txRaw: TxRaw,
  extension: ExtensionOptionsWeb3Tx,
) => {
  const body = TxBody.deserializeBinary(txRaw.getBodyBytes_asU8())
  const extensionAny = createAny(
    extension.serializeBinary(),
    '/injective.types.v1beta1.ExtensionOptionsWeb3Tx',
  )
  body.addExtensionOptions(extensionAny)

  txRaw.setBodyBytes(body.serializeBinary())

  return txRaw
}

export const createWeb3Extension = ({
  ethereumChainId,
  feePayer,
  feePayerSig,
}: {
  ethereumChainId: EthereumChainId
  feePayer?: string
  feePayerSig?: Uint8Array
}) => {
  const web3Extension = new ExtensionOptionsWeb3Tx()
  web3Extension.setTypeddatachainid(ethereumChainId)

  if (feePayer) {
    web3Extension.setFeepayer(feePayer)
  }

  if (feePayerSig) {
    web3Extension.setFeepayersig(feePayerSig)
  }

  return web3Extension
}

export const getTransactionPartsFromTxRaw = (
  txRaw: TxRaw,
): { authInfo: AuthInfo; body: TxBody; signatures: Uint8Array[] } => {
  const authInfo = AuthInfo.deserializeBinary(txRaw.getAuthInfoBytes_asU8())
  const body = TxBody.deserializeBinary(txRaw.getBodyBytes_asU8())

  return {
    body,
    authInfo,
    signatures: txRaw.getSignaturesList_asU8(),
  }
}
