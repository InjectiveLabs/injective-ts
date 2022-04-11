/* eslint-disable camelcase */
import { ChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
import {
  BlockWithTxs as BaseBlockWithTxs,
  Transaction as BaseTransaction,
} from '@injectivelabs/explorer-consumer'

export interface UiTransactionMessage {
  type: string
  value: any
}

export interface UiTransaction {
  id: number
  height: number
  result: boolean
  txHash: string
  txType: string
  txFrom: string
  txFromAcc: string
  timestamp: Date
  messages: UiTransactionMessage[]
}

export interface ExplorerApiResponse<T> {
  data: {
    paging: any
    data: T
  }
}

export interface TransactionFromExplorerApiResponse {
  id: string
  block_number: number
  block_timestamp: string
  signatures: Array<{
    pubkey: string
    address: string
    signature: string
    sequence: number
  }>
  tx_type: string
  hash: string
  code: number
  memo?: string
  data?: Uint8Array | string
  info: string
  gas_wanted: number
  gas_used: number
  gas_fee: {
    amount: {
      amount: string
      denom: string
    }[]
    gas_limit: number
    payer: string
    granter: string
  }
  events: Array<any> // TODO
  codespace: string
  messages: Array<{ value: any; type: string }> // TODO
}

export interface BlockFromExplorerApiResponse {
  height: number
  proposer: string
  moniker: string
  block_hash: string
  parent_hash: string
  num_pre_commits: number
  num_txs: number
  total_txs: number
  timestamp: string
  txs: TransactionFromExplorerApiResponse[]
}

export interface ExplorerTransactionApiResponse {
  paging: any
  data: TransactionFromExplorerApiResponse[]
}

export interface ExplorerBlockApiResponse {
  paging: any
  data: BlockFromExplorerApiResponse[]
}

export type NetworkType = {
  display: string
  network: Network
  chainId: ChainId
  baseUrl: string
}

export enum Auction {
  MsgBid = 'MsgBid',
}

export enum Exchange {
  MsgDeposit = 'MsgDeposit',
  MsgWithdraw = 'MsgWithdraw',
  MsgCreateSpotLimitOrder = 'MsgCreateSpotLimitOrder',
  MsgBatchCreateSpotLimitOrders = 'MsgBatchCreateSpotLimitOrders',
  MsgCreateSpotMarketOrder = 'MsgCreateSpotMarketOrder',
  MsgCancelSpotOrder = 'MsgCancelSpotOrder',
  MsgBatchCancelSpotOrders = 'MsgBatchCancelSpotOrders',
  MsgCreateDerivativeLimitOrder = 'MsgCreateDerivativeLimitOrder',
  MsgBatchCreateDerivativeLimitOrders = 'MsgBatchCreateDerivativeLimitOrders',
  MsgCreateDerivativeMarketOrder = 'MsgCreateDerivativeMarketOrder',
  MsgCancelDerivativeOrder = 'MsgCancelDerivativeOrder',
  MsgBatchCancelDerivativeOrders = 'MsgBatchCancelDerivativeOrders',
  MsgSubaccountTransfer = 'MsgSubaccountTransfer',
  MsgExternalTransfer = 'MsgExternalTransfer',
  MsgIncreasePositionMargin = 'MsgIncreasePositionMargin',
  MsgLiquidatePosition = 'MsgLiquidatePosition',
  MsgInstantSpotMarketLaunch = 'MsgInstantSpotMarketLaunch',
  MsgInstantPerpetualMarketLaunch = 'MsgInstantPerpetualMarketLaunch',
  MsgInstantExpiryFuturesMarketLaunch = 'MsgInstantExpiryFuturesMarketLaunch',
}

export enum Insurance {
  MsgCreateInsuranceFund = 'MsgCreateInsuranceFund',
  MsgUnderwrite = 'MsgUnderwrite',
  MsgRequestRedemption = 'MsgRequestRedemption',
}

export enum Oracle {
  MsgRelayPriceFeedPrice = 'MsgRelayPriceFeedPrice',
  MsgRelayBandRates = 'MsgRelayBandRates',
  MsgRelayCoinbaseMessages = 'MsgRelayCoinbaseMessages',
}

export enum Peggy {
  MsgValsetConfirm = 'MsgValsetConfirm',
  MsgSendToEth = 'MsgSendToEth',
  MsgRequestBatch = 'MsgRequestBatch',
  MsgConfirmBatch = 'MsgConfirmBatch',
  MsgSetOrchestratorAddresses = 'MsgSetOrchestratorAddresses',
  MsgERC20DeployedClaim = 'MsgERC20DeployedClaim',
  MsgDepositClaim = 'MsgDepositClaim',
  MsgWithdrawClaim = 'MsgWithdrawClaim',
  MsgCancelSendToEth = 'MsgCancelSendToEth',
  MsgValsetUpdatedClaim = 'MsgValsetUpdatedClaim',
  MsgSubmitBadSignatureEvidence = 'MsgSubmitBadSignatureEvidence',
}

export const MessageTypeList = Object.values({
  ...Auction,
  ...Exchange,
  ...Insurance,
  ...Oracle,
  ...Peggy,
})

export type MessageType = Auction | Exchange | Insurance | Oracle | Peggy

export enum EventTypes {
  Transfer = 'transfer',
}

export enum Module {
  Auction = 'Auction',
  Exchange = 'Exchange',
  Insurance = 'Insurance',
  Oracle = 'Oracle',
  Peggy = 'Peggy',
}

export enum TransactionFilterType {
  Module = 'module',
  MessageType = 'message type',
}

export interface Message {
  type: string
  message: any
}

export interface Transaction extends Omit<BaseTransaction, 'messages'> {
  memo: string
  messages: Message[]
  parsedMessages?: Message[]
}

export type TransactionListItem = {
  key: number
  list: Transaction[]
}

export interface BlockWithTxs extends Omit<BaseBlockWithTxs, 'txs'> {
  txs: Transaction[]
}

export { BaseTransaction }
