/* eslint-disable class-methods-use-this */
import {
  ChainId,
  AccountAddress,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import {
  ErrorType,
  LedgerCosmosException,
  TransactionException,
  UnspecifiedErrorCode,
  WalletException,
} from '@injectivelabs/exceptions'
import {
  TxRaw,
  toUtf8,
  TxGrpcApi,
  TxResponse,
  DirectSignResponse,
  sortObjectByKeys,
} from '@injectivelabs/sdk-ts'
import { ConcreteWalletStrategy } from '../../../types/index.js'
import { LedgerWalletInfo, SendTransactionOptions } from '../../types.js'
import BaseConcreteStrategy from '../Base.js'
import {
  DEFAULT_BASE_DERIVATION_PATH,
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from '../../constants.js'
import LedgerHW from './hw/index.js'
import { WalletAction, WalletDeviceType } from '../../../../types/enums.js'
import { CosmosWalletException } from '@injectivelabs/exceptions'

export default class LedgerCosmos
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private baseDerivationPath: string

  private ledger: LedgerHW

  constructor(args: { chainId: ChainId }) {
    super(args)

    this.baseDerivationPath = DEFAULT_BASE_DERIVATION_PATH
    this.ledger = new LedgerHW()
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Hardware)
  }

  async enable(): Promise<boolean> {
    return Promise.resolve(true)
  }

  public async disconnect() {
    this.ledger = await this.ledger.refresh()
  }

  public async getAddresses(): Promise<string[]> {
    const { baseDerivationPath } = this

    try {
      const accountManager = await this.ledger.getAccountManager()
      const wallets = await accountManager.getWallets(baseDerivationPath)

      return wallets.map((k) => k.address)
    } catch (e: unknown) {
      throw new LedgerCosmosException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
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

  async sendEthereumTransaction(
    _txData: any,
    _options: {
      address: string
      ethereumChainId: EthereumChainId
    },
  ): Promise<string> {
    throw new CosmosWalletException(
      new Error(
        'sendEthereumTransaction is not supported. LedgerCosmos only supports sending cosmos transactions',
      ),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendEthereumTransaction,
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
          'You have to pass endpoints.grpc within the options for using LedgerCosmos wallet',
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
    transaction: { txRaw: TxRaw; accountNumber: number; chainId: string },
    injectiveAddress: AccountAddress,
  ): Promise<DirectSignResponse> {
    return this.signCosmosTransaction({
      ...transaction,
      address: injectiveAddress,
    })
  }

  async signAminoCosmosTransaction(transaction: {
    signDoc: any
    accountNumber: number
    chainId: string
    address: string
  }): Promise<string> {
    try {
      const { derivationPath } = await this.getWalletForAddress(
        transaction.address,
      )
      const ledger = await this.ledger.getInstance()

      const result = await ledger.sign(
        derivationPath,
        JSON.stringify(sortObjectByKeys(transaction.signDoc)),
      )

      return Buffer.from(result.signature!).toString('base64')
    } catch (e: unknown) {
      throw new LedgerCosmosException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  async signCosmosTransaction(_transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse> {
    throw new CosmosWalletException(
      new Error('This wallet does not support signing using direct sign'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      },
    )
  }

  async signEip712TypedData(
    _eip712Json: string,
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
    signer: AccountAddress,
    data: string | Uint8Array,
  ): Promise<string> {
    try {
      const { derivationPath } = await this.getWalletForAddress(signer)

      const ledger = await this.ledger.getInstance()
      const result = await ledger.sign(derivationPath, toUtf8(data))

      return Buffer.from(result.signature!).toString('base64')
    } catch (e: unknown) {
      throw new LedgerCosmosException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  async getEthereumChainId(): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEthereumChainId is not supported on Keplr'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetChainId,
      },
    )
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEthereumTransactionReceipt is not supported on Keplr'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetEthereumTransactionReceipt,
      },
    )
  }

  async getPubKey(address?: string): Promise<string> {
    if (!address) {
      throw new WalletException(
        new Error('You can only fetch PubKey corresponding to an address'),
      )
    }

    const ledgerWalletInfo = await this.getWalletForAddress(address)

    return Buffer.from(ledgerWalletInfo.publicKey || '', 'hex').toString(
      'base64',
    )
  }

  private async getWalletForAddress(
    address: string,
  ): Promise<LedgerWalletInfo> {
    try {
      const { baseDerivationPath } = this
      const accountManager = await this.ledger.getAccountManager()

      if (!accountManager.hasWalletForAddress(address)) {
        for (
          let i = 0;
          i < DEFAULT_ADDRESS_SEARCH_LIMIT / DEFAULT_NUM_ADDRESSES_TO_FETCH;
          i += 1
        ) {
          await accountManager.getWallets(baseDerivationPath)

          if (accountManager.hasWalletForAddress(address)) {
            return (await accountManager.getWalletForAddress(
              address,
            )) as LedgerWalletInfo
          }
        }
      }

      return (await accountManager.getWalletForAddress(
        address,
      )) as LedgerWalletInfo
    } catch (e) {
      throw new LedgerCosmosException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }
}
