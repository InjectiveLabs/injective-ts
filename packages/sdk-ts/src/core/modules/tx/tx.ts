import keccak256 from 'keccak256'
import { DEFAULT_STD_FEE } from '@injectivelabs/utils'
import {
  createAuthInfo,
  createBody,
  createFee,
  createSignDoc,
  createSigners,
  SIGN_DIRECT,
} from './utils'
import {
  CreateTransactionArgs,
  CreateTransactionResult,
  CreateTransactionWithSignersArgs,
} from './types'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { BigNumberInBase } from '@injectivelabs/utils'
import { Msgs } from '../msgs'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  getStdFeeFromString,
  DEFAULT_BLOCK_TIMEOUT_HEIGHT,
} from '@injectivelabs/utils'
import { ChainRestAuthApi, ChainRestTendermintApi } from '../../../client'
import { CosmosTxV1Beta1Tx } from '@injectivelabs/core-proto-ts'
import { BaseAccount } from '../../accounts'

/**
 * @typedef {Object} CreateTransactionWithSignersArgs
 * @param {CreateTransactionWithSignersArgs} params
 * @property {Msg | Msg[]} message - the Cosmos messages to wrap them in a transaction
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
  signers,
  chainId,
  message,
  timeoutHeight,
  memo = '',
  fee = DEFAULT_STD_FEE,
  signMode = SIGN_DIRECT,
}: CreateTransactionWithSignersArgs): CreateTransactionResult => {
  const actualSigners = Array.isArray(signers) ? signers : [signers]
  const [signer] = actualSigners

  const body = createBody({ message, memo, timeoutHeight })
  const actualFee = typeof fee === 'string' ? getStdFeeFromString(fee) : fee
  const feeMessage = createFee({
    fee: actualFee.amount[0],
    payer: actualFee.payer,
    granter: actualFee.granter,
    gasLimit: parseInt(actualFee.gas, 10),
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

  const bodyBytes = CosmosTxV1Beta1Tx.TxBody.encode(body).finish()
  const authInfoBytes = CosmosTxV1Beta1Tx.AuthInfo.encode(authInfo).finish()

  const signDoc = createSignDoc({
    chainId,
    bodyBytes: bodyBytes,
    authInfoBytes: authInfoBytes,
    accountNumber: signer.accountNumber,
  })

  const signDocBytes = CosmosTxV1Beta1Tx.SignDoc.encode(signDoc).finish()

  const toSignBytes = Buffer.from(signDocBytes)
  const toSignHash = keccak256(Buffer.from(signDocBytes))

  const txRaw = CosmosTxV1Beta1Tx.TxRaw.create()
  txRaw.authInfoBytes = authInfoBytes
  txRaw.bodyBytes = bodyBytes

  return {
    txRaw,
    signDoc,
    signers,
    signer,
    signBytes: toSignBytes,
    signHashedBytes: toSignHash,
    bodyBytes: bodyBytes,
    authInfoBytes: authInfoBytes,
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

/**
 * Used when we want to pass a Msg class instead of the {type, message}
 * object of the Message (using the toDirectSign() method)
 * @returns
 */
export const createTransactionFromMsg = (
  params: Omit<CreateTransactionArgs, 'message'> & { message: Msgs | Msgs[] },
) => {
  const messages = Array.isArray(params.message)
    ? params.message
    : [params.message]

  return createTransaction({
    ...params,
    message: messages,
  })
}

/**
 * Used when we get a DirectSignResponse from
 * Cosmos native wallets like Keplr, Leap, etc after
 * the TxRaw has been signed.
 *
 * The reason why we need to create a new TxRaw and
 * not use the one that we passed to signing is that the users
 * can change the gas fees and that will alter the original
 * TxRaw which will cause signature miss match if we broadcast
 * that transaction on chain
 * @returns TxRaw
 */
export const createTxRawFromSigResponse = (
  response: CosmosTxV1Beta1Tx.TxRaw | DirectSignResponse,
) => {
  if ((response as DirectSignResponse).signed === undefined) {
    return response as CosmosTxV1Beta1Tx.TxRaw
  }

  const directSignResponse = response as DirectSignResponse

  const txRaw = CosmosTxV1Beta1Tx.TxRaw.create()
  txRaw.authInfoBytes = directSignResponse.signed.authInfoBytes
  txRaw.bodyBytes = directSignResponse.signed.bodyBytes
  txRaw.signatures = [
    Buffer.from(directSignResponse.signature.signature, 'base64'),
  ]

  return txRaw
}

/**
 * Used when we don't have account details and block details
 * and we pass the message and the user's address only
 * @returns
 */
export const createTransactionForAddressAndMsg = async (
  params: Omit<
    CreateTransactionArgs,
    'message' | 'sequence' | 'pubKey' | 'accountNumber'
  > & {
    message: Msgs | Msgs[]
    address: string
    pubKey?: string
    endpoint: string
  },
) => {
  const messages = Array.isArray(params.message)
    ? params.message
    : [params.message]

  // Clients
  const chainRestAuthApi = new ChainRestAuthApi(params.endpoint)
  const tendermintRestApi = new ChainRestTendermintApi(params.endpoint)

  /** Account Details * */
  const accountDetails = await chainRestAuthApi.fetchCosmosAccount(
    params.address,
  )
  const baseAccount = BaseAccount.fromRestCosmosApi(accountDetails)

  /** Block Details */
  const latestBlock = await tendermintRestApi.fetchLatestBlock()
  const latestHeight = latestBlock.header.height
  const timeoutHeight = new BigNumberInBase(latestHeight).plus(
    DEFAULT_BLOCK_TIMEOUT_HEIGHT,
  )

  const pubKey = params.pubKey || baseAccount.pubKey.key

  if (!pubKey) {
    throw new GeneralException(
      new Error(`The pubKey for ${params.address} is missing.`),
    )
  }

  return createTransaction({
    ...params,
    pubKey:
      params.pubKey || Buffer.from(baseAccount.pubKey.key).toString('base64'),
    sequence: Number(baseAccount.sequence),
    accountNumber: Number(baseAccount.accountNumber),
    timeoutHeight: timeoutHeight.toNumber(),
    message: messages,
  })
}

export const createTransactionAndCosmosSignDoc = (
  args: CreateTransactionArgs,
) => {
  const result = createTransaction(args)
  const [signer] = Array.isArray(result.signers)
    ? result.signers
    : [result.signers]

  return {
    ...result,
    cosmosSignDoc: CosmosTxV1Beta1Tx.SignDoc.fromPartial({
      bodyBytes: result.bodyBytes,
      authInfoBytes: result.authInfoBytes,
      accountNumber: signer.accountNumber.toString(),
      chainId: args.chainId,
    }),
  }
}

export const createTransactionAndCosmosSignDocForAddressAndMsg = async (
  params: Omit<
    CreateTransactionArgs,
    'message' | 'sequence' | 'pubKey' | 'accountNumber'
  > & {
    message: Msgs | Msgs[]
    address: string
    pubKey?: string
    endpoint: string
  },
) => {
  const result = await createTransactionForAddressAndMsg(params)
  const [signer] = Array.isArray(result.signers)
    ? result.signers
    : [result.signers]

  return {
    ...result,
    cosmosSignDoc: CosmosTxV1Beta1Tx.SignDoc.fromPartial({
      bodyBytes: result.bodyBytes,
      authInfoBytes: result.authInfoBytes,
      accountNumber: signer.accountNumber.toString(),
      chainId: params.chainId,
    }),
  }
}

export const getTxRawFromTxRawOrDirectSignResponse = (
  txRawOrDirectSignResponse: CosmosTxV1Beta1Tx.TxRaw | DirectSignResponse,
): CosmosTxV1Beta1Tx.TxRaw => {
  return (txRawOrDirectSignResponse as DirectSignResponse).signed === undefined
    ? (txRawOrDirectSignResponse as CosmosTxV1Beta1Tx.TxRaw)
    : createTxRawFromSigResponse(
        txRawOrDirectSignResponse as DirectSignResponse,
      )
}
