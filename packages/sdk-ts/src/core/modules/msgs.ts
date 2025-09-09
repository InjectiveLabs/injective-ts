import type MsgVote from './gov/msgs/MsgVote.js'
import type MsgSend from './bank/msgs/MsgSend.js'
import type MsgBid from './auction/msgs/MsgBid.js'
import type MsgGrant from './authz/msgs/MsgGrant.js'
import type MsgRevoke from './authz/msgs/MsgRevoke.js'
import type MsgAuthzExec from './authz/msgs/MsgExec.js'
import type { MsgSubmitProposal } from './gov/index.js'
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
import type MsgReclaimLockedFunds from './exchange/msgs/MsgReclaimLockedFunds.js'
import type MsgSetDenomMetadata from './tokenfactory/msgs/MsgSetDenomMetadata.js'
import type MsgExecuteContractCompat from './wasm/msgs/MsgExecuteContractCompat.js'
import type MsgCreateInsuranceFund from './insurance/msgs/MsgCreateInsuranceFund.js'
import type MsgAuthorizeStakeGrants from './exchange/msgs/MsgAuthorizeStakeGrants.js'
import type MsgCreateSpotLimitOrder from './exchange/msgs/MsgCreateSpotLimitOrder.js'
import type MsgGrantWithAuthorization from './authz/msgs/MsgGrantWithAuthorization.js'
import type MsgBatchCancelSpotOrders from './exchange/msgs/MsgBatchCancelSpotOrders.js'
import type MsgCancelDerivativeOrder from './exchange/msgs/MsgCancelDerivativeOrder.js'
import type MsgCreateSpotMarketOrder from './exchange/msgs/MsgCreateSpotMarketOrder.js'
import type MsgIncreasePositionMargin from './exchange/msgs/MsgIncreasePositionMargin.js'
import type MsgInstantSpotMarketLaunch from './exchange/msgs/MsgInstantSpotMarketLaunch.js'
import type MsgCancelBinaryOptionsOrder from './exchange/msgs/MsgCancelBinaryOptionsOrder.js'
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

/**
 * @category Messages
 */
export type Msgs =
  | MsgBid
  | MsgRevoke
  | MsgGrant
  | MsgAuthzExec
  | MsgSend
  | MsgMultiSend
  | MsgBatchUpdateOrders
  | MsgWithdrawDelegatorReward
  | MsgBatchCancelDerivativeOrders
  | MsgBatchCancelSpotOrders
  | MsgCancelDerivativeOrder
  | MsgCancelSpotOrder
  | MsgCreateDerivativeLimitOrder
  | MsgCreateDerivativeMarketOrder
  | MsgCreateSpotLimitOrder
  | MsgCreateSpotMarketOrder
  | MsgDeposit
  | MsgIncreasePositionMargin
  | MsgInstantSpotMarketLaunch
  | MsgWithdraw
  | MsgGovDeposit
  | MsgSubmitProposal
  | MsgVote
  | MsgTransfer
  | MsgCreateInsuranceFund
  | MsgRequestRedemption
  | MsgUnderwrite
  | MsgSendToEth
  | MsgDelegate
  | MsgUndelegate
  | MsgBeginRedelegate
  | MsgCancelUnbondingDelegation
  | MsgExecuteContract
  | MsgExecuteContractCompat
  | MsgMigrateContract
  | MsgUpdateAdmin
  | MsgExec
  | MsgInstantiateContract
  | MsgCreateBinaryOptionsLimitOrder
  | MsgCreateBinaryOptionsMarketOrder
  | MsgCancelBinaryOptionsOrder
  | MsgBatchCancelBinaryOptionsOrders
  | MsgWithdrawValidatorCommission
  | MsgEditValidator
  | MsgReclaimLockedFunds
  | MsgExternalTransfer
  | MsgStoreCode
  | MsgRewardsOptOut
  | MsgCreateValidator
  | MsgMint
  | MsgBurn
  | MsgChangeAdmin
  | MsgCreateDenom
  | MsgSetDenomMetadata
  | MsgGrantAllowance
  | MsgRevokeAllowance
  | MsgAdminUpdateBinaryOptionsMarket
  | MsgLiquidatePosition
  | MsgSignData
  | MsgGrantWithAuthorization
  | MsgAuthorizeStakeGrants

/**
 * @category Messages
 */
export type ExchangeMsgs =
  | MsgBatchCancelDerivativeOrders
  | MsgBatchCancelSpotOrders
  | MsgCancelDerivativeOrder
  | MsgCancelSpotOrder
  | MsgCreateDerivativeLimitOrder
  | MsgCreateDerivativeMarketOrder
  | MsgCreateSpotLimitOrder
  | MsgCreateSpotMarketOrder
  | MsgDeposit
  | MsgIncreasePositionMargin
  | MsgInstantSpotMarketLaunch
  | MsgWithdraw
  | MsgExec
  | MsgBatchUpdateOrders
  | MsgCreateBinaryOptionsLimitOrder
  | MsgCreateBinaryOptionsMarketOrder
  | MsgCancelBinaryOptionsOrder
  | MsgBatchCancelBinaryOptionsOrders
  | MsgReclaimLockedFunds
  | MsgExternalTransfer
  | MsgStoreCode
  | MsgSignData
  | MsgRewardsOptOut
  | MsgLiquidatePosition
  | MsgAuthorizeStakeGrants
  | MsgAdminUpdateBinaryOptionsMarket
