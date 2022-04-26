import { BECH32_ADDR_ACC_PREFIX, BECH32_PUBKEY_ACC_PREFIX } from '../utils'
import { bech32 } from 'bech32'
// import { sha256, ripemd160 } from '../util/hash'
import { PubKey } from '@injectivelabs/chain-api/injective/crypto/v1beta1/ethsecp256k1/keys_pb'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import secp256k1 from 'secp256k1'

export class PublicKey {
  private type: string

  private key: string

  private constructor(key: string, type: string) {
    this.key = key
    this.type = type
  }

  static fromHex(privateKey: string | Uint8Array): PublicKey {
    const privateKeyHex = Buffer.from(privateKey.toString(), 'hex')
    const publicKeyByte = secp256k1.publicKeyCreate(privateKeyHex)

    const buf1 = Buffer.from([10])
    const buf2 = Buffer.from([publicKeyByte.length])
    const buf3 = Buffer.from(publicKeyByte)

    const key = Buffer.concat([buf1, buf2, buf3]).toString('base64')
    const type = '/injective.crypto.v1beta1.ethsecp256k1.PubKey'

    return new PublicKey(key, type)
  }

  public toHex(): Uint8Array {
    return new Uint8Array([]) /* TODO */
  }

  public toPubKey(): string {
    const pubkeyAminoPrefixSecp256k1 = Buffer.from('eb5ae987' + '21', 'hex')
    const pubKeyBytes = Buffer.concat([
      pubkeyAminoPrefixSecp256k1,
      Buffer.from(this.key, 'base64'),
    ])

    return bech32.encode(BECH32_PUBKEY_ACC_PREFIX, bech32.toWords(pubKeyBytes))
  }

  public toBech32(): string {
    return bech32.encode(BECH32_ADDR_ACC_PREFIX, bech32.toWords(this.toHex()))
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
