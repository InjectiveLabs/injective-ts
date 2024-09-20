import { CONTRACTS, ChainId } from '@injectivelabs/wormhole-sdk'
import { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base'
import { ethers } from 'ethers'
import { TxResponse, MsgExecuteContractCompat } from '@injectivelabs/sdk-ts'
import { TransactionResponse, Transaction } from '@solana/web3.js'

export interface TransferMsgArgs {
  amount: string
  signer?: string
  tokenAddress?: string
  recipient: string
  relayerFee?: string
  payload?: Uint8Array | null
}

export type WormholeContractAddresses = typeof CONTRACTS.MAINNET.injective
export type WormholeWormchainContractAddresses =
  typeof CONTRACTS.MAINNET.wormchain
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
  Wormchain = 'wormchain',
  Injective = 'injective',
}

export interface WormholeClient<
  T extends
    | (ethers.ContractReceipt & {
        txHash: string
      })
    | TxResponse
    | TransactionResponse,
  R extends Transaction | MsgExecuteContractCompat | ethers.ContractReceipt,
> {
  getAddress: () => Promise<string>
  getBalance: (address: string, tokenAddress?: string) => Promise<string>
  transfer: (args: TransferMsgArgs) => Promise<T>
  getSignedVAA: (tx: T) => Promise<string /* base 64 */>
  getTxResponse: (txHash: string) => Promise<T>
  getIsTransferCompleted: (
    signedVAA: string /* in base 64 */,
  ) => Promise<boolean>
  getIsTransferCompletedRetry: (
    signedVAA: string /* in base 64 */,
  ) => Promise<boolean>
  redeem: ({
    signedVAA,
    recipient,
  }: {
    signedVAA: string /* base64 */
    recipient: string
  }) => Promise<R>
  redeemNative: ({
    signedVAA,
    recipient,
  }: {
    signedVAA: string /* base64 */
    recipient: string
  }) => Promise<R>
  getForeignAsset: (
    originChain: ChainId,
    originAsset: string,
  ) => Promise<string>
}

export { BaseMessageSignerWalletAdapter }
