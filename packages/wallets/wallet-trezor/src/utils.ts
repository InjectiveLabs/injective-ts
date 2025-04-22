import { TrezorException } from '@injectivelabs/exceptions'
import {
  sanitizeTypedData,
  type TypedMessageV4,
  TypedDataUtilsHashStruct,
  SignTypedDataVersionV4,
  TypedDataUtilsSanitizeData,
} from '@injectivelabs/sdk-ts'

/**
 * Calculates the domain_separator_hash and message_hash from an EIP-712 Typed Data object.
 *
 * The Trezor Model 1 does not currently support constructing the hash on the device,
 * so this function pre-computes them.
 *
 * @template {TypedMessage} T
 * @param {T} data - The EIP-712 Typed Data object.
 * @param {boolean} metamask_v4_compat - Set to `true` for compatibility with Metamask's signTypedData_v4 function.
 * @returns {{domain_separator_hash: string, message_hash?: string} & T} The hashes.
 */
export const transformTypedData = <T extends TypedMessageV4>(
  data: T,
  metamask_v4_compat: boolean = true,
): { domain_separator_hash: string; message_hash?: string } & T => {
  if (!metamask_v4_compat) {
    throw new TrezorException(
      new Error('Trezor: Only version 4 of typed data signing is supported'),
    )
  }

  const version = SignTypedDataVersionV4

  const { types, primaryType, domain, message } =
    TypedDataUtilsSanitizeData(data)

  const domainSeparatorHash = TypedDataUtilsHashStruct(
    'EIP712Domain',
    sanitizeTypedData(domain),
    types,
    version,
  ).toString('hex')

  let messageHash = null

  if (primaryType !== 'EIP712Domain') {
    messageHash = TypedDataUtilsHashStruct(
      primaryType as string,
      sanitizeTypedData(message),
      types,
      version,
    ).toString('hex')
  }

  return {
    domain_separator_hash: domainSeparatorHash,
    message_hash: messageHash as string,
    ...data,
  }
}
