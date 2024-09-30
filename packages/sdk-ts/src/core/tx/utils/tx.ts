import { createAny, createAnyMessage } from './helpers'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { Msgs } from '../../modules/msgs'
import {
  GoogleProtobufAny,
  CosmosTxV1Beta1Tx,
  CosmosBaseV1Beta1Coin,
  InjectiveTypesV1Beta1TxExt,
  CosmosCryptoSecp256k1Keys,
  CosmosTxSigningV1Beta1Signing,
} from '@injectivelabs/core-proto-ts'
import { getStdFee } from '@injectivelabs/utils'

export const getPublicKey = ({
  chainId,
  key,
}: {
  chainId: string
  key: string | GoogleProtobufAny.Any
}) => {
  if (typeof key !== 'string') {
    return key
  }

  let proto
  let path
  let baseProto

  if (chainId.startsWith('injective')) {
    proto = CosmosCryptoSecp256k1Keys.PubKey.create()
    baseProto = CosmosCryptoSecp256k1Keys.PubKey
    path = '/injective.crypto.v1beta1.ethsecp256k1.PubKey'
  } else if (chainId.startsWith('evmos')) {
    proto = CosmosCryptoSecp256k1Keys.PubKey.create()
    baseProto = CosmosCryptoSecp256k1Keys.PubKey
    path = '/ethermint.crypto.v1.ethsecp256k1.PubKey'
  } else {
    proto = CosmosCryptoSecp256k1Keys.PubKey.create()
    baseProto = CosmosCryptoSecp256k1Keys.PubKey
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

  const txBody = CosmosTxV1Beta1Tx.TxBody.create()

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
  granter,
  gasLimit,
}: {
  fee: { amount: string; denom: string }
  payer?: string
  granter?: string
  gasLimit: number
}) => {
  const feeAmount = CosmosBaseV1Beta1Coin.Coin.create()
  feeAmount.amount = fee.amount
  feeAmount.denom = fee.denom

  const feeProto = CosmosTxV1Beta1Tx.Fee.create()
  feeProto.gasLimit = gasLimit.toString()
  feeProto.amount = [feeAmount]

  if (payer) {
    feeProto.payer = payer
  }

  if (granter) {
    feeProto.granter = granter
  }

  return feeProto
}

export const createSigners = ({
  chainId,
  mode,
  signers,
}: {
  chainId: string
  signers: { pubKey: string | GoogleProtobufAny.Any; sequence: number }[]
  mode: CosmosTxSigningV1Beta1Signing.SignMode
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
  publicKey: string | GoogleProtobufAny.Any
  sequence: number
  mode: CosmosTxSigningV1Beta1Signing.SignMode
}) => {
  const pubKey = getPublicKey({ chainId, key: publicKey })

  const single = CosmosTxV1Beta1Tx.ModeInfo_Single.create()
  single.mode = mode

  const modeInfo = CosmosTxV1Beta1Tx.ModeInfo.create()
  modeInfo.single = single

  const signerInfo = CosmosTxV1Beta1Tx.SignerInfo.create()
  signerInfo.publicKey = pubKey
  signerInfo.sequence = sequence.toString()
  signerInfo.modeInfo = modeInfo

  return signerInfo
}

export const createAuthInfo = ({
  signerInfo,
  fee,
}: {
  signerInfo: CosmosTxV1Beta1Tx.SignerInfo[]
  fee: CosmosTxV1Beta1Tx.Fee
}) => {
  const authInfo = CosmosTxV1Beta1Tx.AuthInfo.create()
  authInfo.signerInfos = signerInfo
  authInfo.fee = fee

  return authInfo
}

export const createSignDoc = ({
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
  const signDoc = CosmosTxV1Beta1Tx.SignDoc.create()

  signDoc.accountNumber = accountNumber.toString()
  signDoc.chainId = chainId
  signDoc.bodyBytes = bodyBytes
  signDoc.authInfoBytes = authInfoBytes

  return signDoc
}

export const createSignDocFromTransaction = (args: {
  txRaw: CosmosTxV1Beta1Tx.TxRaw
  chainId: string
  accountNumber: number
}) => {
  return CosmosTxV1Beta1Tx.SignDoc.fromPartial({
    bodyBytes: args.txRaw.bodyBytes,
    authInfoBytes: args.txRaw.authInfoBytes,
    accountNumber: args.accountNumber.toString(),
    chainId: args.chainId,
  })
}

export const createTxRawEIP712 = (
  txRaw: CosmosTxV1Beta1Tx.TxRaw,
  extension: InjectiveTypesV1Beta1TxExt.ExtensionOptionsWeb3Tx,
) => {
  const body = CosmosTxV1Beta1Tx.TxBody.decode(txRaw.bodyBytes)
  const extensionAny = createAny(
    InjectiveTypesV1Beta1TxExt.ExtensionOptionsWeb3Tx.encode(extension).finish(),
    '/injective.types.v1beta1.ExtensionOptionsWeb3Tx',
  )

  body.extensionOptions = [extensionAny]

  txRaw.bodyBytes = CosmosTxV1Beta1Tx.TxBody.encode(body).finish()

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
  const web3Extension = InjectiveTypesV1Beta1TxExt.ExtensionOptionsWeb3Tx.create()
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
  txRaw: CosmosTxV1Beta1Tx.TxRaw,
): {
  authInfo: CosmosTxV1Beta1Tx.AuthInfo
  body: CosmosTxV1Beta1Tx.TxBody
  signatures: Uint8Array[]
} => {
  const authInfo = CosmosTxV1Beta1Tx.AuthInfo.decode(txRaw.authInfoBytes)
  const body = CosmosTxV1Beta1Tx.TxBody.decode(txRaw.bodyBytes)

  return {
    body,
    authInfo,
    signatures: txRaw.signatures,
  }
}

export const getAminoStdSignDoc = ({
  memo,
  chainId,
  accountNumber,
  timeoutHeight,
  sequence,
  gas,
  msgs,
}: {
  memo?: string
  chainId: ChainId
  timeoutHeight?: string
  accountNumber: number
  sequence: number
  gas?: string
  msgs: Msgs[]
}) => ({
  chain_id: chainId,
  timeout_height: timeoutHeight || '',
  account_number: accountNumber.toString(),
  sequence: sequence.toString(),
  fee: getStdFee({ gas }),
  msgs: msgs.map((m) => m.toAmino()),
  memo: memo || '',
})
