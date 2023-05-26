import { CONTRACTS } from '@certusone/wormhole-sdk'
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

export interface SolanaNativeTransferMsgArgs
  extends Omit<SolanaTransferMsgArgs, 'tokenAddress'> {
  //
}

export interface EvmTransferMsgArgs extends TransferMsgArgs {
  tokenAddress: string
}

export interface EvmNativeTransferMsgArgs
  extends Omit<EvmTransferMsgArgs, 'tokenAddress'> {
  //
}

export interface InjectiveTransferMsgArgs extends TransferMsgArgs {
  injectiveAddress: string
  tokenAddress: string
}

export type WormholeContractAddresses = typeof CONTRACTS.MAINNET.injective
export type WormholeSolanaContractAddresses = typeof CONTRACTS.MAINNET.solana
export type WormholeArbitrumContractAddresses =
  typeof CONTRACTS.MAINNET.arbitrum
export type WormholeEthereumContractAddresses =
  typeof CONTRACTS.MAINNET.ethereum
export type WormholePolygonContractAddresses = typeof CONTRACTS.MAINNET.polygon
export type WormholeSuiContractAddresses = typeof CONTRACTS.MAINNET.sui
export type WormholeKlaytnContractAddresses = typeof CONTRACTS.MAINNET.klaytn
export type WormholeAptosContractAddresses = typeof CONTRACTS.MAINNET.aptos

export enum WormholeSource {
  Ethereum = 'ethereum',
  Arbitrum = 'arbitrum',
  Solana = 'solana',
  Polygon = 'polygon',
  Sui = 'sui',
  Klaytn = 'klaytn',
  Aptos = 'aptos',
}

export { BaseMessageSignerWalletAdapter }
