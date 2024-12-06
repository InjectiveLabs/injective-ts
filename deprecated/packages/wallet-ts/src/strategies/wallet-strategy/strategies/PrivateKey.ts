/* eslint-disable class-methods-use-this */
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import {
  ErrorType,
  WalletException,
  MetamaskException,
  UnspecifiedErrorCode,
  TransactionException,
} from '@injectivelabs/exceptions'
import {
  PrivateKey as PrivateKeySigner,
  getInjectiveSignerAddress,
} from '@injectivelabs/sdk-ts'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { TxRaw, toUtf8, TxGrpcApi, TxResponse } from '@injectivelabs/sdk-ts'
import { ConcreteWalletStrategy, EthereumWalletStrategyArgs } from '../../types/index.js'
import { SendTransactionOptions } from '../types.js'
import BaseConcreteStrategy from './Base.js'
import { WalletAction, WalletDeviceType } from '../../../types/enums.js'

interface PrivateKeyArgs extends EthereumWalletStrategyArgs {
  privateKey?: string
}

export default class PrivateKey
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private privateKey?: PrivateKeySigner | undefined

  constructor(args: PrivateKeyArgs) {
    super(args)

    this.privateKey = args.privateKey
      ? PrivateKeySigner.fromHex(args.privateKey)
      : undefined
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Other)
  }

  async enable(): Promise<boolean> {
    return Promise.resolve(true)
  }

  public async disconnect() {
    this.listeners = {}
  }

  async getAddresses(): Promise<string[]> {
    const pk = this.getPrivateKey()

    try {
      return Promise.resolve([pk.toAddress().toHex()])
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getSessionOrConfirm(address: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  async sendEthereumTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    throw new WalletException(
      new Error('This wallet does not support sending Ethereum transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEthereumTransaction,
      },
    )
  }

  async sendTransaction(
    transaction: TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse> {
    const { endpoints, txTimeout } = options

    if (!endpoints) {
      throw new WalletException(
        new Error(
          'You have to pass endpoints within the options for using Ethereum native wallets',
        ),
      )
    }

    const txApi = new TxGrpcApi(endpoints.grpc)
    const response = await txApi.broadcast(transaction, { txTimeout })

    if (response.code !== 0) {
      throw new TransactionException(new Error(response.rawLog), {
        code: UnspecifiedErrorCode,
        contextCode: response.code,
        contextModule: response.codespace,
      })
    }

    return response
  }

  /** @deprecated */
  async signTransaction(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    return this.signEip712TypedData(eip712json, address)
  }

  async signEip712TypedData(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const pk = this.getPrivateKey()

    if (getInjectiveSignerAddress(address) !== pk.toAddress().toBech32()) {
      throw new WalletException(
        new Error('Signer address does not match the private key address'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.SignTransaction,
        },
      )
    }

    try {
      const signature = await pk.signTypedData(JSON.parse(eip712json))

      return `0x${Buffer.from(signature).toString('hex')}`
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  async signAminoCosmosTransaction(_transaction: {
    signDoc: any
    accountNumber: number
    chainId: string
    address: string
  }): Promise<string> {
    throw new WalletException(
      new Error('This wallet does not support signing Cosmos transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      },
    )
  }

  // eslint-disable-next-line class-methods-use-this
  async signCosmosTransaction(_transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse> {
    throw new WalletException(
      new Error('This wallet does not support signing Cosmos transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      },
    )
  }

  async signArbitrary(
    signer: AccountAddress,
    data: string | Uint8Array,
  ): Promise<string> {
    const pk = this.getPrivateKey()

    if (getInjectiveSignerAddress(signer) !== pk.toAddress().toBech32()) {
      throw new WalletException(
        new Error('Signer address does not match the private key address'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.SignArbitrary,
        },
      )
    }

    try {
      const signature = await pk.signHashed(Buffer.from(toUtf8(data), 'utf-8'))

      return `0x${Buffer.from(signature).toString('base64')}`
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignArbitrary,
      })
    }
  }

  async getEthereumChainId(): Promise<string> {
    try {
      return Promise.resolve(
        (this.chainId === ChainId.Mainnet
          ? EthereumChainId.Mainnet
          : EthereumChainId.Sepolia
        ).toString(16),
      )
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      })
    }
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new WalletException(new Error('Not supported'))
  }

  // eslint-disable-next-line class-methods-use-this
  async getPubKey(): Promise<string> {
    const pk = this.getPrivateKey()

    return pk.toPublicKey().toBase64()
  }

  async onChainIdChanged(_callback: (chain: string) => void): Promise<void> {
    //
  }

  async onAccountChange(
    _callback: (account: AccountAddress | string[]) => void,
  ): Promise<void> {
    //
  }

  private getPrivateKey(): PrivateKeySigner {
    if (!this.privateKey) {
      throw new WalletException(
        new Error('Please provide private key in the constructor'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: WalletAction.GetAccounts,
        },
      )
    }

    return this.privateKey
  }
}
