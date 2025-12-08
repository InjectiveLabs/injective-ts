import { EventEmitter } from 'eventemitter3'
import { WalletException, GeneralException } from '@injectivelabs/exceptions'
import {
  Wallet,
  isEvmWallet,
  isCosmosWallet,
  type WalletMetadata,
} from '@injectivelabs/wallet-base'
import { WalletStrategyEmitterEventType } from '../broadcaster/types.js'
import type { StdSignDoc } from '@keplr-wallet/types'
import type { OfflineSigner } from '@cosmjs/proto-signing'
import type { AccountAddress } from '@injectivelabs/ts-types'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'
import type { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import type {
  TxRaw,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts/types'
import type {
  Eip1193Provider,
  WalletDeviceType,
  ConcreteStrategiesArg,
  SendTransactionOptions,
  ConcreteWalletStrategy,
  onAccountChangeCallback,
  onChainIdChangeCallback,
  WalletStrategyArguments,
  CosmosWalletAbstraction,
  WalletStrategy as WalletStrategyInterface,
} from '@injectivelabs/wallet-base'
import type {
  WalletStrategyEmitter,
  WalletStrategyEmitterEvents,
} from '../broadcaster/types.js'

const getInitialWallet = (args: WalletStrategyArguments): Wallet => {
  if (args.wallet) {
    return args.wallet
  }

  const keys = Object.keys(args.strategies || {})

  if (keys.length === 0) {
    return Wallet.Metamask
  }

  if (keys.includes(Wallet.Metamask) && args.evmOptions) {
    return Wallet.Metamask
  }

  if (keys.includes(Wallet.Keplr) && !args.evmOptions) {
    return Wallet.Keplr
  }

  return keys[0] as Wallet
}

export default class BaseWalletStrategy implements WalletStrategyInterface {
  public strategies: ConcreteStrategiesArg

  public wallet: Wallet

  public args: WalletStrategyArguments

  public metadata?: WalletMetadata

  public wallets?: Wallet[]

  private emitter: WalletStrategyEmitter
  public on: WalletStrategyEmitter['on']
  public off: WalletStrategyEmitter['off']
  public emit: WalletStrategyEmitter['emit']

  constructor(args: WalletStrategyArguments) {
    this.args = args
    this.strategies = args.strategies
    this.wallet = getInitialWallet(args)
    this.metadata = args.metadata

    this.emitter = new EventEmitter<WalletStrategyEmitterEvents>()
    this.on = this.emitter.on.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)
    this.emit = this.emitter.emit.bind(this.emitter)
  }

  public getWallet(): Wallet {
    return this.wallet
  }

  public async setWallet(wallet: Wallet): Promise<void> {
    this.wallet = wallet

    this.getStrategy()
  }

  public setMetadata(metadata?: WalletMetadata) {
    this.metadata = metadata

    this.getStrategy().setMetadata?.(metadata)
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

  public getAddressesInfo(
    args?: unknown,
  ): Promise<
    { address: string; derivationPath: string; baseDerivationPath: string }[]
  > {
    const strategy = this.getStrategy()
    return strategy.getAddressesInfo(args)
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

  public async getEvmTransactionReceipt(
    txHash: string,
    evmChainId?: EvmChainId,
  ): Promise<void> {
    return this.getStrategy().getEvmTransactionReceipt(txHash, evmChainId)
  }

  public async getSessionOrConfirm(address?: AccountAddress): Promise<string> {
    return this.getStrategy().getSessionOrConfirm(address)
  }

  public async getWalletClient<T>(): Promise<T> {
    if (this.getStrategy()?.getWalletClient) {
      const result = this.getStrategy()?.getWalletClient<T>?.()
      if (result) {
        return result
      }
    }

    throw new WalletException(
      new Error('Wallet client not found. Please check your wallet strategy.'),
    )
  }

  public async sendTransaction(
    tx: DirectSignResponse | TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse> {
    return this.getStrategy().sendTransaction(tx, options)
  }

  public async sendEvmTransaction(
    tx: any /* TODO */,
    options: {
      evmChainId: EvmChainId
      address: AccountAddress /* Ethereum address */
    },
  ): Promise<string> {
    return this.getStrategy().sendEvmTransaction(tx, options)
  }

  public async signEip712TypedData(
    eip712TypedData: string,
    address: AccountAddress,
    options: { txTimeout?: number } = {},
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

    this.emit(WalletStrategyEmitterEventType.TransactionSignStart)

    const response = await this.getStrategy().signEip712TypedData(
      eip712TypedData,
      address,
      options,
    )

    this.emit(WalletStrategyEmitterEventType.TransactionSigned)

    return response
  }

  public async signAminoCosmosTransaction(transaction: {
    signDoc: StdSignDoc
    address: string
  }): Promise<AminoSignResponse> {
    if (isEvmWallet(this.wallet)) {
      throw new WalletException(
        new Error(`You can't sign Cosmos Transaction using ${this.wallet}`),
      )
    }

    this.emit(WalletStrategyEmitterEventType.TransactionSignStart)

    const response =
      await this.getStrategy().signAminoCosmosTransaction(transaction)

    this.emit(WalletStrategyEmitterEventType.TransactionSigned)

    return response
  }

  public async signCosmosTransaction(transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse> {
    if (isEvmWallet(this.wallet)) {
      throw new WalletException(
        new Error(`You can't sign Cosmos Transaction using ${this.wallet}`),
      )
    }

    this.emit(WalletStrategyEmitterEventType.TransactionSignStart)

    const response = await this.getStrategy().signCosmosTransaction(transaction)

    this.emit(WalletStrategyEmitterEventType.TransactionSigned)

    return response
  }

  public async signArbitrary(
    signer: string,
    data: string | Uint8Array,
  ): Promise<string | void> {
    if (this.getStrategy().signArbitrary) {
      this.emit(WalletStrategyEmitterEventType.TransactionSignStart)

      const response = await this.getStrategy().signArbitrary!(signer, data)

      this.emit(WalletStrategyEmitterEventType.TransactionSigned)

      return response
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

      this.emit(WalletStrategyEmitterEventType.WalletStrategyDisconnect)
    }
  }

  public getCosmosWallet(chainId: ChainId): CosmosWalletAbstraction {
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

  public async getEip1193Provider(): Promise<Eip1193Provider> {
    if (this.getStrategy().getEip1193Provider) {
      return this.getStrategy().getEip1193Provider!()
    }

    throw new WalletException(
      new Error(
        'EIP1193 provider not found. Please check your wallet strategy.',
      ),
    )
  }

  public async getOfflineSigner(chainId: string): Promise<OfflineSigner> {
    if (this.getStrategy().getOfflineSigner) {
      return this.getStrategy().getOfflineSigner!(chainId)
    }

    throw new WalletException(
      new Error('Offline signer not found. Please check your wallet strategy.'),
    )
  }
}
