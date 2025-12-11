import { injective } from 'viem/chains'
import * as viemChains from 'viem/chains'
import { EvmChainId } from '@injectivelabs/ts-types'
import {
  http,
  custom,
  extractChain,
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
} from 'viem'
import type { BrowserEip1993Provider } from './../types/provider'

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
  provider: BrowserEip1993Provider,
): PublicClient => {
  const chain = getEvmChainConfig(chainId)

  return createPublicClient({
    chain,
    transport: custom(provider),
  })
}
