import bip39 from 'bip39'
import { Wallet } from 'ethers'
import secp256k1 from 'secp256k1'
import keccak256 from 'keccak256'
import { DEFAULT_DERIVATION_PATH } from '../utils/constants'
import { PublicKey } from './PublicKey'

/**
 * Class for wrapping SigningKey that is used for signature creation and public key derivation.
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
    const mnemonic = bip39.generateMnemonic()
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
    path = DEFAULT_DERIVATION_PATH,
  ): PrivateKey {
    return new PrivateKey(Wallet.fromMnemonic(words, path))
  }

  /**
   * Create a PrivateKey instance from a given private key and a HD derivation path.
   * If path is not given, default to Band's HD prefix 494 and all other indexes being zeroes.
   * @param {string} privateKey  the private key
   * @param {string|undefined} path the HD path that follows the BIP32 standard  (optional)
   * @returns {PrivateKey} Initialized PrivateKey object
   */
  static fromPrivateKey(
    privateKey: string,
    path = DEFAULT_DERIVATION_PATH,
  ): PrivateKey {
    return new PrivateKey(Wallet.fromMnemonic(privateKey, path))
  }

  /**
   * Return a hex representation of signing key.
   * @returns {string}
   */
  toHex(): string {
    return `0x${this.wallet.address}`
  }

  /**
   * Return the PublicKey associated with this private key.
   * @returns {PublicKey} a Private that can be used to verify the signatures made with this PrivateKey
   **/
  toPublicKey(): PublicKey {
    return PublicKey.fromHex(this.wallet.publicKey)
  }

  /**
   * Sign the given message using the edcsa sign_deterministic function.
   * @param {any} message: the message that will be hashed and signed
   * @returns {string} a signature of this private key over the given message
   */
  async sign(message: any): Promise<Uint8Array> {
    const { wallet } = this

    const msgHash = keccak256(Buffer.from(message))
    const privateKeyToHex = Buffer.from(wallet.privateKey, 'hex')
    const { signature } = secp256k1.ecdsaSign(msgHash, privateKeyToHex)

    return signature
  }
}
