import MsgBid from './auction/msgs/MsgBid'
import MsgGrant from './authz/msgs/MsgGrant'
import MsgRevoke from './authz/msgs/MsgRevoke'
import MsgAuthzExec from './authz/msgs/MsgExec'
import MsgSend from './bank/msgs/MsgSend'
import MsgMultiSend from './bank/msgs/MsgMultiSend'
import MsgGrantAllowance from './feegrant/msgs/MsgGrantAllowance'
import MsgRevokeAllowance from './feegrant/msgs/MsgRevokeAllowance'
import MsgWithdrawDelegatorReward from './distribution/msgs/MsgWithdrawDelegatorReward'
import MsgWithdrawValidatorCommission from './distribution/msgs/MsgWithdrawValidatorCommission'
import MsgBatchCancelDerivativeOrders from './exchange/msgs/MsgBatchCancelDerivativeOrders'
import MsgBatchCancelSpotOrders from './exchange/msgs/MsgBatchCancelSpotOrders'
import MsgBatchCancelBinaryOptionsOrders from './exchange/msgs/MsgBatchCancelBinaryOptionsOrders'
import MsgCancelDerivativeOrder from './exchange/msgs/MsgCancelDerivativeOrder'
import MsgCancelSpotOrder from './exchange/msgs/MsgCancelSpotOrder'
import MsgCancelBinaryOptionsOrder from './exchange/msgs/MsgCancelBinaryOptionsOrder'
import MsgCreateDerivativeLimitOrder from './exchange/msgs/MsgCreateDerivativeLimitOrder'
import MsgCreateDerivativeMarketOrder from './exchange/msgs/MsgCreateDerivativeMarketOrder'
import MsgCreateBinaryOptionsLimitOrder from './exchange/msgs/MsgCreateBinaryOptionsLimitOrder'
import MsgCreateBinaryOptionsMarketOrder from './exchange/msgs/MsgCreateBinaryOptionsMarketOrder'
import MsgCreateSpotLimitOrder from './exchange/msgs/MsgCreateSpotLimitOrder'
import MsgCreateSpotMarketOrder from './exchange/msgs/MsgCreateSpotMarketOrder'
import MsgBatchUpdateOrders from './exchange/msgs/MsgBatchUpdateOrders'
import MsgAdminUpdateBinaryOptionsMarket from './exchange/msgs/MsgAdminUpdateBinaryOptionsMarket'
import MsgDeposit from './exchange/msgs/MsgDeposit'
import MsgIncreasePositionMargin from './exchange/msgs/MsgIncreasePositionMargin'
import MsgInstantSpotMarketLaunch from './exchange/msgs/MsgInstantSpotMarketLaunch'
import MsgWithdraw from './exchange/msgs/MsgWithdraw'
import MsgGovDeposit from './gov/msgs/MsgDeposit'
import MsgVote from './gov/msgs/MsgVote'
import MsgTransfer from './ibc/msgs/MsgTransfer'
import MsgCreateInsuranceFund from './insurance/msgs/MsgCreateInsuranceFund'
import MsgRequestRedemption from './insurance/msgs/MsgRequestRedemption'
import MsgUnderwrite from './insurance/msgs/MsgUnderwrite'
import MsgSendToEth from './peggy/msgs/MsgSendToEth'
import MsgDelegate from './staking/msgs/MsgDelegate'
import MsgUndelegate from './staking/msgs/MsgUndelegate'
import MsgEditValidator from './staking/msgs/MsgEditValidator'
import MsgCreateValidator from './staking/msgs/MsgCreateValidator'
import MsgBeginRedelegate from './staking/msgs/MsgBeginRedelegate'
import MsgCancelUnbondingDelegation from './staking/msgs/MsgCancelUnbondingDelegation'
import MsgExecuteContract from './wasm/msgs/MsgExecuteContract'
import MsgExecuteContractCompat from './wasm/msgs/MsgExecuteContractCompat'
import MsgMigrateContract from './wasm/msgs/MsgMigrateContract'
import MsgUpdateAdmin from './wasm/msgs/MsgUpdateAdmin'
import MsgExec from './wasm/msgs/MsgPrivilegedExecuteContract'
import MsgInstantiateContract from './wasm/msgs/MsgInstantiateContract'
import MsgStoreCode from './wasm/msgs/MsgStoreCode'
import MsgReclaimLockedFunds from './exchange/msgs/MsgReclaimLockedFunds'
import MsgRewardsOptOut from './exchange/msgs/MsgRewardsOptOut'
import MsgBurn from './tokenfactory/msgs/MsgBurn'
import MsgChangeAdmin from './tokenfactory/msgs/MsgChangeAdmin'
import MsgCreateDenom from './tokenfactory/msgs/MsgCreateDenom'
import MsgMint from './tokenfactory/msgs/MsgMint'
import MsgSignData from './exchange/msgs/MsgSignData'
import MsgSetDenomMetadata from './tokenfactory/msgs/MsgSetDenomMetadata'
import MsgExternalTransfer from './exchange/msgs/MsgExternalTransfer'
import MsgLiquidatePosition from './exchange/msgs/MsgLiquidatePosition'
import { MsgSubmitProposal } from './gov'

/**
 * @category Messages
 */
export type Msgs =
  | MsgBid
  | MsgGrant
  | MsgRevoke
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
