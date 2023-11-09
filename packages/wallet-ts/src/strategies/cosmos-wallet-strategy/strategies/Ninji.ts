/* eslint-disable class-methods-use-this */
import { CosmosChainId } from '@injectivelabs/ts-types'
import {
  ErrorType,
  UnspecifiedErrorCode,
  CosmosWalletException,
  TransactionException,
} from '@injectivelabs/exceptions'
import {
  TxRaw,
  TxResponse,
  createTxRawFromSigResponse,
  createCosmosSignDocFromSignDoc,
  createSignDocFromTransaction,
} from '@injectivelabs/sdk-ts'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import { StdSignDoc } from '@keplr-wallet/types'
import { AminoSignResponse } from '@cosmjs/launchpad'
import { NinjiWallet } from '../../../utils/wallets/ninji'
import { WalletAction, WalletDeviceType } from '../../../types/enums'
import { ConcreteCosmosWalletStrategy } from '../../types/strategy'

export default class Ninji implements ConcreteCosmosWalletStrategy {
  public chainId: CosmosChainId

  private ninjiWallet: NinjiWallet

  constructor(args: { chainId: CosmosChainId }) {
    this.chainId = args.chainId || CosmosChainId.Injective
    this.ninjiWallet = new NinjiWallet(args.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async isChainIdSupported(chainId?: CosmosChainId): Promise<boolean> {
    const ninjiWallet = chainId
      ? new NinjiWallet(chainId)
      : this.getNinjiWallet()

    return ninjiWallet.checkChainIdSupport()
  }

  async getAddresses(): Promise<string[]> {
    const { chainId } = this
    const ninjiWallet = this.getNinjiWallet()

    try {
      if (!(await ninjiWallet.checkChainIdSupport())) {
        throw new CosmosWalletException(
          new Error(`The ${chainId} is not supported on Ninji.`),
          { type: ErrorType.WalletError },
        )
      }

      const accounts = await ninjiWallet.getAccounts()

      return accounts.map((account) => account.address)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  async sendTransaction(
    transaction: DirectSignResponse | TxRaw,
  ): Promise<TxResponse> {
    const { ninjiWallet } = this
    const txRaw = createTxRawFromSigResponse(transaction)

    try {
      return await ninjiWallet.waitTxBroadcasted(
        await ninjiWallet.broadcastTx(txRaw),
      )
    } catch (e: unknown) {
      throw new TransactionException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      })
    }
  }

  async signTransaction(transaction: {
    txRaw: TxRaw
    chainId: string
    accountNumber: number
    address: string
  }) {
    const ninjiWallet = this.getNinjiWallet()
    const signer = await ninjiWallet.getOfflineSigner()
    const signDoc = createSignDocFromTransaction(transaction)

    try {
      return signer.signDirect(
        transaction.address,
        createCosmosSignDocFromSignDoc(signDoc),
      )
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      })
    }
  }

  async signAminoTransaction(_transaction: {
    address: string
    stdSignDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    throw new CosmosWalletException(
      new Error('signAminoTransaction not supported on Ninji'),
    )
  }

  async getPubKey(): Promise<string> {
    const ninjiWallet = this.getNinjiWallet()

    try {
      const key = await ninjiWallet.getKey()

      return Buffer.from(key.pubKey).toString('base64')
    } catch (e) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  private getNinjiWallet(): NinjiWallet {
    const { ninjiWallet } = this

    if (!ninjiWallet) {
      throw new CosmosWalletException(
        new Error('Please install the Ninji wallet extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: WalletAction.SignTransaction,
        },
      )
    }

    return ninjiWallet
  }
}
