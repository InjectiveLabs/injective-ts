import { StdFee } from '@cosmjs/amino'
import keccak256 from 'keccak256'
import {
  TxBody,
  SignDoc,
  SignerInfo,
  AuthInfo,
  ModeInfo,
  Fee,
  TxRaw,
} from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import {
  SignMode,
  SignModeMap,
} from '@injectivelabs/chain-api/cosmos/tx/signing/v1beta1/signing_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { PubKey as CosmosPubKey } from '@injectivelabs/chain-api/cosmos/crypto/secp256k1/keys_pb'
import { PubKey } from '@injectivelabs/chain-api/injective/crypto/v1beta1/ethsecp256k1/keys_pb'
import { DEFAULT_STD_FEE } from '@injectivelabs/utils'
import { createAny, createAnyMessage } from './utils'

export type MsgArg = {
  type: string
  message: any
}

export interface SignerDetails {
  pubKey: string // the pubKey of the signer of the transaction in base64
  sequence: number // the sequence (nonce) of the signer of the transaction
  accountNumber: number // the account number of the signer of the transaction
}

/** @type {CreateTransactionWithSignersArgs} */
export interface CreateTransactionWithSignersArgs {
  fee?: StdFee // the fee to include in the transaction
  memo: string // the memo to include in the transaction
  chainId: string // the chain id of the chain that the transaction is going to be broadcasted to
  message: MsgArg | MsgArg[] // the message that should be packed into the transaction
  signers: SignerDetails | SignerDetails[] // the signers of the transaction
  signMode?: SignModeMap[keyof SignModeMap]
  timeoutHeight?: number // the height at which the transaction should be considered invalid
}

/** @type {CreateTransactionArgs} */
export interface CreateTransactionArgs {
  fee?: StdFee // the fee to include in the transaction
  memo: string // the memo to include in the transaction
  chainId: string // the chain id of the chain that the transaction is going to be broadcasted to
  message: MsgArg | MsgArg[] // the message that should be packed into the transaction
  pubKey: string // the pubKey of the signer of the transaction in base64
  sequence: number // the sequence (nonce) of the signer of the transaction
  accountNumber: number // the account number of the signer of the transaction
  signMode?: SignModeMap[keyof SignModeMap]
  timeoutHeight?: number // the height at which the transaction should be considered invalid
}

/** @type {CreateTransactionResult} */
export interface CreateTransactionResult {
  txRaw: TxRaw // the Tx raw that was created
  signDoc: SignDoc // the SignDoc that was created - used for signing of the transaction
  bodyBytes: Uint8Array // the body bytes of the transaction
  signers: SignerDetails | SignerDetails[] // the signers of the transaction
  signer: SignerDetails // the signer of the transaction
  authInfoBytes: Uint8Array // the auth info bytes of the transaction
  signBytes: Uint8Array // the sign bytes of the transaction (SignDoc serialized to binary)
  signHashedBytes: Uint8Array // the sign bytes of the transaction (SignDoc serialized to binary) and hashed using keccak256
}

export const SIGN_DIRECT = SignMode.SIGN_MODE_DIRECT
export const SIGN_AMINO = SignMode.SIGN_MODE_LEGACY_AMINO_JSON

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
  timeoutHeight,
}: {
  message: MsgArg | MsgArg[]
  memo: string
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
  signers: { pubKey: string; sequence: number }[]
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
  publicKey: string
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

/**
 * @typedef {Object} CreateTransactionWithSignersArgs
 * @param {CreateTransactionWithSignersArgs} params
 * @property {MsgArg | MsgArg[]} message - the Cosmos messages to wrap them in a transaction
 * @property {string} memo - the memo to attach to the transaction
 * @property {StdFee} fee - the fee to attach to the transaction
 * @property {SignerDetails} signers - the signers of the transaction
 * @property {number} number - the account number to attach to the transaction
 * @property {number} chainId - the chain-id to attach to the transaction
 * @property {string} pubKey - the account pubKey to attach to the transaction (in base64)
 *
 * @typedef {Object} CreateTransactionResult
 * @property {TxRaw} txRaw  - the Tx raw that was created
 * @property {SignDoc} signDoc  - the SignDoc that was created - used for signing of the transaction
 * @property {SignerDetails} signers  - the signers of the transaction
 * @property {Uint8Array} bodyBytes  - the body bytes of the transaction
 * @property {Uint8Array} authInfoBytes  - the auth info bytes of the transaction
 * @property {Uint8Array} signBytes  - the sign bytes of the transaction (SignDoc serialized to binary)
 * @property {Uint8Array} signHashedBytes  - the sign bytes of the transaction (SignDoc serialized to binary) and hashed using keccak256
 * @returns {CreateTransactionResult} result
 */
export const createTransactionWithSigners = ({
  memo,
  signers,
  chainId,
  message,
  fee = DEFAULT_STD_FEE,
  signMode = SIGN_DIRECT,
  timeoutHeight,
}: CreateTransactionWithSignersArgs): CreateTransactionResult => {
  const actualSigners = Array.isArray(signers) ? signers : [signers]
  const [signer] = actualSigners

  const body = createBody({ message, memo, timeoutHeight })
  const feeMessage = createFee({
    fee: fee.amount[0],
    payer: fee.payer,
    gasLimit: parseInt(fee.gas, 10),
  })

  const signInfo = createSigners({
    chainId,
    mode: signMode,
    signers: actualSigners,
  })

  const authInfo = createAuthInfo({
    signerInfo: signInfo,
    fee: feeMessage,
  })

  const signDoc = createSigDoc({
    chainId,
    bodyBytes: body.serializeBinary(),
    authInfoBytes: authInfo.serializeBinary(),
    accountNumber: signer.accountNumber,
  })

  const toSignBytes = Buffer.from(signDoc.serializeBinary())
  const toSignHash = keccak256(Buffer.from(signDoc.serializeBinary()))

  const txRaw = new TxRaw()
  txRaw.setAuthInfoBytes(authInfo.serializeBinary())
  txRaw.setBodyBytes(body.serializeBinary())

  return {
    txRaw,
    signDoc,
    signers,
    signer,
    signBytes: toSignBytes,
    signHashedBytes: toSignHash,
    bodyBytes: body.serializeBinary(),
    authInfoBytes: authInfo.serializeBinary(),
  }
}

/**
 * @typedef {Object} CreateTransactionArgs
 * @param {CreateTransactionArgs} params
 * @property {MsgArg | MsgArg[]} message - the Cosmos messages to wrap them in a transaction
 * @property {string} memo - the memo to attach to the transaction
 * @property {StdFee} fee - the fee to attach to the transaction
 * @property {string} sequence - the account sequence to attach to the transaction
 * @property {number} number - the account number to attach to the transaction
 * @property {number} chainId - the chain-id to attach to the transaction
 * @property {string} pubKey - the account pubKey to attach to the transaction (in base64)
 *
 * @typedef {Object} CreateTransactionResult
 * @property {TxRaw} txRaw  // the Tx raw that was created
 * @property {SignDoc} signDoc  // the SignDoc that was created - used for signing of the transaction
 * @property {number} accountNumber  // the account number of the signer of the transaction
 * @property {Uint8Array} bodyBytes  // the body bytes of the transaction
 * @property {Uint8Array} authInfoBytes  // the auth info bytes of the transaction
 * @property {Uint8Array} signBytes  // the sign bytes of the transaction (SignDoc serialized to binary)
 * @property {Uint8Array} signHashedBytes  // the sign bytes of the transaction (SignDoc serialized to binary) and hashed using keccak256
 * @returns {CreateTransactionResult} result
 */
export const createTransaction = (
  args: CreateTransactionArgs,
): CreateTransactionResult => {
  return createTransactionWithSigners({
    ...args,
    signers: {
      pubKey: args.pubKey,
      accountNumber: args.accountNumber,
      sequence: args.sequence,
    },
  })
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
