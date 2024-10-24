import { TxRaw, TxResponse } from '@injectivelabs/sdk-ts'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import {
  ChainId,
  AccountAddress,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import { GeneralException, WalletException } from '@injectivelabs/exceptions'
import {
  Wallet,
  isEthWallet,
  isCosmosWallet,
  WalletDeviceType,
  ConcreteStrategiesArg,
  SendTransactionOptions,
  ConcreteWalletStrategy,
  onAccountChangeCallback,
  onChainIdChangeCallback,
  WalletStrategyArguments,
  CosmosWalletAbstraction,
  ConcreteWalletStrategyOptions,
  WalletStrategy as WalletStrategyInterface,
} from '@injectivelabs/wallet-base'

const getInitialWallet = (args: WalletStrategyArguments): Wallet => {
  if (args.wallet) {
    return args.wallet
  }

  if (Object.keys(args.strategies || [])?.length) {
    return Object.keys(args.strategies || [])[0] as Wallet
  }

  return args.ethereumOptions ? Wallet.Metamask : Wallet.Keplr
}

export default class BaseWalletStrategy implements WalletStrategyInterface {
  public strategies: ConcreteStrategiesArg

  public wallet: Wallet

  public args: WalletStrategyArguments

  public wallets?: Wallet[]

  constructor(args: WalletStrategyArguments) {
    this.args = args
    this.strategies = args.strategies
    this.wallet = getInitialWallet(args)
  }

  public getWallet(): Wallet {
    return this.wallet
  }

  public setWallet(wallet: Wallet) {
    this.wallet = wallet
  }

  public setOptions(_options?: ConcreteWalletStrategyOptions) {
    //
  }

  public getStrategy(): ConcreteWalletStrategy {
    if (!this.strategies[this.wallet]) {
      throw new GeneralException(
        new Error(`Wallet ${this.wallet} is not enabled/available!`),
      )
    }

    return this.strategies[this.wallet] as ConcreteWalletStrategy
  }

  public getAddresses(args?: unknown): Promise<AccountAddress[]> {
    return this.getStrategy().getAddresses(args)
  }

  public getWalletDeviceType(): Promise<WalletDeviceType> {
    return this.getStrategy().getWalletDeviceType()
  }

  public getPubKey(address?: string): Promise<string> {
    return this.getStrategy().getPubKey(address)
  }

  public enable(args?: unknown): Promise<boolean> {
    return this.getStrategy().enable(args)
  }

  public async enableAndGetAddresses(
    args?: unknown,
  ): Promise<AccountAddress[]> {
    await this.getStrategy().enable(args)

    return this.getStrategy().getAddresses(args)
  }

  public getEthereumChainId(): Promise<string> {
    return this.getStrategy().getEthereumChainId()
  }

  public async getEthereumTransactionReceipt(txHash: string): Promise<void> {
    return this.getStrategy().getEthereumTransactionReceipt(txHash)
  }

  public async getSessionOrConfirm(address?: AccountAddress): Promise<string> {
    return this.getStrategy().getSessionOrConfirm(address)
  }

  public async sendTransaction(
    tx: DirectSignResponse | TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse> {
    return this.getStrategy().sendTransaction(tx, options)
  }

  public async sendEthereumTransaction(
    tx: any /* TODO */,
    options: {
      address: AccountAddress /* Ethereum address */
      ethereumChainId: EthereumChainId
    },
  ): Promise<string> {
    return this.getStrategy().sendEthereumTransaction(tx, options)
  }

  /** @deprecated * */
  public async signTransaction(
    data:
      | string /* When using EIP712 typed data */
      | { txRaw: TxRaw; accountNumber: number; chainId: string },
    address: AccountAddress,
  ): Promise<string | DirectSignResponse> {
    return this.getStrategy().signTransaction(data, address)
  }

  public async signEip712TypedData(
    eip712TypedData: string,
    address: AccountAddress,
  ): Promise<string> {
    if (isCosmosWallet(this.wallet)) {
      throw new WalletException(
        new Error(`You can't sign Ethereum Transaction using ${this.wallet}`),
      )
    }

    /** Phantom wallet needs enabling before signing */
    if (this.wallet === Wallet.Phantom) {
      await this.enable()
    }

    return this.getStrategy().signEip712TypedData(eip712TypedData, address)
  }

  public async signAminoCosmosTransaction(transaction: {
    signDoc: any
    accountNumber: number
    chainId: string
    address: string
  }): Promise<string> {
    if (isEthWallet(this.wallet)) {
      throw new WalletException(
        new Error(`You can't sign Cosmos Transaction using ${this.wallet}`),
      )
    }

    return this.getStrategy().signAminoCosmosTransaction(transaction)
  }

  public async signCosmosTransaction(transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse> {
    if (isEthWallet(this.wallet)) {
      throw new WalletException(
        new Error(`You can't sign Cosmos Transaction using ${this.wallet}`),
      )
    }

    return this.getStrategy().signCosmosTransaction(transaction)
  }

  public async signArbitrary(
    signer: string,
    data: string | Uint8Array,
  ): Promise<string | void> {
    if (this.getStrategy().signArbitrary) {
      return this.getStrategy().signArbitrary!(signer, data)
    }
  }

  public async onAccountChange(
    callback: onAccountChangeCallback,
  ): Promise<void> {
    if (this.getStrategy().onAccountChange) {
      return this.getStrategy().onAccountChange!(callback)
    }
  }

  public async onChainIdChange(
    callback: onChainIdChangeCallback,
  ): Promise<void> {
    if (this.getStrategy().onChainIdChange) {
      return this.getStrategy().onChainIdChange!(callback)
    }
  }

  public async disconnect() {
    if (this.getStrategy().disconnect) {
      await this.getStrategy().disconnect!()
    }
  }

  public getCosmosWallet(chainId: ChainId): CosmosWalletAbstraction {
    if ([Wallet.Keplr, Wallet.Leap].includes(this.getWallet())) {
      throw new WalletException(
        new Error(`You can't use this method outside of Keplr/Leap wallet`),
      )
    }

    const strategy = this.getStrategy()

    if (strategy.getCosmosWallet == undefined) {
      throw new WalletException(
        new Error(
          `This method is not available for ${this.getWallet()} wallet`,
        ),
      )
    }

    return strategy.getCosmosWallet(chainId)
  }
}
