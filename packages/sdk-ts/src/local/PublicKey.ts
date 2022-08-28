import { BECH32_PUBKEY_ACC_PREFIX } from '../utils'
import { bech32 } from 'bech32'
import { PubKey } from '@injectivelabs/chain-api/injective/crypto/v1beta1/ethsecp256k1/keys_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import { toBuffer } from 'ethereumjs-util'
import secp256k1 from 'secp256k1'
import { Address } from '../classes'
import EthCrypto from 'eth-crypto'
import { keccak256 } from 'js-sha3'

/**
 * @category Crypto Utility Classes
 */
export class PublicKey {
  private type: string

  private key: Uint8Array

  private constructor(key: Uint8Array, type?: string) {
    this.key = key
    this.type = type || '/injective.crypto.v1beta1.ethsecp256k1.PubKey'
  }

  static fromBase64(publicKey: string): PublicKey {
    return new PublicKey(Buffer.from(publicKey, 'base64'))
  }

  static fromHex(privateKey: string | Uint8Array): PublicKey {
    const isString = typeof privateKey === 'string'
    const privateKeyHex =
      isString && privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey
    const privateKeyBuff = Buffer.from(privateKeyHex.toString(), 'hex')
    const publicKeyByte = secp256k1.publicKeyCreate(privateKeyBuff, true)
    const type = '/injective.crypto.v1beta1.ethsecp256k1.PubKey'

    return new PublicKey(publicKeyByte, type)
  }

  public toPubKeyBytes(): Uint8Array {
    return this.key
  }

  public toBase64(): string {
    return Buffer.from(this.toPubKeyBytes()).toString('base64')
  }

  public toHex(): string {
    return Buffer.from(this.toPubKeyBytes()).toString('hex')
  }

  public toBech32(): string {
    return bech32.encode(BECH32_PUBKEY_ACC_PREFIX, this.key)
  }

  public toAddress(): Address {
    const publicKeyHex = this.toHex()
    const decompressedPublicKey = EthCrypto.publicKey.decompress(publicKeyHex)
    const addressBuffer = Buffer.from(
      keccak256(toBuffer(EthCrypto.util.addLeading0x(decompressedPublicKey))),
      'hex',
    ).subarray(-20)

    return Address.fromHex(addressBuffer.toString('hex').toLowerCase())
  }

  public toProto() {
    const proto = new PubKey()
    proto.setKey(this.key)

    return proto
  }

  public toAny() {
    const proto = this.toProto()

    const message = new Any()
    message.setTypeUrl(this.type)
    message.setValue(Buffer.from(proto.serializeBinary()).toString('base64'))

    return message
  }
}
