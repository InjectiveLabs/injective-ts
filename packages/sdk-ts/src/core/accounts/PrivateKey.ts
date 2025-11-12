import secp256k1 from 'secp256k1'
import { generateMnemonic } from 'bip39'
import { toBytes, keccak256, hashTypedData } from 'viem'
import { GeneralException } from '@injectivelabs/exceptions'
import { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import { Wallet, concat, getBytes, Signature, HDNodeWallet } from 'ethers'
import * as InjectiveTypesV1Beta1TxExtPb from '@injectivelabs/core-proto-ts-v2/generated/injective/types/v1beta1/tx_ext_pb.mjs'
import { Address } from './Address.js'
import { PublicKey } from './PublicKey.js'
import { getTransactionPartsFromTxRaw } from '../tx/utils/tx.js'
import { MsgDecoder, getEip712TypedData } from '../tx/eip712/index.js'
import {
  DEFAULT_DERIVATION_PATH,
  TypedDataUtilsSanitizeData,
  recoverTypedSignaturePubKey,
} from '../../utils/index.js'
import type { TypedDataDefinition } from 'viem'
import type * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb.mjs'

/**
 * Class for wrapping SigningKey that is used for signature creation and public key derivation.
 *
 * @category Crypto Utility Classes
 */
export class PrivateKey {
  private wallet: Wallet

  private constructor(wallet: Wallet) {
    this.wallet = wallet
  }

  /**
   * Generate new private key with random mnemonic phrase
   * @returns { privateKey: PrivateKey, mnemonic: string }
   */
  static generate(): { privateKey: PrivateKey; mnemonic: string } {
    const mnemonic = generateMnemonic()
    const privateKey = PrivateKey.fromMnemonic(mnemonic)

    return {
      privateKey,
      mnemonic,
    }
  }

  /**
   * Create a PrivateKey instance from a given mnemonic phrase and a HD derivation path.
   * If path is not given, default to Band's HD prefix 494 and all other indexes being zeroes.
   * @param {string} words the mnemonic phrase
   * @param {string|undefined} path the HD path that follows the BIP32 standard (optional)
   * @returns {PrivateKey} Initialized PrivateKey object
   */
  static fromMnemonic(
    words: string,
    path: string = DEFAULT_DERIVATION_PATH,
  ): PrivateKey {
    const hdNodeWallet = HDNodeWallet.fromPhrase(words, undefined, path)

    return new PrivateKey(new Wallet(hdNodeWallet.privateKey))
  }

  /**
   * Create a PrivateKey instance from a given private key and a HD derivation path.
   * If path is not given, default to Band's HD prefix 494 and all other indexes being zeroes.
   * @param {string} privateKey  the private key
   * @returns {PrivateKey} Initialized PrivateKey object
   *
   * @deprecated - use fromHex instead
   */
  static fromPrivateKey(privateKey: string): PrivateKey {
    return new PrivateKey(new Wallet(privateKey))
  }

  /**
   * Create a PrivateKey instance from a given private key and a HD derivation path.
   * If path is not given, default to Band's HD prefix 494 and all other indexes being zeroes.
   * @param {string} privateKey  the private key
   * @returns {PrivateKey} Initialized PrivateKey object
   */
  static fromHex(privateKey: string | Uint8Array): PrivateKey {
    const isString = typeof privateKey === 'string'
    const privateKeyHex =
      isString && privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey
    const privateKeyBuff = isString
      ? Buffer.from(privateKeyHex.toString(), 'hex')
      : privateKey

    return new PrivateKey(
      new Wallet(Buffer.from(privateKeyBuff).toString('hex')),
    )
  }

  /**
   * Return the private key in hex
   * @returns {string}
   **/
  toPrivateKeyHex(): string {
    return this.wallet.privateKey.startsWith('0x')
      ? this.wallet.privateKey
      : `0x${this.wallet.privateKey}`
  }

  /**
   * Return the PublicKey associated with this private key.
   * @returns {PublicKey} a Public key that can be used to verify the signatures made with this PrivateKey
   **/
  toPublicKey(): PublicKey {
    return PublicKey.fromPrivateKeyHex(this.wallet.privateKey)
  }

  /**
   * Return the hex address associated with this private key.
   * @returns {string}
   */
  toHex(): string {
    return this.wallet.address.startsWith('0x')
      ? this.wallet.address
      : `0x${this.wallet.address}`
  }

  /**
   * Return the Address associated with this private key.
   * @returns {Address}
   **/
  toAddress(): Address {
    return Address.fromHex(this.toHex())
  }

  /**
   * Return the Bech32 address associated with this private key.
   * @returns {string}
   **/
  toBech32(): string {
    return Address.fromHex(this.toHex()).toBech32()
  }

  /**
   * Sign the given message using the wallet's _signingKey function.
   * @param {string} messageBytes: the message that will be hashed and signed, a Buffer made of bytes
   * @returns {Uint8Array} a signature of this private key over the given message
   */
  sign(messageBytes: Buffer): Uint8Array {
    const { wallet } = this

    const msgHash = keccak256(messageBytes)
    const signature = wallet.signingKey.sign(msgHash)
    const splittedSignature = Signature.from(signature)

    return getBytes(concat([splittedSignature.r, splittedSignature.s]))
  }

  /**
   * Sign the given message using the edcsa sign_deterministic function.
   * @param {Buffer} messageBytes: the message that will be hashed and signed, a Buffer made of bytes
   * @returns {Uint8Array} a signature of this private key over the given message
   */
  signEcda(messageBytes: Buffer): Uint8Array {
    const { wallet } = this

    const msgHash = keccak256(messageBytes)
    const privateKeyHex = wallet.privateKey.startsWith('0x')
      ? wallet.privateKey.slice(2)
      : wallet.privateKey
    const privateKey = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'))
    const { signature } = secp256k1.ecdsaSign(toBytes(msgHash), privateKey)

    return signature
  }

  /**
   * Sign the given message using the wallet's _signingKey function.
   * @param {string} messageHashedBytes: the message that will be signed, a Buffer made of bytes
   * @returns {Uint8Array} a signature of this private key over the given message
   */
  signHashed(messageHashedBytes: Buffer): Uint8Array {
    const { wallet } = this

    const signature = wallet.signingKey.sign(messageHashedBytes)
    const splittedSignature = Signature.from(signature)

    return getBytes(concat([splittedSignature.r, splittedSignature.s]))
  }

  /**
   * Sign the given message using the edcsa sign_deterministic function.
   * @param {Buffer} messageHashedBytes: the message that will be signed, a Buffer made of bytes
   * @returns {Uint8Array} a signature of this private key over the given message
   */
  signHashedEcda(messageHashedBytes: Buffer): Uint8Array {
    const { wallet } = this

    const privateKeyHex = wallet.privateKey.startsWith('0x')
      ? wallet.privateKey.slice(2)
      : wallet.privateKey
    const privateKey = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'))
    const { signature } = secp256k1.ecdsaSign(messageHashedBytes, privateKey)

    return signature
  }

  /**
   * Sign the given typed data using the edcsa sign_deterministic function.
   * @param {TypedDataDefinition | any} eip712Data: the typed data that will be hashed and signed
   * @returns {Uint8Array} a signature of this private key over the given message
   */
  async signTypedData(
    eip712Data: TypedDataDefinition | any,
  ): Promise<Uint8Array> {
    const { wallet } = this

    const privateKeyHex = wallet.privateKey.startsWith('0x')
      ? wallet.privateKey.slice(2)
      : wallet.privateKey

    // Use viem's hashTypedData but with sanitized data to match @metamask/eth-sig-util behavior
    const sanitizedData = TypedDataUtilsSanitizeData(eip712Data)
    const msgHashBytes = hashTypedData(sanitizedData)

    const privateKey = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'))
    const { signature, recid } = secp256k1.ecdsaSign(
      toBytes(msgHashBytes),
      privateKey,
    )

    // Append recovery ID to match @metamask/eth-sig-util format
    const signatureWithRecovery = new Uint8Array(signature.length + 1)
    signatureWithRecovery.set(signature)
    signatureWithRecovery[signature.length] = recid + 27 // EIP155 recovery ID format

    return signatureWithRecovery
  }

  /**
   * Sign the given typed data using the edcsa sign_deterministic function.
   * @param {Buffer} eip712Data: the typed data that will be signed, a Buffer made of bytes
   * @returns {Uint8Array} a signature of this private key over the given message
   */
  signHashedTypedData(eip712Data: Buffer): Uint8Array {
    const { wallet } = this

    const privateKeyHex = wallet.privateKey.startsWith('0x')
      ? wallet.privateKey.slice(2)
      : wallet.privateKey
    const privateKey = Uint8Array.from(Buffer.from(privateKeyHex, 'hex'))
    const { signature } = secp256k1.ecdsaSign(eip712Data, privateKey)

    return signature
  }

  /**
   * Verify signature using EIP712 typed data
   * and the publicKey
   *
   * (params are passed as an object)
   *
   * @param {string} signature: the signature to verify in hex
   * @param {any} eip712: the EIP712 typed data to verify against
   * @param {string} publicKey: the public key to verify against in hex
   * */
  public static async verifySignature({
    signature,
    eip712,
    publicKey,
  }: {
    signature: string /* in hex */
    eip712: any
    publicKey: string /* in hex */
  }): Promise<boolean> {
    const publicKeyInHex = publicKey.startsWith('0x')
      ? publicKey
      : `0x${publicKey}`

    const recoveredPubKey = await recoverTypedSignaturePubKey(eip712, signature)
    const recoveredPubKeyInHex = recoveredPubKey.startsWith('0x')
      ? recoveredPubKey
      : `0x${recoveredPubKey}`

    /** uncompressed/compressed key */
    if (publicKeyInHex.length !== recoveredPubKeyInHex.length) {
      return (
        recoveredPubKeyInHex.substring(0, publicKeyInHex.length) ===
        publicKeyInHex
      )
    }

    return publicKeyInHex === recoveredPubKeyInHex
  }

  /**
   * Verify signature using EIP712 typed data
   * and the publicKey
   *
   * (params are passed as an object)
   *
   * @param {string} signature: the signature to verify in hex
   * @param {any} eip712: the EIP712 typed data to verify against
   * @param {string} publicKey: the public key to verify against in hex
   * */
  public async verifyThisPkSignature({
    signature,
    eip712,
  }: {
    signature: string /* in hex */
    eip712: any
  }): Promise<boolean> {
    const publicKeyInHex = `0x${this.toPublicKey().toHex()}`
    const recoveredPubKey = await recoverTypedSignaturePubKey(eip712, signature)
    const recoveredPubKeyInHex = recoveredPubKey.startsWith('0x')
      ? recoveredPubKey
      : `0x${recoveredPubKey}`

    /** uncompressed/compressed key */
    if (publicKeyInHex.length !== recoveredPubKeyInHex.length) {
      return (
        recoveredPubKeyInHex.substring(0, publicKeyInHex.length) ===
        publicKeyInHex
      )
    }

    return publicKeyInHex === recoveredPubKeyInHex
  }

  /**
   * Verify cosmos signature EIP712 typed
   * data from the TxRaw and verify the signature
   * that's included in the TxRaw
   *
   * (params are passed as an object)
   *
   * @param {CosmosTxV1Beta1TxPb.TxRaw} txRaw: the signature to verify in hex
   * @param {object} signer: the public key and the account number to verify against
   **/
  public static async verifyCosmosSignature({
    txRaw,
    signer,
  }: {
    txRaw: CosmosTxV1Beta1TxPb.TxRaw
    signer: {
      accountNumber: number | string
      publicKey: string /* in base64 */
    }
  }): Promise<boolean> {
    const { body, authInfo, signatures } = getTransactionPartsFromTxRaw(txRaw)

    if (authInfo.signerInfos.length > 1 || signatures.length > 1) {
      throw new GeneralException(
        new Error('Validation of multiple signers is not supported'),
      )
    }

    if (body.messages.length > 1) {
      throw new GeneralException(
        new Error('Validation of multiple messages is not supported'),
      )
    }

    const getChainIds = () => {
      if (!body.extensionOptions.length) {
        return {
          chainId: ChainId.Mainnet,
          EvmChainId: EvmChainId.Mainnet,
        }
      }

      const extension = body.extensionOptions.find((extension) =>
        extension.typeUrl.includes('ExtensionOptionsWeb3Tx'),
      )

      if (!extension) {
        return {
          chainId: ChainId.Mainnet,
          EvmChainId: EvmChainId.Mainnet,
        }
      }

      const decodedExtension =
        InjectiveTypesV1Beta1TxExtPb.ExtensionOptionsWeb3Tx.fromBinary(
          extension.value,
        )

      const evmChainId = Number(decodedExtension.typedDataChainID) as EvmChainId

      const testnetChainIds: EvmChainId[] = [
        EvmChainId.Kovan,
        EvmChainId.Goerli,
        EvmChainId.Sepolia,
      ]

      return {
        evmChainId: EvmChainId,
        chainId: testnetChainIds.includes(evmChainId)
          ? ChainId.Testnet
          : ChainId.Mainnet,
      }
    }

    const { evmChainId, chainId } = getChainIds()
    const [signerInfo] = authInfo.signerInfos
    const [signature] = signatures
    const [msg] = body.messages
    const decodedMsg = MsgDecoder.decode(msg)

    const eip712TypedData = getEip712TypedData({
      msgs: [decodedMsg],
      fee: authInfo.fee,
      tx: {
        memo: body.memo,
        accountNumber: signer.accountNumber.toString(),
        sequence: signerInfo.sequence.toString(),
        timeoutHeight: body.timeoutHeight.toString(),
        chainId,
      },
      evmChainId: evmChainId as unknown as EvmChainId,
    })

    return await this.verifySignature({
      eip712: eip712TypedData,
      signature: Buffer.from(signature).toString('hex'),
      publicKey: Buffer.from(signer.publicKey, 'base64').toString('hex'),
    })
  }

  /**
   * Verify signature using ADR-36 sign doc
   * and the publicKey
   *
   * (params are passed as an object)
   *
   * @param {string} signature: the signature to verify in hex
   * @param {any} signDoc: the signDoc to verify against
   * @param {string} publicKey:the public key to verify against in hex
   * */
  public static verifyArbitrarySignature({
    signature,
    signDoc,
    publicKey,
  }: {
    signature: string /* in hex */
    signDoc: Buffer
    publicKey: string /* in hex */
  }): boolean {
    const sigHex = signature.startsWith('0x') ? signature : `0x${signature}`
    const pubHex = publicKey.startsWith('0x') ? publicKey : `0x${publicKey}`
    return secp256k1.ecdsaVerify(
      toBytes(sigHex as `0x${string}`),
      toBytes(keccak256(signDoc)),
      toBytes(pubHex as `0x${string}`),
    )
  }
}
