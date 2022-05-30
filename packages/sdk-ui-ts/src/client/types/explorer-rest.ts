import { ChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'

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
