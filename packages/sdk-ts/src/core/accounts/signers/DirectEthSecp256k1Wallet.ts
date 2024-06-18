import { DirectSignResponse, makeSignBytes } from '@cosmjs/proto-signing'
import { PrivateKey } from '../PrivateKey'
import { PublicKey } from '../PublicKey'
import { AccountData, OfflineDirectSigner } from './types/proto-signer'
import { CosmosTxV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export class DirectEthSecp256k1Wallet implements OfflineDirectSigner {
  /**
   * Creates a DirectEthSecp256k1Wallet from the given private key
   *
   * @param privKey The private key.
   * @param prefix The bech32 address prefix (human readable part). Defaults to "inj".
   */
  public static async fromKey(
    privKey: Uint8Array,
    prefix = 'inj',
  ): Promise<DirectEthSecp256k1Wallet> {
    const publicKey = PrivateKey.fromHex(Buffer.from(privKey).toString('hex'))
      .toPublicKey()
      .toPubKeyBytes()

    return new DirectEthSecp256k1Wallet(privKey, publicKey, prefix)
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

  public async signDirect(
    address: string,
    signDoc: Omit<CosmosTxV1Beta1Tx.SignDoc, 'accountNumber'> & {
      accountNumber: bigint
    },
  ): Promise<DirectSignResponse> {
    const signBytes = makeSignBytes(signDoc)

    if (address !== this.address) {
      throw new Error(`Address ${address} not found in wallet`)
    }

    const signature = await this.privateKey.sign(Buffer.from(signBytes))

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
