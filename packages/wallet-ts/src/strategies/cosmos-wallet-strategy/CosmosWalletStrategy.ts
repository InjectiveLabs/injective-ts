import { AccountAddress } from '@injectivelabs/ts-types'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { GeneralException } from '@injectivelabs/exceptions'
import { TxResponse, TxRaw } from '@injectivelabs/sdk-ts'
import { AminoSignResponse, StdSignDoc } from '@keplr-wallet/types'
import { Wallet, WalletDeviceType } from '../../types/enums'
import Keplr from './strategies/Keplr'
import Leap from './strategies/Leap'
import Cosmostation from './strategies/Cosmostation'
import Ninji from './strategies/Ninji'
import {
  ConcreteCosmosWalletStrategy,
  CosmosWalletStrategyArguments,
} from '../types/strategy'
import {} from '../../utils/utils'
import { isCosmosWallet } from '../wallet-strategy/utils'
import { SendTransactionOptions } from '../wallet-strategy'

export const cosmosWallets = [
  Wallet.Keplr,
  Wallet.Leap,
  Wallet.Cosmostation,
  Wallet.Ninji,
]

const createWallet = ({
  wallet,
  args,
}: {
  wallet: Wallet
  args: CosmosWalletStrategyArguments
}): ConcreteCosmosWalletStrategy | undefined => {
  switch (wallet) {
    case Wallet.Keplr:
      return new Keplr({ ...args })
    case Wallet.Leap:
      return new Leap({ ...args })
    case Wallet.Cosmostation:
      return new Cosmostation({ ...args })
    case Wallet.Ninji:
      return new Ninji({ ...args })
    default:
      throw new GeneralException(
        new Error(`The ${wallet} concrete wallet strategy is not supported`),
      )
  }
}

const createWallets = (
  args: CosmosWalletStrategyArguments,
): Record<Wallet, ConcreteCosmosWalletStrategy | undefined> =>
  cosmosWallets.reduce(
    (strategies, wallet) => ({
      ...strategies,
      [wallet]: createWallet({ wallet, args }),
    }),
    {} as Record<Wallet, ConcreteCosmosWalletStrategy | undefined>,
  )

export default class CosmosWalletStrategy {
  public strategies: Record<Wallet, ConcreteCosmosWalletStrategy | undefined>

  public wallet: Wallet

  constructor(args: CosmosWalletStrategyArguments) {
    this.strategies = createWallets(args)
    this.wallet = args.wallet || Wallet.Keplr
  }

  public getWallet(): Wallet {
    return this.wallet
  }

  public setWallet(wallet: Wallet) {
    this.wallet = isCosmosWallet(wallet) ? wallet : Wallet.Keplr
  }

  public getStrategy(): ConcreteCosmosWalletStrategy {
    if (!this.strategies[this.wallet]) {
      throw new GeneralException(
        new Error(`Wallet ${this.wallet} is not enabled/available!`),
      )
    }

    return this.strategies[this.wallet] as ConcreteCosmosWalletStrategy
  }

  public getWalletDeviceType(): Promise<WalletDeviceType> {
    return this.getStrategy().getWalletDeviceType()
  }

  public getPubKey(): Promise<string> {
    return this.getStrategy().getPubKey()
  }

  public enable(): Promise<boolean> {
    return this.getStrategy().enable()
  }

  public getAddresses(): Promise<AccountAddress[]> {
    return this.getStrategy().getAddresses()
  }

  public async enableAndGetAddresses(): Promise<AccountAddress[]> {
    await this.getStrategy().enable()

    return await this.getStrategy().getAddresses()
  }

  public async sendTransaction(
    tx: TxRaw | DirectSignResponse,
    options: SendTransactionOptions
  ): Promise<TxResponse> {
    return this.getStrategy().sendTransaction(tx, options)
  }

  public async signTransaction(transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse> {
    return this.getStrategy().signTransaction(transaction)
  }

  public async signAminoTransaction(transaction: {
    address: string
    stdSignDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    return this.getStrategy().signAminoTransaction(transaction)
  }
}
