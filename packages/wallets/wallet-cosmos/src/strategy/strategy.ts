import { capitalize } from '@injectivelabs/utils'
import {
  uint8ArrayToHex,
  uint8ArrayToBase64,
  stringToUint8Array,
} from '@injectivelabs/sdk-ts/utils'
import {
  ErrorType,
  UnspecifiedErrorCode,
  TransactionException,
  CosmosWalletException,
} from '@injectivelabs/exceptions'
import {
  waitTxBroadcasted,
  createTxRawFromSigResponse,
  createSignDocFromTransaction,
} from '@injectivelabs/sdk-ts/core/tx'
import {
  Wallet,
  WalletAction,
  WalletDeviceType,
  WalletEventListener,
  BaseConcreteStrategy,
  createCosmosSignDocFromSignDoc,
} from '@injectivelabs/wallet-base'
import { CosmosWallet } from './../wallet.js'
import type { OfflineSigner } from '@cosmjs/proto-signing'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'
import type { Wallet as WalletType } from '@injectivelabs/wallet-base'
import type {
  TxRaw,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts/types'
import type {
  ChainId,
  EvmChainId,
  CosmosChainId,
  AccountAddress,
} from '@injectivelabs/ts-types'
import type {
  StdSignDoc,
  ConcreteWalletStrategy,
  SendTransactionOptions,
} from '@injectivelabs/wallet-base'

const cosmosWallets = [
  Wallet.Leap,
  Wallet.Ninji,
  Wallet.Keplr,
  Wallet.OWallet,
] as WalletType[]

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

      if (([Wallet.Keplr, Wallet.OWallet] as WalletType[]).includes(wallet)) {
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

  async getAddressesInfo(): Promise<
    { address: string; derivationPath: string; baseDerivationPath: string }[]
  > {
    throw new CosmosWalletException(
      new Error('getAddressesInfo is not implemented'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      },
    )
  }

  async getSessionOrConfirm(address: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${uint8ArrayToHex(
        stringToUint8Array(
          `Confirmation for ${address} at time: ${Date.now()}`,
        ),
      )}`,
    )
  }

  async sendEvmTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; evmChainId: EvmChainId },
  ): Promise<string> {
    const { wallet } = this

    throw new CosmosWalletException(
      new Error(
        `sendEvmTransaction is not supported. ${capitalize(
          wallet,
        )} only supports sending cosmos transactions`,
      ),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendEvmTransaction,
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
    const signer = await cosmosWallet.getOfflineSigner(this.chainId)
    const signDoc = createSignDocFromTransaction(transaction)

    try {
      if (!('signDirect' in signer)) {
        throw new CosmosWalletException(new Error('signDirect not available'), {
          code: UnspecifiedErrorCode,
          context: WalletAction.SendTransaction,
        })
      }

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
      new Error('This wallet does not support signing Evm transactions'),
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

  async getEvmTransactionReceipt(_txHash: string): Promise<string> {
    const { wallet } = this

    throw new CosmosWalletException(
      new Error(
        `getEvmTransactionReceipt is not supported on ${capitalize(wallet)}`,
      ),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetEvmTransactionReceipt,
      },
    )
  }

  async getPubKey(): Promise<string> {
    const cosmosWallet = this.getCurrentCosmosWallet()
    const key = await cosmosWallet.getKey()

    return uint8ArrayToBase64(key.pubKey)
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

    if (([Wallet.Keplr, Wallet.OWallet] as WalletType[]).includes(wallet)) {
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

  public async getOfflineSigner(chainId?: string): Promise<OfflineSigner> {
    const cosmosWallet = await this.getCosmosWallet(
      (chainId as ChainId) || this.chainId,
    )
    if (!cosmosWallet) {
      throw new Error('no cosmos wallet')
    }

    return await cosmosWallet.getOfflineSigner(chainId || this.chainId)
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
