import { getStdFee } from '@injectivelabs/utils'
import * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb.mjs'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import * as CosmosCryptoSecp256k1KeysPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/crypto/secp256k1/keys_pb.mjs'
import * as InjectiveTypesV1Beta1TxExtPb from '@injectivelabs/core-proto-ts-v2/generated/injective/types/v1beta1/tx_ext_pb.mjs'
import { createAny, createAnyMessage } from './helpers.js'
import { base64ToUint8Array } from '../../../utils/encoding.js'
import type { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import type * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'
import type * as CosmosTxSigningV1Beta1SigningPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/signing/v1beta1/signing_pb.mjs'
import type { Msgs } from '../../modules/msgs.js'

export const getPublicKey = ({
  chainId,
  key,
}: {
  chainId: string
  key: string | GoogleProtobufAnyPb.Any
}) => {
  if (typeof key !== 'string') {
    return key
  }

  let proto
  let path
  let baseProto

  if (chainId.startsWith('injective')) {
    proto = CosmosCryptoSecp256k1KeysPb.PubKey.create()
    baseProto = CosmosCryptoSecp256k1KeysPb.PubKey
    path = '/injective.crypto.v1beta1.ethsecp256k1.PubKey'
  } else if (chainId.startsWith('evmos')) {
    proto = CosmosCryptoSecp256k1KeysPb.PubKey.create()
    baseProto = CosmosCryptoSecp256k1KeysPb.PubKey
    path = '/ethermint.crypto.v1.ethsecp256k1.PubKey'
  } else {
    proto = CosmosCryptoSecp256k1KeysPb.PubKey.create()
    baseProto = CosmosCryptoSecp256k1KeysPb.PubKey
    path = '/cosmos.crypto.secp256k1.PubKey'
  }

  proto.key = base64ToUint8Array(key)

  return createAny(baseProto.toBinary(proto), path)
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

  const txBody = CosmosTxV1Beta1TxPb.TxBody.create()

  txBody.messages = messages.map((message) =>
    createAnyMessage({
      value: message.toBinary(),
      type: message.toDirectSign().type,
    }),
  )

  txBody.memo = memo

  if (timeoutHeight) {
    txBody.timeoutHeight = BigInt(timeoutHeight)
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
  const feeAmount = CosmosBaseV1Beta1CoinPb.Coin.create()
  feeAmount.amount = fee.amount
  feeAmount.denom = fee.denom

  const feeProto = CosmosTxV1Beta1TxPb.Fee.create()
  feeProto.gasLimit = BigInt(gasLimit)
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
  signers: { pubKey: string | GoogleProtobufAnyPb.Any; sequence: number }[]
  mode: CosmosTxSigningV1Beta1SigningPb.SignMode
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
  publicKey: string | GoogleProtobufAnyPb.Any
  sequence: number
  mode: CosmosTxSigningV1Beta1SigningPb.SignMode
}) => {
  const pubKey = getPublicKey({ chainId, key: publicKey })

  const single = CosmosTxV1Beta1TxPb.ModeInfo_Single.create()
  single.mode = mode

  const modeInfo = CosmosTxV1Beta1TxPb.ModeInfo.create()
  modeInfo.sum = {
    oneofKind: 'single',
    single: single,
  }

  const signerInfo = CosmosTxV1Beta1TxPb.SignerInfo.create()
  signerInfo.publicKey = pubKey
  signerInfo.sequence = BigInt(sequence)
  signerInfo.modeInfo = modeInfo

  return signerInfo
}

export const createAuthInfo = ({
  signerInfo,
  fee,
}: {
  signerInfo: CosmosTxV1Beta1TxPb.SignerInfo[]
  fee: CosmosTxV1Beta1TxPb.Fee
}) => {
  const authInfo = CosmosTxV1Beta1TxPb.AuthInfo.create()
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
  const signDoc = CosmosTxV1Beta1TxPb.SignDoc.create()

  signDoc.accountNumber = BigInt(accountNumber)
  signDoc.chainId = chainId
  signDoc.bodyBytes = bodyBytes
  signDoc.authInfoBytes = authInfoBytes

  return signDoc
}

export const createSignDocFromTransaction = (args: {
  txRaw: CosmosTxV1Beta1TxPb.TxRaw
  chainId: string
  accountNumber: number
}) => {
  return CosmosTxV1Beta1TxPb.SignDoc.create({
    bodyBytes: args.txRaw.bodyBytes,
    authInfoBytes: args.txRaw.authInfoBytes,
    accountNumber: BigInt(args.accountNumber),
    chainId: args.chainId,
  })
}

export const createTxRawEIP712 = (
  txRaw: CosmosTxV1Beta1TxPb.TxRaw,
  extension: InjectiveTypesV1Beta1TxExtPb.ExtensionOptionsWeb3Tx,
  nonCriticalExtension?: GoogleProtobufAnyPb.Any | GoogleProtobufAnyPb.Any[],
) => {
  const body = CosmosTxV1Beta1TxPb.TxBody.fromBinary(txRaw.bodyBytes)
  const extensionAny = createAny(
    InjectiveTypesV1Beta1TxExtPb.ExtensionOptionsWeb3Tx.toBinary(extension),
    '/injective.types.v1beta1.ExtensionOptionsWeb3Tx',
  )

  body.extensionOptions = [extensionAny]

  if (nonCriticalExtension) {
    body.nonCriticalExtensionOptions = Array.isArray(nonCriticalExtension)
      ? nonCriticalExtension
      : [nonCriticalExtension]
  }

  txRaw.bodyBytes = CosmosTxV1Beta1TxPb.TxBody.toBinary(body)

  return txRaw
}

export const createWeb3Extension = ({
  evmChainId,
  feePayer,
  feePayerSig,
}: {
  evmChainId: EvmChainId
  feePayer?: string
  feePayerSig?: Uint8Array
}) => {
  const web3Extension =
    InjectiveTypesV1Beta1TxExtPb.ExtensionOptionsWeb3Tx.create()
  web3Extension.typedDataChainID = BigInt(evmChainId)

  if (feePayer) {
    web3Extension.feePayer = feePayer
  }

  if (feePayerSig) {
    web3Extension.feePayerSig = feePayerSig
  }

  return web3Extension
}

export const createNonCriticalExtensionFromObject = (
  object: Record<string, unknown>,
) => {
  const jsonBytes = new TextEncoder().encode(JSON.stringify(object))

  return createAny(jsonBytes, '/google.protobuf.Struct')
}

export const getTransactionPartsFromTxRaw = (
  txRaw: CosmosTxV1Beta1TxPb.TxRaw,
): {
  authInfo: CosmosTxV1Beta1TxPb.AuthInfo
  body: CosmosTxV1Beta1TxPb.TxBody
  signatures: Uint8Array[]
} => {
  const authInfo = CosmosTxV1Beta1TxPb.AuthInfo.fromBinary(txRaw.authInfoBytes)
  const body = CosmosTxV1Beta1TxPb.TxBody.fromBinary(txRaw.bodyBytes)

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
