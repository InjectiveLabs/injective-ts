import { injective } from 'viem/chains'
import * as viemChains from 'viem/chains'
import { EvmChainId } from '@injectivelabs/ts-types'
import {
  http,
  custom,
  extractChain,
  isAddressEqual,
  createPublicClient,
  createWalletClient,
} from 'viem'
import type {
  Hash,
  Chain,
  Account,
  LocalAccount,
  PublicClient,
  WalletClient,
  TransactionType,
  TransactionRequest,
} from 'viem'
import type { BrowserEip1193Provider } from './../types/provider'

const TRANSACTION_QUANTITY_FIELDS = [
  'value',
  'gas',
  'gasLimit',
  'gasPrice',
  'maxFeePerGas',
  'maxPriorityFeePerGas',
] as const

// viem's names for EIP-2718 transaction types 0 to 4
const TRANSACTION_TYPES: TransactionType[] = [
  'legacy',
  'eip2930',
  'eip1559',
  'eip4844',
  'eip7702',
]

const toQuantity = (field: string, value: unknown) => {
  // BigInt('') is 0n, which would sign a transaction nobody asked for
  if (typeof value === 'string' && value.trim() === '') {
    throw new Error(`Transaction ${field} is empty`)
  }

  // BigInt reads 0x strings as hex and other strings as decimal
  return BigInt(value as string | number | bigint)
}

const toTransactionType = (value: unknown): TransactionType => {
  const type = TRANSACTION_TYPES.includes(value as TransactionType)
    ? (value as TransactionType)
    : // Number('') is 0, which would read an empty type as legacy
      String(value).trim()
      ? TRANSACTION_TYPES[Number(value)]
      : undefined

  if (!type) {
    throw new Error(`Unsupported transaction type ${value}`)
  }

  return type
}

/**
 * Turns a transaction as callers send it (e.g. Web3Broadcaster: null fields,
 * quantities as strings, gasLimit, input) into a viem request for `from`
 */
export const toViemTransactionRequest = (
  transaction: unknown,
  from: string,
): TransactionRequest & { chainId?: number } => {
  const request: Record<string, any> = Object.fromEntries(
    Object.entries(transaction as Record<string, unknown>).filter(
      ([, value]) => value != null,
    ),
  )

  for (const field of TRANSACTION_QUANTITY_FIELDS) {
    if (request[field] !== undefined) {
      request[field] = toQuantity(field, request[field])
    }
  }

  // viem takes these as numbers: a '0x0' string nonce serializes as a non-canonical 0x00
  for (const field of ['nonce', 'chainId'] as const) {
    if (request[field] !== undefined) {
      request[field] = Number(toQuantity(field, request[field]))
    }
  }

  if (request.gasLimit !== undefined) {
    request.gas ??= request.gasLimit
    delete request.gasLimit
  }

  if (request.input !== undefined) {
    request.data ??= request.input
    delete request.input
  }

  if (request.type !== undefined) {
    request.type = toTransactionType(request.type)
  }

  if (
    request.from !== undefined &&
    !isAddressEqual(request.from, from as Hash)
  ) {
    throw new Error(`Transaction is from ${request.from}, not ${from}`)
  }

  delete request.from

  return request as TransactionRequest & { chainId?: number }
}

export const getEvmChainConfig = (chainId: EvmChainId | number): Chain => {
  if (chainId === EvmChainId.DevnetEvm) {
    return {
      id: EvmChainId.DevnetEvm,
      name: 'Injective EVM Devnet',
      nativeCurrency: injective.nativeCurrency,
      rpcUrls: {
        default: {
          http: ['https://devnet.json-rpc.injective.dev'],
        },
      },
      blockExplorers: {
        default: {
          name: '',
          url: '',
        },
      },
      testnet: true,
    } as Chain
  }

  if (chainId === EvmChainId.TestnetEvm) {
    return {
      id: EvmChainId.TestnetEvm,
      name: 'Injective Testnet',
      nativeCurrency: injective.nativeCurrency,
      rpcUrls: {
        default: {
          http: ['https://k8s.testnet.json-rpc.injective.network'],
        },
      },
      blockExplorers: {
        default: {
          name: 'Blockscout',
          url: 'https://testnet.blockscout.injective.network',
        },
      },
      testnet: true,
    } as Chain
  }

  try {
    return extractChain({
      id: chainId,
      chains: Object.values(viemChains) as Chain[],
    })
  } catch {
    throw new Error(`Unsupported chainId: ${chainId}`)
  }
}

export const getViemPublicClient = (
  chainId: EvmChainId | number,
  rpcUrl?: string,
): PublicClient => {
  const chain = getEvmChainConfig(chainId)

  const isEthereumNetwork = (
    [EvmChainId.Mainnet, EvmChainId.Sepolia] as EvmChainId[]
  ).includes(chainId as EvmChainId)

  if (isEthereumNetwork && rpcUrl && !rpcUrl.includes('alchemy')) {
    throw new Error(
      `An Alchemy RPC URL must be provided for EvmChainId ${chainId}`,
    )
  }

  const chainConfig: Chain = rpcUrl
    ? {
        ...chain,
        rpcUrls: {
          default: {
            http: [rpcUrl],
          },
          public: {
            http: [rpcUrl],
          },
        },
      }
    : chain

  return createPublicClient({
    chain: chainConfig,
    transport: rpcUrl ? http(rpcUrl) : http(),
  })
}

export const getViemWalletClient = ({
  chainId,
  account,
  rpcUrl,
}: {
  chainId: EvmChainId | number
  account: Account | LocalAccount | `0x${string}`
  rpcUrl?: string
}): WalletClient => {
  const chain = getEvmChainConfig(chainId)

  const chainConfig: Chain = rpcUrl
    ? {
        ...chain,
        rpcUrls: {
          default: {
            http: [rpcUrl],
          },
          public: {
            http: [rpcUrl],
          },
        },
      }
    : chain

  return createWalletClient({
    chain: chainConfig,
    transport: rpcUrl ? http(rpcUrl) : http(),
    account: typeof account === 'string' ? (account as Hash) : account,
  })
}

export const getViemPublicClientFromEip1193Provider = (
  chainId: EvmChainId | number,
  provider: BrowserEip1193Provider,
): PublicClient => {
  const chain = getEvmChainConfig(chainId)

  return createPublicClient({
    chain,
    transport: custom(provider),
  })
}
