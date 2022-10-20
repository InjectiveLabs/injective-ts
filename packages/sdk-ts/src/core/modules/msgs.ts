import MsgBid from './auction/msgs/MsgBid'
import MsgGrant from './authz/msgs/MsgGrant'
import MsgRevoke from './authz/msgs/MsgRevoke'
import MsgAuthzExec from './authz/msgs/MsgExec'
import MsgSend from './bank/msgs/MsgSend'
import MsgWithdrawDelegatorReward from './distribution/msgs/MsgWithdrawDelegatorReward'
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
import MsgTransferAndExecute from './exchange/msgs/MsgTransferAndExecute'
import MsgMultiExecute from './exchange/msgs/MsgMultiExecute'
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
import MsgBeginRedelegate from './staking/msgs/MsgBeginRedelegate'
import MsgExecuteContract from './wasm/msgs/MsgExecuteContract'
import MsgExec from './wasm/msgs/MsgExec'
import MsgInstantiateContract from './wasm/msgs/MsgInstantiateContract'
// import MsgReclaimLockedFunds from './exchange/msgs/MsgReclaimLockedFunds'
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
  | MsgExecuteContract
  | MsgExec
  | MsgInstantiateContract
  | MsgCreateBinaryOptionsLimitOrder
  | MsgCreateBinaryOptionsMarketOrder
  | MsgCancelBinaryOptionsOrder
  | MsgBatchCancelBinaryOptionsOrders
  | MsgTransferAndExecute
  | MsgMultiExecute
// | MsgReclaimLockedFunds

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
  | MsgTransferAndExecute
  | MsgMultiExecute
// | MsgReclaimLockedFunds
