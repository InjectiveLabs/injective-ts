import { ChainCosmosErrorCode, ChainExchangeModuleErrorCode } from './types'

export const messagesMap = {
  'insufficient fee': {
    message: 'You do not have enough funds to cover transaction fees.',
    code: ChainCosmosErrorCode.ErrInsufficientFee,
  },

  'insufficient funds': {
    message: 'You do not have enough funds to cover transaction fees.',
    code: ChainCosmosErrorCode.ErrInsufficientFunds,
  },

  'tx timeout height': {
    message: 'The transaction failed to be included within a block on time.',
    code: ChainCosmosErrorCode.ErrTxTimeoutHeight,
  },

  // Exchange Module Messages
  'failed to validate order': {
    message: 'Your order failed to validate',
    code: ChainExchangeModuleErrorCode.ErrOrderInvalid,
  },

  'spot market not found': {
    message: 'The spot market has not been found',
    code: ChainExchangeModuleErrorCode.ErrSpotMarketNotFound,
  },

  'spot market exists': {
    message: 'The spot market already exists',
    code: ChainExchangeModuleErrorCode.ErrSpotMarketExists,
  },

  'struct field error': {
    message: 'There is an issue with your order',
    code: ChainExchangeModuleErrorCode.ErrBadField,
  },

  'failed to validate market': {
    message: 'The market failed to validate',
    code: ChainExchangeModuleErrorCode.ErrMarketInvalid,
  },

  'subaccount has insufficient deposits': {
    message: 'Your trading account has insufficient funds',
    code: ChainExchangeModuleErrorCode.ErrInsufficientDeposit,
  },

  'unrecognized order type': {
    message: 'The order type is not recognized',
    code: ChainExchangeModuleErrorCode.ErrUnrecognizedOrderType,
  },

  'position quantity insufficient for order': {
    message: 'The position quantity is insufficient for the order',
    code: ChainExchangeModuleErrorCode.ErrInsufficientPositionQuantity,
  },

  'order hash is not valid': {
    message: 'The order hash is not valid',
    code: ChainExchangeModuleErrorCode.ErrOrderHashInvalid,
  },

  'subaccount id is not valid': {
    message: 'The subaccount id is not valid',
    code: ChainExchangeModuleErrorCode.ErrBadSubaccountID,
  },

  'invalid ticker': {
    message: "The market's ticker is not valid",
    code: ChainExchangeModuleErrorCode.ErrInvalidTicker,
  },

  'invalid base denom': {
    message: '',
    code: ChainExchangeModuleErrorCode.ErrInvalidBaseDenom,
  },

  'invalid quote denom': {
    message: '',
    code: ChainExchangeModuleErrorCode.ErrInvalidQuoteDenom,
  },

  'invalid oracle': {
    message: 'The oracle is invalid',
    code: ChainExchangeModuleErrorCode.ErrInvalidOracle,
  },

  'invalid expiry': {
    message: 'The expiry date is invalid',
    code: ChainExchangeModuleErrorCode.ErrInvalidExpiry,
  },

  'invalid price': {
    message: 'The price is invalid',
    code: ChainExchangeModuleErrorCode.ErrInvalidPrice,
  },

  'invalid quantity': {
    message: 'The quantity is invalid',
    code: ChainExchangeModuleErrorCode.ErrInvalidQuantity,
  },

  'unsupported oracle type': {
    message: 'The oracle type is not supported',
    code: ChainExchangeModuleErrorCode.ErrUnsupportedOracleType,
  },

  'order doesnt exist': {
    message: 'The order does not exist',
    code: ChainExchangeModuleErrorCode.ErrOrderDoesntExist,
  },

  'spot limit orderbook fill invalid': {
    message: '',
    code: ChainExchangeModuleErrorCode.ErrOrderbookFillInvalid,
  },

  'perpetual market exists': {
    message: 'The perpetual market already exists',
    code: ChainExchangeModuleErrorCode.ErrPerpetualMarketExists,
  },

  'expiry futures market exists': {
    message: 'The expiry futures market market already exists',
    code: ChainExchangeModuleErrorCode.ErrExpiryFuturesMarketExists,
  },

  'expiry futures market expired': {
    message: 'The expiry futures market has expired',
    code: ChainExchangeModuleErrorCode.ErrExpiryFuturesMarketExpired,
  },

  'no liquidity on the orderbook': {
    message: 'There is not enough liquidity',
    code: ChainExchangeModuleErrorCode.ErrNoLiquidity,
  },

  'orderbook liquidity cannot satisfy current worst price': {
    message: 'There is not enough liquidity',
    code: ChainExchangeModuleErrorCode.ErrSlippageExceedsWorstPrice,
  },

  'order has insufficient margin': {
    message: 'The order has insufficient margin',
    code: ChainExchangeModuleErrorCode.ErrInsufficientOrderMargin,
  },

  'derivative market not found': {
    message: 'The derivative market cannot be found',
    code: ChainExchangeModuleErrorCode.ErrDerivativeMarketNotFound,
  },

  'position not found': {
    message: 'The position cannot be found',
    code: ChainExchangeModuleErrorCode.ErrPositionNotFound,
  },

  'position direction does not oppose the reduce-only order': {
    message: 'Position direction does not oppose the reduce-only order',
    code: ChainExchangeModuleErrorCode.ErrInvalidReduceOnlyPositionDirection,
  },

  'price surpasses bankruptcy price': {
    message: 'Your order price surpasses bankruptcy price',
    code: ChainExchangeModuleErrorCode.ErrPriceSurpassesBankruptcyPrice,
  },

  'position not liquidable': {
    message: 'The position is not liquidable',
    code: ChainExchangeModuleErrorCode.ErrPositionNotLiquidable,
  },

  'invalid trigger price': {
    message: 'Your order trigger price is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidTriggerPrice,
  },

  'invalid oracle type': {
    message: 'The oracle type is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidOracleType,
  },

  'invalid minimum price tick size': {
    message: 'The minimum price tick size is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidPriceTickSize,
  },

  'invalid minimum quantity tick size': {
    message: 'The minimum quantity tick size is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidQuantityTickSize,
  },

  'invalid minimum order margin': {
    message: "Your order's minimum margin is not valid ",
    code: ChainExchangeModuleErrorCode.ErrInvalidMargin,
  },

  'exceeds order side count': {
    message: 'You cannot have more orders for this market for this direction',
    code: ChainExchangeModuleErrorCode.ErrExceedsOrderSideCount,
  },
  'subaccount cannot place a market order when a market order in the same market was already placed in same block':
    {
      message: 'You cannot place another market order within this block',
      code: ChainExchangeModuleErrorCode.ErrMarketOrderAlreadyExists,
    },
  'cannot place a conditional market order when a conditional market order in same relative direction already exists':
    {
      message: 'You cannot place another conditional market order',
      code: ChainExchangeModuleErrorCode.ErrConditionalMarketOrderAlreadyExists,
    },

  'an equivalent market launch proposal already exists.': {
    message: 'There is an existing equivalent market launch proposal.',
    code: ChainExchangeModuleErrorCode.ErrMarketLaunchProposalAlreadyExists,
  },

  'invalid market status': {
    message: 'The market status is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidMarketStatus,
  },

  'base denom cannot be same with quote denom': {
    message: 'The base denom and quote denom cannot be same',
    code: ChainExchangeModuleErrorCode.ErrSameDenoms,
  },

  'oracle base cannot be same with oracle quote': {
    message: 'The oracle base and the oracle quote cannot be the same',
    code: ChainExchangeModuleErrorCode.ErrSameOracles,
  },

  'makerfeerate does not match takerfeeeate requirements': {
    message: 'The MakerFeeRate does not match TakerFeeRate requirements',
    code: ChainExchangeModuleErrorCode.ErrFeeRatesRelation,
  },
  'maintenancemarginratio cannot be greater than initialmarginratio': {
    message:
      'The MaintenanceMarginRatio cannot be greater than InitialMarginRatio',
    code: ChainExchangeModuleErrorCode.ErrMarginsRelation,
  },

  'oraclescalefactor cannot be greater than maxoraclescalefactor': {
    message:
      'The OracleScaleFactor cannot be greater than MaxOracleScaleFactor',
    code: ChainExchangeModuleErrorCode.ErrExceedsMaxOracleScaleFactor,
  },

  'spot exchange is not enabled yet': {
    message: 'Spot exchange is not enabled yet',
    code: ChainExchangeModuleErrorCode.ErrSpotExchangeNotEnabled,
  },

  'derivatives exchange is not enabled yet': {
    message: 'Derivatives exchange is not enabled yet',
    code: ChainExchangeModuleErrorCode.ErrDerivativesExchangeNotEnabled,
  },

  'oracle price delta exceeds threshold': {
    message: 'The oracle price delta exceeds threshold',
    code: ChainExchangeModuleErrorCode.ErrOraclePriceDeltaExceedsThreshold,
  },

  'invalid hourly interest rate': {
    message: 'The hourly interest rate is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidHourlyInterestRate,
  },

  'invalid hourly funding rate cap': {
    message: 'The hourly funding rate cap is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidHourlyFundingRateCap,
  },

  'only perpetual markets can update funding parameters': {
    message: 'You can only update funding parameters on perpetual markets.',
    code: ChainExchangeModuleErrorCode.ErrInvalidMarketFundingParamUpdate,
  },

  'invalid trading reward campaign': {
    message: 'The trading reward campaign is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidTradingRewardCampaign,
  },

  'invalid fee discount schedule': {
    message: 'The fee discount schedule is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidFeeDiscountSchedule,
  },

  'invalid liquidation order': {
    message: 'The liquidation order is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidLiquidationOrder,
  },

  'unknown error happened for campaign distributions': {
    message: 'Unknown error happened for campaign distributions',
    code: ChainExchangeModuleErrorCode.ErrTradingRewardCampaignDistributionError,
  },

  'invalid trading reward points update': {
    message: 'The updated trading reward points is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidTradingRewardsPendingPointsUpdate,
  },

  'invalid batch msg update': {
    message: 'The MsgBatchUpdate is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidBatchMsgUpdate,
  },

  'post-only order exceeds top of book price': {
    message: 'The post-only order price exceeds top of the orderbook price',
    code: ChainExchangeModuleErrorCode.ErrExceedsTopOfBookPrice,
  },

  'order type not supported for given message': {
    message: 'The order type is not supported for this message',
    code: ChainExchangeModuleErrorCode.ErrInvalidOrderTypeForMessage,
  },

  'sender must match dmm account': {
    message: 'The sender must match the DMM address',
    code: ChainExchangeModuleErrorCode.ErrInvalidDMMSender,
  },

  'already opted out of rewards': {
    message: 'The DMM address already opted out of rewards',
    code: ChainExchangeModuleErrorCode.ErrAlreadyOptedOutOfRewards,
  },

  'invalid margin ratio': {
    message: 'The margin ratio is invalid',
    code: ChainExchangeModuleErrorCode.ErrInvalidMarginRatio,
  },

  'provided funds are below minimum': {
    message: 'The provided funds are below minimum',
    code: ChainExchangeModuleErrorCode.ErrBelowMinimalContribution,
  },

  'position is below initial margin requirement': {
    message: 'The position is below initial margin requirement',
    code: ChainExchangeModuleErrorCode.ErrLowPositionMargin,
  },

  'pool has non-positive total lp token supply': {
    message: 'The pool has non-positive total LP token supply',
    code: ChainExchangeModuleErrorCode.ErrInvalidTotalSupply,
  },
  'passed lp token burn amount is greater than total lp token supply': {
    message:
      'The passed LP token burn amount is greater than total LP token supply',
    code: ChainExchangeModuleErrorCode.ErrInvalidLpTokenBurnAmount,
  },

  'unsupported action': {
    message: 'This action is not supported',
    code: ChainExchangeModuleErrorCode.ErrUnsupportedAction,
  },

  'position quantity cannot be negative': {
    message: 'The position quantity cannot be negative',
    code: ChainExchangeModuleErrorCode.ErrNegativePositionQuantity,
  },

  'binary options market exists': {
    message: 'The BinaryOptions market already exists',
    code: ChainExchangeModuleErrorCode.ErrBinaryOptionsMarketExists,
  },

  'binary options market not found': {
    message: 'The BinaryOptions market cannot be found',
    code: ChainExchangeModuleErrorCode.ErrBinaryOptionsMarketNotFound,
  },

  'invalid settlement': {
    message: 'The settlement price is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidSettlement,
  },

  'account doesnt exist': {
    message: 'The trading account does not exist',
    code: ChainExchangeModuleErrorCode.ErrAccountDoesntExist,
  },

  'sender should be a market admin': {
    message: 'The sender should be the admin of the market',
    code: ChainExchangeModuleErrorCode.ErrSenderIsNotAnAdmin,
  },

  'market is already scheduled to settle': {
    message: 'The market is already scheduled to settle ',
    code: ChainExchangeModuleErrorCode.ErrMarketAlreadyScheduledToSettle,
  },

  'market not found': {
    message: 'The market cannot be found',
    code: ChainExchangeModuleErrorCode.ErrGenericMarketNotFound,
  },

  'denom decimal cannot be below 1 or above max scale factor': {
    message: 'The denom decimal cannot be below 1 or above max scale factor',
    code: ChainExchangeModuleErrorCode.ErrInvalidDenomDecimal,
  },

  'state is invalid': {
    message: 'The state is invalid',
    code: ChainExchangeModuleErrorCode.ErrInvalidState,
  },

  'transient orders up to cancellation not supported': {
    message: 'The transient orders up to cancellation not supported',
    code: ChainExchangeModuleErrorCode.ErrTransientOrdersUpToCancelNotSupported,
  },

  'invalid trade': {
    message: 'The trade is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidTrade,
  },

  'no margin locked in subaccount': {
    message: 'There is no margin locked in the trading account',
    code: ChainExchangeModuleErrorCode.ErrNoMarginLocked,
  },

  'Invalid access level to perform action': {
    message: 'There is no access to perform action',
    code: ChainExchangeModuleErrorCode.ErrInvalidAccessLevel,
  },

  'Invalid address': {
    message: 'The address is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidAddress,
  },

  'Invalid argument': {
    message: 'The argument is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidArgument,
  },
}
