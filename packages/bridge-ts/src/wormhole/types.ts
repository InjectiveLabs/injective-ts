import { CONTRACTS } from '@injectivelabs/wormhole-sdk'
import { ChainId } from '@injectivelabs/ts-types'
import { PublicKey } from '@solana/web3.js'
import { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base'

export interface TransferMsgArgs {
  amount: string
  recipient: string
  recipientChainId: ChainId | number | string
  relayerFee?: string
  payload?: Uint8Array | null
}

/* The recipient is the Injective Address that receives the assets */
export interface SolanaTransferMsgArgs extends TransferMsgArgs {
  tokenAddress: string
  signerPubKey?: PublicKey
}

export interface SolanaNativeSolTransferMsgArgs
  extends Omit<SolanaTransferMsgArgs, 'tokenAddress'> {
  signerPubKey?: PublicKey
}

export interface EthereumTransferMsgArgs extends TransferMsgArgs {
  tokenAddress: string
}

export interface InjectiveTransferMsgArgs extends TransferMsgArgs {
  injectiveAddress: string
  tokenAddress: string
  chainId: string
}

export type WormholeContractAddresses = typeof CONTRACTS.TESTNET.injective
export type WormholeSolanaContractAddresses = typeof CONTRACTS.TESTNET.solana
export type WormholeEthereumContractAddresses =
  typeof CONTRACTS.TESTNET.ethereum

export enum WormholeSource {
  Ethereum = 'ethereum',
  Solana = 'solana',
}

export { BaseMessageSignerWalletAdapter }
