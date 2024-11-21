import MsgBid from './auction/msgs/MsgBid.js'
import MsgGrant from './authz/msgs/MsgGrant.js'
import MsgGrantWithAuthorization from './authz/msgs/MsgGrantWithAuthorization.js'
import MsgRevoke from './authz/msgs/MsgRevoke.js'
import MsgAuthzExec from './authz/msgs/MsgExec.js'
import MsgSend from './bank/msgs/MsgSend.js'
import MsgMultiSend from './bank/msgs/MsgMultiSend.js'
import MsgGrantAllowance from './feegrant/msgs/MsgGrantAllowance.js'
import MsgRevokeAllowance from './feegrant/msgs/MsgRevokeAllowance.js'
import MsgWithdrawDelegatorReward from './distribution/msgs/MsgWithdrawDelegatorReward.js'
import MsgWithdrawValidatorCommission from './distribution/msgs/MsgWithdrawValidatorCommission.js'
import MsgBatchCancelDerivativeOrders from './exchange/msgs/MsgBatchCancelDerivativeOrders.js'
import MsgBatchCancelSpotOrders from './exchange/msgs/MsgBatchCancelSpotOrders.js'
import MsgBatchCancelBinaryOptionsOrders from './exchange/msgs/MsgBatchCancelBinaryOptionsOrders.js'
import MsgCancelDerivativeOrder from './exchange/msgs/MsgCancelDerivativeOrder.js'
import MsgCancelSpotOrder from './exchange/msgs/MsgCancelSpotOrder.js'
import MsgCancelBinaryOptionsOrder from './exchange/msgs/MsgCancelBinaryOptionsOrder.js'
import MsgCreateDerivativeLimitOrder from './exchange/msgs/MsgCreateDerivativeLimitOrder.js'
import MsgCreateDerivativeMarketOrder from './exchange/msgs/MsgCreateDerivativeMarketOrder.js'
import MsgCreateBinaryOptionsLimitOrder from './exchange/msgs/MsgCreateBinaryOptionsLimitOrder.js'
import MsgCreateBinaryOptionsMarketOrder from './exchange/msgs/MsgCreateBinaryOptionsMarketOrder.js'
import MsgCreateSpotLimitOrder from './exchange/msgs/MsgCreateSpotLimitOrder.js'
import MsgCreateSpotMarketOrder from './exchange/msgs/MsgCreateSpotMarketOrder.js'
import MsgBatchUpdateOrders from './exchange/msgs/MsgBatchUpdateOrders.js'
import MsgAdminUpdateBinaryOptionsMarket from './exchange/msgs/MsgAdminUpdateBinaryOptionsMarket.js'
import MsgDeposit from './exchange/msgs/MsgDeposit.js'
import MsgIncreasePositionMargin from './exchange/msgs/MsgIncreasePositionMargin.js'
import MsgInstantSpotMarketLaunch from './exchange/msgs/MsgInstantSpotMarketLaunch.js'
import MsgWithdraw from './exchange/msgs/MsgWithdraw.js'
import MsgGovDeposit from './gov/msgs/MsgDeposit.js'
import MsgVote from './gov/msgs/MsgVote.js'
import MsgTransfer from './ibc/msgs/MsgTransfer.js'
import MsgCreateInsuranceFund from './insurance/msgs/MsgCreateInsuranceFund.js'
import MsgRequestRedemption from './insurance/msgs/MsgRequestRedemption.js'
import MsgUnderwrite from './insurance/msgs/MsgUnderwrite.js'
import MsgSendToEth from './peggy/msgs/MsgSendToEth.js'
import MsgDelegate from './staking/msgs/MsgDelegate.js'
import MsgUndelegate from './staking/msgs/MsgUndelegate.js'
import MsgEditValidator from './staking/msgs/MsgEditValidator.js'
import MsgCreateValidator from './staking/msgs/MsgCreateValidator.js'
import MsgBeginRedelegate from './staking/msgs/MsgBeginRedelegate.js'
import MsgCancelUnbondingDelegation from './staking/msgs/MsgCancelUnbondingDelegation.js'
import MsgExecuteContract from './wasm/msgs/MsgExecuteContract.js'
import MsgExecuteContractCompat from './wasm/msgs/MsgExecuteContractCompat.js'
import MsgMigrateContract from './wasm/msgs/MsgMigrateContract.js'
import MsgUpdateAdmin from './wasm/msgs/MsgUpdateAdmin.js'
import MsgExec from './wasm/msgs/MsgPrivilegedExecuteContract.js'
import MsgInstantiateContract from './wasm/msgs/MsgInstantiateContract.js'
import MsgStoreCode from './wasm/msgs/MsgStoreCode.js'
import MsgReclaimLockedFunds from './exchange/msgs/MsgReclaimLockedFunds.js'
import MsgRewardsOptOut from './exchange/msgs/MsgRewardsOptOut.js'
import MsgBurn from './tokenfactory/msgs/MsgBurn.js'
import MsgChangeAdmin from './tokenfactory/msgs/MsgChangeAdmin.js'
import MsgCreateDenom from './tokenfactory/msgs/MsgCreateDenom.js'
import MsgMint from './tokenfactory/msgs/MsgMint.js'
import MsgSignData from './exchange/msgs/MsgSignData.js'
import MsgSetDenomMetadata from './tokenfactory/msgs/MsgSetDenomMetadata.js'
import MsgExternalTransfer from './exchange/msgs/MsgExternalTransfer.js'
import MsgLiquidatePosition from './exchange/msgs/MsgLiquidatePosition.js'
import { MsgSubmitProposal } from './gov/index.js'

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
  | MsgAdminUpdateBinaryOptionsMarket
