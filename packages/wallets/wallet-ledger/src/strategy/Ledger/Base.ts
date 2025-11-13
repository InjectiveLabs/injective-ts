import { serializeTransaction } from 'viem'
import { sleep } from '@injectivelabs/utils'
import { EvmChainId } from '@injectivelabs/ts-types'
import { Alchemy, Network as AlchemyNetwork } from 'alchemy-sdk'
import {
  toUtf8,
  TxGrpcApi,
  uint8ArrayToHex,
  stringToUint8Array,
} from '@injectivelabs/sdk-ts'
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
  getKeyFromRpcUrl,
  WalletDeviceType,
  getViemPublicClient,
  BaseConcreteStrategy,
  DEFAULT_BASE_DERIVATION_PATH,
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from '@injectivelabs/wallet-base'
import LedgerHW from './hw/index.js'
import { loadLedgerServiceType } from './../lib.js'
import { domainHash, messageHash } from './utils.js'
import { LedgerEip1193Provider } from './Eip1193Provider.js'
import type { AccountAddress } from '@injectivelabs/ts-types'
import type {
  TxRaw,
  TxResponse,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts'
import type {
  StdSignDoc,
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

  private alchemy: Alchemy | undefined

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
    const evmChainId = args.evmChainId
    const injectiveEvmChainIds = [
      EvmChainId.MainnetEvm,
      EvmChainId.TestnetEvm,
      EvmChainId.DevnetEvm,
    ] as EvmChainId[]

    const signedTransaction = await this.signEvmTransaction(txData, args)

    if (injectiveEvmChainIds.includes(evmChainId)) {
      try {
        const publicClient = getViemPublicClient(evmChainId)
        const txHash = await publicClient.sendRawTransaction({
          serializedTransaction: signedTransaction as `0x${string}`,
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

    try {
      const alchemy = await this.getAlchemy(args.evmChainId)
      const provider = await alchemy.config.getProvider()
      const txHash = await provider.send('eth_sendRawTransaction', [
        signedTransaction,
      ])

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
    const { derivationPath } = await this.getWalletForAddress(address)
    const object = JSON.parse(eip712json)

    try {
      const ledger = await this.ledger.getInstance()
      const result = await ledger.signEIP712Message(derivationPath, object)

      const combined = `${result.r}${result.s}${result.v.toString(16)}`

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

        const combined = `${result.r}${result.s}${result.v.toString(16)}`

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
      const { derivationPath } = await this.getWalletForAddress(signer)

      const ledger = await this.ledger.getInstance()
      const result = await ledger.signPersonalMessage(
        derivationPath,
        uint8ArrayToHex(stringToUint8Array(toUtf8(data))),
      )

      const combined = `${result.r}${result.s}${result.v.toString(16)}`

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
    const alchemy = await this.getAlchemy()
    const alchemyProvider = await alchemy.config.getProvider()

    return alchemyProvider.network.chainId.toString()
  }

  async getEvmTransactionReceipt(
    txHash: string,
    evmChainId?: EvmChainId,
  ): Promise<string> {
    const chainId = evmChainId || this.evmOptions.evmChainId
    const injectiveEvmChainIds = [
      EvmChainId.MainnetEvm,
      EvmChainId.TestnetEvm,
      EvmChainId.DevnetEvm,
    ] as EvmChainId[]

    const interval = 3000
    const maxAttempts = 10
    let attempts = 0

    if (injectiveEvmChainIds.includes(chainId)) {
      const publicClient = getViemPublicClient(chainId)

      while (attempts < maxAttempts) {
        attempts++
        await sleep(interval)

        try {
          const receipt = await publicClient.getTransactionReceipt({
            hash: txHash as `0x${string}`,
          })

          if (receipt) {
            return txHash
          }
        } catch {}
      }

      throw new Error(
        `Failed to retrieve transaction receipt for txHash: ${txHash}`,
      )
    }

    const alchemy = await this.getAlchemy(evmChainId)
    const provider = await alchemy.config.getProvider()

    while (attempts < maxAttempts) {
      attempts++
      await sleep(interval)

      try {
        const receipt = await provider.send('eth_getTransactionReceipt', [
          txHash,
        ])

        if (receipt) {
          return txHash
        }
      } catch {}
    }

    throw new Error(
      `Failed to retrieve transaction receipt for txHash: ${txHash}`,
    )
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
    const ledgerService = await loadLedgerServiceType()

    const chainId = parseInt(args.evmChainId.toString(), 10) as EvmChainId
    const injectiveEvmChainIds = [
      EvmChainId.MainnetEvm,
      EvmChainId.TestnetEvm,
      EvmChainId.DevnetEvm,
    ] as EvmChainId[]

    let nonce: number

    if (injectiveEvmChainIds.includes(args.evmChainId)) {
      const publicClient = getViemPublicClient(args.evmChainId)
      nonce = await publicClient.getTransactionCount({
        address: args.address as `0x${string}`,
      })
    } else {
      const alchemy = await this.getAlchemy(args.evmChainId)
      nonce = await alchemy.core.getTransactionCount(args.address)
    }

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
      to: txData.to as `0x${string}`,
      value: parseHexValue(txData.value || '0x0'),
      data: txData.data as `0x${string}`,
      gas: parseHexValue(txData.gas),
      maxFeePerGas: parseHexValue(txData.maxFeePerGas),
      maxPriorityFeePerGas: parseHexValue(txData.maxPriorityFeePerGas),
    }

    // Serialize the transaction
    const serializedTx = serializeTransaction(eip1559TxData)
    const serializedTxHex = serializedTx.slice(2) // Remove 0x prefix

    try {
      const ledger = await this.ledger.getInstance()
      const { derivationPath } = await this.getWalletForAddress(args.address)

      // Resolve transaction for Ledger display
      const resolution = await ledgerService.resolveTransaction(
        serializedTxHex,
        {},
        {},
      )

      // Sign the transaction with Ledger
      const txSig = await ledger.signTransaction(
        derivationPath,
        serializedTxHex,
        resolution,
      )

      const signedTxData = {
        ...eip1559TxData,
        v: BigInt(`0x${txSig.v}`),
        r: `0x${txSig.r}` as `0x${string}`,
        s: `0x${txSig.s}` as `0x${string}`,
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
      derivationPath: this.baseDerivationPath,
    })
  }

  private async getAlchemy(evmChainId?: EvmChainId) {
    if (this.alchemy) {
      return this.alchemy
    }

    const options = this.evmOptions

    const chainId = evmChainId || options.evmChainId
    const url = options.rpcUrl || options.rpcUrls?.[chainId]

    if (!url) {
      throw new GeneralException(
        new Error('Please pass rpcUrl within the evmOptions'),
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
