import { CONTRACTS } from '@certusone/wormhole-sdk'
import { ChainId } from '@injectivelabs/ts-types'
import { PublicKey } from '@solana/web3.js'

export interface TransferMsgArgs {
  address?: string
  tokenAddress: string
  signerPubKey?: PublicKey
  amount: string
  recipientChainId: ChainId | number | string
  recipient: string /* Injective Address to receive the assets */
  relayerFee?: string
  payload?: Uint8Array | null
}

export type WormholeContractAddresses = typeof CONTRACTS.TESTNET.injective
export type WormholeSolanaContractAddresses = typeof CONTRACTS.TESTNET.solana
export type WormholeEthereumContractAddresses =
  typeof CONTRACTS.TESTNET.ethereum
