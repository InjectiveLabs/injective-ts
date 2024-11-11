import { AminoSignResponse, serializeSignDoc, StdSignDoc } from '@cosmjs/amino'
import { PrivateKey } from '../PrivateKey.js'
import { PublicKey } from '../PublicKey.js'
import { AccountData, OfflineAminoSigner } from './types/amino-signer.js'

export class EthSecp256k1Wallet implements OfflineAminoSigner {
  /**
   * Creates a EthSecp256k1Wallet from the given private key
   *
   * @param privKey The private key.
   * @param prefix The bech32 address prefix (human readable part). Defaults to "inj".
   */
  public static async fromKey(
    privKey: Uint8Array,
    prefix = 'inj',
  ): Promise<EthSecp256k1Wallet> {
    const publicKey = PrivateKey.fromHex(Buffer.from(privKey).toString('hex'))
      .toPublicKey()
      .toPubKeyBytes()

    return new EthSecp256k1Wallet(privKey, publicKey, prefix)
  }

  private readonly privateKey: PrivateKey

  private readonly publicKey: PublicKey

  private readonly prefix: string

  private constructor(privKey: Uint8Array, pubKey: Uint8Array, prefix: string) {
    this.privateKey = PrivateKey.fromHex(Buffer.from(privKey).toString('hex'))
    this.publicKey = PublicKey.fromBytes(pubKey)
    this.prefix = prefix
  }

  private get address(): string {
    return this.publicKey.toAddress().toBech32(this.prefix)
  }

  public async getAccounts(): Promise<readonly AccountData[]> {
    return [
      {
        algo: 'eth_secp256k1',
        address: this.address,
        pubkey: this.publicKey.toPubKeyBytes(),
      },
    ]
  }

  public async signAmino(
    signerAddress: string,
    signDoc: StdSignDoc,
  ): Promise<AminoSignResponse> {
    if (signerAddress !== this.address) {
      throw new Error(`Address ${signerAddress} not found in wallet`)
    }

    const messageBytes = serializeSignDoc(signDoc)
    const signature = await this.privateKey.sign(Buffer.from(messageBytes))

    return {
      signed: signDoc,
      signature: {
        pub_key: {
          type: 'tendermint/PubKeyEthSecp256k1',
          value: this.publicKey.toBase64(),
        },
        signature: Buffer.from(signature).toString('base64'),
      },
    }
  }
}
