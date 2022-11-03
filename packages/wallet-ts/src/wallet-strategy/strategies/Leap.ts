/* eslint-disable class-methods-use-this */
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
  CosmosChainId,
} from '@injectivelabs/ts-types'
import {
  UnspecifiedErrorCode,
  CosmosWalletException,
  TransactionException,
  ErrorType,
} from '@injectivelabs/exceptions'
import {
  createCosmosSignDocFromTransaction,
  createTxRawFromSigResponse,
} from '@injectivelabs/sdk-ts'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { LeapWallet } from '../../leap'
import { ConcreteWalletStrategy } from '../types'
import BaseConcreteStrategy from './Base'
import { WalletAction } from '../../types/enums'

export default class Leap
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private leapWallet: LeapWallet

  constructor(args: { chainId: ChainId }) {
    super(args)
    this.chainId = args.chainId || CosmosChainId.Injective
    this.leapWallet = new LeapWallet(args.chainId)
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

  async confirm(address: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  // eslint-disable-next-line class-methods-use-this
  async sendEthereumTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    throw new CosmosWalletException(
      new Error(
        'sendEthereumTransaction is not supported. Leap only supports sending cosmos transactions',
      ),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEthereumTransaction,
      },
    )
  }

  async sendTransaction(
    transaction: DirectSignResponse | TxRaw,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    const { leapWallet } = this
    const txRaw =
      transaction instanceof TxRaw
        ? transaction
        : createTxRawFromSigResponse(transaction)

    try {
      return await leapWallet.waitTxBroadcasted(
        await leapWallet.broadcastTx(txRaw),
      )
    } catch (e: unknown) {
      throw new TransactionException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.ChainError,
        contextModule: WalletAction.SendTransaction,
      })
    }
  }

  async signTransaction(
    transaction: { txRaw: TxRaw; accountNumber: number; chainId: string },
    address: AccountAddress,
  ) {
    const leapWallet = this.getLeapWallet()
    const signer = await leapWallet.getOfflineSigner()
    const signDoc = createCosmosSignDocFromTransaction(transaction)

    try {
      return signer.signDirect(address, signDoc)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
      })
    }
  }

  async getNetworkId(): Promise<string> {
    throw new CosmosWalletException(
      new Error('getNetworkId is not supported on Leap'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetNetworkId,
      },
    )
  }

  async getChainId(): Promise<string> {
    throw new CosmosWalletException(
      new Error('getChainId is not supported on Leap'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      },
    )
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEthereumTransactionReceipt is not supported on Leap'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetEthereumTransactionReceipt,
      },
    )
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
