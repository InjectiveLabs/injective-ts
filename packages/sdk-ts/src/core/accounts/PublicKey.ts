import { bech32 } from '@scure/base'
import { secp256k1 } from '@noble/curves/secp256k1'
import { keccak256, toBytes as toBuffer } from 'viem'
import * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb'
import * as InjectiveCryptoV1Beta1Ethsecp256k1KeysPb from '@injectivelabs/core-proto-ts-v2/generated/injective/crypto/v1beta1/ethsecp256k1/keys_pb'
import { Address } from './Address.js'
import {
  decompressPubKey,
  BECH32_PUBKEY_ACC_PREFIX,
} from '../../utils/index.js'
import {
  hexToUint8Array,
  uint8ArrayToHex,
  base64ToUint8Array,
  uint8ArrayToBase64,
} from '../../utils/encoding.js'

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
    return new PublicKey(base64ToUint8Array(publicKey))
  }

  static fromBytes(publicKey: Uint8Array): PublicKey {
    return new PublicKey(publicKey)
  }

  static fromHex(pubKey: string): PublicKey {
    const pubKeyHex = pubKey.startsWith('0x') ? pubKey.slice(2) : pubKey

    return new PublicKey(hexToUint8Array(pubKeyHex.toString()))
  }

  static fromPrivateKeyHex(privateKey: string | Uint8Array): PublicKey {
    const isString = typeof privateKey === 'string'
    const privateKeyHex =
      isString && privateKey.startsWith('0x') ? privateKey.slice(2) : privateKey
    const privateKeyBuff = isString
      ? hexToUint8Array(privateKeyHex.toString())
      : privateKey
    // @noble/curves: getPublicKey derives public key from private key
    // Second parameter true = compressed format (33 bytes)
    const publicKeyByte = secp256k1.getPublicKey(privateKeyBuff, true)
    const type = '/injective.crypto.v1beta1.ethsecp256k1.PubKey'

    return new PublicKey(publicKeyByte, type)
  }

  public toPubKeyBytes(): Uint8Array {
    return this.key
  }

  public toBase64(): string {
    return uint8ArrayToBase64(this.toPubKeyBytes())
  }

  public toHex(): string {
    return uint8ArrayToHex(this.toPubKeyBytes())
  }

  /**
   * Convert the public key to a pubkey in bech32 format.
   * Note: this does not convert the public key to an address.
   */
  public toBech32(): string {
    return bech32.encode(
      BECH32_PUBKEY_ACC_PREFIX,
      bech32.toWords(hexToUint8Array(this.toHex())),
    )
  }

  public toAddress(): Address {
    const publicKeyHex = this.toHex()
    const decompressedPublicKey = decompressPubKey(publicKeyHex)
    const addressBuffer = keccak256(
      toBuffer(
        decompressedPublicKey.startsWith('0x')
          ? decompressedPublicKey
          : '0x' + decompressedPublicKey,
      ),
      'bytes',
    ).subarray(-20)

    return Address.fromHex(uint8ArrayToHex(addressBuffer).toLowerCase())
  }

  public toProto() {
    const proto = InjectiveCryptoV1Beta1Ethsecp256k1KeysPb.PubKey.create()
    proto.key = this.key

    return proto
  }

  public toAny() {
    const proto = this.toProto()

    const message = GoogleProtobufAnyPb.Any.create()
    message.typeUrl = this.type
    message.value =
      InjectiveCryptoV1Beta1Ethsecp256k1KeysPb.PubKey.toBinary(proto)

    return message
  }
}
