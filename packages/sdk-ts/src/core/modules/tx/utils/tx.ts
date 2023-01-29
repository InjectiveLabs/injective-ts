import { PubKey } from '@injectivelabs/core-proto-ts/cosmos/crypto/secp256k1/keys'
import { PubKey as CosmosPubKey } from '@injectivelabs/core-proto-ts/cosmos/crypto/secp256k1/keys'
import { createAny, createAnyMessage } from './helpers'
import {
  TxBody,
  SignDoc,
  SignerInfo,
  AuthInfo,
  ModeInfo,
  Fee,
  TxRaw,
} from '@injectivelabs/core-proto-ts/cosmos/tx/v1beta1/tx'
import { SignMode } from '@injectivelabs/core-proto-ts/cosmos/tx/signing/v1beta1/signing'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { SignDoc as CosmosSignDoc } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { ExtensionOptionsWeb3Tx } from '@injectivelabs/core-proto-ts/injective/types/v1beta1/tx_ext'
import { EthereumChainId } from '@injectivelabs/ts-types'
import { Msgs } from '../../msgs'

export const getPublicKey = ({
  chainId,
  key,
}: {
  chainId: string
  key: string
}) => {
  let proto
  let path
  let baseProto

  if (chainId.startsWith('injective')) {
    proto = PubKey.create()
    baseProto = PubKey
    path = '/injective.crypto.v1beta1.ethsecp256k1.PubKey'
  } else if (chainId.startsWith('evmos')) {
    proto = PubKey.create()
    baseProto = PubKey
    path = '/ethermint.crypto.v1.ethsecp256k1.PubKey'
  } else {
    proto = CosmosPubKey.create()
    baseProto = CosmosPubKey
    path = '/cosmos.crypto.secp256k1.PubKey'
  }

  proto.key = Buffer.from(key, 'base64')

  return createAny(baseProto.encode(proto).finish(), path)
}

export const createBody = ({
  message,
  memo = '',
  timeoutHeight,
}: {
  message: Msgs | Msgs[]
  memo?: string
  timeoutHeight?: number
}) => {
  const messages = Array.isArray(message) ? message : [message]

  const txBody = TxBody.create()

  txBody.messages = messages.map((message) =>
    createAnyMessage({
      value: message.toBinary(),
      type: message.toDirectSign().type,
    }),
  )

  txBody.memo = memo

  if (timeoutHeight) {
    txBody.timeoutHeight = timeoutHeight.toString()
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
  const feeAmount = Coin.create()
  feeAmount.amount = fee.amount
  feeAmount.denom = fee.denom

  const feeProto = Fee.create()
  feeProto.gasLimit = gasLimit.toString()
  feeProto.amount = [feeAmount]

  if (payer) {
    feeProto.payer = payer
  }

  return feeProto
}

export const createSigners = ({
  chainId,
  mode,
  signers,
}: {
  chainId: string
  signers: { pubKey: string; sequence: number }[]
  mode: SignMode
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
  publicKey: string
  sequence: number
  mode: SignMode
}) => {
  const pubKey = getPublicKey({ chainId, key: publicKey })

  const single = ModeInfo.create().single!
  single.mode = mode

  const modeInfo = ModeInfo.create()
  modeInfo.single = single

  const signerInfo = SignerInfo.create()
  signerInfo.publicKey = pubKey
  signerInfo.sequence = sequence.toString()
  signerInfo.modeInfo = modeInfo

  return signerInfo
}

export const createAuthInfo = ({
  signerInfo,
  fee,
}: {
  signerInfo: SignerInfo[]
  fee: Fee
}) => {
  const authInfo = AuthInfo.create()
  authInfo.signerInfos = signerInfo
  authInfo.fee = fee

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
  const signDoc = SignDoc.create()

  signDoc.accountNumber = accountNumber.toString()
  signDoc.chainId = chainId
  signDoc.bodyBytes = bodyBytes
  signDoc.authInfoBytes = authInfoBytes

  return signDoc
}

export const createCosmosSignDocFromTransaction = (args: {
  txRaw: TxRaw
  chainId: string
  accountNumber: number
}) => {
  return CosmosSignDoc.fromPartial({
    bodyBytes: args.txRaw.bodyBytes,
    authInfoBytes: args.txRaw.authInfoBytes,
    accountNumber: args.accountNumber,
    chainId: args.chainId,
  })
}

export const createTxRawEIP712 = (
  txRaw: TxRaw,
  extension: ExtensionOptionsWeb3Tx,
) => {
  const body = TxBody.decode(txRaw.bodyBytes)
  const extensionAny = createAny(
    ExtensionOptionsWeb3Tx.encode(extension).finish(),
    '/injective.types.v1beta1.ExtensionOptionsWeb3Tx',
  )

  body.extensionOptions = [extensionAny]

  txRaw.bodyBytes = TxBody.encode(body).finish()

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
  const web3Extension = ExtensionOptionsWeb3Tx.create()
  web3Extension.typedDataChainID = ethereumChainId.toString()

  if (feePayer) {
    web3Extension.feePayer = feePayer
  }

  if (feePayerSig) {
    web3Extension.feePayerSig = feePayerSig
  }

  return web3Extension
}

export const getTransactionPartsFromTxRaw = (
  txRaw: TxRaw,
): { authInfo: AuthInfo; body: TxBody; signatures: Uint8Array[] } => {
  const authInfo = AuthInfo.decode(txRaw.authInfoBytes)
  const body = TxBody.decode(txRaw.bodyBytes)

  return {
    body,
    authInfo,
    signatures: txRaw.signatures,
  }
}
