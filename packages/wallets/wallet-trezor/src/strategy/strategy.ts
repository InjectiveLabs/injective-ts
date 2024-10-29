/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import { Alchemy, Network as AlchemyNetwork } from 'alchemy-sdk'
import { addHexPrefix } from 'ethereumjs-util'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { Common, Chain, Hardfork } from '@ethereumjs/common'
import TrezorConnect from '@trezor/connect-web'
import {
  ErrorType,
  WalletException,
  TrezorException,
  GeneralException,
  TransactionException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import {
  TxRaw,
  toUtf8,
  TxGrpcApi,
  TxResponse,
  DirectSignResponse,
  AminoSignResponse,
} from '@injectivelabs/sdk-ts'
import {
  StdSignDoc,
  TIP_IN_GWEI,
  WalletAction,
  getKeyFromRpcUrl,
  WalletDeviceType,
  BaseConcreteStrategy,
  ConcreteWalletStrategy,
  SendTransactionOptions,
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
  WalletStrategyEthereumOptions,
  ConcreteEthereumWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import TrezorHW from './hw'
import { transformTypedData } from '../utils'
import { TrezorWalletInfo } from '../types'

type EthereumTransactionEIP1559 = {
  to: string
  value: string
  gasLimit: string
  gasPrice?: typeof undefined
  nonce: string
  data?: string
  chainId: number
  maxFeePerGas: string
  maxPriorityFeePerGas: string
}

const getNetworkFromChainId = (chainId: EthereumChainId): Chain => {
  if (chainId === EthereumChainId.Goerli) {
    return Chain.Goerli
  }

  if (chainId === EthereumChainId.Sepolia) {
    return Chain.Sepolia
  }

  if (chainId === EthereumChainId.Kovan) {
    return Chain.Goerli
  }

  return Chain.Mainnet
}

export class TrezorWallet
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private trezor: TrezorHW

  private ethereumOptions: WalletStrategyEthereumOptions

  private alchemy: Alchemy | undefined

  constructor(args: ConcreteEthereumWalletStrategyArgs) {
    super(args)
    this.trezor = new TrezorHW()
    this.ethereumOptions = args.ethereumOptions
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Hardware)
  }

  async enable(): Promise<boolean> {
    return Promise.resolve(true)
  }

  public async disconnect() {
    this.trezor = new TrezorHW()
  }

  public async getAddresses(): Promise<string[]> {
    try {
      await this.trezor.connect()
      const accountManager = await this.trezor.getAccountManager()
      const wallets = await accountManager.getWallets()

      return wallets.map((k) => k.address)
    } catch (e: unknown) {
      throw new TrezorException(new Error((e as any).message), {
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
    txData: any,
    options: { address: string; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    const signedTransaction = await this.signEthereumTransaction(
      txData,
      options,
    )

    try {
      const alchemy = await this.getAlchemy()
      const txReceipt = await alchemy.core.sendTransaction(
        addHexPrefix(signedTransaction.serialize().toString('hex')),
      )

      return txReceipt.hash
    } catch (e: unknown) {
      throw new TrezorException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEthereumTransaction,
      })
    }
  }

  async sendTransaction(
    transaction: TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse> {
    const { endpoints, txTimeout } = options

    if (!endpoints) {
      throw new WalletException(
        new Error(
          'You have to pass endpoints.grpc within the options for using Ethereum native wallets',
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

  async signEip712TypedData(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const object = JSON.parse(eip712json)
    const compatibleObject = {
      ...object,
      domain: {
        ...object.domain,
        chainId: object.domain.chainId,
        salt: '0',
      },
    }
    const dataWithHashes = transformTypedData(compatibleObject)
    const {
      types: { EIP712Domain = [], ...otherTypes } = {},
      message = {},
      domain = {},
      primaryType,
      domain_separator_hash,
      message_hash,
    } = dataWithHashes

    try {
      await this.trezor.connect()
      const { derivationPath } = await this.getWalletForAddress(address)
      const response = await TrezorConnect.ethereumSignTypedData({
        path: derivationPath,
        data: {
          types: { EIP712Domain, ...otherTypes },
          message,
          domain,
          primaryType,
        },
        message_hash,
        domain_separator_hash,
        metamask_v4_compat: true,
      })

      if (!response.success) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(
          (response.payload && response.payload.error) || 'Unknown error',
        )
      }

      return response.payload.signature
    } catch (e: unknown) {
      throw new TrezorException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  async signAminoCosmosTransaction(_transaction: {
    address: string
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    throw new WalletException(
      new Error('This wallet does not support signing Cosmos transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
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
        contextModule: WalletAction.SendTransaction,
      },
    )
  }

  async signArbitrary(
    signer: AccountAddress,
    data: string | Uint8Array,
  ): Promise<string> {
    try {
      await this.trezor.connect()
      const { derivationPath } = await this.getWalletForAddress(signer)

      const response = await TrezorConnect.ethereumSignMessage({
        path: derivationPath,
        message: toUtf8(data),
      })

      if (!response.success) {
        throw new Error(
          (response.payload && response.payload.error) || 'Unknown error',
        )
      }

      return response.payload.signature
    } catch (e: unknown) {
      throw new TrezorException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  async getEthereumChainId(): Promise<string> {
    const alchemy = await this.getAlchemy()
    const alchemyProvider = await alchemy.config.getProvider()

    return alchemyProvider.network.chainId.toString()
  }

  async getEthereumTransactionReceipt(txHash: string): Promise<string> {
    return Promise.resolve(txHash)
  }

  // eslint-disable-next-line class-methods-use-this
  async getPubKey(): Promise<string> {
    throw new WalletException(
      new Error('You can only fetch PubKey from Cosmos native wallets'),
    )
  }

  private async signEthereumTransaction(
    txData: any,
    options: { address: string; ethereumChainId: EthereumChainId },
  ) {
    const chainId = parseInt(options.ethereumChainId.toString(), 10)
    const alchemy = await this.getAlchemy()
    const nonce = await alchemy.core.getTransactionCount(options.address)

    const common = new Common({
      chain: getNetworkFromChainId(chainId),
      hardfork: Hardfork.London,
    })

    const eip1559TxData = {
      from: txData.from,
      data: txData.data,
      to: txData.to,
      nonce: addHexPrefix(nonce.toString(16)),
      gas: addHexPrefix(txData.gas),
      gasLimit: addHexPrefix(txData.gas),
      maxFeePerGas: addHexPrefix(txData.gasPrice || txData.maxFeePerGas),
      maxPriorityFeePerGas: addHexPrefix(
        txData.maxPriorityFeePerGas || TIP_IN_GWEI.toString(16),
      ),
    }
    const tx = FeeMarketEIP1559Transaction.fromTxData(eip1559TxData, {
      common,
    })

    const transaction = {
      ...tx.toJSON(),
      chainId,
    } as EthereumTransactionEIP1559

    try {
      await this.trezor.connect()
      const { derivationPath } = await this.getWalletForAddress(options.address)
      const response = await TrezorConnect.ethereumSignTransaction({
        path: derivationPath,
        transaction,
      })

      if (!response.success) {
        throw new TrezorException(
          new Error(
            (response.payload && response.payload.error) ||
              'Something happened while signing with Trezor',
          ),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
            contextModule: WalletAction.SignEthereumTransaction,
          },
        )
      }

      const signedTxData = {
        ...eip1559TxData,
        v: `${response.payload.v}`,
        r: `${response.payload.r}`,
        s: `${response.payload.s}`,
      }

      return FeeMarketEIP1559Transaction.fromTxData(signedTxData, {
        common,
      })
    } catch (e: unknown) {
      if (e instanceof TrezorException) {
        throw e
      }

      throw new TrezorException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignEthereumTransaction,
      })
    }
  }

  private async getWalletForAddress(
    address: string,
  ): Promise<TrezorWalletInfo> {
    const accountManager = await this.trezor.getAccountManager()

    if (!accountManager.hasWalletForAddress(address)) {
      for (
        let i = 0;
        i < DEFAULT_ADDRESS_SEARCH_LIMIT / DEFAULT_NUM_ADDRESSES_TO_FETCH;
        i += 1
      ) {
        await accountManager.getWallets()

        if (accountManager.hasWalletForAddress(address)) {
          return (await accountManager.getWalletForAddress(
            address,
          )) as TrezorWalletInfo
        }
      }
    }

    return (await accountManager.getWalletForAddress(
      address,
    )) as TrezorWalletInfo
  }

  private async getAlchemy() {
    if (this.alchemy) {
      return this.alchemy
    }

    const { rpcUrl, ethereumChainId } = this.ethereumOptions

    if (!rpcUrl) {
      throw new GeneralException(
        new Error('Please pass rpcUrl within the ethereumOptions'),
      )
    }

    this.alchemy = new Alchemy({
      apiKey: getKeyFromRpcUrl(rpcUrl),
      network:
        ethereumChainId === EthereumChainId.Mainnet
          ? AlchemyNetwork.ETH_MAINNET
          : AlchemyNetwork.ETH_SEPOLIA,
    })

    return this.alchemy
  }
}
