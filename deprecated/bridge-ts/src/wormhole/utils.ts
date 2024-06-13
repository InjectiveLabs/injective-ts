import { Network } from '@injectivelabs/networks'
import { PublicKey as SolanaPublicKey } from '@solana/web3.js'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  WormholeSource,
  WormholeContractAddresses,
  WormholeSuiContractAddresses,
  WormholeAptosContractAddresses,
  WormholeKlaytnContractAddresses,
  WormholeSolanaContractAddresses,
  WormholeArbitrumContractAddresses,
  WormholeEthereumContractAddresses,
  WormholeWormchainContractAddresses,
  WormholePolygonContractAddresses,
} from './types'
import {
  WORMHOLE_CHAINS,
  WORMHOLE_CONTRACT_BY_NETWORK,
  WORMHOLE_NATIVE_WRAPPED_ADDRESS,
  WORMHOLE_SUI_CONTRACT_BY_NETWORK,
  WORMHOLE_APTOS_CONTRACT_BY_NETWORK,
  WORMHOLE_SOLANA_CONTRACT_BY_NETWORK,
  WORMHOLE_KLAYTN_CONTRACT_BY_NETWORK,
  WORMHOLE_POLYGON_CONTRACT_BY_NETWORK,
  WORMHOLE_ARBITRUM_CONTRACT_BY_NETWORK,
  WORMHOLE_WORMCHAIN_CONTRACT_BY_NETWORK,
  WORMHOLE_ETHEREUM_CONTRACT_BY_NETWORK,
} from './constants'
import { arrayify, zeroPad } from 'ethers/lib/utils'
import { Provider } from './clients'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import { Signer } from '@wormhole-foundation/sdk'
import { evm } from '@wormhole-foundation/sdk/evm'
import { signSendAndConfirmTransactionUnsigned } from './solana'

export const getEthereumContractAddresses = (network: Network) => {
  const associatedChainContractAddresses =
    WORMHOLE_ETHEREUM_CONTRACT_BY_NETWORK(
      network,
    ) as WormholeEthereumContractAddresses
  const injectiveContractAddresses = WORMHOLE_CONTRACT_BY_NETWORK(
    network,
  ) as WormholeContractAddresses

  if (!injectiveContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Solana not found`),
    )
  }

  if (!injectiveContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Ethereum not found`),
    )
  }

  return {
    injectiveContractAddresses,
    associatedChainContractAddresses,
  }
}

export const getSolanaContractAddresses = (network: Network) => {
  const associatedChainContractAddresses = WORMHOLE_SOLANA_CONTRACT_BY_NETWORK(
    network,
  ) as WormholeSolanaContractAddresses
  const injectiveContractAddresses = WORMHOLE_CONTRACT_BY_NETWORK(
    network,
  ) as WormholeContractAddresses

  if (!injectiveContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Solana not found`),
    )
  }

  if (!injectiveContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Solana not found`),
    )
  }

  return {
    injectiveContractAddresses,
    associatedChainContractAddresses,
  }
}

export const getArbitrumContractAddresses = (network: Network) => {
  const associatedChainContractAddresses =
    WORMHOLE_ARBITRUM_CONTRACT_BY_NETWORK(
      network,
    ) as WormholeArbitrumContractAddresses
  const injectiveContractAddresses = WORMHOLE_CONTRACT_BY_NETWORK(
    network,
  ) as WormholeContractAddresses

  if (!injectiveContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Arbitrum not found`),
    )
  }

  if (!injectiveContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Arbitrum not found`),
    )
  }

  return {
    injectiveContractAddresses,
    associatedChainContractAddresses,
  }
}

export const getPolygonContractAddresses = (network: Network) => {
  const associatedChainContractAddresses = WORMHOLE_POLYGON_CONTRACT_BY_NETWORK(
    network,
  ) as WormholePolygonContractAddresses
  const injectiveContractAddresses = WORMHOLE_CONTRACT_BY_NETWORK(
    network,
  ) as WormholeContractAddresses

  if (!injectiveContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Polygon not found`),
    )
  }

  if (!injectiveContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Polygon not found`),
    )
  }

  return {
    injectiveContractAddresses,
    associatedChainContractAddresses,
  }
}

export const getSuiContractAddresses = (network: Network) => {
  const associatedChainContractAddresses = WORMHOLE_SUI_CONTRACT_BY_NETWORK(
    network,
  ) as WormholeSuiContractAddresses
  const injectiveContractAddresses = WORMHOLE_CONTRACT_BY_NETWORK(
    network,
  ) as WormholeContractAddresses

  if (!injectiveContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Sui not found`),
    )
  }

  if (!injectiveContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Sui not found`),
    )
  }

  return {
    injectiveContractAddresses,
    associatedChainContractAddresses,
  }
}

export const getKlaytnContractAddresses = (network: Network) => {
  const associatedChainContractAddresses = WORMHOLE_KLAYTN_CONTRACT_BY_NETWORK(
    network,
  ) as WormholeKlaytnContractAddresses
  const injectiveContractAddresses = WORMHOLE_CONTRACT_BY_NETWORK(
    network,
  ) as WormholeContractAddresses

  if (!injectiveContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Klaytn not found`),
    )
  }

  if (!injectiveContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Klaytn not found`),
    )
  }

  return {
    injectiveContractAddresses,
    associatedChainContractAddresses,
  }
}

export const getAptosContractAddresses = (network: Network) => {
  const associatedChainContractAddresses = WORMHOLE_APTOS_CONTRACT_BY_NETWORK(
    network,
  ) as WormholeAptosContractAddresses
  const injectiveContractAddresses = WORMHOLE_CONTRACT_BY_NETWORK(
    network,
  ) as WormholeContractAddresses

  if (!injectiveContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Aptos not found`),
    )
  }

  if (!injectiveContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Aptos not found`),
    )
  }

  return {
    injectiveContractAddresses,
    associatedChainContractAddresses,
  }
}

export const getWormchainContractAddresses = (network: Network) => {
  const associatedChainContractAddresses =
    WORMHOLE_WORMCHAIN_CONTRACT_BY_NETWORK(
      network,
    ) as WormholeWormchainContractAddresses
  const injectiveContractAddresses = WORMHOLE_CONTRACT_BY_NETWORK(
    network,
  ) as WormholeContractAddresses

  if (!injectiveContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Wormchain not found`),
    )
  }

  if (!injectiveContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Injective not found`),
    )
  }

  if (!associatedChainContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Wormchain not found`),
    )
  }

  return {
    injectiveContractAddresses,
    associatedChainContractAddresses,
  }
}

export const getContractAddresses = (
  network: Network,
  source: WormholeSource = WormholeSource.Solana,
) => {
  switch (source) {
    case WormholeSource.Solana:
      return getSolanaContractAddresses(network)
    case WormholeSource.Ethereum:
      return getEthereumContractAddresses(network)
    case WormholeSource.Arbitrum:
      return getArbitrumContractAddresses(network)
    case WormholeSource.Sui:
      return getSuiContractAddresses(network)
    case WormholeSource.Polygon:
      return getPolygonContractAddresses(network)
    case WormholeSource.Klaytn:
      return getKlaytnContractAddresses(network)
    case WormholeSource.Aptos:
      return getAptosContractAddresses(network)
    case WormholeSource.Wormchain:
      return getWormchainContractAddresses(network)
    default:
      return getSolanaContractAddresses(network)
  }
}

export const getAssociatedChain = (
  source: WormholeSource = WormholeSource.Solana,
) => {
  switch (source) {
    case WormholeSource.Solana:
      return WORMHOLE_CHAINS.solana
    case WormholeSource.Ethereum:
      return WORMHOLE_CHAINS.ethereum
    case WormholeSource.Arbitrum:
      return WORMHOLE_CHAINS.arbitrum
    case WormholeSource.Sui:
      return WORMHOLE_CHAINS.sui
    case WormholeSource.Polygon:
      return WORMHOLE_CHAINS.polygon
    case WormholeSource.Klaytn:
      return WORMHOLE_CHAINS.klaytn
    case WormholeSource.Aptos:
      return WORMHOLE_CHAINS.aptos
    case WormholeSource.Wormchain:
      return WORMHOLE_CHAINS.wormchain
    default:
      return WORMHOLE_CHAINS.solana
  }
}

export const getAssociatedChainName = (
  source: WormholeSource = WormholeSource.Solana,
) => {
  switch (source) {
    case WormholeSource.Solana:
      return 'Solana'
    case WormholeSource.Ethereum:
      return 'Ethereum'
    case WormholeSource.Arbitrum:
      return 'Arbitrum'
    case WormholeSource.Polygon:
      return 'Polygon'
    default:
      return 'Solana'
  }
}

export const getAssociatedChainRecipient = (
  recipient: string,
  source: WormholeSource = WormholeSource.Solana,
) => {
  switch (source) {
    case WormholeSource.Solana:
      return new SolanaPublicKey(recipient).toString()
    case WormholeSource.Ethereum:
      return recipient /* Hex Ethereum Address */
    case WormholeSource.Arbitrum:
      return recipient /* Hex Address */
    case WormholeSource.Polygon:
      return recipient /* Hex Address */
    case WormholeSource.Klaytn:
      return recipient /* Hex Address */
    case WormholeSource.Aptos:
      throw Error('Aptos not yet implemented')
    case WormholeSource.Sui:
      throw Error('Sui not yet implemented')
    case WormholeSource.Wormchain:
      return Buffer.from(recipient).toString('base64')
    default:
      return new SolanaPublicKey(recipient).toString()
  }
}

export const getAssociatedChainRecipientIbc = (
  recipient: string,
  source: WormholeSource = WormholeSource.Solana,
) => {
  switch (source) {
    case WormholeSource.Solana:
      const addr =
        typeof recipient === 'string' && recipient.startsWith('0x')
          ? arrayify(recipient)
          : recipient

      return arrayify(zeroPad(new SolanaPublicKey(addr).toBytes(), 32))

    case WormholeSource.Ethereum:
      return arrayify(Buffer.from(zeroPad(recipient, 32)))
    case WormholeSource.Arbitrum:
      return arrayify(Buffer.from(zeroPad(recipient, 32)))
    case WormholeSource.Polygon:
      return arrayify(Buffer.from(zeroPad(recipient, 32)))
    case WormholeSource.Klaytn:
      return arrayify(Buffer.from(zeroPad(recipient, 32)))
    case WormholeSource.Aptos:
      throw Error('Aptos not yet implemented')
    case WormholeSource.Sui:
      throw Error('Sui not yet implemented')
    case WormholeSource.Wormchain:
      return arrayify(Buffer.from(recipient))
    default:
      throw Error('Default Not yet implemented')
  }
}

export const getEvmNativeAddress = (
  network: Network,
  source: WormholeSource = WormholeSource.Ethereum,
) => {
  const addresses = WORMHOLE_NATIVE_WRAPPED_ADDRESS(network)

  if (source === WormholeSource.Ethereum) {
    if (!addresses.ethereum) {
      throw new GeneralException(
        new Error(`Ethereum native address for ${network} not found`),
      )
    }

    return addresses.ethereum
  }

  if (source === WormholeSource.Polygon) {
    if (!addresses.polygon) {
      throw new GeneralException(
        new Error(`Polygon native address for ${network} not found`),
      )
    }

    return addresses.polygon
  }

  throw new GeneralException(
    new Error(`Native address for ${network} and ${source} not found`),
  )
}

export const getEvmChainName = (chainId: number) => {
  switch (chainId) {
    case 1:
      return 'Ethereum'
    case 42161:
      return 'Arbitrum'
    case 137:
      return 'Polygon'
    default:
      return 'Ethereum'
  }
}

export const getAssociatedChainSigner = async ({
  source = WormholeSource.Solana,
  provider,
  address,
  rpc,
}: {
  source: WormholeSource
  provider: Provider | PhantomWalletAdapter
  address: string
  rpc: string
}): Promise<
  Signer<
    'Mainnet',
    'Solana' | 'Ethereum' | 'Polygon' | 'Arbitrum' | 'Injective'
  >
> => {
  if (source === WormholeSource.Solana) {
    const actualProvider = provider as PhantomWalletAdapter

    return {
      address: () => {
        return address
      },
      chain: () => {
        return 'Solana'
      },
      signAndSend: async (transactions) => {
        const txHashes = []

        for (const transaction of transactions) {
          const response = await signSendAndConfirmTransactionUnsigned({
            provider: actualProvider,
            transaction: transaction,
            solanaHostUrl: rpc,
          })

          txHashes.push(response.txHash)
        }

        return txHashes
      },
    }
  }

  const chainName = getAssociatedChainName(source)
  const actualProvider = await (provider as Provider)()
  const signer = actualProvider.getSigner() as any
  const evmSigner = await evm.getEvmSignerForSigner(chainName as any, signer)

  return evmSigner as Signer<
    'Mainnet',
    'Solana' | 'Ethereum' | 'Polygon' | 'Arbitrum'
  >
}
