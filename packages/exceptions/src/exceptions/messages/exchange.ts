import { createChainErrorMaps } from './utils.js'
import {
  TransactionChainErrorModule,
  ChainExchangeModuleErrorCode,
} from '../types/index.js'

export const exchangeErrors = createChainErrorMaps(
  TransactionChainErrorModule.Exchange,
  [
    {
      code: ChainExchangeModuleErrorCode.ErrOrderInvalid,
      message: 'Your order failed to validate',
      match: 'failed to validate order',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrSpotMarketNotFound,
      message: 'The spot market has not been found',
      match: 'spot market not found',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrSpotMarketExists,
      message: 'The spot market already exists',
      match: 'spot market exists',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrBadField,
      message: 'There is an issue with your order',
      match: 'struct field error',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrMarketInvalid,
      message: 'The market failed to validate',
      match: 'failed to validate market',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInsufficientDeposit,
      message: 'Your trading account has insufficient funds',
      match: 'subaccount has insufficient deposits',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrUnrecognizedOrderType,
      message: 'The order type is not recognized',
      match: 'unrecognized order type',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInsufficientPositionQuantity,
      message: 'The position quantity is insufficient for the order',
      match: 'position quantity insufficient for order',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrOrderHashInvalid,
      message: 'The order hash is not valid',
      match: 'order hash is not valid',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrBadSubaccountID,
      message: 'The subaccount id is not valid',
      match: 'subaccount id is not valid',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidBaseDenom,
      message: '',
      match: 'invalid base denom',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidExpiry,
      message: 'The expiry date is not valid',
      match: 'invalid expiry',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidPrice,
      message: 'The price is not valid',
      match: 'invalid price',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidQuantity,
      message: 'The quantity is not valid',
      match: 'invalid quantity',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrUnsupportedOracleType,
      message: 'The oracle type is not supported',
      match: 'unsupported oracle type',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrOrderDoesntExist,
      message: 'The order does not exist',
      match: 'order doesnt exist',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrOrderbookFillInvalid,
      message: '',
      match: 'spot limit orderbook fill invalid',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrPerpetualMarketExists,
      message: 'The perpetual market already exists',
      match: 'perpetual market exists',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrExpiryFuturesMarketExists,
      message: 'The expiry futures market market already exists',
      match: 'expiry futures market exists',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrExpiryFuturesMarketExpired,
      message: 'The expiry futures market has expired',
      match: 'expiry futures market expired',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrNoLiquidity,
      message: 'There is not enough liquidity',
      match: 'no liquidity on the orderbook',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrSlippageExceedsWorstPrice,
      message: 'There is not enough liquidity',
      match: 'orderbook liquidity cannot satisfy current worst price',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInsufficientOrderMargin,
      message: 'The order has insufficient margin',
      match: 'order has insufficient margin',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrDerivativeMarketNotFound,
      message: 'The derivative market cannot be found',
      match: 'derivative market not found',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrPositionNotFound,
      message: 'The position cannot be found',
      match: 'position not found',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidReduceOnlyPositionDirection,
      message: 'Position direction does not oppose the reduce-only order',
      match: 'position direction does not oppose the reduce-only order',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrPriceSurpassesBankruptcyPrice,
      message: 'Your order price surpasses bankruptcy price',
      match: 'price surpasses bankruptcy price',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrPositionNotLiquidable,
      message: 'The position is not liquidable',
      match: 'position not liquidable',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidTriggerPrice,
      message: 'Your order trigger price is not valid',
      match: 'invalid trigger price',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidOracleType,
      message: 'The oracle type is not valid',
      match: 'invalid oracle type',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidPriceTickSize,
      message: 'The minimum price tick size is not valid',
      match: 'invalid minimum price tick size',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidQuantityTickSize,
      message: 'The minimum quantity tick size is not valid',
      match: 'invalid minimum quantity tick size',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidMargin,
      message: "Your order's minimum margin is not valid ",
      match: 'invalid minimum order margin',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrExceedsOrderSideCount,
      message: 'You cannot have more orders for this market for this direction',
      match: 'exceeds order side count',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrMarketOrderAlreadyExists,
      message: 'You cannot place another market order within this block',
      match:
        'subaccount cannot place a market order when a market order in the same market was already placed in same block',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrConditionalMarketOrderAlreadyExists,
      message: 'You cannot place another conditional market order',
      match:
        'cannot place a conditional market order when a conditional market order in same relative direction already exists',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrMarketLaunchProposalAlreadyExists,
      message: 'There is an existing equivalent market launch proposal.',
      match: 'an equivalent market launch proposal already exists.',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidMarketStatus,
      message: 'The market status is not valid',
      match: 'invalid market status',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrSameDenoms,
      message: 'The base denom and quote denom cannot be same',
      match: 'base denom cannot be same with quote denom',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrSameOracles,
      message: 'The oracle base and the oracle quote cannot be the same',
      match: 'oracle base cannot be same with oracle quote',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrFeeRatesRelation,
      message: 'The MakerFeeRate does not match TakerFeeRate requirements',
      match: 'makerfeerate does not match takerfeeeate requirements',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrMarginsRelation,
      message:
        'The MaintenanceMarginRatio cannot be greater than InitialMarginRatio',
      match: 'maintenancemarginratio cannot be greater than initialmarginratio',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrExceedsMaxOracleScaleFactor,
      message:
        'The OracleScaleFactor cannot be greater than MaxOracleScaleFactor',
      match: 'oraclescalefactor cannot be greater than maxoraclescalefactor',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrSpotExchangeNotEnabled,
      message: 'Spot exchange is not enabled yet',
      match: 'spot exchange is not enabled yet',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrDerivativesExchangeNotEnabled,
      message: 'Derivatives exchange is not enabled yet',
      match: 'derivatives exchange is not enabled yet',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrOraclePriceDeltaExceedsThreshold,
      message: 'The oracle price delta exceeds threshold',
      match: 'oracle price delta exceeds threshold',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidHourlyInterestRate,
      message: 'The hourly interest rate is not valid',
      match: 'invalid hourly interest rate',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidHourlyFundingRateCap,
      message: 'The hourly funding rate cap is not valid',
      match: 'invalid hourly funding rate cap',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidMarketFundingParamUpdate,
      message: 'You can only update funding parameters on perpetual markets.',
      match: 'only perpetual markets can update funding parameters',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidTradingRewardCampaign,
      message: 'The trading reward campaign is not valid',
      match: 'invalid trading reward campaign',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidFeeDiscountSchedule,
      message: 'The fee discount schedule is not valid',
      match: 'invalid fee discount schedule',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidLiquidationOrder,
      message: 'The liquidation order is not valid',
      match: 'invalid liquidation order',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrTradingRewardCampaignDistributionError,
      message: 'Unknown error happened for campaign distributions',
      match: 'unknown error happened for campaign distributions',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidTradingRewardsPendingPointsUpdate,
      message: 'The updated trading reward points is not valid',
      match: 'invalid trading reward points update',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidBatchMsgUpdate,
      message: 'The MsgBatchUpdate is not valid',
      match: 'invalid batch msg update',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrExceedsTopOfBookPrice,
      message: 'The post-only order price exceeds top of the orderbook price',
      match: 'post-only order exceeds top of book price',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidOrderTypeForMessage,
      message: 'The order type is not supported for this message',
      match: 'order type not supported for given message',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidDMMSender,
      message: 'The sender must match the DMM address',
      match: 'sender must match dmm account',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrAlreadyOptedOutOfRewards,
      message: 'The DMM address already opted out of rewards',
      match: 'already opted out of rewards',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidMarginRatio,
      message: 'The margin ratio is not valid',
      match: 'invalid margin ratio',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrBelowMinimalContribution,
      message: 'The provided funds are below minimum',
      match: 'provided funds are below minimum',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrLowPositionMargin,
      message: 'The position is below initial margin requirement',
      match: 'position is below initial margin requirement',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidTotalSupply,
      message: 'The pool has non-positive total LP token supply',
      match: 'pool has non-positive total lp token supply',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidLpTokenBurnAmount,
      message:
        'The passed LP token burn amount is greater than total LP token supply',
      match:
        'passed lp token burn amount is greater than total lp token supply',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrUnsupportedAction,
      message: 'This action is not supported',
      match: 'unsupported action',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrNegativePositionQuantity,
      message: 'The position quantity cannot be negative',
      match: 'position quantity cannot be negative',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrBinaryOptionsMarketExists,
      message: 'The BinaryOptions market already exists',
      match: 'binary options market exists',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrBinaryOptionsMarketNotFound,
      message: 'The BinaryOptions market cannot be found',
      match: 'binary options market not found',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidSettlement,
      message: 'The settlement price is not valid',
      match: 'invalid settlement',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrAccountDoesntExist,
      message: 'The trading account does not exist',
      match: 'account doesnt exist',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrSenderIsNotAnAdmin,
      message: 'The sender should be the admin of the market',
      match: 'sender should be a market admin',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrMarketAlreadyScheduledToSettle,
      message: 'The market is already scheduled to settle ',
      match: 'market is already scheduled to settle',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrGenericMarketNotFound,
      message: 'The market cannot be found',
      match: 'market not found',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidDenomDecimal,
      message: 'The denom decimal cannot be below 1 or above max scale factor',
      match: 'denom decimal cannot be below 1 or above max scale factor',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidState,
      message: 'The state is not valid',
      match: 'state is invalid',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrTransientOrdersUpToCancelNotSupported,
      message: 'The transient orders up to cancellation not supported',
      match: 'transient orders up to cancellation not supported',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidTrade,
      message: 'The trade is not valid',
      match: 'invalid trade',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrNoMarginLocked,
      message: 'There is no margin locked in the trading account',
      match: 'no margin locked in subaccount',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidAccessLevel,
      message: 'There is no access to perform action',
      match: 'Invalid access level to perform action',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidAddress,
      message: 'The address is not valid',
      match: 'Invalid address',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidArgument,
      message: 'The argument is not valid',
      match: 'Invalid argument',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrStaleOraclePrice,
      message: 'Stale oracle price',
      match: 'stale oracle price',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidStakeGrant,
      message: 'Invalid stake grant',
      match: 'invalid stake grant',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInsufficientStake,
      message: 'Insufficient stake for grant',
      match: 'insufficient stake for grant',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidPermissions,
      message: 'Invalid permissions',
      match: 'invalid permissions',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrDenomDecimalsDoNotMatch,
      message: 'The decimals specified for the denom is incorrect',
      match: 'the decimals specified for the denom is incorrect',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInsufficientMarketBalance,
      message: 'Insufficient market balance',
      match: 'insufficient market balance',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidExpirationBlock,
      message: 'Invalid expiration block',
      match: 'invalid expiration block',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrV1DerivativeMarketLaunch,
      message:
        'V1 perpetual and expiry market launch proposal is not supported',
      match: 'v1 perpetual and expiry market launch proposal is not supported',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrPositionNotOffsettable,
      message: 'Position not offsettable',
      match: 'position not offsettable',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrOffsettingSubaccountIDsEmpty,
      message: 'Offsetting subaccount IDs cannot be empty',
      match: 'offsetting subaccount IDs cannot be empty',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidOpenNotionalCap,
      message: 'Invalid open notional cap',
      match: 'invalid open notional cap',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrOpenNotionalCapBreached,
      message: 'Open notional cap breached',
      match: 'open notional cap breached',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrNoOffsettingPositionsFound,
      message: 'No valid offsetting positions found',
      match: 'no valid offsetting positions found',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrNotCanonicalLiquidationTarget,
      message: 'Targeted market is not the canonical liquidation target',
      match: 'targeted market is not the canonical liquidation target',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrMsgDeprecated,
      message: 'Message type is deprecated',
      match: 'message type is deprecated',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrTooManyCrossMarginSpotOrders,
      message:
        'Cross-margin subaccount has reached the per-denom spot order cap',
      match: 'cross-margin subaccount has reached the per-denom spot order cap',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrSwapDisabled,
      message: 'Spot swap is disabled',
      match: 'spot swap is disabled',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidSwapRoute,
      message: 'Invalid swap route',
      match: 'invalid swap route',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrSwapDeadlineExceeded,
      message: 'Swap deadline exceeded',
      match: 'swap deadline exceeded',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrSwapMinOutputNotMet,
      message: 'Swap output below minimum',
      match: 'swap output below minimum',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrPoolFundedCloseCannotRest,
      message: 'Pool-funded cross-margin close cannot rest on the orderbook',
      match: 'pool-funded cross-margin close cannot rest on the orderbook',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrRFQPartialInsuranceNotLastResort,
      message:
        'RFQ partial may draw insurance only when the remaining pool positions hold no positive mark equity',
      match:
        'RFQ partial may draw insurance only when the remaining pool positions hold no positive mark equity',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrRFQInactiveSettlementNotLastResort,
      message:
        'Inactive cross-margin legs may be scheduled for settlement only when the active pool positions hold no positive mark equity',
      match:
        'inactive cross-margin legs may be scheduled for settlement only when the active pool positions hold no positive mark equity',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrRFQPartialBelowMarkWhileInsolvent,
      message:
        'A partial RFQ slice may pay below the exact-mark payout only while the pool has no mark shortfall after it',
      match:
        'a partial RFQ slice may pay below the exact-mark payout only while the pool has no mark shortfall after it',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrTooManyIsolatedActiveMarkets,
      message:
        'Cross-exposed subaccount has reached the per-denom isolated active derivative market cap',
      match:
        'cross-exposed subaccount has reached the per-denom isolated active derivative market cap',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidReferencePriceGateConfig,
      message: 'Invalid reference price gate config',
      match: 'invalid reference price gate config',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrUnsupportedReferencePriceSource,
      message: 'Unsupported reference price source',
      match: 'unsupported reference price source',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrReferencePriceGateRejection,
      message: 'Position-opening fill rejected by reference price gate',
      match: 'position-opening fill rejected by reference price gate',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrTooManyOrdersPerAddress,
      message: 'Address has reached the order-book order cap',
      match: 'address has reached the order-book order cap',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidFundingImpactNotional,
      message: 'Invalid funding impact notional',
      match: 'invalid funding impact notional',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrTooManyFundingV2Markets,
      message: 'Too many markets use funding v2',
      match: 'too many markets use funding v2',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidSyntheticTradeFeeRate,
      message: 'Invalid synthetic trade fee rate',
      match: 'invalid synthetic trade fee rate',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrSwapMaxInputExceeded,
      message: 'Swap input above maximum',
      match: 'swap input above maximum',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidFundsDirection,
      message: 'Invalid funds direction',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrNoFundsProvided,
      message: 'No funds provided',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidSignature,
      message: 'Invalid signature',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrNoFundsToUnlock,
      message: 'No funds to unlock',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrNoMsgsProvided,
      message: 'No msgs provided',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrNoMsgProvided,
      message: 'No msg provided',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidAmount,
      message: 'Invalid amount',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrFeatureDisabled,
      message: 'The current feature has been disabled',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrTooMuchOrderMargin,
      message: 'Order has too much margin',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrBadSubaccountNonce,
      message: 'Subaccount nonce is invalid',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInsufficientFunds,
      message: 'Insufficient funds',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrPostOnlyMode,
      message:
        'Only post-only actions available for approximately 30 minutes after a chain upgrade.',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrClientOrderIdAlreadyExists,
      message: 'Client order id already exists',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidCid,
      message: 'Client order id is invalid. Max length is 36 chars',
    },
    {
      code: ChainExchangeModuleErrorCode.ErrInvalidClosingDirection,
      message: 'Invalid closing direction',
    },
  ],
)
