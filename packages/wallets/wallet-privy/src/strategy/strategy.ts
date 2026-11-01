import { TxGrpcApi } from '@injectivelabs/sdk-ts/core/tx'
import { toHex, bytesToHex, hexToBytes, getAddress, hashTypedData } from 'viem'
import {
  toUtf8,
  uint8ArrayToHex,
  stringToUint8Array,
  getEthereumAddress,
} from '@injectivelabs/sdk-ts/utils'
import {
  WalletAction,
  WalletDeviceType,
  getViemPublicClient,
  BaseConcreteStrategy,
} from '@injectivelabs/wallet-base'
import {
  ErrorType,
  WalletException,
  UnspecifiedErrorCode,
  TransactionException,
  PrivyWalletSessionException,
} from '@injectivelabs/exceptions'
import type { Hex, Hash } from 'viem'
import type { EvmChainId, AccountAddress } from '@injectivelabs/ts-types'
import type {
  TxRaw,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts/types'
import type {
  StdSignDoc,
  PrivyMetadata,
  Eip1193Provider,
  PrivyEip1193Provider,
  ConcreteWalletStrategy,
  SendTransactionOptions,
  WalletStrategyEvmOptions,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base'

const HEX_QUANTITY_FIELDS = [
  'value',
  'gas',
  'gasLimit',
  'gasPrice',
  'maxFeePerGas',
  'maxPriorityFeePerGas',
] as const

// viem's names for EIP-2718 transaction types 0, 1 and 2
const VIEM_TX_TYPES = ['legacy', 'eip2930', 'eip1559'] as const

const toBigInt = (value: string | number | bigint) => {
  if (typeof value === 'string') {
    return BigInt(value.startsWith('0x') ? value : `0x${value}`)
  }

  return BigInt(value)
}

// Privy returns r‖s‖v in several shapes; Injective expects v as 27/28
const normalizeSignature = (result: unknown): Hex => {
  const raw =
    typeof result === 'string'
      ? result
      : result && typeof result === 'object' && 'signature' in result
        ? String((result as { signature: unknown }).signature)
        : ''

  if (!/^(0x)?[0-9a-fA-F]+$/.test(raw)) {
    throw new Error('Privy returned an invalid signature')
  }

  const bytes = hexToBytes((raw.startsWith('0x') ? raw : `0x${raw}`) as Hex)

  if (bytes.length !== 65) {
    throw new Error(`Expected a 65-byte signature, got ${bytes.length} bytes`)
  }

  if (bytes[64] < 27) {
    bytes[64] += 27
  }

  return bytesToHex(bytes)
}

/** Signs through the Privy embedded wallet provider passed in `metadata.privy`. */
export class PrivyWalletStrategy
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  public evmOptions: WalletStrategyEvmOptions

  constructor(args: ConcreteEvmWalletStrategyArgs) {
    super(args)

    this.evmOptions = args.evmOptions
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  // WalletStrategy sends every setMetadata call to all strategies
  setMetadata(metadata?: { privy?: PrivyMetadata }) {
    if (metadata?.privy) {
      this.metadata = { ...this.metadata, privy: metadata.privy }
    }
  }

  async enable(): Promise<boolean> {
    const privy = this.metadata?.privy

    return Promise.resolve(Boolean(privy?.address && privy.getProvider))
  }

  public async disconnect() {
    // The app signs out through the Privy SDK; here we only forget the wallet
    if (this.metadata?.privy) {
      this.metadata = { ...this.metadata, privy: undefined }
    }
  }

  async getAddresses(): Promise<string[]> {
    const { address } = this.getPrivyMetadata(WalletAction.GetAccounts)

    try {
      return [getAddress(address)]
    } catch (e: unknown) {
      throw this.toWalletException(e, WalletAction.GetAccounts)
    }
  }

  async getAddressesInfo(): Promise<
    { address: string; derivationPath: string; baseDerivationPath: string }[]
  > {
    throw new WalletException(
      new Error('getAddressesInfo is not implemented'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      },
    )
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
    transaction: unknown,
    args: { address: AccountAddress; evmChainId: EvmChainId },
  ): Promise<string> {
    const chainId = args.evmChainId || this.evmOptions.evmChainId
    const url = this.evmOptions.rpcUrls?.[chainId] || this.evmOptions.rpcUrl

    if (!url) {
      throw new WalletException(
        new Error('Please pass rpcUrl within the evmOptions'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.SendEvmTransaction,
        },
      )
    }

    try {
      const from = this.getCheckedAddress(
        args.address,
        WalletAction.SendEvmTransaction,
      )
      // Web3Broadcaster's transaction type allows null fields; viem wants them absent
      const request = Object.fromEntries(
        Object.entries(transaction as Record<string, any>).filter(
          ([, value]) => value != null,
        ),
      )

      for (const field of HEX_QUANTITY_FIELDS) {
        if (request[field] !== undefined) {
          request[field] = toBigInt(request[field])
        }
      }

      if (request.gas === undefined && request.gasLimit !== undefined) {
        request.gas = request.gasLimit
      }

      if (request.data === undefined && request.input !== undefined) {
        request.data = request.input
      }

      if (request.type !== undefined) {
        const type = VIEM_TX_TYPES.includes(request.type)
          ? request.type
          : VIEM_TX_TYPES[Number(request.type)]

        // Signing e.g. a 7702 or blob transaction as 1559 would drop its fields
        if (!type) {
          throw new Error(`Unsupported transaction type ${request.type}`)
        }

        request.type = type
      }

      delete request.gasLimit
      delete request.input
      delete request.from

      const publicClient = getViemPublicClient(chainId, url)
      const prepared = await publicClient.prepareTransactionRequest({
        ...request,
        account: from,
      } as Parameters<typeof publicClient.prepareTransactionRequest>[0])

      // Sent through our RPC: Privy's RPC list only covers eth_sendTransaction
      const fees =
        prepared.maxFeePerGas !== undefined
          ? {
              type: 2,
              maxFeePerGas: toHex(prepared.maxFeePerGas),
              maxPriorityFeePerGas: toHex(prepared.maxPriorityFeePerGas ?? 0n),
            }
          : {
              type: prepared.type === 'eip2930' ? 1 : 0,
              gasPrice: toHex(prepared.gasPrice ?? 0n),
            }
      const accessList =
        fees.type !== 0 && prepared.accessList?.length
          ? { accessList: prepared.accessList }
          : {}

      const signed = await this.request(
        WalletAction.SendEvmTransaction,
        'eth_signTransaction',
        [
          {
            from,
            to: prepared.to,
            chainId: Number(chainId),
            nonce: prepared.nonce,
            value: toHex(prepared.value ?? 0n),
            data: prepared.data,
            gasLimit: toHex(prepared.gas),
            ...fees,
            ...accessList,
          },
        ],
      )

      if (typeof signed !== 'string' || !signed.startsWith('0x')) {
        throw new Error('Privy did not return a signed transaction')
      }

      return await publicClient.sendRawTransaction({
        serializedTransaction: signed as Hex,
      })
    } catch (e) {
      throw this.toWalletException(e, WalletAction.SendEvmTransaction)
    }
  }

  async sendTransaction(
    transaction: TxRaw,
    options: SendTransactionOptions,
  ): Promise<any> {
    const { endpoints, txTimeout, txInclusion, onBroadcast } = options

    if (!endpoints) {
      throw new WalletException(
        new Error(
          'You have to pass endpoints.grpc within the options for using Privy wallet',
        ),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.SendTransaction,
        },
      )
    }

    const txApi = new TxGrpcApi(endpoints.grpc)
    const response = await txApi.broadcast(transaction, {
      txTimeout,
      ...txInclusion,
      onBroadcast,
    })

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
    this.getCheckedAddress(address, WalletAction.SignTransaction)

    let parsedData

    try {
      parsedData = JSON.parse(eip712json)
    } catch {
      throw new WalletException(
        new Error('Failed to parse EIP-712 data: Invalid JSON format'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.SignTransaction,
        },
      )
    }

    if (
      parsedData.domain?.chainId &&
      typeof parsedData.domain.chainId === 'string'
    ) {
      parsedData.domain.chainId = Number(parsedData.domain.chainId)
    }

    // Sign the digest like Turnkey: eth_signTypedData_v4 can reject Injective's domain
    let typedDataHash: Hex

    try {
      typedDataHash = hashTypedData({
        types: parsedData.types,
        domain: parsedData.domain,
        message: parsedData.message,
        primaryType: parsedData.primaryType,
      })
    } catch (e: unknown) {
      throw this.toWalletException(e, WalletAction.SignTransaction)
    }

    const signature = await this.request(
      WalletAction.SignTransaction,
      'secp256k1_sign',
      [typedDataHash],
    )

    return this.normalize(signature, WalletAction.SignTransaction)
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
        contextModule: WalletAction.SignTransaction,
      },
    )
  }

  async signAminoCosmosTransaction(_transaction: {
    address: string
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    throw new WalletException(
      new Error('This wallet does not support signAminoCosmosTransaction'),
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
    const checksumAddress = this.getCheckedAddress(
      signer,
      WalletAction.SignArbitrary,
    )
    const signature = await this.request(
      WalletAction.SignArbitrary,
      'personal_sign',
      [toUtf8(data), checksumAddress],
    )

    return this.normalize(signature, WalletAction.SignArbitrary)
  }

  async getEthereumChainId(): Promise<string> {
    return Promise.resolve(toHex(this.evmOptions.evmChainId))
  }

  async getEvmTransactionReceipt(
    txHash: string,
    evmChainId?: EvmChainId,
  ): Promise<Record<string, any>> {
    const chainId = evmChainId || this.evmOptions.evmChainId
    const url = this.evmOptions.rpcUrls?.[chainId] || this.evmOptions.rpcUrl

    if (!url) {
      throw new WalletException(
        new Error('Please pass rpcUrl within the evmOptions'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetEvmTransactionReceipt,
        },
      )
    }

    let publicClient: ReturnType<typeof getViemPublicClient>

    try {
      publicClient = getViemPublicClient(chainId, url)
    } catch (e: unknown) {
      throw this.toWalletException(e, WalletAction.GetEvmTransactionReceipt)
    }

    try {
      return await publicClient.waitForTransactionReceipt({
        hash: txHash as Hash,
        timeout: 30_000,
        pollingInterval: 3_000,
      })
    } catch {
      throw new WalletException(
        new Error(
          `Failed to retrieve transaction receipt for txHash: ${txHash}`,
        ),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.GetEvmTransactionReceipt,
        },
      )
    }
  }

  async getPubKey(): Promise<string> {
    throw new WalletException(
      new Error('You can only fetch PubKey from Cosmos native wallets'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      },
    )
  }

  public async getEip1193Provider(): Promise<Eip1193Provider> {
    const provider = await this.getProvider(WalletAction.GetAccounts)
    const events = provider as Partial<Eip1193Provider>

    return {
      request: ({ method, params }) => provider.request({ method, params }),
      on: (event, listener) => events.on?.(event, listener),
      removeListener: (event, listener) =>
        events.removeListener?.(event, listener),
    }
  }

  private getPrivyMetadata(action: WalletAction): PrivyMetadata {
    const privy = this.metadata?.privy

    if (!privy?.address || !privy.getProvider) {
      throw new PrivyWalletSessionException(
        new Error('Privy metadata with address and getProvider is required'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: action,
        },
      )
    }

    return privy
  }

  private getCheckedAddress(address: string, action: WalletAction) {
    const privy = this.getPrivyMetadata(action)
    let walletAddress: string
    let requestedAddress: string

    try {
      walletAddress = getAddress(privy.address)
      requestedAddress = getAddress(getEthereumAddress(address))
    } catch (e: unknown) {
      throw this.toWalletException(e, action)
    }

    if (requestedAddress !== walletAddress) {
      throw new WalletException(
        new Error(`Address ${address} is not the connected Privy wallet`),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: action,
        },
      )
    }

    return walletAddress
  }

  private async getProvider(
    action: WalletAction,
  ): Promise<PrivyEip1193Provider> {
    const privy = this.getPrivyMetadata(action)

    try {
      return await privy.getProvider()
    } catch (e: unknown) {
      throw this.toWalletException(e, action)
    }
  }

  private async request(
    action: WalletAction,
    method: string,
    params: unknown[],
  ): Promise<unknown> {
    const provider = await this.getProvider(action)

    try {
      return await provider.request({ method, params })
    } catch (e: unknown) {
      throw this.toWalletException(e, action)
    }
  }

  private normalize(signature: unknown, action: WalletAction) {
    try {
      return normalizeSignature(signature)
    } catch (e: unknown) {
      throw this.toWalletException(e, action)
    }
  }

  private toWalletException(e: unknown, action: WalletAction) {
    // Matched by name too, in case the app loads a second copy of exceptions
    if (
      e instanceof WalletException ||
      e instanceof PrivyWalletSessionException ||
      (e as Error | null)?.name === PrivyWalletSessionException.errorClass
    ) {
      return e as Error
    }

    const message = e instanceof Error ? e.message : String(e)
    // EIP-1193 providers put e.g. 4001 (user rejected) on the error
    const providerCode = (e as { code?: unknown } | null)?.code

    return new WalletException(new Error(message), {
      code: UnspecifiedErrorCode,
      type: ErrorType.WalletError,
      contextModule: action,
      ...(typeof providerCode === 'number'
        ? { contextCode: providerCode }
        : {}),
    })
  }
}
