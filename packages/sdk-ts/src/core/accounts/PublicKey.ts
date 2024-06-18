import { BECH32_PUBKEY_ACC_PREFIX, decompressPubKey } from '../../utils'
import { bech32 } from 'bech32'
import { toBuffer } from 'ethereumjs-util'
import secp256k1 from 'secp256k1'
import { Address } from './Address'
import { keccak256 } from 'js-sha3'
import {
  GoogleProtobufAny,
  InjectiveCryptoV1Beta1Ethsecp256k1Keys,
} from '@injectivelabs/core-proto-ts'

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

  static fromBytes(publicKey: Uint8Array): PublicKey {
    return new PublicKey(publicKey)
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
    return bech32.encode(
      BECH32_PUBKEY_ACC_PREFIX,
      bech32.toWords(Buffer.from(this.toHex(), 'hex')),
    )
  }

  public toAddress(): Address {
    const publicKeyHex = this.toHex()
    const decompressedPublicKey = decompressPubKey(publicKeyHex)
    const addressBuffer = Buffer.from(
      keccak256(
        toBuffer(
          decompressedPublicKey.startsWith('0x')
            ? decompressedPublicKey
            : '0x' + decompressedPublicKey,
        ),
      ),
      'hex',
    ).subarray(-20)

    return Address.fromHex(
      Buffer.from(addressBuffer).toString('hex').toLowerCase(),
    )
  }

  public toProto() {
    const proto = InjectiveCryptoV1Beta1Ethsecp256k1Keys.PubKey.create()
    proto.key = this.key

    return proto
  }

  public toAny() {
    const proto = this.toProto()

    const message = GoogleProtobufAny.Any.create()
    message.typeUrl = this.type
    message.value = Buffer.from(
      InjectiveCryptoV1Beta1Ethsecp256k1Keys.PubKey.encode(proto).finish(),
    )

    return message
  }
}
