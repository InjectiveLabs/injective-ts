import {
  ChainAuctionErrorCodes,
  ChainCosmosErrorCode,
  ChainExchangeModuleErrorCode,
  ChainInsuranceErrorCodes,
} from './types'

/* todo: remove this with the next chain upgrade */
export const chainErrorMessagesMap = {
  'insufficient fee': {
    message: 'You do not have enough funds to cover the transaction fees.',
    code: ChainCosmosErrorCode.ErrInsufficientFee,
  },

  'insufficient funds': {
    message: 'You do not have enough funds.',
    code: ChainCosmosErrorCode.ErrInsufficientFunds,
  },

  'tx timeout height': {
    message: 'The transaction failed to be included within a block on time.',
    code: ChainCosmosErrorCode.ErrTxTimeoutHeight,
  },

  'tx parse error': {
    message: 'There is an issue while parsing the transaction',
    code: ChainCosmosErrorCode.ErrTxDecode,
  },

  'invalid sequence': {
    message: 'The sequence number is not valid',
    code: ChainCosmosErrorCode.ErrInvalidSequence,
  },

  unauthorized: {
    message: 'Unauthorized',
    code: ChainCosmosErrorCode.ErrUnauthorized,
  },

  'unknown request': {
    message: 'The request is not known',
    code: ChainCosmosErrorCode.ErrUnknownRequest,
  },

  'invalid address': {
    message: 'The address is not valid',
    code: ChainCosmosErrorCode.ErrInvalidAddress,
  },

  'invalid pubkey': {
    message: 'The public key is not valid',
    code: ChainCosmosErrorCode.ErrInvalidPubKey,
  },

  'unknown address': {
    message: 'The address is unknown',
    code: ChainCosmosErrorCode.ErrUnknownAddress,
  },

  'invalid coins': {
    message: 'The coins are not valid',
    code: ChainCosmosErrorCode.ErrInvalidCoins,
  },

  'out of gas': {
    message: 'The transaction run out of gas',
    code: ChainCosmosErrorCode.ErrOutOfGas,
  },
  'memo too large': {
    message: 'The memo field in the transaction is too large',
    code: ChainCosmosErrorCode.ErrMemoTooLarge,
  },

  'maximum number of signatures exceeded': {
    message: 'The transaction exceeded the maximum number of signatures',
    code: ChainCosmosErrorCode.ErrTooManySignatures,
  },

  'no signatures supplied': {
    message: 'There are no signatures appended on the transaction',
    code: ChainCosmosErrorCode.ErrNoSignatures,
  },

  'failed to marshal JSON bytes': {
    message: 'There is an issue while parsing the transaction',
    code: ChainCosmosErrorCode.ErrJSONMarshal,
  },

  'failed to unmarshal JSON bytes': {
    message: 'There is an issue while parsing the transaction',
    code: ChainCosmosErrorCode.ErrJSONUnmarshal,
  },

  'invalid request': {
    message: 'invalid request',
    code: ChainCosmosErrorCode.ErrInvalidRequest,
  },

  'tx already in mempool': {
    message: 'The transaction is already in the mempool',
    code: ChainCosmosErrorCode.ErrTxInMempoolCache,
  },

  'mempool is full': {
    message: 'The mempool is full',
    code: ChainCosmosErrorCode.ErrMempoolIsFull,
  },

  'tx too large': {
    message: 'The transaction is too large',
    code: ChainCosmosErrorCode.ErrTxTooLarge,
  },

  'key not found': {
    message: 'The key has not been found',
    code: ChainCosmosErrorCode.ErrKeyNotFound,
  },

  'invalid account password': {
    message: 'invalid account password',
    code: ChainCosmosErrorCode.ErrWrongPassword,
  },

  'tx intended signer does not match the given signer': {
    message: 'tx intended signer does not match the given signer',
    code: ChainCosmosErrorCode.ErrorInvalidSigner,
  },

  'invalid gas adjustment': {
    message: 'invalid gas adjustment',
    code: ChainCosmosErrorCode.ErrorInvalidGasAdjustment,
  },

  'invalid height': {
    message: 'The height provided in the transaction is not valid',
    code: ChainCosmosErrorCode.ErrInvalidHeight,
  },

  'invalid version': {
    message: 'The version provided in the transaction is not valid',
    code: ChainCosmosErrorCode.ErrInvalidVersion,
  },

  'invalid chain-id': {
    message: 'The chainId provided in the transaction is not valid',
    code: ChainCosmosErrorCode.ErrInvalidChainID,
  },

  'invalid type': {
    message: 'The type provided in the transaction is not valid',
    code: ChainCosmosErrorCode.ErrInvalidType,
  },

  'unknown extension options': {
    message: 'The extension options provided in the transaction is unknown',
    code: ChainCosmosErrorCode.ErrUnknownExtensionOptions,
  },

  'incorrect account sequence': {
    message: 'The sequence number provided in the transaction is incorrect',
    code: ChainCosmosErrorCode.ErrWrongSequence,
  },

  'failed packing protobuf message to Any': {
    message: 'failed packing protobuf message to Any',
    code: ChainCosmosErrorCode.ErrPackAny,
  },

  'failed unpacking protobuf message from Any': {
    message: 'failed unpacking protobuf message from Any',
    code: ChainCosmosErrorCode.ErrUnpackAny,
  },

  'internal logic error': {
    message: 'Internal logic error',
    code: ChainCosmosErrorCode.ErrLogic,
  },

  conflict: { message: 'conflict', code: ChainCosmosErrorCode.ErrConflict },

  'feature not supported': {
    message: 'The feature is not supported',
    code: ChainCosmosErrorCode.ErrNotSupported,
  },

  'not found': { message: 'not found', code: ChainCosmosErrorCode.ErrNotFound },

  'Internal IO error': {
    message: 'Internal IO error',
    code: ChainCosmosErrorCode.ErrIO,
  },

  'error in app.toml': {
    message: 'error in app.toml',
    code: ChainCosmosErrorCode.ErrAppConfig,
  },

  'invalid gas limit': {
    message: 'The gas limit provided in the transaction is not valid',
    code: ChainCosmosErrorCode.ErrInvalidGasLimit,
  },

  // Auction Module Messages
  'invalid bid denom': {
    message: 'The gas limit provided in the transaction is not valid',
    code: ChainAuctionErrorCodes.ErrBidInvalid,
  },

  'invalid bid round': {
    message: 'The gas limit provided in the transaction is not valid',
    code: ChainAuctionErrorCodes.ErrBidRound,
  },

  // Insurance Module Messages
  'insurance fund already exists': {
    message: 'The insurance fund already exists',
    code: ChainInsuranceErrorCodes.ErrInsuranceFundAlreadyExists,
  },

  'insurance fund not found': {
    message: 'The insurance fund is not found',
    code: ChainInsuranceErrorCodes.ErrInsuranceFundNotFound,
  },

  'redemption already exists': {
    message: 'The redemption already exists',
    code: ChainInsuranceErrorCodes.ErrRedemptionAlreadyExists,
  },

  'invalid deposit amount': {
    message: 'The deposit amount is not valid',
    code: ChainInsuranceErrorCodes.ErrInvalidDepositAmount,
  },

  'invalid deposit denom': {
    message: 'The deposit denom is not valid',
    code: ChainInsuranceErrorCodes.ErrInvalidDepositDenom,
  },

  'insurance payout exceeds deposits': {
    message: 'The insurance fund payout exceeds the deposits',
    code: ChainInsuranceErrorCodes.ErrPayoutTooLarge,
  },

  'invalid ticker': {
    message: 'The ticker is not valid',
    code: ChainInsuranceErrorCodes.ErrInvalidTicker,
  },

  'invalid quote denom': {
    message: 'The quote denom is not valid',
    code: ChainInsuranceErrorCodes.ErrInvalidQuoteDenom,
  },

  'invalid oracle': {
    message: 'The oracle is not valid',
    code: ChainInsuranceErrorCodes.ErrInvalidOracle,
  },

  'invalid expiration time': {
    message: 'The expiration time is not valid',
    code: ChainInsuranceErrorCodes.ErrInvalidExpirationTime,
  },

  'invalid marketID': {
    message: 'The marketId is not valid',
    code: ChainInsuranceErrorCodes.ErrInvalidMarketID,
  },

  'invalid share denom': {
    message: 'The share denom is not valid',
    code: ChainInsuranceErrorCodes.ErrInvalidShareDenom,
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

  'invalid base denom': {
    message: '',
    code: ChainExchangeModuleErrorCode.ErrInvalidBaseDenom,
  },

  'invalid expiry': {
    message: 'The expiry date is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidExpiry,
  },

  'invalid price': {
    message: 'The price is not valid',
    code: ChainExchangeModuleErrorCode.ErrInvalidPrice,
  },

  'invalid quantity': {
    message: 'The quantity is not valid',
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
    message: 'The margin ratio is not valid',
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
    message: 'The state is not valid',
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

export const chainCodeErrorMessagesMap: Record<number, string> = {
  [ChainCosmosErrorCode.ErrInsufficientFee]:
    'You do not have enough funds to cover the transaction fees.',
  [ChainCosmosErrorCode.ErrInsufficientFunds]: 'You do not have enough funds.',
  [ChainCosmosErrorCode.ErrTxTimeoutHeight]:
    'The transaction failed to be included within a block on time.',
  [ChainCosmosErrorCode.ErrTxDecode]:
    'There is an issue while parsing the transaction',
  [ChainCosmosErrorCode.ErrInvalidSequence]: 'The sequence number is not valid',
  [ChainCosmosErrorCode.ErrUnauthorized]: 'Unauthorized',
  [ChainCosmosErrorCode.ErrUnknownRequest]: 'The request is not known',
  [ChainCosmosErrorCode.ErrInvalidAddress]: 'The address is not valid',
  [ChainCosmosErrorCode.ErrInvalidPubKey]: 'The public key is not valid',
  [ChainCosmosErrorCode.ErrUnknownAddress]: 'The address is unknown',
  [ChainCosmosErrorCode.ErrInvalidCoins]: 'The coins are not valid',
  [ChainCosmosErrorCode.ErrOutOfGas]: 'The transaction run out of gas',
  [ChainCosmosErrorCode.ErrMemoTooLarge]:
    'The memo field in the transaction is too large',
  [ChainCosmosErrorCode.ErrTooManySignatures]:
    'The transaction exceeded the maximum number of signatures',
  [ChainCosmosErrorCode.ErrNoSignatures]:
    'There are no signatures appended on the transaction',
  [ChainCosmosErrorCode.ErrJSONMarshal]:
    'There is an issue while parsing the transaction',
  [ChainCosmosErrorCode.ErrJSONUnmarshal]:
    'There is an issue while parsing the transaction',
  [ChainCosmosErrorCode.ErrInvalidRequest]: 'invalid request',
  [ChainCosmosErrorCode.ErrTxInMempoolCache]:
    'The transaction is already in the mempool',
  [ChainCosmosErrorCode.ErrMempoolIsFull]: 'The mempool is full',
  [ChainCosmosErrorCode.ErrTxTooLarge]: 'The transaction is too large',
  [ChainCosmosErrorCode.ErrKeyNotFound]: 'The key has not been found',
  [ChainCosmosErrorCode.ErrWrongPassword]: 'invalid account password',
  [ChainCosmosErrorCode.ErrorInvalidSigner]:
    'tx intended signer does not match the given signer',
  [ChainCosmosErrorCode.ErrorInvalidGasAdjustment]: 'invalid gas adjustment',
  [ChainCosmosErrorCode.ErrInvalidHeight]:
    'The height provided in the transaction is not valid',
  [ChainCosmosErrorCode.ErrInvalidVersion]:
    'The version provided in the transaction is not valid',
  [ChainCosmosErrorCode.ErrInvalidChainID]:
    'The chainId provided in the transaction is not valid',
  [ChainCosmosErrorCode.ErrInvalidType]:
    'The type provided in the transaction is not valid',
  [ChainCosmosErrorCode.ErrUnknownExtensionOptions]:
    'The extension options provided in the transaction is unknown',
  [ChainCosmosErrorCode.ErrWrongSequence]:
    'The sequence number provided in the transaction is incorrect',
  [ChainCosmosErrorCode.ErrPackAny]: 'failed packing protobuf message to Any',
  [ChainCosmosErrorCode.ErrUnpackAny]:
    'failed unpacking protobuf message from Any',
  [ChainCosmosErrorCode.ErrLogic]: 'Internal logic error',
  [ChainCosmosErrorCode.ErrConflict]: 'conflict',
  [ChainCosmosErrorCode.ErrNotSupported]: 'The feature is not supported',
  [ChainCosmosErrorCode.ErrNotFound]: 'not found',
  [ChainCosmosErrorCode.ErrIO]: 'Internal IO error',
  [ChainCosmosErrorCode.ErrAppConfig]: 'error in app.toml',
  [ChainCosmosErrorCode.ErrInvalidGasLimit]:
    'The gas limit provided in the transaction is not valid',
  // Auction Module Messages
  [ChainAuctionErrorCodes.ErrBidInvalid]:
    'The gas limit provided in the transaction is not valid',
  [ChainAuctionErrorCodes.ErrBidRound]:
    'The gas limit provided in the transaction is not valid',
  // Insurance Module Messages
  [ChainInsuranceErrorCodes.ErrInsuranceFundAlreadyExists]:
    'The insurance fund already exists',
  [ChainInsuranceErrorCodes.ErrInsuranceFundNotFound]:
    'The insurance fund is not found',
  [ChainInsuranceErrorCodes.ErrRedemptionAlreadyExists]:
    'The redemption already exists',
  [ChainInsuranceErrorCodes.ErrInvalidDepositAmount]:
    'The deposit amount is not valid',
  [ChainInsuranceErrorCodes.ErrInvalidDepositDenom]:
    'The deposit denom is not valid',
  [ChainInsuranceErrorCodes.ErrPayoutTooLarge]:
    'The insurance fund payout exceeds the deposits',
  [ChainInsuranceErrorCodes.ErrInvalidTicker]: 'The ticker is not valid',
  [ChainInsuranceErrorCodes.ErrInvalidQuoteDenom]:
    'The quote denom is not valid',
  [ChainInsuranceErrorCodes.ErrInvalidOracle]: 'The oracle is not valid',
  [ChainInsuranceErrorCodes.ErrInvalidExpirationTime]:
    'The expiration time is not valid',
  [ChainInsuranceErrorCodes.ErrInvalidMarketID]: 'The marketId is not valid',
  [ChainInsuranceErrorCodes.ErrInvalidShareDenom]:
    'The share denom is not valid',
  // Exchange Module Messages
  [ChainExchangeModuleErrorCode.ErrOrderInvalid]:
    'Your order failed to validate',
  [ChainExchangeModuleErrorCode.ErrSpotMarketNotFound]:
    'The spot market has not been found',
  [ChainExchangeModuleErrorCode.ErrSpotMarketExists]:
    'The spot market already exists',
  [ChainExchangeModuleErrorCode.ErrBadField]:
    'There is an issue with your order',
  [ChainExchangeModuleErrorCode.ErrMarketInvalid]:
    'The market failed to validate',
  [ChainExchangeModuleErrorCode.ErrInsufficientDeposit]:
    'Your trading account has insufficient funds',
  [ChainExchangeModuleErrorCode.ErrUnrecognizedOrderType]:
    'The order type is not recognized',
  [ChainExchangeModuleErrorCode.ErrInsufficientPositionQuantity]:
    'The position quantity is insufficient for the order',
  [ChainExchangeModuleErrorCode.ErrOrderHashInvalid]:
    'The order hash is not valid',
  [ChainExchangeModuleErrorCode.ErrBadSubaccountID]:
    'The subaccount id is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidBaseDenom]: '',
  [ChainExchangeModuleErrorCode.ErrInvalidExpiry]:
    'The expiry date is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidPrice]: 'The price is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidQuantity]:
    'The quantity is not valid',
  [ChainExchangeModuleErrorCode.ErrUnsupportedOracleType]:
    'The oracle type is not supported',
  [ChainExchangeModuleErrorCode.ErrOrderDoesntExist]:
    'The order does not exist',
  [ChainExchangeModuleErrorCode.ErrOrderbookFillInvalid]: '',
  [ChainExchangeModuleErrorCode.ErrPerpetualMarketExists]:
    'The perpetual market already exists',
  [ChainExchangeModuleErrorCode.ErrExpiryFuturesMarketExists]:
    'The expiry futures market market already exists',
  [ChainExchangeModuleErrorCode.ErrExpiryFuturesMarketExpired]:
    'The expiry futures market has expired',
  [ChainExchangeModuleErrorCode.ErrNoLiquidity]:
    'There is not enough liquidity',
  [ChainExchangeModuleErrorCode.ErrSlippageExceedsWorstPrice]:
    'There is not enough liquidity',
  [ChainExchangeModuleErrorCode.ErrInsufficientOrderMargin]:
    'The order has insufficient margin',
  [ChainExchangeModuleErrorCode.ErrDerivativeMarketNotFound]:
    'The derivative market cannot be found',
  [ChainExchangeModuleErrorCode.ErrPositionNotFound]:
    'The position cannot be found',
  [ChainExchangeModuleErrorCode.ErrInvalidReduceOnlyPositionDirection]:
    'Position direction does not oppose the reduce-only order',
  [ChainExchangeModuleErrorCode.ErrPriceSurpassesBankruptcyPrice]:
    'Your order price surpasses bankruptcy price',
  [ChainExchangeModuleErrorCode.ErrPositionNotLiquidable]:
    'The position is not liquidable',
  [ChainExchangeModuleErrorCode.ErrInvalidTriggerPrice]:
    'Your order trigger price is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidOracleType]:
    'The oracle type is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidPriceTickSize]:
    'The minimum price tick size is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidQuantityTickSize]:
    'The minimum quantity tick size is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidMargin]:
    "Your order's minimum margin is not valid ",
  [ChainExchangeModuleErrorCode.ErrExceedsOrderSideCount]:
    'You cannot have more orders for this market for this direction',
  [ChainExchangeModuleErrorCode.ErrMarketOrderAlreadyExists]:
    'You cannot place another market order within this block',
  [ChainExchangeModuleErrorCode.ErrConditionalMarketOrderAlreadyExists]:
    'You cannot place another conditional market order',
  [ChainExchangeModuleErrorCode.ErrMarketLaunchProposalAlreadyExists]:
    'There is an existing equivalent market launch proposal.',
  [ChainExchangeModuleErrorCode.ErrInvalidMarketStatus]:
    'The market status is not valid',
  [ChainExchangeModuleErrorCode.ErrSameDenoms]:
    'The base denom and quote denom cannot be same',
  [ChainExchangeModuleErrorCode.ErrSameOracles]:
    'The oracle base and the oracle quote cannot be the same',
  [ChainExchangeModuleErrorCode.ErrFeeRatesRelation]:
    'The MakerFeeRate does not match TakerFeeRate requirements',
  [ChainExchangeModuleErrorCode.ErrMarginsRelation]:
    'The MaintenanceMarginRatio cannot be greater than InitialMarginRatio',
  [ChainExchangeModuleErrorCode.ErrExceedsMaxOracleScaleFactor]:
    'The OracleScaleFactor cannot be greater than MaxOracleScaleFactor',
  [ChainExchangeModuleErrorCode.ErrSpotExchangeNotEnabled]:
    'Spot exchange is not enabled yet',
  [ChainExchangeModuleErrorCode.ErrDerivativesExchangeNotEnabled]:
    'Derivatives exchange is not enabled yet',
  [ChainExchangeModuleErrorCode.ErrOraclePriceDeltaExceedsThreshold]:
    'The oracle price delta exceeds threshold',
  [ChainExchangeModuleErrorCode.ErrInvalidHourlyInterestRate]:
    'The hourly interest rate is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidHourlyFundingRateCap]:
    'The hourly funding rate cap is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidMarketFundingParamUpdate]:
    'You can only update funding parameters on perpetual markets.',
  [ChainExchangeModuleErrorCode.ErrInvalidTradingRewardCampaign]:
    'The trading reward campaign is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidFeeDiscountSchedule]:
    'The fee discount schedule is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidLiquidationOrder]:
    'The liquidation order is not valid',
  [ChainExchangeModuleErrorCode.ErrTradingRewardCampaignDistributionError]:
    'Unknown error happened for campaign distributions',
  [ChainExchangeModuleErrorCode.ErrInvalidTradingRewardsPendingPointsUpdate]:
    'The updated trading reward points is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidBatchMsgUpdate]:
    'The MsgBatchUpdate is not valid',
  [ChainExchangeModuleErrorCode.ErrExceedsTopOfBookPrice]:
    'The post-only order price exceeds top of the orderbook price',
  [ChainExchangeModuleErrorCode.ErrInvalidOrderTypeForMessage]:
    'The order type is not supported for this message',
  [ChainExchangeModuleErrorCode.ErrInvalidDMMSender]:
    'The sender must match the DMM address',
  [ChainExchangeModuleErrorCode.ErrAlreadyOptedOutOfRewards]:
    'The DMM address already opted out of rewards',
  [ChainExchangeModuleErrorCode.ErrInvalidMarginRatio]:
    'The margin ratio is not valid',
  [ChainExchangeModuleErrorCode.ErrBelowMinimalContribution]:
    'The provided funds are below minimum',
  [ChainExchangeModuleErrorCode.ErrLowPositionMargin]:
    'The position is below initial margin requirement',
  [ChainExchangeModuleErrorCode.ErrInvalidTotalSupply]:
    'The pool has non-positive total LP token supply',
  [ChainExchangeModuleErrorCode.ErrInvalidLpTokenBurnAmount]:
    'The passed LP token burn amount is greater than total LP token supply',
  [ChainExchangeModuleErrorCode.ErrUnsupportedAction]:
    'This action is not supported',
  [ChainExchangeModuleErrorCode.ErrNegativePositionQuantity]:
    'The position quantity cannot be negative',
  [ChainExchangeModuleErrorCode.ErrBinaryOptionsMarketExists]:
    'The BinaryOptions market already exists',
  [ChainExchangeModuleErrorCode.ErrBinaryOptionsMarketNotFound]:
    'The BinaryOptions market cannot be found',
  [ChainExchangeModuleErrorCode.ErrInvalidSettlement]:
    'The settlement price is not valid',
  [ChainExchangeModuleErrorCode.ErrAccountDoesntExist]:
    'The trading account does not exist',
  [ChainExchangeModuleErrorCode.ErrSenderIsNotAnAdmin]:
    'The sender should be the admin of the market',
  [ChainExchangeModuleErrorCode.ErrMarketAlreadyScheduledToSettle]:
    'The market is already scheduled to settle ',
  [ChainExchangeModuleErrorCode.ErrGenericMarketNotFound]:
    'The market cannot be found',
  [ChainExchangeModuleErrorCode.ErrInvalidDenomDecimal]:
    'The denom decimal cannot be below 1 or above max scale factor',
  [ChainExchangeModuleErrorCode.ErrInvalidState]: 'The state is not valid',
  [ChainExchangeModuleErrorCode.ErrTransientOrdersUpToCancelNotSupported]:
    'The transient orders up to cancellation not supported',
  [ChainExchangeModuleErrorCode.ErrInvalidTrade]: 'The trade is not valid',
  [ChainExchangeModuleErrorCode.ErrNoMarginLocked]:
    'There is no margin locked in the trading account',
  [ChainExchangeModuleErrorCode.ErrInvalidAccessLevel]:
    'There is no access to perform action',
  [ChainExchangeModuleErrorCode.ErrInvalidAddress]: 'The address is not valid',
  [ChainExchangeModuleErrorCode.ErrInvalidArgument]:
    'The argument is not valid',
}
