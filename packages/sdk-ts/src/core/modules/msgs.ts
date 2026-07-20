import type MsgVote from './gov/msgs/MsgVote.js'
import type MsgSend from './bank/msgs/MsgSend.js'
import type MsgBid from './auction/msgs/MsgBid.js'
import type MsgGrant from './authz/msgs/MsgGrant.js'
import type MsgRevoke from './authz/msgs/MsgRevoke.js'
import type { MsgSubmitProposal } from './gov/index.js'
import type MsgAuthzExec from './authz/msgs/MsgExec.js'
import type MsgTransfer from './ibc/msgs/MsgTransfer.js'
import type MsgGovDeposit from './gov/msgs/MsgDeposit.js'
import type MsgBurn from './tokenfactory/msgs/MsgBurn.js'
import type MsgMint from './tokenfactory/msgs/MsgMint.js'
import type MsgMultiSend from './bank/msgs/MsgMultiSend.js'
import type MsgDeposit from './exchange/msgs/MsgDeposit.js'
import type MsgStoreCode from './wasm/msgs/MsgStoreCode.js'
import type MsgSendToEth from './peggy/msgs/MsgSendToEth.js'
import type MsgDelegate from './staking/msgs/MsgDelegate.js'
import type MsgSignData from './exchange/msgs/MsgSignData.js'
import type MsgWithdraw from './exchange/msgs/MsgWithdraw.js'
import type MsgUpdateAdmin from './wasm/msgs/MsgUpdateAdmin.js'
import type MsgUndelegate from './staking/msgs/MsgUndelegate.js'
import type MsgUnderwrite from './insurance/msgs/MsgUnderwrite.js'
import type MsgEditValidator from './staking/msgs/MsgEditValidator.js'
import type MsgExec from './wasm/msgs/MsgPrivilegedExecuteContract.js'
import type MsgRewardsOptOut from './exchange/msgs/MsgRewardsOptOut.js'
import type MsgChangeAdmin from './tokenfactory/msgs/MsgChangeAdmin.js'
import type MsgCreateDenom from './tokenfactory/msgs/MsgCreateDenom.js'
import type MsgExecuteContract from './wasm/msgs/MsgExecuteContract.js'
import type MsgMigrateContract from './wasm/msgs/MsgMigrateContract.js'
import type MsgCreateRateLimit from './peggy/msgs/MsgCreateRateLimit.js'
import type MsgUpdateRateLimit from './peggy/msgs/MsgUpdateRateLimit.js'
import type MsgRemoveRateLimit from './peggy/msgs/MsgRemoveRateLimit.js'
import type MsgCreateTokenPair from './erc20/msgs/MsgCreateTokenPair.js'
import type MsgGrantAllowance from './feegrant/msgs/MsgGrantAllowance.js'
import type MsgBeginRedelegate from './staking/msgs/MsgBeginRedelegate.js'
import type MsgCreateValidator from './staking/msgs/MsgCreateValidator.js'
import type MsgCancelSpotOrder from './exchange/msgs/MsgCancelSpotOrder.js'
import type MsgRevokeAllowance from './feegrant/msgs/MsgRevokeAllowance.js'
import type MsgExternalTransfer from './exchange/msgs/MsgExternalTransfer.js'
import type MsgBatchUpdateOrders from './exchange/msgs/MsgBatchUpdateOrders.js'
import type MsgLiquidatePosition from './exchange/msgs/MsgLiquidatePosition.js'
import type MsgInstantiateContract from './wasm/msgs/MsgInstantiateContract.js'
import type MsgRequestRedemption from './insurance/msgs/MsgRequestRedemption.js'
import type MsgTransferDelegation from './staking/msgs/MsgTransferDelegation.js'
import type MsgRelayProviderPrices from './oracle/msgs/MsgRelayProviderPrices.js'
import type MsgReclaimLockedFunds from './exchange/msgs/MsgReclaimLockedFunds.js'
import type MsgUpdateSpotMarketV2 from './exchange/msgs/MsgUpdateSpotMarketV2.js'
import type MsgSetDenomMetadata from './tokenfactory/msgs/MsgSetDenomMetadata.js'
import type MsgFundCommunityPool from './distribution/msgs/MsgFundCommunityPool.js'
import type MsgExecuteContractCompat from './wasm/msgs/MsgExecuteContractCompat.js'
import type MsgCreateInsuranceFund from './insurance/msgs/MsgCreateInsuranceFund.js'
import type MsgAuthorizeStakeGrants from './exchange/msgs/MsgAuthorizeStakeGrants.js'
import type MsgCreateSpotLimitOrder from './exchange/msgs/MsgCreateSpotLimitOrder.js'
import type MsgCancelPostOnlyModeV2 from './exchange/msgs/MsgCancelPostOnlyModeV2.js'
import type MsgGrantWithAuthorization from './authz/msgs/MsgGrantWithAuthorization.js'
import type MsgBatchCancelSpotOrders from './exchange/msgs/MsgBatchCancelSpotOrders.js'
import type MsgCancelDerivativeOrder from './exchange/msgs/MsgCancelDerivativeOrder.js'
import type MsgCreateSpotMarketOrder from './exchange/msgs/MsgCreateSpotMarketOrder.js'
import type MsgIncreasePositionMargin from './exchange/msgs/MsgIncreasePositionMargin.js'
import type MsgDecreasePositionMargin from './exchange/msgs/MsgDecreasePositionMargin.js'
import type MsgInstantSpotMarketLaunch from './exchange/msgs/MsgInstantSpotMarketLaunch.js'
import type MsgCancelBinaryOptionsOrder from './exchange/msgs/MsgCancelBinaryOptionsOrder.js'
import type MsgUpdateDerivativeMarketV2 from './exchange/msgs/MsgUpdateDerivativeMarketV2.js'
import type MsgCancelUnbondingDelegation from './staking/msgs/MsgCancelUnbondingDelegation.js'
import type MsgWithdrawDelegatorReward from './distribution/msgs/MsgWithdrawDelegatorReward.js'
import type MsgCreateDerivativeLimitOrder from './exchange/msgs/MsgCreateDerivativeLimitOrder.js'
import type MsgBatchCancelDerivativeOrders from './exchange/msgs/MsgBatchCancelDerivativeOrders.js'
import type MsgCreateDerivativeMarketOrder from './exchange/msgs/MsgCreateDerivativeMarketOrder.js'
import type MsgWithdrawValidatorCommission from './distribution/msgs/MsgWithdrawValidatorCommission.js'
import type MsgCreateBinaryOptionsLimitOrder from './exchange/msgs/MsgCreateBinaryOptionsLimitOrder.js'
import type MsgAdminUpdateBinaryOptionsMarket from './exchange/msgs/MsgAdminUpdateBinaryOptionsMarket.js'
import type MsgBatchCancelBinaryOptionsOrders from './exchange/msgs/MsgBatchCancelBinaryOptionsOrders.js'
import type MsgCreateBinaryOptionsMarketOrder from './exchange/msgs/MsgCreateBinaryOptionsMarketOrder.js'
import type MsgDepositV2 from './exchange/msgs/MsgDepositV2.js'
import type MsgSignDataV2 from './exchange/msgs/MsgSignDataV2.js'
import type MsgWithdrawV2 from './exchange/msgs/MsgWithdrawV2.js'
import type MsgRewardsOptOutV2 from './exchange/msgs/MsgRewardsOptOutV2.js'
import type MsgCancelSpotOrderV2 from './exchange/msgs/MsgCancelSpotOrderV2.js'
import type MsgExternalTransferV2 from './exchange/msgs/MsgExternalTransferV2.js'
import type MsgBatchUpdateOrdersV2 from './exchange/msgs/MsgBatchUpdateOrdersV2.js'
import type MsgLiquidatePositionV2 from './exchange/msgs/MsgLiquidatePositionV2.js'
import type MsgReclaimLockedFundsV2 from './exchange/msgs/MsgReclaimLockedFundsV2.js'
import type MsgAuthorizeStakeGrantsV2 from './exchange/msgs/MsgAuthorizeStakeGrantsV2.js'
import type MsgCreateSpotLimitOrderV2 from './exchange/msgs/MsgCreateSpotLimitOrderV2.js'
import type MsgCancelDerivativeOrderV2 from './exchange/msgs/MsgCancelDerivativeOrderV2.js'
import type MsgBatchCancelSpotOrdersV2 from './exchange/msgs/MsgBatchCancelSpotOrdersV2.js'
import type MsgCreateSpotMarketOrderV2 from './exchange/msgs/MsgCreateSpotMarketOrderV2.js'
import type MsgIncreasePositionMarginV2 from './exchange/msgs/MsgIncreasePositionMarginV2.js'
import type MsgDecreasePositionMarginV2 from './exchange/msgs/MsgDecreasePositionMarginV2.js'
import type MsgInstantSpotMarketLaunchV2 from './exchange/msgs/MsgInstantSpotMarketLaunchV2.js'
import type MsgCancelBinaryOptionsOrderV2 from './exchange/msgs/MsgCancelBinaryOptionsOrderV2.js'
import type MsgCreateDerivativeLimitOrderV2 from './exchange/msgs/MsgCreateDerivativeLimitOrderV2.js'
import type MsgBatchCancelDerivativeOrdersV2 from './exchange/msgs/MsgBatchCancelDerivativeOrdersV2.js'
import type MsgCreateDerivativeMarketOrderV2 from './exchange/msgs/MsgCreateDerivativeMarketOrderV2.js'
import type MsgCreateBinaryOptionsLimitOrderV2 from './exchange/msgs/MsgCreateBinaryOptionsLimitOrderV2.js'
import type MsgAdminUpdateBinaryOptionsMarketV2 from './exchange/msgs/MsgAdminUpdateBinaryOptionsMarketV2.js'
import type MsgBatchCancelBinaryOptionsOrdersV2 from './exchange/msgs/MsgBatchCancelBinaryOptionsOrdersV2.js'
import type MsgCreateBinaryOptionsMarketOrderV2 from './exchange/msgs/MsgCreateBinaryOptionsMarketOrderV2.js'
import type MsgInstantBinaryOptionsMarketLaunchV2 from './exchange/msgs/MsgInstantBinaryOptionsMarketLaunchV2.js'
import type MsgSetDelegationTransferReceiversV2 from './exchange/msgs/MsgSetDelegationTransferReceiversV2.js'

export type AuctionMsgs = MsgBid
export type IbcMsgs = MsgTransfer
export type PeggyMsgs =
  | MsgSendToEth
  | MsgCreateRateLimit
  | MsgUpdateRateLimit
  | MsgRemoveRateLimit
export type Erc20Msgs = MsgCreateTokenPair
export type BankMsgs = MsgSend | MsgMultiSend
export type OracleMsgs = MsgRelayProviderPrices
export type FeegrantMsgs = MsgGrantAllowance | MsgRevokeAllowance
export type GovMsgs = MsgVote | MsgSubmitProposal | MsgGovDeposit
export type AuthzMsgs =
  | MsgGrant
  | MsgRevoke
  | MsgAuthzExec
  | MsgGrantWithAuthorization
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
  | MsgDecreasePositionMargin
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
export type ExchangeV2Msgs =
  | MsgDepositV2
  | MsgSignDataV2
  | MsgWithdrawV2
  | MsgRewardsOptOutV2
  | MsgCancelSpotOrderV2
  | MsgExternalTransferV2
  | MsgBatchUpdateOrdersV2
  | MsgLiquidatePositionV2
  | MsgReclaimLockedFundsV2
  | MsgAuthorizeStakeGrantsV2
  | MsgCreateSpotLimitOrderV2
  | MsgCancelDerivativeOrderV2
  | MsgBatchCancelSpotOrdersV2
  | MsgCreateSpotMarketOrderV2
  | MsgIncreasePositionMarginV2
  | MsgDecreasePositionMarginV2
  | MsgInstantSpotMarketLaunchV2
  | MsgCancelBinaryOptionsOrderV2
  | MsgCreateDerivativeLimitOrderV2
  | MsgBatchCancelDerivativeOrdersV2
  | MsgCreateDerivativeMarketOrderV2
  | MsgCreateBinaryOptionsLimitOrderV2
  | MsgAdminUpdateBinaryOptionsMarketV2
  | MsgBatchCancelBinaryOptionsOrdersV2
  | MsgCreateBinaryOptionsMarketOrderV2
  | MsgInstantBinaryOptionsMarketLaunchV2
  | MsgUpdateSpotMarketV2
  | MsgCancelPostOnlyModeV2
  | MsgUpdateDerivativeMarketV2
  | MsgSetDelegationTransferReceiversV2
export type InsuranceMsgs =
  | MsgUnderwrite
  | MsgRequestRedemption
  | MsgCreateInsuranceFund
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
  | Erc20Msgs
  | OracleMsgs

export type ExchangeMsgs = ExchangeV1Msgs | ExchangeV2Msgs
