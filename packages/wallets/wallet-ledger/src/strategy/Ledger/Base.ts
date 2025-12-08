import { serializeTransaction } from 'viem'
import { TxGrpcApi } from '@injectivelabs/sdk-ts/core/tx'
import {
  toUtf8,
  uint8ArrayToHex,
  stringToUint8Array,
} from '@injectivelabs/sdk-ts/utils'
import {
  ErrorType,
  LedgerException,
  WalletException,
  GeneralException,
  UnspecifiedErrorCode,
  TransactionException,
} from '@injectivelabs/exceptions'
import {
  WalletAction,
  WalletDeviceType,
  getViemPublicClient,
  BaseConcreteStrategy,
  DEFAULT_BASE_DERIVATION_PATH,
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from '@injectivelabs/wallet-base'
import LedgerHW from './hw/index.js'
import { domainHash, messageHash } from './utils.js'
import { LedgerEip1193Provider } from './Eip1193Provider.js'
import type { Hash } from 'viem'
import type { PublicClient } from 'viem'
import type { EvmChainId } from '@injectivelabs/ts-types'
import type { AccountAddress } from '@injectivelabs/ts-types'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'
import type {
  TxRaw,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts/types'
import type {
  StdSignDoc,
  WalletMetadata,
  Eip1193Provider,
  SendTransactionOptions,
  ConcreteWalletStrategy,
  WalletStrategyEvmOptions,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import type { LedgerWalletInfo, LedgerDerivationPathType } from '../../types.js'

export default class LedgerBase
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private baseDerivationPath: string

  private derivationPathType: LedgerDerivationPathType

  private ledger: LedgerHW

  private evmOptions: WalletStrategyEvmOptions

  private publicClient: PublicClient | undefined

  constructor(
    args: ConcreteEvmWalletStrategyArgs & {
      derivationPathType: LedgerDerivationPathType
    },
  ) {
    super(args)

    this.baseDerivationPath = DEFAULT_BASE_DERIVATION_PATH
    this.derivationPathType = args.derivationPathType
    this.ledger = new LedgerHW()
    this.evmOptions = args.evmOptions
  }

  setMetadata(metadata: WalletMetadata): void {
    this.metadata = metadata
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

  protected async getDerivationPath(address: string): Promise<string> {
    return this.metadata?.derivationPath
      ? this.metadata.derivationPath
      : (await this.getWalletForAddress(address)).derivationPath
  }

  public async getAddresses(): Promise<string[]> {
    const { baseDerivationPath, derivationPathType } = this

    try {
      const accountManager = await this.ledger.getAccountManager()
      const wallets = await accountManager.getWallets(
        baseDerivationPath,
        derivationPathType,
      )
      return wallets.map((k) => k.address)
    } catch (e: unknown) {
      throw new LedgerException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  public async getAddressesInfo(): Promise<
    { address: string; derivationPath: string; baseDerivationPath: string }[]
  > {
    const { baseDerivationPath, derivationPathType } = this

    try {
      const accountManager = await this.ledger.getAccountManager()
      const wallets = await accountManager.getWallets(
        baseDerivationPath,
        derivationPathType,
      )
      return wallets.map((k) => ({
        address: k.address,
        derivationPath: k.derivationPath,
        baseDerivationPath: k.baseDerivationPath,
      }))
    } catch (e: unknown) {
      throw new LedgerException(new Error((e as any).message), {
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
    args: {
      address: string
      evmChainId: EvmChainId
    },
  ): Promise<string> {
    const signedTransaction = await this.signEvmTransaction(txData, args)

    try {
      const publicClient = await this.getPublicClient(args.evmChainId)
      const txHash = await publicClient.sendRawTransaction({
        serializedTransaction: signedTransaction as Hash,
      })

      return txHash
    } catch (e: unknown) {
      throw new LedgerException(new Error((e as any).message), {
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
    const derivationPath = await this.getDerivationPath(address)
    const object = JSON.parse(eip712json)

    try {
      const ledger = await this.ledger.getInstance()
      const result = await ledger.signEIP712Message(derivationPath, object)

      const v = result.v.toString(16).padStart(2, '0')
      const combined = `${result.r}${result.s}${v}`

      return combined.startsWith('0x') ? combined : `0x${combined}`
    } catch (e: unknown) {
      const errorMessage = (e as any).message
      const isKnownNanoSError =
        errorMessage.includes('instruction not supported') ||
        errorMessage.includes('invalid status') ||
        errorMessage.includes('not supported') ||
        errorMessage.includes('INS_NOT_SUPPORTED')

      if (!isKnownNanoSError) {
        throw new LedgerException(new Error(errorMessage), {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.SignTransaction,
        })
      }

      try {
        const ledger = await this.ledger.getInstance()
        const result = await ledger.signEIP712HashedMessage(
          derivationPath,
          domainHash(object),
          messageHash(object),
        )

        const v = result.v.toString(16).padStart(2, '0')
        const combined = `${result.r}${result.s}${v}`

        return combined.startsWith('0x') ? combined : `0x${combined}`
      } catch (e) {
        throw new LedgerException(new Error((e as any).message), {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.SignTransaction,
        })
      }
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
    try {
      const derivationPath = await this.getDerivationPath(signer)
      const ledger = await this.ledger.getInstance()
      const result = await ledger.signPersonalMessage(
        derivationPath,
        uint8ArrayToHex(stringToUint8Array(toUtf8(data))),
      )

      const v = result.v.toString(16).padStart(2, '0')
      const combined = `${result.r}${result.s}${v}`

      return combined.startsWith('0x') ? combined : `0x${combined}`
    } catch (e: unknown) {
      throw new LedgerException(new Error((e as any).message), {
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
    const publicClient = await this.getPublicClient(args.evmChainId)
    const chainId = parseInt(args.evmChainId.toString(), 10) as EvmChainId
    const address = args.address.startsWith('0x')
      ? (args.address as Hash)
      : (`0x${args.address}` as Hash)
    const nonce = await publicClient.getTransactionCount({
      address,
    })

    const parseHexValue = (value: string | number | bigint) => {
      if (typeof value === 'string') {
        const hexValue = value.startsWith('0x') ? value : `0x${value}`

        return BigInt(hexValue)
      }

      return BigInt(value)
    }

    const eip1559TxData = {
      type: 'eip1559' as const,
      chainId,
      nonce,
      to: txData.to as Hash,
      value: parseHexValue(txData.value || '0x0'),
      data: txData.data as Hash,
      gas: parseHexValue(txData.gas),
      maxFeePerGas: parseHexValue(txData.maxFeePerGas),
      maxPriorityFeePerGas: parseHexValue(txData.maxPriorityFeePerGas),
    }

    // Serialize the transaction
    const serializedTx = serializeTransaction(eip1559TxData)
    const serializedTxHex = serializedTx.slice(2) // Remove 0x prefix

    try {
      const ledger = await this.ledger.getInstance()
      const derivationPath = await this.getDerivationPath(args.address)

      // Sign the transaction with clear signing enabled
      const txSig = await ledger.clearSignTransaction(
        derivationPath,
        serializedTxHex,
        {
          erc20: true,
          externalPlugins: true,
          nft: true,
        },
      )

      const signedTxData = {
        ...eip1559TxData,
        v: BigInt(`0x${txSig.v}`),
        r: `0x${txSig.r}` as Hash,
        s: `0x${txSig.s}` as Hash,
      }

      return serializeTransaction(signedTxData)
    } catch (e: unknown) {
      throw new LedgerException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignEvmTransaction,
      })
    }
  }

  private async getWalletForAddress(
    address: string,
  ): Promise<LedgerWalletInfo> {
    // Check metadata first for derivation path
    if (this.metadata?.derivationPath) {
      return {
        address,
        baseDerivationPath:
          this.metadata.baseDerivationPath || this.baseDerivationPath,
        derivationPath: this.metadata.derivationPath,
      }
    }

    // Fall back to AccountManager lookup
    try {
      const { baseDerivationPath, derivationPathType } = this
      const accountManager = await this.ledger.getAccountManager()

      if (!accountManager.hasWalletForAddress(address)) {
        for (
          let i = 0;
          i < DEFAULT_ADDRESS_SEARCH_LIMIT / DEFAULT_NUM_ADDRESSES_TO_FETCH;
          i += 1
        ) {
          await accountManager.getWallets(
            baseDerivationPath,
            derivationPathType,
          )

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
      throw new LedgerException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  public async getEip1193Provider(): Promise<Eip1193Provider> {
    return new LedgerEip1193Provider(this.ledger, {
      chainId: this.evmOptions.evmChainId.toString(),
      derivationPath: this.metadata?.derivationPath,
    })
  }

  private async getPublicClient(evmChainId?: EvmChainId) {
    if (this.publicClient) {
      return this.publicClient
    }

    const options = this.evmOptions

    const chainId = evmChainId || options.evmChainId
    const url = options.rpcUrl || options.rpcUrls?.[chainId]

    if (!url) {
      throw new GeneralException(
        new Error('Please pass rpcUrl within the evmOptions'),
      )
    }

    this.publicClient = getViemPublicClient(chainId, url)

    return this.publicClient
  }
}
