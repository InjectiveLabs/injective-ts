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
  createCosmosSignDocFromTransaction,
} from '@injectivelabs/sdk-ts'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import { StdSignDoc } from '@keplr-wallet/types'
import { AminoSignResponse } from '@cosmjs/launchpad'
import { LeapWallet } from '../../../utils/wallets/leap'
import { WalletAction, WalletDeviceType } from '../../../types/enums'
import { ConcreteCosmosWalletStrategy } from '../../types/strategy'
import Long from 'long'

export default class Leap implements ConcreteCosmosWalletStrategy {
  public chainId: CosmosChainId

  private leapWallet: LeapWallet

  constructor(args: { chainId: CosmosChainId }) {
    this.chainId = args.chainId || CosmosChainId.Injective
    this.leapWallet = new LeapWallet(args.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async isChainIdSupported(chainId?: CosmosChainId): Promise<boolean> {
    const leapWallet = chainId ? new LeapWallet(chainId) : this.getLeapWallet()

    return leapWallet.checkChainIdSupport()
  }

  async getAddresses(): Promise<string[]> {
    const { chainId } = this
    const leapWallet = this.getLeapWallet()

    try {
      if (!(await leapWallet.checkChainIdSupport())) {
        throw new CosmosWalletException(
          new Error(`The ${chainId} is not supported on Leap.`),
          { type: ErrorType.WalletError },
        )
      }

      const accounts = await leapWallet.getAccounts()

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
    const { leapWallet } = this
    const txRaw = createTxRawFromSigResponse(transaction)

    try {
      return await leapWallet.waitTxBroadcasted(
        await leapWallet.broadcastTx(txRaw),
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
    const leapWallet = this.getLeapWallet()
    const signer = await leapWallet.getOfflineSigner()
    const signDoc = createCosmosSignDocFromTransaction(transaction)

    try {
      return signer.signDirect(transaction.address, {
        ...signDoc,
        accountNumber: new Long(parseInt(signDoc.accountNumber), 10),
      })
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
      new Error('signAminoTransaction not supported on Leap'),
    )
  }

  async getPubKey(): Promise<string> {
    const leapWallet = this.getLeapWallet()

    try {
      const key = await leapWallet.getKey()

      return Buffer.from(key.pubKey).toString('base64')
    } catch (e) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  private getLeapWallet(): LeapWallet {
    const { leapWallet } = this

    if (!leapWallet) {
      throw new CosmosWalletException(
        new Error('Please install the Leap wallet extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: WalletAction.SignTransaction,
        },
      )
    }

    return leapWallet
  }
}
