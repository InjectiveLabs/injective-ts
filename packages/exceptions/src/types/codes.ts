import type { grpc } from '@improbable-eng/grpc-web'
import { StatusCodes } from 'http-status-codes'

export enum ChainCosmosErrorCode {
  // ErrTxDecode is returned if we cannot parse a transaction
  ErrTxDecode = 2,
  // ErrInvalidSequence is used the sequence number (nonce) is incorrect for the signature
  ErrInvalidSequence = 3,
  // ErrUnauthorized is used whenever a request without sufficient authorization is handled.
  ErrUnauthorized = 4,
  // ErrInsufficientFunds is used when the account cannot pay requested amount.
  ErrInsufficientFunds = 5,
  // ErrUnknownRequest to doc
  ErrUnknownRequest = 6,
  // ErrInvalidAddress to doc
  ErrInvalidAddress = 7,
  // ErrInvalidPubKey to doc
  ErrInvalidPubKey = 8,
  // ErrUnknownAddress to doc
  ErrUnknownAddress = 9,
  // ErrInvalidCoins to doc
  ErrInvalidCoins = 10,
  // ErrOutOfGas to doc
  ErrOutOfGas = 11,
  // ErrMemoTooLarge to doc
  ErrMemoTooLarge = 12,
  // ErrInsufficientFee to doc
  ErrInsufficientFee = 13,
  // ErrTooManySignatures to doc
  ErrTooManySignatures = 14,
  // ErrNoSignatures to doc
  ErrNoSignatures = 15,
  // ErrJSONMarshal defines an ABCI typed JSON marshalling error
  ErrJSONMarshal = 16,
  // ErrJSONUnmarshal defines an ABCI typed JSON unmarshalling error
  ErrJSONUnmarshal = 17,
  // ErrInvalidRequest defines an ABCI typed error where the request contains invalid data.
  ErrInvalidRequest = 18,
  // ErrTxInMempoolCache defines an ABCI typed error where a tx already exists in the mempool.
  ErrTxInMempoolCache = 19,
  // ErrMempoolIsFull defines an ABCI typed error where the mempool is full.
  ErrMempoolIsFull = 20,
  // ErrTxTooLarge defines an ABCI typed error where tx is too large.
  ErrTxTooLarge = 21,
  // ErrKeyNotFound defines an error when the key doesn't exist
  ErrKeyNotFound = 22,
  // ErrWrongPassword defines an error when the key password is invalid.
  ErrWrongPassword = 23,
  // ErrorInvalidSigner defines an error when the tx intended signer does not match the given signer.
  ErrorInvalidSigner = 24,
  // ErrorInvalidGasAdjustment defines an error for an invalid gas adjustment
  ErrorInvalidGasAdjustment = 25,
  // ErrInvalidHeight defines an error for an invalid height
  ErrInvalidHeight = 26,
  // ErrInvalidVersion defines a general error for an invalid version
  ErrInvalidVersion = 27,
  // ErrInvalidChainID defines an error when the chain-id is invalid.
  ErrInvalidChainID = 28,
  // ErrInvalidType defines an error an invalid type.
  ErrInvalidType = 29,
  // ErrTxTimeoutHeight defines an error for when a tx is rejected out due to an explicitly set timeout height.
  ErrTxTimeoutHeight = 30,
  // ErrUnknownExtensionOptions defines an error for unknown extension options.
  ErrUnknownExtensionOptions = 31,
  // ErrWrongSequence defines an error where the account sequence defined in the signer info doesn't match the account's actual sequence number.
  ErrWrongSequence = 32,
  // ErrPackAny defines an error when packing a protobuf message to Any fails.
  ErrPackAny = 33,
  // ErrUnpackAny defines an error when unpacking a protobuf message from Any fails.
  ErrUnpackAny = 34,
  // ErrLogic defines an internal logic error, e.g. an invariant or assertion that is violated. It is a programmer error, not a user-facing error.
  ErrLogic = 35,
  // ErrConflict defines a conflict error, e.g. when two goroutines try to access the same resource and one of them fails.
  ErrConflict = 36,
  // ErrNotSupported is returned when we call a branch of a code which is currently not supported.
  ErrNotSupported = 37,
  // ErrNotFound defines an error when requested entity doesn't exist in the state.
  ErrNotFound = 38,
  // ErrIO should be used to wrap internal errors caused by external operation. Examples: not DB domain error, file writing etc...
  ErrIO = 39,
  // ErrAppConfig defines an error occurred if min-gas-prices field in BaseConfig is empty.
  ErrAppConfig = 40,
  // ErrInvalidGasLimit defines an error when an invalid GasWanted value is supplied.
  ErrInvalidGasLimit = 41,
}

export enum ChainExchangeModuleErrorCode {
  //  failed to validate order
  ErrOrderInvalid = 1,
  //  spot market not found
  ErrSpotMarketNotFound = 2,
  //  spot market exists
  ErrSpotMarketExists = 3,
  //  struct field error
  ErrBadField = 4,
  //  failed to validate market
  ErrMarketInvalid = 5,
  //  subaccount has insufficient deposits
  ErrInsufficientDeposit = 6,
  //  unrecognized order type
  ErrUnrecognizedOrderType = 7,
  //  position quantity insufficient for order
  ErrInsufficientPositionQuantity = 8,
  //  order hash is not valid
  ErrOrderHashInvalid = 9,
  //  subaccount id is not valid
  ErrBadSubaccountID = 10,
  //  invalid ticker
  ErrInvalidTicker = 11,
  //  invalid base denom
  ErrInvalidBaseDenom = 12,
  //  invalid quote denom
  ErrInvalidQuoteDenom = 13,
  //  invalid oracle
  ErrInvalidOracle = 14,
  //  invalid expiry
  ErrInvalidExpiry = 15,
  //  invalid price
  ErrInvalidPrice = 16,
  //  invalid quantity
  ErrInvalidQuantity = 17,
  //  unsupported oracle type
  ErrUnsupportedOracleType = 18,
  //  order doesnt exist
  ErrOrderDoesntExist = 19,
  //  spot limit orderbook fill invalid
  ErrOrderbookFillInvalid = 20,
  //  perpetual market exists
  ErrPerpetualMarketExists = 21,
  //  expiry futures market exists
  ErrExpiryFuturesMarketExists = 22,
  //  expiry futures market expired
  ErrExpiryFuturesMarketExpired = 23,
  //  no liquidity on the orderbook!
  ErrNoLiquidity = 24,
  //  Orderbook liquidity cannot satisfy current worst price
  ErrSlippageExceedsWorstPrice = 25,
  //  Order has insufficient margin
  ErrInsufficientOrderMargin = 26,
  //  Derivative market not found
  ErrDerivativeMarketNotFound = 27,
  //  Position not found
  ErrPositionNotFound = 28,
  //  Position direction does not oppose the reduce-only order
  ErrInvalidReduceOnlyPositionDirection = 29,
  //  Price Surpasses Bankruptcy Price
  ErrPriceSurpassesBankruptcyPrice = 30,
  //  Position not liquidable
  ErrPositionNotLiquidable = 31,
  //  invalid trigger price
  ErrInvalidTriggerPrice = 32,
  //  invalid oracle type
  ErrInvalidOracleType = 33,
  //  invalid minimum price tick size
  ErrInvalidPriceTickSize = 34,
  //  invalid minimum quantity tick size
  ErrInvalidQuantityTickSize = 35,
  //  invalid minimum order margin
  ErrInvalidMargin = 36,
  //  Exceeds order side count
  ErrExceedsOrderSideCount = 37,
  //  Subaccount cannot place a market order when a market order in the same market was already placed in same block
  ErrMarketOrderAlreadyExists = 38,
  //  cannot place a conditional market order when a conditional market order in same relative direction already exists
  ErrConditionalMarketOrderAlreadyExists = 39,
  //  An equivalent market launch proposal already exists.
  ErrMarketLaunchProposalAlreadyExists = 40,
  //  Invalid Market Status
  ErrInvalidMarketStatus = 41,
  //  base denom cannot be same with quote denom
  ErrSameDenoms = 42,
  //  oracle base cannot be same with oracle quote
  ErrSameOracles = 43,
  //  MakerFeeRate does not match TakerFeeRate requirements
  ErrFeeRatesRelation = 44,
  //  MaintenanceMarginRatio cannot be greater than InitialMarginRatio
  ErrMarginsRelation = 45,
  //  OracleScaleFactor cannot be greater than MaxOracleScaleFactor
  ErrExceedsMaxOracleScaleFactor = 46,
  //  Spot exchange is not enabled yet
  ErrSpotExchangeNotEnabled = 47,
  //  Derivatives exchange is not enabled yet
  ErrDerivativesExchangeNotEnabled = 48,
  //  Oracle price delta exceeds threshold
  ErrOraclePriceDeltaExceedsThreshold = 49,
  //  Invalid hourly interest rate
  ErrInvalidHourlyInterestRate = 50,
  //  Invalid hourly funding rate cap
  ErrInvalidHourlyFundingRateCap = 51,
  //  Only perpetual markets can update funding parameters
  ErrInvalidMarketFundingParamUpdate = 52,
  //  Invalid trading reward campaign
  ErrInvalidTradingRewardCampaign = 53,
  //  Invalid fee discount schedule
  ErrInvalidFeeDiscountSchedule = 54,
  //  invalid liquidation order
  ErrInvalidLiquidationOrder = 55,
  //  Unknown error happened for campaign distributions
  ErrTradingRewardCampaignDistributionError = 56,
  //  Invalid trading reward points update
  ErrInvalidTradingRewardsPendingPointsUpdate = 57,
  //  Invalid batch msg update
  ErrInvalidBatchMsgUpdate = 58,
  //  Post-only order exceeds top of book price
  ErrExceedsTopOfBookPrice = 59,
  //  Order type not supported for given message
  ErrInvalidOrderTypeForMessage = 60,
  //  Sender must match dmm account
  ErrInvalidDMMSender = 61,
  //  already opted out of rewards
  ErrAlreadyOptedOutOfRewards = 62,
  //  Invalid margin ratio
  ErrInvalidMarginRatio = 63,
  //  Provided funds are below minimum
  ErrBelowMinimalContribution = 64,
  //  Position is below initial margin requirement
  ErrLowPositionMargin = 65,
  //  Pool has non-positive total lp token supply
  ErrInvalidTotalSupply = 66,
  //  Passed lp token burn amount is greater than total lp token supply
  ErrInvalidLpTokenBurnAmount = 67,
  //  unsupported action
  ErrUnsupportedAction = 68,
  //  position quantity cannot be negative
  ErrNegativePositionQuantity = 69,
  //  binary options market exists
  ErrBinaryOptionsMarketExists = 70,
  //  binary options market not found
  ErrBinaryOptionsMarketNotFound = 71,
  //  invalid settlement
  ErrInvalidSettlement = 72,
  //  account doesnt exist
  ErrAccountDoesntExist = 73,
  //  sender should be a market admin
  ErrSenderIsNotAnAdmin = 74,
  //  market is already scheduled to settle
  ErrMarketAlreadyScheduledToSettle = 75,
  //  market not found
  ErrGenericMarketNotFound = 76,
  //  denom decimal cannot be below 1 or above max scale factor
  ErrInvalidDenomDecimal = 77,
  //  state is invalid
  ErrInvalidState = 78,
  //  transient orders up to cancellation not supported
  ErrTransientOrdersUpToCancelNotSupported = 79,
  //  invalid trade
  ErrInvalidTrade = 80,
  //  no margin locked in subaccount
  ErrNoMarginLocked = 81,
  //  Invalid access level to perform action
  ErrInvalidAccessLevel = 82,
  //  Invalid address
  ErrInvalidAddress = 83,
  //  Invalid argument
  ErrInvalidArgument = 84,
}

export type IndexerApiErrorCode = number

export const UnspecifiedErrorCode = -1

export type ErrorCode = StatusCodes | typeof UnspecifiedErrorCode | grpc.Code

export type ErrorContextCode =
  | ChainExchangeModuleErrorCode
  | ChainCosmosErrorCode
  | typeof UnspecifiedErrorCode
