import { binaryToBase64 } from '@injectivelabs/sdk-ts'
import { Network } from '@injectivelabs/networks'
import { Connection } from '@solana/web3.js'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  TransferMsgArgs,
  WormholeContractAddresses,
  WormholeEthereumContractAddresses,
  WormholeSolanaContractAddresses,
} from './types'
import {
  WORMHOLE_CONTRACT_BY_NETWORK,
  WORMHOLE_ETHEREUM_CONTRACT_BY_NETWORK,
  WORMHOLE_SOLANA_CONTRACT_BY_NETWORK,
} from './constants'

export const createTransferContractMsgExec = (
  args: TransferMsgArgs,
  info: Record<string, any>,
) => {
  const nonce = Math.round(Math.random() * 100000)

  return {
    nonce,
    asset: {
      amount: args.amount,
      info,
    },
    recipient_chain: args.recipientChainId,
    recipient: binaryToBase64(args.recipient),
    fee: args.relayerFee || '0',
    ...(args.payload && { payload: binaryToBase64(args.payload) }),
  }
}

export const getSolanaTransactionInfo = async (
  transactionId: string,
  connection: Connection,
) => {
  const POLL_INTERVAL = 1000
  const timeout = 300000

  for (let i = 0; i <= timeout / POLL_INTERVAL; i += 1) {
    try {
      const txResponse = await connection.getTransaction(transactionId)

      if (txResponse) {
        return txResponse
      }
    } catch (error: any) {
      //
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
  }

  return null
}

export const getEthereumContractAddresses = (network: Network) => {
  const ethereumContractAddresses = (
    WORMHOLE_ETHEREUM_CONTRACT_BY_NETWORK as {
      [key: string]: WormholeEthereumContractAddresses
    }
  )[network] as WormholeEthereumContractAddresses

  const contractAddresses = (
    WORMHOLE_CONTRACT_BY_NETWORK as {
      [key: string]: WormholeContractAddresses
    }
  )[network] as WormholeContractAddresses

  if (!contractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Injective not found`),
    )
  }

  if (!ethereumContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Solana not found`),
    )
  }

  if (!contractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Injective not found`),
    )
  }

  if (!ethereumContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Ethereum not found`),
    )
  }

  return {
    contractAddresses,
    ethereumContractAddresses,
  }
}

export const getSolanaContractAddresses = (network: Network) => {
  const solanaContractAddresses = (
    WORMHOLE_SOLANA_CONTRACT_BY_NETWORK as {
      [key: string]: WormholeSolanaContractAddresses
    }
  )[network] as WormholeSolanaContractAddresses

  const contractAddresses = (
    WORMHOLE_CONTRACT_BY_NETWORK as {
      [key: string]: WormholeContractAddresses
    }
  )[network] as WormholeContractAddresses

  if (!contractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Injective not found`),
    )
  }

  if (!solanaContractAddresses) {
    throw new GeneralException(
      new Error(`Contracts for ${network} on Solana not found`),
    )
  }

  if (!contractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Injective not found`),
    )
  }

  if (!solanaContractAddresses.token_bridge) {
    throw new GeneralException(
      new Error(`Token Bridge Address for ${network} on Solana not found`),
    )
  }

  return {
    contractAddresses,
    solanaContractAddresses,
  }
}
