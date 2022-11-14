import { CONTRACTS } from '@certusone/wormhole-sdk'
import { ChainId } from '@injectivelabs/ts-types'

export interface TransferMsgArgs {
  address: string
  pubKey: string
  tokenAddress: string
  amount: string
  recipientChainId: ChainId | number | string
  recipient: string /* Injective Address to receive the assets */
  relayerFee: string
  payload?: Uint8Array | null
}

export type WormholeContractAddresses = typeof CONTRACTS.TESTNET.injective
export type WormholeSolanaContractAddresses = typeof CONTRACTS.TESTNET.solana
