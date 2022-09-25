/* eslint-disable class-methods-use-this */
import { CosmosChainId } from '@injectivelabs/ts-types'
import { DEFAULT_STD_FEE } from '@injectivelabs/utils'
import {
  createTransactionAndCosmosSignDocForAddressAndMsg,
  createTxRawFromSigResponse,
} from '@injectivelabs/sdk-ts/dist/core/transaction'
import type { Msgs } from '@injectivelabs/sdk-ts'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import {
  UnspecifiedErrorCode,
  CosmosWalletException,
  ErrorType,
  TransactionException,
} from '@injectivelabs/exceptions'
import { KeplrWallet } from '../../keplr'
import { ConcreteCosmosWalletStrategy } from '../types/strategy'
import { WalletAction } from '../../wallet-strategy/types/enums'

export default class Keplr implements ConcreteCosmosWalletStrategy {
  public chainId: CosmosChainId

  private keplrWallet: KeplrWallet

  constructor(args: { chainId: CosmosChainId }) {
    this.chainId = args.chainId || CosmosChainId.Injective
    this.keplrWallet = new KeplrWallet(args.chainId)
  }

  async isChainIdSupported(chainId?: CosmosChainId): Promise<boolean> {
    const keplrWallet = chainId
      ? new KeplrWallet(chainId)
      : this.getKeplrWallet()

    return keplrWallet.checkChainIdSupport()
  }

  async getAddresses(): Promise<string[]> {
    const keplrWallet = this.getKeplrWallet()

    try {
      if (!(await keplrWallet.checkChainIdSupport())) {
        await keplrWallet.experimentalSuggestChain()
      }

      const accounts = await keplrWallet.getAccounts()

      return accounts.map((account) => account.address)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  async sendTransaction(signResponse: DirectSignResponse): Promise<string> {
    const { keplrWallet } = this
    const txRaw = createTxRawFromSigResponse(signResponse)

    try {
      return await keplrWallet.broadcastTxBlock(txRaw)
    } catch (e: unknown) {
      throw new TransactionException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.ChainError,
        contextModule: WalletAction.SendTransaction,
      })
    }
  }

  async signTransaction(transaction: {
    address: string
    memo: string
    gas: string
    message: Msgs | Msgs[]
  }) {
    const { chainId } = this
    const keplrWallet = this.getKeplrWallet()

    const endpoints = await keplrWallet.getChainEndpoints()
    const key = await keplrWallet.getKey()
    const signer = await keplrWallet.getOfflineSigner()

    try {
      /** Prepare the Transaction * */
      const { cosmosSignDoc } =
        await createTransactionAndCosmosSignDocForAddressAndMsg({
          chainId,
          memo: transaction.memo || '',
          address: transaction.address,
          message: transaction.message,
          pubKey: Buffer.from(key.pubKey).toString('base64'),
          endpoint: endpoints.rest,
          fee: {
            ...DEFAULT_STD_FEE,
            gas: transaction.gas || DEFAULT_STD_FEE.gas,
          },
        })

      /* Sign the transaction */
      return signer.signDirect(transaction.address, cosmosSignDoc)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
      })
    }
  }

  private getKeplrWallet(): KeplrWallet {
    const { keplrWallet } = this

    if (!keplrWallet) {
      throw new CosmosWalletException(
        new Error('Please install the Keplr wallet extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: WalletAction.SignTransaction,
        },
      )
    }

    return keplrWallet
  }
}
