/* eslint-disable class-methods-use-this */
import {
  TxRaw,
  TxResponse,
  waitTxBroadcasted,
  AminoSignResponse,
  DirectSignResponse,
  createTxRawFromSigResponse,
  createSignDocFromTransaction,
} from '@injectivelabs/sdk-ts'
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
  Wallet,
  StdSignDoc,
  WalletAction,
  WalletDeviceType,
  WalletEventListener,
  BaseConcreteStrategy,
  ConcreteWalletStrategy,
  SendTransactionOptions,
  createCosmosSignDocFromSignDoc,
} from '@injectivelabs/wallet-base'
import { capitalize } from '@injectivelabs/utils'
import { CosmosWallet } from './../wallet.js'

const cosmosWallets = [Wallet.Leap, Wallet.Ninji, Wallet.Keplr, Wallet.OWallet]

export class CosmosWalletStrategy
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  public wallet: Wallet

  private cosmosWallet: CosmosWallet

  constructor(
    args: {
      chainId: ChainId | CosmosChainId
      endpoints?: { rest: string; rpc: string }
    } & { wallet: Wallet },
  ) {
    super({ ...args, chainId: args.chainId as ChainId })

    if (!cosmosWallets.includes(args.wallet)) {
      throw new CosmosWalletException(
        new Error(
          `Cosmos Wallet for ${capitalize(args.wallet)} is not supported.`,
        ),
      )
    }

    this.wallet = args.wallet
    this.chainId = args.chainId as ChainId
    this.cosmosWallet = new CosmosWallet({
      wallet: args.wallet,
      chainId: args.chainId,
    })
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    const cosmosWallet = this.getCurrentCosmosWallet()
    const key = await cosmosWallet.getKey()

    return key.isNanoLedger
      ? Promise.resolve(WalletDeviceType.Hardware)
      : Promise.resolve(WalletDeviceType.Browser)
  }

  async enable(): Promise<boolean> {
    const cosmosWallet = this.getCurrentCosmosWallet()

    return await cosmosWallet.checkChainIdSupport()
  }

  public async disconnect() {
    const { wallet } = this

    if (this.listeners[WalletEventListener.AccountChange]) {
      if (wallet === Wallet.Ninji) {
        window.ninji.off(
          'accountsChanged',
          this.listeners[WalletEventListener.AccountChange],
        )
      }

      if ([Wallet.Keplr, Wallet.OWallet].includes(wallet)) {
        window.removeEventListener(
          'keplr_keystorechange',
          this.listeners[WalletEventListener.AccountChange],
        )
      }

      if (wallet === Wallet.Leap) {
        window.removeEventListener(
          'leap_keystorechange',
          this.listeners[WalletEventListener.AccountChange],
        )
      }
    }

    this.listeners = {}
  }

  async getAddresses(): Promise<string[]> {
    const cosmosWallet = this.getCurrentCosmosWallet()

    try {
      const accounts = await cosmosWallet.getAccounts()

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
    const { wallet } = this

    throw new CosmosWalletException(
      new Error(
        `sendEthereumTransaction is not supported. ${capitalize(
          wallet,
        )} only supports sending cosmos transactions`,
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
    const cosmosWallet = this.getCurrentCosmosWallet()
    const txRaw = createTxRawFromSigResponse(transaction)

    if (!options.endpoints) {
      throw new CosmosWalletException(
        new Error(
          'You have to pass endpoints within the options to broadcast transaction',
        ),
      )
    }

    try {
      const txHash = await cosmosWallet.broadcastTx(txRaw)

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

  async signAminoCosmosTransaction(transaction: {
    address: string
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    const cosmosWallet = this.getCurrentCosmosWallet()
    const signer = await cosmosWallet.getOfflineAminoSigner()

    try {
      return await signer.signAmino(transaction.address, transaction.signDoc)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SignTransaction,
      })
    }
  }

  async signCosmosTransaction(transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: AccountAddress
  }) {
    const cosmosWallet = this.getCurrentCosmosWallet()
    const signer = await cosmosWallet.getOfflineSigner()
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

  async signArbitrary(
    signer: string,
    data: string | Uint8Array,
  ): Promise<string> {
    const cosmosWallet = this.getCurrentCosmosWallet()

    try {
      const signature = await cosmosWallet.signArbitrary({ data, signer })

      return signature
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SignArbitrary,
      })
    }
  }

  async getEthereumChainId(): Promise<string> {
    const { wallet } = this

    throw new CosmosWalletException(
      new Error(`getEthereumChainId is not supported on ${capitalize(wallet)}`),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetChainId,
      },
    )
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    const { wallet } = this

    throw new CosmosWalletException(
      new Error(
        `getEthereumTransactionReceipt is not supported on ${capitalize(
          wallet,
        )}`,
      ),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetEthereumTransactionReceipt,
      },
    )
  }

  async getPubKey(): Promise<string> {
    const cosmosWallet = this.getCurrentCosmosWallet()
    const key = await cosmosWallet.getKey()

    return Buffer.from(key.pubKey).toString('base64')
  }

  async onAccountChange(
    callback: (account: AccountAddress | string[]) => void,
  ): Promise<void> {
    const { wallet } = this

    const listener = async () => {
      const [account] = await this.getAddresses()

      callback(account)
    }

    this.listeners = {
      [WalletEventListener.AccountChange]: listener,
    }

    if (wallet === Wallet.Ninji) {
      window.ninji.on('accountsChanged', listener)
    }

    if ([Wallet.Keplr, Wallet.OWallet].includes(wallet)) {
      window.addEventListener('keplr_keystorechange', listener)
    }

    if (wallet === Wallet.Leap) {
      window.addEventListener('leap_keystorechange', listener)
    }
  }

  public getCosmosWallet(chainId: ChainId): CosmosWallet {
    const { wallet, cosmosWallet } = this

    return !cosmosWallet ? new CosmosWallet({ chainId, wallet }) : cosmosWallet
  }

  private getCurrentCosmosWallet(): CosmosWallet {
    const { wallet, cosmosWallet } = this

    if (!cosmosWallet) {
      throw new CosmosWalletException(
        new Error(`Please install the ${capitalize(wallet)} wallet extension`),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: WalletAction.SignTransaction,
        },
      )
    }

    return cosmosWallet as CosmosWallet
  }
}
