/* eslint-disable class-methods-use-this */
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
  CosmosChainId,
} from '@injectivelabs/ts-types'
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
import { ConcreteWalletStrategy, WalletAction } from '../types'
import BaseConcreteStrategy from './Base'

export default class Keplr
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private keplrWallet: KeplrWallet

  constructor(args: { ethereumChainId: EthereumChainId; chainId: ChainId }) {
    super(args)
    this.chainId = args.chainId || CosmosChainId.Injective
    this.keplrWallet = new KeplrWallet(args.chainId)
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
        'sendEthereumTransaction is not supported. Keplr only supports sending cosmos transactions',
      ),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEthereumTransaction,
      },
    )
  }

  async sendTransaction(
    signResponse: DirectSignResponse,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
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

  async signTransaction(
    transaction: {
      memo: string
      gas: string
      message: Msgs | Msgs[]
    },
    injectiveAddress: AccountAddress,
  ) {
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
          memo: transaction.memo,
          address: injectiveAddress,
          message: transaction.message,
          pubKey: Buffer.from(key.pubKey).toString('base64'),
          endpoint: endpoints.rest,
          fee: {
            ...DEFAULT_STD_FEE,
            gas: transaction.gas || DEFAULT_STD_FEE.gas,
          },
        })

      /* Sign the transaction */
      return signer.signDirect(injectiveAddress, cosmosSignDoc)
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
      new Error('getNetworkId is not supported on Keplr'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetNetworkId,
      },
    )
  }

  async getChainId(): Promise<string> {
    throw new CosmosWalletException(
      new Error('getChainId is not supported on Keplr'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      },
    )
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEthereumTransactionReceipt is not supported on Keplr'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetEthereumTransactionReceipt,
      },
    )
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
