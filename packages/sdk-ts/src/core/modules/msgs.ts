// auction
import type MsgBid from './auction/msgs/MsgBid.js'

// authz
import type MsgGrant from './authz/msgs/MsgGrant.js'
import type MsgRevoke from './authz/msgs/MsgRevoke.js'
import type MsgAuthzExec from './authz/msgs/MsgExec.js'
import type MsgGrantWithAuthorization from './authz/msgs/MsgGrantWithAuthorization.js'

// bank
import type MsgSend from './bank/msgs/MsgSend.js'
import type MsgMultiSend from './bank/msgs/MsgMultiSend.js'

// distribution
import type MsgFundCommunityPool from './distribution/msgs/MsgFundCommunityPool.js'
import type MsgWithdrawDelegatorReward from './distribution/msgs/MsgWithdrawDelegatorReward.js'
import type MsgWithdrawValidatorCommission from './distribution/msgs/MsgWithdrawValidatorCommission.js'

// exchange
import type MsgDeposit from './exchange/msgs/MsgDeposit.js'
import type MsgSignData from './exchange/msgs/MsgSignData.js'
import type MsgWithdraw from './exchange/msgs/MsgWithdraw.js'
import type MsgRewardsOptOut from './exchange/msgs/MsgRewardsOptOut.js'
import type MsgCancelSpotOrder from './exchange/msgs/MsgCancelSpotOrder.js'
import type MsgExternalTransfer from './exchange/msgs/MsgExternalTransfer.js'
import type MsgBatchUpdateOrders from './exchange/msgs/MsgBatchUpdateOrders.js'
import type MsgLiquidatePosition from './exchange/msgs/MsgLiquidatePosition.js'
import type MsgReclaimLockedFunds from './exchange/msgs/MsgReclaimLockedFunds.js'
import type MsgAuthorizeStakeGrants from './exchange/msgs/MsgAuthorizeStakeGrants.js'
import type MsgCreateSpotLimitOrder from './exchange/msgs/MsgCreateSpotLimitOrder.js'
import type MsgBatchCancelSpotOrders from './exchange/msgs/MsgBatchCancelSpotOrders.js'
import type MsgCancelDerivativeOrder from './exchange/msgs/MsgCancelDerivativeOrder.js'
import type MsgCreateSpotMarketOrder from './exchange/msgs/MsgCreateSpotMarketOrder.js'
import type MsgIncreasePositionMargin from './exchange/msgs/MsgIncreasePositionMargin.js'
import type MsgInstantSpotMarketLaunch from './exchange/msgs/MsgInstantSpotMarketLaunch.js'
import type MsgCancelBinaryOptionsOrder from './exchange/msgs/MsgCancelBinaryOptionsOrder.js'
import type MsgCreateDerivativeLimitOrder from './exchange/msgs/MsgCreateDerivativeLimitOrder.js'
import type MsgBatchCancelDerivativeOrders from './exchange/msgs/MsgBatchCancelDerivativeOrders.js'
import type MsgCreateDerivativeMarketOrder from './exchange/msgs/MsgCreateDerivativeMarketOrder.js'
import type MsgCreateBinaryOptionsLimitOrder from './exchange/msgs/MsgCreateBinaryOptionsLimitOrder.js'
import type MsgAdminUpdateBinaryOptionsMarket from './exchange/msgs/MsgAdminUpdateBinaryOptionsMarket.js'
import type MsgBatchCancelBinaryOptionsOrders from './exchange/msgs/MsgBatchCancelBinaryOptionsOrders.js'
import type MsgCreateBinaryOptionsMarketOrder from './exchange/msgs/MsgCreateBinaryOptionsMarketOrder.js'
import type MsgSetDelegationTransferReceivers from './exchange/msgs/MsgSetDelegationTransferReceivers.js'

// exchange v2
import type MsgUpdateSpotMarketV2 from './exchange/msgs/MsgUpdateSpotMarketV2.js'
import type MsgUpdateDerivativeMarketV2 from './exchange/msgs/MsgUpdateDerivativeMarketV2.js'

// feegrant
import type MsgGrantAllowance from './feegrant/msgs/MsgGrantAllowance.js'
import type MsgRevokeAllowance from './feegrant/msgs/MsgRevokeAllowance.js'

// gov
import type MsgVote from './gov/msgs/MsgVote.js'
import type { MsgSubmitProposal } from './gov/index.js'
import type MsgGovDeposit from './gov/msgs/MsgDeposit.js'

// ibc
import type MsgTransfer from './ibc/msgs/MsgTransfer.js'

// insurance
import type MsgUnderwrite from './insurance/msgs/MsgUnderwrite.js'
import type MsgRequestRedemption from './insurance/msgs/MsgRequestRedemption.js'
import type MsgCreateInsuranceFund from './insurance/msgs/MsgCreateInsuranceFund.js'

// peggy
import type MsgSendToEth from './peggy/msgs/MsgSendToEth.js'

// staking
import type MsgDelegate from './staking/msgs/MsgDelegate.js'
import type MsgUndelegate from './staking/msgs/MsgUndelegate.js'
import type MsgEditValidator from './staking/msgs/MsgEditValidator.js'
import type MsgBeginRedelegate from './staking/msgs/MsgBeginRedelegate.js'
import type MsgCreateValidator from './staking/msgs/MsgCreateValidator.js'
import type MsgTransferDelegation from './staking/msgs/MsgTransferDelegation.js'
import type MsgCancelUnbondingDelegation from './staking/msgs/MsgCancelUnbondingDelegation.js'

// tokenfactory
import type MsgBurn from './tokenfactory/msgs/MsgBurn.js'
import type MsgMint from './tokenfactory/msgs/MsgMint.js'
import type MsgChangeAdmin from './tokenfactory/msgs/MsgChangeAdmin.js'
import type MsgCreateDenom from './tokenfactory/msgs/MsgCreateDenom.js'
import type MsgSetDenomMetadata from './tokenfactory/msgs/MsgSetDenomMetadata.js'

// wasm
import type MsgStoreCode from './wasm/msgs/MsgStoreCode.js'
import type MsgUpdateAdmin from './wasm/msgs/MsgUpdateAdmin.js'
import type MsgExec from './wasm/msgs/MsgPrivilegedExecuteContract.js'
import type MsgExecuteContract from './wasm/msgs/MsgExecuteContract.js'
import type MsgMigrateContract from './wasm/msgs/MsgMigrateContract.js'
import type MsgInstantiateContract from './wasm/msgs/MsgInstantiateContract.js'
import type MsgExecuteContractCompat from './wasm/msgs/MsgExecuteContractCompat.js'

export type AuctionMsgs = MsgBid

export type AuthzMsgs =
  | MsgGrant
  | MsgRevoke
  | MsgAuthzExec
  | MsgGrantWithAuthorization

export type BankMsgs = MsgSend | MsgMultiSend

export type DistributionMsgs =
  | MsgFundCommunityPool
  | MsgWithdrawDelegatorReward
  | MsgWithdrawValidatorCommission

export type ExchangeV1Msgs =
  | MsgDeposit
  | MsgSignData
  | MsgWithdraw
  | MsgRewardsOptOut
  | MsgCancelSpotOrder
  | MsgExternalTransfer
  | MsgBatchUpdateOrders
  | MsgLiquidatePosition
  | MsgReclaimLockedFunds
  | MsgAuthorizeStakeGrants
  | MsgCreateSpotLimitOrder
  | MsgBatchCancelSpotOrders
  | MsgCancelDerivativeOrder
  | MsgCreateSpotMarketOrder
  | MsgIncreasePositionMargin
  | MsgInstantSpotMarketLaunch
  | MsgCancelBinaryOptionsOrder
  | MsgCreateDerivativeLimitOrder
  | MsgBatchCancelDerivativeOrders
  | MsgCreateDerivativeMarketOrder
  | MsgCreateBinaryOptionsLimitOrder
  | MsgAdminUpdateBinaryOptionsMarket
  | MsgBatchCancelBinaryOptionsOrders
  | MsgCreateBinaryOptionsMarketOrder
  | MsgSetDelegationTransferReceivers

export type ExchangeV2Msgs = MsgUpdateSpotMarketV2 | MsgUpdateDerivativeMarketV2

export type FeegrantMsgs = MsgGrantAllowance | MsgRevokeAllowance

export type GovMsgs = MsgVote | MsgSubmitProposal | MsgGovDeposit

export type IbcMsgs = MsgTransfer

export type InsuranceMsgs =
  | MsgUnderwrite
  | MsgRequestRedemption
  | MsgCreateInsuranceFund

export type PeggyMsgs = MsgSendToEth

export type StakingMsgs =
  | MsgDelegate
  | MsgUndelegate
  | MsgEditValidator
  | MsgBeginRedelegate
  | MsgCreateValidator
  | MsgTransferDelegation
  | MsgCancelUnbondingDelegation

export type TokenFactoryMsgs =
  | MsgBurn
  | MsgMint
  | MsgChangeAdmin
  | MsgCreateDenom
  | MsgSetDenomMetadata

export type WasmMsgs =
  | MsgStoreCode
  | MsgUpdateAdmin
  | MsgExec
  | MsgExecuteContract
  | MsgMigrateContract
  | MsgInstantiateContract
  | MsgExecuteContractCompat

export type Msgs =
  | AuctionMsgs
  | AuthzMsgs
  | BankMsgs
  | DistributionMsgs
  | ExchangeV1Msgs
  | ExchangeV2Msgs
  | FeegrantMsgs
  | GovMsgs
  | IbcMsgs
  | InsuranceMsgs
  | PeggyMsgs
  | StakingMsgs
  | TokenFactoryMsgs
  | WasmMsgs

export type ExchangeMsgs = ExchangeV1Msgs | ExchangeV2Msgs
