/* eslint-disable class-methods-use-this */
import {
  ChainId,
  CosmosChainId,
  AccountAddress,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import {
  ErrorType,
  UnspecifiedErrorCode,
  CosmosWalletException,
  TransactionException,
} from '@injectivelabs/exceptions'
import {
  TxRaw,
  TxResponse,
  waitTxBroadcasted,
  createTxRawFromSigResponse,
  createSignDocFromTransaction,
} from '@injectivelabs/sdk-ts'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import { NinjiWallet } from '../../../utils/wallets/ninji/index.js'
import { ConcreteWalletStrategy } from '../../types/index.js'
import BaseConcreteStrategy from './Base.js'
import {
  WalletAction,
  WalletDeviceType,
  WalletEventListener,
} from '../../../types/enums.js'
import { SendTransactionOptions } from '../types.js'
import { createCosmosSignDocFromSignDoc } from '../../../utils/cosmos.js'

export default class Ninji extends BaseConcreteStrategy implements ConcreteWalletStrategy {
  private ninjiWallet: NinjiWallet

  constructor(args: {
    chainId: ChainId
    endpoints?: { rest: string; rpc: string }
  }) {
    super(args)
    this.chainId = args.chainId || CosmosChainId.Injective
    this.ninjiWallet = new NinjiWallet(args.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async enable(): Promise<boolean> {
    const ninjiWallet = this.getNinjiWallet()

    return await ninjiWallet.checkChainIdSupport()
  }

  public async disconnect() {
    if (this.listeners[WalletEventListener.AccountChange]) {
      window.removeEventListener(
        'ninji_keystorechange',
        this.listeners[WalletEventListener.AccountChange],
      )
    }

    this.listeners = {}
  }

  async getAddresses(): Promise<string[]> {
    const ninjiWallet = this.getNinjiWallet()

    try {
      const accounts = await ninjiWallet.getAccounts()

      return accounts.map((account) => account.address)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  async getSessionOrConfirm(address: AccountAddress): Promise<string> {
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
        'sendEthereumTransaction is not supported. Ninji only supports sending cosmos transactions',
      ),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendEthereumTransaction,
      },
    )
  }

  async sendTransaction(
    transaction: DirectSignResponse | TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse> {
    const { ninjiWallet } = this
    const txRaw = createTxRawFromSigResponse(transaction)

    if (!options.endpoints) {
      throw new CosmosWalletException(
        new Error(
          'You have to pass endpoints within the options to broadcast transaction',
        ),
      )
    }

    try {
      const txHash = await ninjiWallet.broadcastTx(txRaw)

      return await waitTxBroadcasted(txHash, options)
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new TransactionException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      })
    }
  }

  /** @deprecated */
  async signTransaction(
    transaction: { txRaw: TxRaw; accountNumber: number; chainId: string },
    injectiveAddress: AccountAddress,
  ) {
    return this.signCosmosTransaction({
      ...transaction,
      address: injectiveAddress,
    })
  }

  async signAminoCosmosTransaction(_transaction: {
    signDoc: any
    accountNumber: number
    chainId: string
    address: string
  }): Promise<string> {
    throw new CosmosWalletException(
      new Error('This wallet does not support signing using amino'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      },
    )
  }

  async signCosmosTransaction(transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: AccountAddress
  }) {
    const ninjiWallet = this.getNinjiWallet()
    const signer = await ninjiWallet.getOfflineSigner()
    const signDoc = createSignDocFromTransaction(transaction)

    try {
      return await signer.signDirect(
        transaction.address,
        createCosmosSignDocFromSignDoc(signDoc),
      )
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      })
    }
  }

  async signArbitrary(
    signer: string,
    data: string | Uint8Array,
  ): Promise<string> {
    const ninjiWallet = this.getNinjiWallet()
    const ninji = await ninjiWallet.getNinjiWallet()

    try {
      const signature = await ninji.signArbitrary(this.chainId, signer, data)

      return signature.signature
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SignArbitrary,
      })
    }
  }

  async signEip712TypedData(
    _eip712TypedData: string,
    _address: AccountAddress,
  ): Promise<string> {
    throw new CosmosWalletException(
      new Error('This wallet does not support signing Ethereum transactions'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      },
    )
  }

  async getEthereumChainId(): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEthereumChainId is not supported on Ninji'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetChainId,
      },
    )
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEthereumTransactionReceipt is not supported on Ninji'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetEthereumTransactionReceipt,
      },
    )
  }

  async getPubKey(): Promise<string> {
    const keplrWallet = this.getNinjiWallet()
    const key = await keplrWallet.getKey()

    return Buffer.from(key.pubKey).toString('base64')
  }

  async onAccountChange(
    callback: (account: AccountAddress) => void,
  ): Promise<void> {
    const listener = async () => {
      const [account] = await this.getAddresses()

      callback(account)
    }

    this.listeners = {
      [WalletEventListener.AccountChange]: listener,
    }

    window.addEventListener('leap_keystorechange', listener)
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
