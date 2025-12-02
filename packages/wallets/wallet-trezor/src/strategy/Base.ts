import { toHex, serializeTransaction } from 'viem'
import { TxGrpcApi } from '@injectivelabs/sdk-ts/core/tx'
import { getViemPublicClient } from '@injectivelabs/wallet-base'
import {
  toUtf8,
  uint8ArrayToHex,
  stringToUint8Array,
} from '@injectivelabs/sdk-ts/utils'
import {
  ErrorType,
  WalletException,
  TrezorException,
  GeneralException,
  UnspecifiedErrorCode,
  TransactionException,
} from '@injectivelabs/exceptions'
import {
  WalletAction,
  WalletDeviceType,
  BaseConcreteStrategy,
  DEFAULT_BASE_DERIVATION_PATH,
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from '@injectivelabs/wallet-base'
import { loadTrezorConnect } from './lib.js'
import { transformTypedData } from '../utils.js'
import { BaseTrezorTransport } from './hw/index.js'
import type { Hash, PublicClient } from 'viem'
import type { EvmChainId } from '@injectivelabs/ts-types'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'
import type {
  AccountAddress,
  EvmChainId as EvmChainIdType,
} from '@injectivelabs/ts-types'
import type {
  TxRaw,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts/types'
import type {
  StdSignDoc,
  SendTransactionOptions,
  ConcreteWalletStrategy,
  WalletStrategyEvmOptions,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import type { TrezorWalletInfo, TrezorDerivationPathType } from '../types.js'

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

  private publicClient: PublicClient | undefined

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
      `0x${uint8ArrayToHex(
        stringToUint8Array(
          `Confirmation for ${address} at time: ${Date.now()}`,
        ),
      )}`,
    )
  }

  async sendEvmTransaction(
    txData: any,
    args: { address: string; evmChainId: EvmChainIdType },
  ): Promise<string> {
    const signedTransaction = await this.signEvmTransaction(txData, args)

    try {
      const publicClient = await this.getPublicClient(args.evmChainId)
      const txHash = await publicClient.sendRawTransaction({
        serializedTransaction: signedTransaction as Hash,
      })

      return txHash
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

      if (
        'code' in response.payload &&
        response.payload.code === 'Failure_ActionCancelled'
      ) {
        throw new Error('Request rejected')
      }

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
    const publicClient = await this.getPublicClient()
    const chainId = await publicClient.getChainId()

    return chainId.toString()
  }

  async getEvmTransactionReceipt(
    txHash: string,
    evmChainId?: EvmChainId,
  ): Promise<string> {
    const publicClient = await this.getPublicClient(evmChainId)

    try {
      await publicClient.waitForTransactionReceipt({
        hash: txHash as Hash,
        timeout: 30_000,
        pollingInterval: 3_000,
      })

      return txHash
    } catch {
      throw new Error(
        `Failed to retrieve transaction receipt for txHash: ${txHash}`,
      )
    }
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
    const publicClient = await this.getPublicClient(args.evmChainId)
    const address = args.address.startsWith('0x')
      ? (args.address as Hash)
      : (`0x${args.address}` as Hash)
    const nonce = await publicClient.getTransactionCount({
      address,
    })

    // Handle hex string values properly (with or without 0x prefix)
    const parseHexValue = (value: string | number | bigint) => {
      if (typeof value === 'string') {
        const hexValue = value.startsWith('0x') ? value : `0x${value}`

        return BigInt(hexValue)
      }

      return BigInt(value)
    }

    // Convert to BigInt first, then to hex for Trezor
    const valueBigInt = parseHexValue(txData.value || '0x0')
    const gasBigInt = parseHexValue(txData.gas)
    const maxFeePerGasBigInt = parseHexValue(txData.maxFeePerGas)
    const maxPriorityFeePerGasBigInt = parseHexValue(
      txData.maxPriorityFeePerGas,
    )

    // Create transaction data for Trezor API (needs hex strings)
    const trezorTxData = {
      to: txData.to,
      value: toHex(valueBigInt),
      gasLimit: toHex(gasBigInt),
      nonce: toHex(nonce),
      data: txData.data || '0x',
      chainId,
      maxFeePerGas: toHex(maxFeePerGasBigInt),
      maxPriorityFeePerGas: toHex(maxPriorityFeePerGasBigInt),
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
        to: txData.to as Hash,
        value: valueBigInt,
        data: (txData.data || '0x') as Hash,
        gas: gasBigInt,
        maxFeePerGas: maxFeePerGasBigInt,
        maxPriorityFeePerGas: maxPriorityFeePerGasBigInt,
        v: BigInt(response.payload.v),
        r: response.payload.r as Hash,
        s: response.payload.s as Hash,
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

  private async getPublicClient(evmChainId?: EvmChainIdType) {
    if (this.publicClient) {
      return this.publicClient
    }

    const options = this.evmOptions

    const chainId = evmChainId || options.evmChainId
    const url = options.rpcUrl || options.rpcUrls?.[chainId]

    if (!url) {
      throw new GeneralException(
        new Error('Please pass rpcUrl within the ethereumOptions'),
      )
    }

    this.publicClient = getViemPublicClient(chainId, url)

    return this.publicClient
  }
}
