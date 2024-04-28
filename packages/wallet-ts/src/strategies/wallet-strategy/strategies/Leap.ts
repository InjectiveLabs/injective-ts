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
  createCosmosSignDocFromSignDoc,
  createSignDocFromTransaction,
} from '@injectivelabs/sdk-ts'
import type { DirectSignResponse } from '@cosmjs/proto-signing'
import { LeapWallet } from '../../../utils/wallets/leap'
import { ConcreteWalletStrategy } from '../../types'
import BaseConcreteStrategy from './Base'
import {
  WalletAction,
  WalletDeviceType,
  WalletEventListener,
} from '../../../types/enums'
import { SendTransactionOptions } from '../types'

export default class Leap extends BaseConcreteStrategy implements ConcreteWalletStrategy {
  private leapWallet: LeapWallet

  constructor(args: { chainId: ChainId }) {
    super(args)
    this.chainId = args.chainId || CosmosChainId.Injective
    this.leapWallet = new LeapWallet(args.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    const leapWallet = this.getLeapWallet()
    const key = await leapWallet.getKey()

    return key.isNanoLedger
      ? Promise.resolve(WalletDeviceType.Hardware)
      : Promise.resolve(WalletDeviceType.Browser)
  }

  async enable(): Promise<boolean> {
    const leapWallet = this.getLeapWallet()

    return await leapWallet.checkChainIdSupport()
  }

  public async disconnect() {
    if (this.listeners[WalletEventListener.AccountChange]) {
      window.removeEventListener(
        'leap_keystorechange',
        this.listeners[WalletEventListener.AccountChange],
      )
    }

    this.listeners = {}
  }

  async getAddresses(): Promise<string[]> {
    const leapWallet = this.getLeapWallet()

    try {
      const accounts = await leapWallet.getAccounts()

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
        'sendEthereumTransaction is not supported. Leap only supports sending cosmos transactions',
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
    const { leapWallet } = this
    const txRaw = createTxRawFromSigResponse(transaction)

    if (!options.endpoints) {
      throw new CosmosWalletException(
        new Error(
          'You have to pass endpoints within the options to broadcast transaction',
        ),
      )
    }

    try {
      const txHash = await leapWallet.broadcastTx(txRaw)

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
    const leapWallet = this.getLeapWallet()
    const signer = await leapWallet.getOfflineSigner()
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
    const leapWallet = this.getLeapWallet()
    const leap = await leapWallet.getLeapWallet()

    try {
      const signature = await leap.signArbitrary(this.chainId, signer, data)

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
      new Error('getEthereumChainId is not supported on Leap'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetChainId,
      },
    )
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEthereumTransactionReceipt is not supported on Leap'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetEthereumTransactionReceipt,
      },
    )
  }

  async getPubKey(): Promise<string> {
    const keplrWallet = this.getLeapWallet()
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
