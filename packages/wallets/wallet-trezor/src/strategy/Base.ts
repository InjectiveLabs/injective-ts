import { toHex, serializeTransaction } from 'viem'
import { EvmChainId } from '@injectivelabs/ts-types'
import { toUtf8, TxGrpcApi } from '@injectivelabs/sdk-ts'
import { Alchemy, Network as AlchemyNetwork } from 'alchemy-sdk'
import {
  ErrorType,
  WalletException,
  TrezorException,
  GeneralException,
  UnspecifiedErrorCode,
  TransactionException,
} from '@injectivelabs/exceptions'
import {
  TIP_IN_GWEI,
  WalletAction,
  getKeyFromRpcUrl,
  WalletDeviceType,
  BaseConcreteStrategy,
  DEFAULT_BASE_DERIVATION_PATH,
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from '@injectivelabs/wallet-base'
import { loadTrezorConnect } from './lib.js'
import { transformTypedData } from '../utils.js'
import { BaseTrezorTransport } from './hw/index.js'
import type { TrezorDerivationPathType, TrezorWalletInfo } from '../types.js'
import type {
  AccountAddress,
  EvmChainId as EvmChainIdType,
} from '@injectivelabs/ts-types'
import type {
  TxRaw,
  TxResponse,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts'
import type {
  StdSignDoc,
  SendTransactionOptions,
  ConcreteWalletStrategy,
  WalletStrategyEvmOptions,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base'

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

export default class TrezorBase
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private baseDerivationPath: string

  private trezor: BaseTrezorTransport

  private evmOptions: WalletStrategyEvmOptions

  private alchemy: Alchemy | undefined

  private derivationPathType: TrezorDerivationPathType

  constructor(
    args: ConcreteEvmWalletStrategyArgs & {
      derivationPathType: TrezorDerivationPathType
    },
  ) {
    super(args)

    this.evmOptions = args.evmOptions
    this.trezor = new BaseTrezorTransport()
    this.derivationPathType = args.derivationPathType
    this.baseDerivationPath = DEFAULT_BASE_DERIVATION_PATH
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Hardware)
  }

  async enable(): Promise<boolean> {
    return Promise.resolve(true)
  }

  public async disconnect() {
    return Promise.resolve()
  }

  public async getAddresses(): Promise<string[]> {
    const { baseDerivationPath, derivationPathType } = this

    try {
      await this.trezor.connect()
      const accountManager = await this.trezor.getAccountManager()
      const wallets = await accountManager.getWallets(
        baseDerivationPath,
        derivationPathType,
      )

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

  async sendEvmTransaction(
    txData: any,
    args: { address: string; evmChainId: EvmChainIdType },
  ): Promise<string> {
    const signedTransaction = await this.signEvmTransaction(txData, args)

    try {
      const alchemy = await this.getAlchemy(args.evmChainId)
      const txReceipt = await alchemy.core.sendTransaction(signedTransaction)

      return txReceipt.hash
    } catch (e: unknown) {
      throw new TrezorException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEvmTransaction,
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
    const TrezorConnect = await loadTrezorConnect()

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
    const TrezorConnect = await loadTrezorConnect()

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

  async getEvmTransactionReceipt(txHash: string): Promise<string> {
    return Promise.resolve(txHash)
  }

  async getPubKey(): Promise<string> {
    throw new WalletException(
      new Error('You can only fetch PubKey from Cosmos native wallets'),
    )
  }

  private async signEvmTransaction(
    txData: any,
    args: { address: string; evmChainId: EvmChainId },
  ): Promise<string> {
    const TrezorConnect = await loadTrezorConnect()

    const chainId = parseInt(args.evmChainId.toString(), 10)
    const alchemy = await this.getAlchemy(args.evmChainId)
    const nonce = await alchemy.core.getTransactionCount(args.address)

    // Create transaction data for Trezor API (still needs hex strings)
    const trezorTxData = {
      to: txData.to,
      value: toHex(txData.value || 0),
      gasLimit: toHex(txData.gas),
      nonce: toHex(nonce),
      data: txData.data || '0x',
      chainId,
      maxFeePerGas: toHex(txData.gasPrice || txData.maxFeePerGas),
      maxPriorityFeePerGas: toHex(txData.maxPriorityFeePerGas || TIP_IN_GWEI),
    } as EthereumTransactionEIP1559

    try {
      await this.trezor.connect()
      const { derivationPath } = await this.getWalletForAddress(args.address)
      const response = await TrezorConnect.ethereumSignTransaction({
        path: derivationPath,
        transaction: trezorTxData,
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
            contextModule: WalletAction.SignEvmTransaction,
          },
        )
      }

      // Create viem-compatible transaction data for serialization
      const viemTxData = {
        type: 'eip1559' as const,
        chainId,
        nonce,
        to: txData.to as `0x${string}`,
        value: BigInt(txData.value || 0),
        data: (txData.data || '0x') as `0x${string}`,
        gas: BigInt(txData.gas),
        maxFeePerGas: BigInt(txData.gasPrice || txData.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(
          txData.maxPriorityFeePerGas || TIP_IN_GWEI,
        ),
        v: BigInt(response.payload.v),
        r: response.payload.r as `0x${string}`,
        s: response.payload.s as `0x${string}`,
      }

      return serializeTransaction(viemTxData)
    } catch (e: unknown) {
      if (e instanceof TrezorException) {
        throw e
      }

      throw new TrezorException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignEvmTransaction,
      })
    }
  }

  private async getWalletForAddress(
    address: string,
  ): Promise<TrezorWalletInfo> {
    const { baseDerivationPath, derivationPathType } = this
    const accountManager = await this.trezor.getAccountManager()

    if (!accountManager.hasWalletForAddress(address)) {
      for (
        let i = 0;
        i < DEFAULT_ADDRESS_SEARCH_LIMIT / DEFAULT_NUM_ADDRESSES_TO_FETCH;
        i += 1
      ) {
        await accountManager.getWallets(baseDerivationPath, derivationPathType)

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

  private async getAlchemy(evmChainId?: EvmChainIdType) {
    if (this.alchemy) {
      return this.alchemy
    }

    const options = this.evmOptions

    const chainId = evmChainId || options.evmChainId
    const url = options.rpcUrl || options.rpcUrls?.[chainId]

    if (!url) {
      throw new GeneralException(
        new Error('Please pass rpcUrl within the ethereumOptions'),
      )
    }

    this.alchemy = new Alchemy({
      apiKey: getKeyFromRpcUrl(url),
      network:
        chainId === EvmChainId.Mainnet
          ? AlchemyNetwork.ETH_MAINNET
          : AlchemyNetwork.ETH_SEPOLIA,
    })

    return this.alchemy
  }
}
