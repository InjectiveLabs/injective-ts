/* eslint-disable class-methods-use-this */
import { CosmosChainId } from '@injectivelabs/ts-types'
import {
  UnspecifiedErrorCode,
  CosmosWalletException,
  TransactionException,
  ErrorType,
} from '@injectivelabs/exceptions'
import { DEFAULT_STD_FEE } from '@injectivelabs/utils'
import {
  createTxRawFromSigResponse,
  createTransactionAndCosmosSignDocForAddressAndMsg,
} from '@injectivelabs/sdk-ts'
import type { Msgs } from '@injectivelabs/sdk-ts'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import { LeapWallet } from '../../leap'
import { WalletAction } from '../../wallet-strategy/types/enums'
import { ConcreteCosmosWalletStrategy } from '../types/strategy'

export default class Leap implements ConcreteCosmosWalletStrategy {
  public chainId: CosmosChainId

  private leapWallet: LeapWallet

  constructor(args: { chainId: CosmosChainId }) {
    this.chainId = args.chainId || CosmosChainId.Injective
    this.leapWallet = new LeapWallet(args.chainId)
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
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  async sendTransaction(signResponse: DirectSignResponse): Promise<string> {
    const { leapWallet } = this
    const txRaw = createTxRawFromSigResponse(signResponse)

    try {
      return await leapWallet.broadcastTxBlock(txRaw)
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
    const leapWallet = this.getLeapWallet()

    const endpoints = await leapWallet.getChainEndpoints()
    const key = await leapWallet.getKey()
    const signer = await leapWallet.getOfflineSigner()

    try {
      /** Prepare the Transaction * */
      const { cosmosSignDoc } =
        await createTransactionAndCosmosSignDocForAddressAndMsg({
          chainId,
          address: transaction.address,
          memo: transaction.memo,
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

  private getLeapWallet(): LeapWallet {
    const { leapWallet } = this

    if (!leapWallet) {
      throw new CosmosWalletException(
        new Error('Please install the Leap wallet extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: WalletAction.SignTransaction,
        },
      )
    }

    return leapWallet
  }
}
