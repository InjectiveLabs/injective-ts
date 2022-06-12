import { AccountAddress, TransactionOptions } from '@injectivelabs/ts-types'
import { NonPayableTx } from '@injectivelabs/web3-contract-typings/types/types'
import { fromRpcSig, ecrecover, toBuffer, Address } from 'ethereumjs-util'
import { publicKeyConvert } from 'secp256k1'
import { TypedDataUtils } from 'eth-sig-util'
import { bech32 } from 'bech32'

export const getTransactionOptionsAsNonPayableTx = (
  transactionOptions: TransactionOptions,
): Partial<NonPayableTx> => ({
  from: transactionOptions.from,
  to: transactionOptions.to,
  gas: transactionOptions.gas?.toString(),
  gasPrice: transactionOptions.gasPrice
    ? transactionOptions.gasPrice.toString()
    : 0,
})

export const createSignatureHexString = (signature: string) => {
  const ecSignature = fromRpcSig(signature)
  const signatureBuffer = Buffer.concat([
    toBuffer(ecSignature.v),
    ecSignature.r,
    ecSignature.s,
    toBuffer(0x02), // SignatureType.EIP712
  ])

  return `0x${signatureBuffer.toString('hex')}`
}

export const recoverTypedSignaturePubKey = (
  data: any,
  signature: string,
): string => {
  const compressedPubKeyPrefix = Buffer.from('04', 'hex')
  const message = TypedDataUtils.sign(data)
  const sigParams = fromRpcSig(signature)
  const publicKey = ecrecover(message, sigParams.v, sigParams.r, sigParams.s)
  const prefixedKey = Buffer.concat([compressedPubKeyPrefix, publicKey])
  const compressedKey = Buffer.from(publicKeyConvert(prefixedKey))

  return `0x${compressedKey.toString('hex')}`
}

export const getCosmosAddressFromAddress = (address: AccountAddress) => {
  const addressBuffer = Address.fromString(address.toString()).toBuffer()

  return bech32.encode('inj', bech32.toWords(addressBuffer))
}
