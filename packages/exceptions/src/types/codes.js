"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRPC_REQUEST_FAILED = exports.UnspecifiedErrorCode = exports.ChainWasmErrorCodes = exports.ChainBankErrorCodes = exports.ChainDistributionErrorCodes = exports.ChainGovErrorCodes = exports.ChainStakingErrorCodes = exports.ChainWasmXErrorCodes = exports.ChainTokenFactoryErrorCodes = exports.ChainPeggyErrorCodes = exports.ChainOracleErrorCodes = exports.ChainOcrErrorCodes = exports.ChainInsuranceErrorCodes = exports.ChainAuthZErrorCodes = exports.ChainAuctionErrorCodes = exports.ChainExchangeModuleErrorCode = exports.ChainCosmosErrorCode = exports.TransactionChainErrorModule = void 0;
const grpc_web_1 = require("@injectivelabs/grpc-web");
var TransactionChainErrorModule;
(function (TransactionChainErrorModule) {
    TransactionChainErrorModule["Auction"] = "auction";
    TransactionChainErrorModule["CosmosSdk"] = "sdk";
    TransactionChainErrorModule["Staking"] = "staking";
    TransactionChainErrorModule["Bank"] = "bank";
    TransactionChainErrorModule["Distribution"] = "distribution";
    TransactionChainErrorModule["Gov"] = "gov";
    TransactionChainErrorModule["Exchange"] = "exchange";
    TransactionChainErrorModule["Insurance"] = "insurance";
    TransactionChainErrorModule["Ocr"] = "ocr";
    TransactionChainErrorModule["Oracle"] = "oracle";
    TransactionChainErrorModule["Peggy"] = "peggy";
    TransactionChainErrorModule["TokenFactory"] = "tokenfactory";
    TransactionChainErrorModule["Wasmx"] = "wasmx";
    TransactionChainErrorModule["Wasm"] = "wasm";
    TransactionChainErrorModule["AuthZ"] = "authz";
})(TransactionChainErrorModule = exports.TransactionChainErrorModule || (exports.TransactionChainErrorModule = {}));
var ChainCosmosErrorCode;
(function (ChainCosmosErrorCode) {
    // ErrTxDecode is returned if we cannot parse a transaction
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrTxDecode"] = 2] = "ErrTxDecode";
    // ErrInvalidSequence is used the sequence number (nonce) is incorrect for the signature
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrInvalidSequence"] = 3] = "ErrInvalidSequence";
    // ErrUnauthorized is used whenever a request without sufficient authorization is handled.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrUnauthorized"] = 4] = "ErrUnauthorized";
    // ErrInsufficientFunds is used when the account cannot pay requested amount.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrInsufficientFunds"] = 5] = "ErrInsufficientFunds";
    // ErrUnknownRequest to doc
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrUnknownRequest"] = 6] = "ErrUnknownRequest";
    // ErrInvalidAddress to doc
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrInvalidAddress"] = 7] = "ErrInvalidAddress";
    // ErrInvalidPubKey to doc
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrInvalidPubKey"] = 8] = "ErrInvalidPubKey";
    // ErrUnknownAddress to doc
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrUnknownAddress"] = 9] = "ErrUnknownAddress";
    // ErrInvalidCoins to doc
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrInvalidCoins"] = 10] = "ErrInvalidCoins";
    // ErrOutOfGas to doc
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrOutOfGas"] = 11] = "ErrOutOfGas";
    // ErrMemoTooLarge to doc
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrMemoTooLarge"] = 12] = "ErrMemoTooLarge";
    // ErrInsufficientFee to doc
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrInsufficientFee"] = 13] = "ErrInsufficientFee";
    // ErrTooManySignatures to doc
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrTooManySignatures"] = 14] = "ErrTooManySignatures";
    // ErrNoSignatures to doc
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrNoSignatures"] = 15] = "ErrNoSignatures";
    // ErrJSONMarshal defines an ABCI typed JSON marshalling error
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrJSONMarshal"] = 16] = "ErrJSONMarshal";
    // ErrJSONUnmarshal defines an ABCI typed JSON unmarshalling error
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrJSONUnmarshal"] = 17] = "ErrJSONUnmarshal";
    // ErrInvalidRequest defines an ABCI typed error where the request contains invalid data.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrInvalidRequest"] = 18] = "ErrInvalidRequest";
    // ErrTxInMempoolCache defines an ABCI typed error where a tx already exists in the mempool.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrTxInMempoolCache"] = 19] = "ErrTxInMempoolCache";
    // ErrMempoolIsFull defines an ABCI typed error where the mempool is full.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrMempoolIsFull"] = 20] = "ErrMempoolIsFull";
    // ErrTxTooLarge defines an ABCI typed error where tx is too large.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrTxTooLarge"] = 21] = "ErrTxTooLarge";
    // ErrKeyNotFound defines an error when the key doesn't exist
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrKeyNotFound"] = 22] = "ErrKeyNotFound";
    // ErrWrongPassword defines an error when the key password is invalid.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrWrongPassword"] = 23] = "ErrWrongPassword";
    // ErrorInvalidSigner defines an error when the tx intended signer does not match the given signer.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrorInvalidSigner"] = 24] = "ErrorInvalidSigner";
    // ErrorInvalidGasAdjustment defines an error for an invalid gas adjustment
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrorInvalidGasAdjustment"] = 25] = "ErrorInvalidGasAdjustment";
    // ErrInvalidHeight defines an error for an invalid height
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrInvalidHeight"] = 26] = "ErrInvalidHeight";
    // ErrInvalidVersion defines a general error for an invalid version
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrInvalidVersion"] = 27] = "ErrInvalidVersion";
    // ErrInvalidChainID defines an error when the chain-id is invalid.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrInvalidChainID"] = 28] = "ErrInvalidChainID";
    // ErrInvalidType defines an error an invalid type.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrInvalidType"] = 29] = "ErrInvalidType";
    // ErrTxTimeoutHeight defines an error for when a tx is rejected out due to an explicitly set timeout height.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrTxTimeoutHeight"] = 30] = "ErrTxTimeoutHeight";
    // ErrUnknownExtensionOptions defines an error for unknown extension options.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrUnknownExtensionOptions"] = 31] = "ErrUnknownExtensionOptions";
    // ErrWrongSequence defines an error where the account sequence defined in the signer info doesn't match the account's actual sequence number.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrWrongSequence"] = 32] = "ErrWrongSequence";
    // ErrPackAny defines an error when packing a protobuf message to Any fails.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrPackAny"] = 33] = "ErrPackAny";
    // ErrUnpackAny defines an error when unpacking a protobuf message from Any fails.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrUnpackAny"] = 34] = "ErrUnpackAny";
    // ErrLogic defines an internal logic error, e.g. an invariant or assertion that is violated. It is a programmer error, not a user-facing error.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrLogic"] = 35] = "ErrLogic";
    // ErrConflict defines a conflict error, e.g. when two goroutines try to access the same resource and one of them fails.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrConflict"] = 36] = "ErrConflict";
    // ErrNotSupported is returned when we call a branch of a code which is currently not supported.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrNotSupported"] = 37] = "ErrNotSupported";
    // ErrNotFound defines an error when requested entity doesn't exist in the state.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrNotFound"] = 38] = "ErrNotFound";
    // ErrIO should be used to wrap internal errors caused by external operation. Examples: not DB domain error, file writing etc...
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrIO"] = 39] = "ErrIO";
    // ErrAppConfig defines an error occurred if min-gas-prices field in BaseConfig is empty.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrAppConfig"] = 40] = "ErrAppConfig";
    // ErrInvalidGasLimit defines an error when an invalid GasWanted value is supplied.
    ChainCosmosErrorCode[ChainCosmosErrorCode["ErrInvalidGasLimit"] = 41] = "ErrInvalidGasLimit";
})(ChainCosmosErrorCode = exports.ChainCosmosErrorCode || (exports.ChainCosmosErrorCode = {}));
var ChainExchangeModuleErrorCode;
(function (ChainExchangeModuleErrorCode) {
    //  failed to validate order
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrOrderInvalid"] = 1] = "ErrOrderInvalid";
    //  spot market not found
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrSpotMarketNotFound"] = 2] = "ErrSpotMarketNotFound";
    //  spot market exists
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrSpotMarketExists"] = 3] = "ErrSpotMarketExists";
    //  struct field error
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrBadField"] = 4] = "ErrBadField";
    //  failed to validate market
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrMarketInvalid"] = 5] = "ErrMarketInvalid";
    //  subaccount has insufficient deposits
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInsufficientDeposit"] = 6] = "ErrInsufficientDeposit";
    //  unrecognized order type
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrUnrecognizedOrderType"] = 7] = "ErrUnrecognizedOrderType";
    //  position quantity insufficient for order
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInsufficientPositionQuantity"] = 8] = "ErrInsufficientPositionQuantity";
    //  order hash is not valid
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrOrderHashInvalid"] = 9] = "ErrOrderHashInvalid";
    //  subaccount id is not valid
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrBadSubaccountID"] = 10] = "ErrBadSubaccountID";
    //  invalid ticker
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidTicker"] = 11] = "ErrInvalidTicker";
    //  invalid base denom
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidBaseDenom"] = 12] = "ErrInvalidBaseDenom";
    //  invalid quote denom
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidQuoteDenom"] = 13] = "ErrInvalidQuoteDenom";
    //  invalid oracle
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidOracle"] = 14] = "ErrInvalidOracle";
    //  invalid expiry
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidExpiry"] = 15] = "ErrInvalidExpiry";
    //  invalid price
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidPrice"] = 16] = "ErrInvalidPrice";
    //  invalid quantity
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidQuantity"] = 17] = "ErrInvalidQuantity";
    //  unsupported oracle type
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrUnsupportedOracleType"] = 18] = "ErrUnsupportedOracleType";
    //  order doesnt exist
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrOrderDoesntExist"] = 19] = "ErrOrderDoesntExist";
    //  spot limit orderbook fill invalid
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrOrderbookFillInvalid"] = 20] = "ErrOrderbookFillInvalid";
    //  perpetual market exists
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrPerpetualMarketExists"] = 21] = "ErrPerpetualMarketExists";
    //  expiry futures market exists
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrExpiryFuturesMarketExists"] = 22] = "ErrExpiryFuturesMarketExists";
    //  expiry futures market expired
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrExpiryFuturesMarketExpired"] = 23] = "ErrExpiryFuturesMarketExpired";
    //  no liquidity on the orderbook!
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrNoLiquidity"] = 24] = "ErrNoLiquidity";
    //  Orderbook liquidity cannot satisfy current worst price
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrSlippageExceedsWorstPrice"] = 25] = "ErrSlippageExceedsWorstPrice";
    //  Order has insufficient margin
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInsufficientOrderMargin"] = 26] = "ErrInsufficientOrderMargin";
    //  Derivative market not found
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrDerivativeMarketNotFound"] = 27] = "ErrDerivativeMarketNotFound";
    //  Position not found
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrPositionNotFound"] = 28] = "ErrPositionNotFound";
    //  Position direction does not oppose the reduce-only order
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidReduceOnlyPositionDirection"] = 29] = "ErrInvalidReduceOnlyPositionDirection";
    //  Price Surpasses Bankruptcy Price
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrPriceSurpassesBankruptcyPrice"] = 30] = "ErrPriceSurpassesBankruptcyPrice";
    //  Position not liquidable
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrPositionNotLiquidable"] = 31] = "ErrPositionNotLiquidable";
    //  invalid trigger price
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidTriggerPrice"] = 32] = "ErrInvalidTriggerPrice";
    //  invalid oracle type
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidOracleType"] = 33] = "ErrInvalidOracleType";
    //  invalid minimum price tick size
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidPriceTickSize"] = 34] = "ErrInvalidPriceTickSize";
    //  invalid minimum quantity tick size
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidQuantityTickSize"] = 35] = "ErrInvalidQuantityTickSize";
    //  invalid minimum order margin
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidMargin"] = 36] = "ErrInvalidMargin";
    //  Exceeds order side count
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrExceedsOrderSideCount"] = 37] = "ErrExceedsOrderSideCount";
    //  Subaccount cannot place a market order when a market order in the same market was already placed in same block
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrMarketOrderAlreadyExists"] = 38] = "ErrMarketOrderAlreadyExists";
    //  cannot place a conditional market order when a conditional market order in same relative direction already exists
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrConditionalMarketOrderAlreadyExists"] = 39] = "ErrConditionalMarketOrderAlreadyExists";
    //  An equivalent market launch proposal already exists.
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrMarketLaunchProposalAlreadyExists"] = 40] = "ErrMarketLaunchProposalAlreadyExists";
    //  Invalid Market Status
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidMarketStatus"] = 41] = "ErrInvalidMarketStatus";
    //  base denom cannot be same with quote denom
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrSameDenoms"] = 42] = "ErrSameDenoms";
    //  oracle base cannot be same with oracle quote
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrSameOracles"] = 43] = "ErrSameOracles";
    //  MakerFeeRate does not match TakerFeeRate requirements
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrFeeRatesRelation"] = 44] = "ErrFeeRatesRelation";
    //  MaintenanceMarginRatio cannot be greater than InitialMarginRatio
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrMarginsRelation"] = 45] = "ErrMarginsRelation";
    //  OracleScaleFactor cannot be greater than MaxOracleScaleFactor
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrExceedsMaxOracleScaleFactor"] = 46] = "ErrExceedsMaxOracleScaleFactor";
    //  Spot exchange is not enabled yet
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrSpotExchangeNotEnabled"] = 47] = "ErrSpotExchangeNotEnabled";
    //  Derivatives exchange is not enabled yet
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrDerivativesExchangeNotEnabled"] = 48] = "ErrDerivativesExchangeNotEnabled";
    //  Oracle price delta exceeds threshold
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrOraclePriceDeltaExceedsThreshold"] = 49] = "ErrOraclePriceDeltaExceedsThreshold";
    //  Invalid hourly interest rate
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidHourlyInterestRate"] = 50] = "ErrInvalidHourlyInterestRate";
    //  Invalid hourly funding rate cap
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidHourlyFundingRateCap"] = 51] = "ErrInvalidHourlyFundingRateCap";
    //  Only perpetual markets can update funding parameters
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidMarketFundingParamUpdate"] = 52] = "ErrInvalidMarketFundingParamUpdate";
    //  Invalid trading reward campaign
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidTradingRewardCampaign"] = 53] = "ErrInvalidTradingRewardCampaign";
    //  Invalid fee discount schedule
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidFeeDiscountSchedule"] = 54] = "ErrInvalidFeeDiscountSchedule";
    //  invalid liquidation order
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidLiquidationOrder"] = 55] = "ErrInvalidLiquidationOrder";
    //  Unknown error happened for campaign distributions
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrTradingRewardCampaignDistributionError"] = 56] = "ErrTradingRewardCampaignDistributionError";
    //  Invalid trading reward points update
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidTradingRewardsPendingPointsUpdate"] = 57] = "ErrInvalidTradingRewardsPendingPointsUpdate";
    //  Invalid batch msg update
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidBatchMsgUpdate"] = 58] = "ErrInvalidBatchMsgUpdate";
    //  Post-only order exceeds top of book price
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrExceedsTopOfBookPrice"] = 59] = "ErrExceedsTopOfBookPrice";
    //  Order type not supported for given message
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidOrderTypeForMessage"] = 60] = "ErrInvalidOrderTypeForMessage";
    //  Sender must match dmm account
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidDMMSender"] = 61] = "ErrInvalidDMMSender";
    //  already opted out of rewards
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrAlreadyOptedOutOfRewards"] = 62] = "ErrAlreadyOptedOutOfRewards";
    //  Invalid margin ratio
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidMarginRatio"] = 63] = "ErrInvalidMarginRatio";
    //  Provided funds are below minimum
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrBelowMinimalContribution"] = 64] = "ErrBelowMinimalContribution";
    //  Position is below initial margin requirement
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrLowPositionMargin"] = 65] = "ErrLowPositionMargin";
    //  Pool has non-positive total lp token supply
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidTotalSupply"] = 66] = "ErrInvalidTotalSupply";
    //  Passed lp token burn amount is greater than total lp token supply
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidLpTokenBurnAmount"] = 67] = "ErrInvalidLpTokenBurnAmount";
    //  unsupported action
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrUnsupportedAction"] = 68] = "ErrUnsupportedAction";
    //  position quantity cannot be negative
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrNegativePositionQuantity"] = 69] = "ErrNegativePositionQuantity";
    //  binary options market exists
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrBinaryOptionsMarketExists"] = 70] = "ErrBinaryOptionsMarketExists";
    //  binary options market not found
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrBinaryOptionsMarketNotFound"] = 71] = "ErrBinaryOptionsMarketNotFound";
    //  invalid settlement
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidSettlement"] = 72] = "ErrInvalidSettlement";
    //  account doesnt exist
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrAccountDoesntExist"] = 73] = "ErrAccountDoesntExist";
    //  sender should be a market admin
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrSenderIsNotAnAdmin"] = 74] = "ErrSenderIsNotAnAdmin";
    //  market is already scheduled to settle
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrMarketAlreadyScheduledToSettle"] = 75] = "ErrMarketAlreadyScheduledToSettle";
    //  market not found
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrGenericMarketNotFound"] = 76] = "ErrGenericMarketNotFound";
    //  denom decimal cannot be below 1 or above max scale factor
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidDenomDecimal"] = 77] = "ErrInvalidDenomDecimal";
    //  state is invalid
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidState"] = 78] = "ErrInvalidState";
    //  transient orders up to cancellation not supported
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrTransientOrdersUpToCancelNotSupported"] = 79] = "ErrTransientOrdersUpToCancelNotSupported";
    //  invalid trade
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidTrade"] = 80] = "ErrInvalidTrade";
    //  no margin locked in subaccount
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrNoMarginLocked"] = 81] = "ErrNoMarginLocked";
    //  Invalid access level to perform action
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidAccessLevel"] = 82] = "ErrInvalidAccessLevel";
    //  Invalid address
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidAddress"] = 83] = "ErrInvalidAddress";
    //  Invalid argument
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidArgument"] = 84] = "ErrInvalidArgument";
    // Invalid funds direction
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidFundsDirection"] = 85] = "ErrInvalidFundsDirection";
    // No funds provided
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrNoFundsProvided"] = 86] = "ErrNoFundsProvided";
    // Invalid signature
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidSignature"] = 87] = "ErrInvalidSignature";
    // no funds to unlock
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrNoFundsToUnlock"] = 88] = "ErrNoFundsToUnlock";
    // No msgs provided
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrNoMsgsProvided"] = 89] = "ErrNoMsgsProvided";
    // No msg provided
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrNoMsgProvided"] = 90] = "ErrNoMsgProvided";
    // Invalid amount
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidAmount"] = 91] = "ErrInvalidAmount";
    // The current feature has been disabled
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrFeatureDisabled"] = 92] = "ErrFeatureDisabled";
    // Order has too much margin
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrTooMuchOrderMargin"] = 93] = "ErrTooMuchOrderMargin";
    // Order has too much margin
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrBadSubaccountNonce"] = 94] = "ErrBadSubaccountNonce";
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInsufficientFunds"] = 95] = "ErrInsufficientFunds";
    // Exchange is in post-only mode
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrPostOnlyMode"] = 96] = "ErrPostOnlyMode";
    // client order id already exists
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrClientOrderIdAlreadyExists"] = 97] = "ErrClientOrderIdAlreadyExists";
    // client order id is invalid. Max length is 36 chars
    ChainExchangeModuleErrorCode[ChainExchangeModuleErrorCode["ErrInvalidCid"] = 98] = "ErrInvalidCid";
})(ChainExchangeModuleErrorCode = exports.ChainExchangeModuleErrorCode || (exports.ChainExchangeModuleErrorCode = {}));
var ChainAuctionErrorCodes;
(function (ChainAuctionErrorCodes) {
    // invalid bid denom
    ChainAuctionErrorCodes[ChainAuctionErrorCodes["ErrBidInvalid"] = 1] = "ErrBidInvalid";
    // invalid bid round
    ChainAuctionErrorCodes[ChainAuctionErrorCodes["ErrBidRound"] = 2] = "ErrBidRound";
})(ChainAuctionErrorCodes = exports.ChainAuctionErrorCodes || (exports.ChainAuctionErrorCodes = {}));
var ChainAuthZErrorCodes;
(function (ChainAuthZErrorCodes) {
    // ErrNoAuthorizationFound error if there is no authorization found given a grant key
    ChainAuthZErrorCodes[ChainAuthZErrorCodes["ErrNoAuthorizationFound"] = 2] = "ErrNoAuthorizationFound";
    // ErrInvalidExpirationTime error if the set expiration time is in the past
    ChainAuthZErrorCodes[ChainAuthZErrorCodes["ErrInvalidExpirationTime"] = 3] = "ErrInvalidExpirationTime";
    // ErrUnknownAuthorizationType error for unknown authorization type
    ChainAuthZErrorCodes[ChainAuthZErrorCodes["ErrUnknownAuthorizationType"] = 4] = "ErrUnknownAuthorizationType";
    // ErrNoGrantKeyFound error if the requested grant key does not exist
    ChainAuthZErrorCodes[ChainAuthZErrorCodes["ErrNoGrantKeyFound"] = 5] = "ErrNoGrantKeyFound";
    // ErrAuthorizationExpired error if the authorization has expired
    ChainAuthZErrorCodes[ChainAuthZErrorCodes["ErrAuthorizationExpired"] = 6] = "ErrAuthorizationExpired";
    // ErrGranteeIsGranter error if the grantee and the granter are the same
    ChainAuthZErrorCodes[ChainAuthZErrorCodes["ErrGranteeIsGranter"] = 7] = "ErrGranteeIsGranter";
    // ErrAuthorizationNumOfSigners error if an authorization message does not have only one signer
    ChainAuthZErrorCodes[ChainAuthZErrorCodes["ErrAuthorizationNumOfSigners"] = 9] = "ErrAuthorizationNumOfSigners";
    // ErrNegativeMaxTokens error if the max tokens is negative
    ChainAuthZErrorCodes[ChainAuthZErrorCodes["ErrNegativeMaxTokens"] = 12] = "ErrNegativeMaxTokens";
})(ChainAuthZErrorCodes = exports.ChainAuthZErrorCodes || (exports.ChainAuthZErrorCodes = {}));
var ChainInsuranceErrorCodes;
(function (ChainInsuranceErrorCodes) {
    // insurance fund already exists
    ChainInsuranceErrorCodes[ChainInsuranceErrorCodes["ErrInsuranceFundAlreadyExists"] = 1] = "ErrInsuranceFundAlreadyExists";
    // insurance fund not found
    ChainInsuranceErrorCodes[ChainInsuranceErrorCodes["ErrInsuranceFundNotFound"] = 2] = "ErrInsuranceFundNotFound";
    // redemption already exists
    ChainInsuranceErrorCodes[ChainInsuranceErrorCodes["ErrRedemptionAlreadyExists"] = 3] = "ErrRedemptionAlreadyExists";
    // invalid deposit amount
    ChainInsuranceErrorCodes[ChainInsuranceErrorCodes["ErrInvalidDepositAmount"] = 4] = "ErrInvalidDepositAmount";
    // invalid deposit denom
    ChainInsuranceErrorCodes[ChainInsuranceErrorCodes["ErrInvalidDepositDenom"] = 5] = "ErrInvalidDepositDenom";
    // insurance payout exceeds deposits
    ChainInsuranceErrorCodes[ChainInsuranceErrorCodes["ErrPayoutTooLarge"] = 6] = "ErrPayoutTooLarge";
    // invalid ticker
    ChainInsuranceErrorCodes[ChainInsuranceErrorCodes["ErrInvalidTicker"] = 7] = "ErrInvalidTicker";
    // invalid quote denom
    ChainInsuranceErrorCodes[ChainInsuranceErrorCodes["ErrInvalidQuoteDenom"] = 8] = "ErrInvalidQuoteDenom";
    // invalid oracle
    ChainInsuranceErrorCodes[ChainInsuranceErrorCodes["ErrInvalidOracle"] = 9] = "ErrInvalidOracle";
    // invalid expiration time
    ChainInsuranceErrorCodes[ChainInsuranceErrorCodes["ErrInvalidExpirationTime"] = 10] = "ErrInvalidExpirationTime";
    // invalid marketID
    ChainInsuranceErrorCodes[ChainInsuranceErrorCodes["ErrInvalidMarketID"] = 11] = "ErrInvalidMarketID";
    // invalid share denom
    ChainInsuranceErrorCodes[ChainInsuranceErrorCodes["ErrInvalidShareDenom"] = 12] = "ErrInvalidShareDenom";
})(ChainInsuranceErrorCodes = exports.ChainInsuranceErrorCodes || (exports.ChainInsuranceErrorCodes = {}));
var ChainOcrErrorCodes;
(function (ChainOcrErrorCodes) {
    // stale report
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrStaleReport"] = 1] = "ErrStaleReport";
    // incomplete proposal
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrIncompleteProposal"] = 2] = "ErrIncompleteProposal";
    // repeated oracle address
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrRepeatedAddress"] = 3] = "ErrRepeatedAddress";
    // too many signers
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrTooManySigners"] = 4] = "ErrTooManySigners";
    // incorrect config
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrIncorrectConfig"] = 5] = "ErrIncorrectConfig";
    // config digest doesn't match
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrConfigDigestNotMatch"] = 6] = "ErrConfigDigestNotMatch";
    // wrong number of signatures
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrWrongNumberOfSignatures"] = 7] = "ErrWrongNumberOfSignatures";
    // incorrect signature
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrIncorrectSignature"] = 8] = "ErrIncorrectSignature";
    // no transmitter specified
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrNoTransmitter"] = 9] = "ErrNoTransmitter";
    // incorrect transmission data
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrIncorrectTransmissionData"] = 10] = "ErrIncorrectTransmissionData";
    // no transmissions found
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrNoTransmissionsFound"] = 11] = "ErrNoTransmissionsFound";
    // median value is out of bounds
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrMedianValueOutOfBounds"] = 12] = "ErrMedianValueOutOfBounds";
    // LINK denom doesn't match
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrIncorrectRewardPoolDenom"] = 13] = "ErrIncorrectRewardPoolDenom";
    // Reward Pool doesn't exist
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrNoRewardPool"] = 14] = "ErrNoRewardPool";
    // wrong number of payees and transmitters
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrInvalidPayees"] = 15] = "ErrInvalidPayees";
    // action is restricted to the module admin
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrModuleAdminRestricted"] = 16] = "ErrModuleAdminRestricted";
    // feed already exists
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrFeedAlreadyExists"] = 17] = "ErrFeedAlreadyExists";
    // feed doesnt exists
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrFeedDoesntExists"] = 19] = "ErrFeedDoesntExists";
    // action is admin-restricted
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrAdminRestricted"] = 20] = "ErrAdminRestricted";
    // insufficient reward pool
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrInsufficientRewardPool"] = 21] = "ErrInsufficientRewardPool";
    // payee already set
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrPayeeAlreadySet"] = 22] = "ErrPayeeAlreadySet";
    // action is payee-restricted
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrPayeeRestricted"] = 23] = "ErrPayeeRestricted";
    // feed config not found
    ChainOcrErrorCodes[ChainOcrErrorCodes["ErrFeedConfigNotFound"] = 24] = "ErrFeedConfigNotFound";
})(ChainOcrErrorCodes = exports.ChainOcrErrorCodes || (exports.ChainOcrErrorCodes = {}));
var ChainOracleErrorCodes;
(function (ChainOracleErrorCodes) {
    // relayer address is empty
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrEmptyRelayerAddr"] = 1] = "ErrEmptyRelayerAddr";
    // bad rates count
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBadRatesCount"] = 2] = "ErrBadRatesCount";
    // bad resolve times
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBadResolveTimesCount"] = 3] = "ErrBadResolveTimesCount";
    // bad request ID
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBadRequestIDsCount"] = 4] = "ErrBadRequestIDsCount";
    // relayer not authorized
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrRelayerNotAuthorized"] = 5] = "ErrRelayerNotAuthorized";
    // bad price feed base count
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBadPriceFeedBaseCount"] = 6] = "ErrBadPriceFeedBaseCount";
    // bad price feed quote count
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBadPriceFeedQuoteCount"] = 7] = "ErrBadPriceFeedQuoteCount";
    // unsupported oracle type
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrUnsupportedOracleType"] = 8] = "ErrUnsupportedOracleType";
    // bad messages count
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBadMessagesCount"] = 9] = "ErrBadMessagesCount";
    // bad Coinbase message
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBadCoinbaseMessage"] = 10] = "ErrBadCoinbaseMessage";
    // bad Ethereum signature
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrInvalidEthereumSignature"] = 11] = "ErrInvalidEthereumSignature";
    // bad Coinbase message timestamp
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBadCoinbaseMessageTimestamp"] = 12] = "ErrBadCoinbaseMessageTimestamp";
    // Coinbase price not found
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrCoinbasePriceNotFound"] = 13] = "ErrCoinbasePriceNotFound";
    // Prices must be positive
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBadPrice"] = 14] = "ErrBadPrice";
    // Prices must be less than 10 million.
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrPriceTooLarge"] = 15] = "ErrPriceTooLarge";
    // Invalid Band IBC Request
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrInvalidBandIBCRequest"] = 16] = "ErrInvalidBandIBCRequest";
    // sample error
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrSample"] = 17] = "ErrSample";
    // invalid packet timeout
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrInvalidPacketTimeout"] = 18] = "ErrInvalidPacketTimeout";
    // invalid symbols count
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBadSymbolsCount"] = 19] = "ErrBadSymbolsCount";
    // could not claim port capability
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBadIBCPortBind"] = 20] = "ErrBadIBCPortBind";
    // invalid IBC Port ID
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrInvalidPortID"] = 21] = "ErrInvalidPortID";
    // invalid IBC Channel ID
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrInvalidChannelID"] = 22] = "ErrInvalidChannelID";
    // invalid Band IBC request interval
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBadRequestInterval"] = 23] = "ErrBadRequestInterval";
    // Invalid Band IBC Update Request Proposal
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrInvalidBandIBCUpdateRequest"] = 24] = "ErrInvalidBandIBCUpdateRequest";
    // Band IBC Oracle Request not found
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrBandIBCRequestNotFound"] = 25] = "ErrBandIBCRequestNotFound";
    // Base Info is empty
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrEmptyBaseInfo"] = 26] = "ErrEmptyBaseInfo";
    // provider is empty
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrEmptyProvider"] = 27] = "ErrEmptyProvider";
    // invalid provider name
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrInvalidProvider"] = 28] = "ErrInvalidProvider";
    // invalid symbol
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrInvalidSymbol"] = 29] = "ErrInvalidSymbol";
    // relayer already exists
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrRelayerAlreadyExists"] = 30] = "ErrRelayerAlreadyExists";
    // provider price not found
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrProviderPriceNotFound"] = 31] = "ErrProviderPriceNotFound";
    // invalid oracle request
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrInvalidOracleRequest"] = 32] = "ErrInvalidOracleRequest";
    // no price for oracle was found
    ChainOracleErrorCodes[ChainOracleErrorCodes["ErrOraclePriceNotFound"] = 33] = "ErrOraclePriceNotFound";
})(ChainOracleErrorCodes = exports.ChainOracleErrorCodes || (exports.ChainOracleErrorCodes = {}));
var ChainPeggyErrorCodes;
(function (ChainPeggyErrorCodes) {
    // internal
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrInternal"] = 1] = "ErrInternal";
    // duplicate
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrDuplicate"] = 2] = "ErrDuplicate";
    // invalid
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrInvalid"] = 3] = "ErrInvalid";
    // timeout
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrTimeout"] = 4] = "ErrTimeout";
    // unknown
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrUnknown"] = 5] = "ErrUnknown";
    // empty
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrEmpty"] = 6] = "ErrEmpty";
    // outdated
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrOutdated"] = 7] = "ErrOutdated";
    // unsupported
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrUnsupported"] = 8] = "ErrUnsupported";
    // non contiguous event nonce
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrNonContiguousEventNonce"] = 9] = "ErrNonContiguousEventNonce";
    // no unbatched txs found
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrNoUnbatchedTxsFound"] = 10] = "ErrNoUnbatchedTxsFound";
    // can not set orchestrator addresses more than once
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrResetDelegateKeys"] = 11] = "ErrResetDelegateKeys";
    // supply cannot exceed max ERC20 value
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrSupplyOverflow"] = 12] = "ErrSupplyOverflow";
    // invalid ethereum sender on claim
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrInvalidEthSender"] = 13] = "ErrInvalidEthSender";
    // invalid ethereum destination
    ChainPeggyErrorCodes[ChainPeggyErrorCodes["ErrInvalidEthDestination"] = 14] = "ErrInvalidEthDestination";
})(ChainPeggyErrorCodes = exports.ChainPeggyErrorCodes || (exports.ChainPeggyErrorCodes = {}));
var ChainTokenFactoryErrorCodes;
(function (ChainTokenFactoryErrorCodes) {
    // attempting to create a denom that already exists (has bank metadata)
    ChainTokenFactoryErrorCodes[ChainTokenFactoryErrorCodes["ErrDenomExists"] = 2] = "ErrDenomExists";
    // unauthorized account
    ChainTokenFactoryErrorCodes[ChainTokenFactoryErrorCodes["ErrUnauthorized"] = 3] = "ErrUnauthorized";
    // invalid denom
    ChainTokenFactoryErrorCodes[ChainTokenFactoryErrorCodes["ErrInvalidDenom"] = 4] = "ErrInvalidDenom";
    // invalid creator
    ChainTokenFactoryErrorCodes[ChainTokenFactoryErrorCodes["ErrInvalidCreator"] = 5] = "ErrInvalidCreator";
    // invalid authority metadata
    ChainTokenFactoryErrorCodes[ChainTokenFactoryErrorCodes["ErrInvalidAuthorityMetadata"] = 6] = "ErrInvalidAuthorityMetadata";
    // invalid genesis
    ChainTokenFactoryErrorCodes[ChainTokenFactoryErrorCodes["ErrInvalidGenesis"] = 7] = "ErrInvalidGenesis";
    // subdenom too long, max length is %d bytes
    ChainTokenFactoryErrorCodes[ChainTokenFactoryErrorCodes["ErrSubdenomTooLong"] = 8] = "ErrSubdenomTooLong";
    // subdenom too short, min length is %d bytes
    ChainTokenFactoryErrorCodes[ChainTokenFactoryErrorCodes["ErrSubdenomTooShort"] = 9] = "ErrSubdenomTooShort";
    // nested subdenom too short, each one should have at least %d bytes
    ChainTokenFactoryErrorCodes[ChainTokenFactoryErrorCodes["ErrSubdenomNestedTooShort"] = 10] = "ErrSubdenomNestedTooShort";
    // creator too long, max length is %d bytes
    ChainTokenFactoryErrorCodes[ChainTokenFactoryErrorCodes["ErrCreatorTooLong"] = 11] = "ErrCreatorTooLong";
    // denom does not exist
    ChainTokenFactoryErrorCodes[ChainTokenFactoryErrorCodes["ErrDenomDoesNotExist"] = 12] = "ErrDenomDoesNotExist";
    // amount has to be positive
    ChainTokenFactoryErrorCodes[ChainTokenFactoryErrorCodes["ErrAmountNotPositive"] = 13] = "ErrAmountNotPositive";
})(ChainTokenFactoryErrorCodes = exports.ChainTokenFactoryErrorCodes || (exports.ChainTokenFactoryErrorCodes = {}));
var ChainWasmXErrorCodes;
(function (ChainWasmXErrorCodes) {
    // invalid gas limit
    ChainWasmXErrorCodes[ChainWasmXErrorCodes["ErrInvalidGasLimit"] = 1] = "ErrInvalidGasLimit";
    // invalid gas price
    ChainWasmXErrorCodes[ChainWasmXErrorCodes["ErrInvalidGasPrice"] = 2] = "ErrInvalidGasPrice";
    // invalid contract address
    ChainWasmXErrorCodes[ChainWasmXErrorCodes["ErrInvalidContractAddress"] = 3] = "ErrInvalidContractAddress";
    // contract already registered
    ChainWasmXErrorCodes[ChainWasmXErrorCodes["ErrAlreadyRegistered"] = 4] = "ErrAlreadyRegistered";
    // duplicate contract
    ChainWasmXErrorCodes[ChainWasmXErrorCodes["ErrDuplicateContract"] = 5] = "ErrDuplicateContract";
    // no contract addresses found
    ChainWasmXErrorCodes[ChainWasmXErrorCodes["ErrNoContractAddresses"] = 6] = "ErrNoContractAddresses";
    // invalid code id
    ChainWasmXErrorCodes[ChainWasmXErrorCodes["ErrInvalidCodeId"] = 7] = "ErrInvalidCodeId";
})(ChainWasmXErrorCodes = exports.ChainWasmXErrorCodes || (exports.ChainWasmXErrorCodes = {}));
var ChainStakingErrorCodes;
(function (ChainStakingErrorCodes) {
    // "empty validator address"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrEmptyValidatorAddr"] = 2] = "ErrEmptyValidatorAddr";
    // "validator does not exist"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrNoValidatorFound"] = 3] = "ErrNoValidatorFound";
    // "validator already exist for this operator address; must use new validator operator address"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrValidatorOwnerExists"] = 4] = "ErrValidatorOwnerExists";
    // "validator already exist for this pubkey; must use new validator pubkey"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrValidatorPubKeyExists"] = 5] = "ErrValidatorPubKeyExists";
    // "validator pubkey type is not supported"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrValidatorPubKeyTypeNotSupported"] = 6] = "ErrValidatorPubKeyTypeNotSupported";
    // "validator for this address is currently jailed"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrValidatorJailed"] = 7] = "ErrValidatorJailed";
    // "failed to remove validator"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrBadRemoveValidator"] = 8] = "ErrBadRemoveValidator";
    // "commission must be positive"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrCommissionNegative"] = 9] = "ErrCommissionNegative";
    // "commission cannot be more than 100%"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrCommissionHuge"] = 10] = "ErrCommissionHuge";
    // "commission cannot be more than the max rate"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrCommissionGTMaxRate"] = 11] = "ErrCommissionGTMaxRate";
    // "commission cannot be changed more than once in 24h"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrCommissionUpdateTime"] = 12] = "ErrCommissionUpdateTime";
    // "commission change rate must be positive"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrCommissionChangeRateNegative"] = 13] = "ErrCommissionChangeRateNegative";
    // "commission change rate cannot be more than the max rate"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrCommissionChangeRateGTMaxRate"] = 14] = "ErrCommissionChangeRateGTMaxRate";
    // "commission cannot be changed more than max change rate"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrCommissionGTMaxChangeRate"] = 15] = "ErrCommissionGTMaxChangeRate";
    // "validator's self delegation must be greater than their minimum self delegation"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrSelfDelegationBelowMinimum"] = 16] = "ErrSelfDelegationBelowMinimum";
    // "minimum self delegation cannot be decrease"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrMinSelfDelegationDecreased"] = 17] = "ErrMinSelfDelegationDecreased";
    // "empty delegator address"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrEmptyDelegatorAddr"] = 18] = "ErrEmptyDelegatorAddr";
    // "no delegation for (address, validator) tuple"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrNoDelegation"] = 19] = "ErrNoDelegation";
    // "delegator does not exist with address"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrBadDelegatorAddr"] = 20] = "ErrBadDelegatorAddr";
    // "delegator does not contain delegation"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrNoDelegatorForAddress"] = 21] = "ErrNoDelegatorForAddress";
    // "insufficient delegation shares"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrInsufficientShares"] = 22] = "ErrInsufficientShares";
    // "cannot delegate to an empty validator"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrDelegationValidatorEmpty"] = 23] = "ErrDelegationValidatorEmpty";
    // "not enough delegation shares"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrNotEnoughDelegationShares"] = 24] = "ErrNotEnoughDelegationShares";
    // "entry not mature"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrNotMature"] = 25] = "ErrNotMature";
    // "no unbonding delegation found"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrNoUnbondingDelegation"] = 26] = "ErrNoUnbondingDelegation";
    // "too many unbonding delegation entries for (delegator, validator) tuple"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrMaxUnbondingDelegationEntries"] = 27] = "ErrMaxUnbondingDelegationEntries";
    // "no redelegation found"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrNoRedelegation"] = 28] = "ErrNoRedelegation";
    // "cannot redelegate to the same validator"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrSelfRedelegation"] = 29] = "ErrSelfRedelegation";
    // "too few tokens to redelegate (truncates to zero tokens)"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrTinyRedelegationAmount"] = 30] = "ErrTinyRedelegationAmount";
    // "redelegation destination validator not found"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrBadRedelegationDst"] = 31] = "ErrBadRedelegationDst";
    // "redelegation to this validator already in progress; first redelegation to this validator must complete before next redelegation"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrTransitiveRedelegation"] = 32] = "ErrTransitiveRedelegation";
    // "too many redelegation entries for (delegator, src-validator, dst-validator) tuple"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrMaxRedelegationEntries"] = 33] = "ErrMaxRedelegationEntries";
    // "cannot delegate to validators with invalid (zero) ex-rate"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrDelegatorShareExRateInvalid"] = 34] = "ErrDelegatorShareExRateInvalid";
    // "both shares amount and shares percent provided"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrBothShareMsgsGiven"] = 35] = "ErrBothShareMsgsGiven";
    // "neither shares amount nor shares percent provided"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrNeitherShareMsgsGiven"] = 36] = "ErrNeitherShareMsgsGiven";
    // "invalid historical info"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrInvalidHistoricalInfo"] = 37] = "ErrInvalidHistoricalInfo";
    // "no historical info found"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrNoHistoricalInfo"] = 38] = "ErrNoHistoricalInfo";
    // "empty validator public key"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrEmptyValidatorPubKey"] = 39] = "ErrEmptyValidatorPubKey";
    // "commission cannot be less than min rate"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrCommissionLTMinRate"] = 40] = "ErrCommissionLTMinRate";
    // "unbonding operation not found"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrUnbondingNotFound"] = 41] = "ErrUnbondingNotFound";
    // "cannot un-hold unbonding operation that is not on hold"
    ChainStakingErrorCodes[ChainStakingErrorCodes["ErrUnbondingOnHoldRefCountNegative"] = 42] = "ErrUnbondingOnHoldRefCountNegative";
})(ChainStakingErrorCodes = exports.ChainStakingErrorCodes || (exports.ChainStakingErrorCodes = {}));
var ChainGovErrorCodes;
(function (ChainGovErrorCodes) {
    //  "unknown proposal"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrUnknownProposal"] = 2] = "ErrUnknownProposal";
    //  "inactive proposal"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrInactiveProposal"] = 3] = "ErrInactiveProposal";
    //  "proposal already active)
    ChainGovErrorCodes[ChainGovErrorCodes["ErrAlreadyActiveProposal"] = 4] = "ErrAlreadyActiveProposal";
    //  "invalid proposal content"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrInvalidProposalContent"] = 5] = "ErrInvalidProposalContent";
    //  "invalid proposal type"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrInvalidProposalType"] = 6] = "ErrInvalidProposalType";
    //  "invalid vote option"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrInvalidVote"] = 7] = "ErrInvalidVote";
    //  "invalid genesis state"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrInvalidGenesis"] = 8] = "ErrInvalidGenesis";
    //  "no handler exists for proosal type")
    ChainGovErrorCodes[ChainGovErrorCodes["ErrNoProposalHandlerExists"] = 9] = "ErrNoProposalHandlerExists";
    //  "proposal message not recognized by router")
    ChainGovErrorCodes[ChainGovErrorCodes["ErrUnroutableProposalMsg"] = 10] = "ErrUnroutableProposalMsg";
    //  "no messages proposed"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrNoProposalMsgs"] = 11] = "ErrNoProposalMsgs";
    //  "invalid proposal message"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrInvalidProposalMsg"] = 12] = "ErrInvalidProposalMsg";
    //  "expected gov account as ony signer for proposal message")
    ChainGovErrorCodes[ChainGovErrorCodes["ErrInvalidSigner"] = 13] = "ErrInvalidSigner";
    //  "signal message is invalid"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrInvalidSignalMsg"] = 14] = "ErrInvalidSignalMsg";
    //  "metadata too long"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrMetadataTooLong"] = 15] = "ErrMetadataTooLong";
    //  "minimum deposit is too smal")
    ChainGovErrorCodes[ChainGovErrorCodes["ErrMinDepositTooSmall"] = 16] = "ErrMinDepositTooSmall";
    //  "proposal is not found"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrProposalNotFound"] = 17] = "ErrProposalNotFound";
    //  "invalid proposer"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrInvalidProposer"] = 18] = "ErrInvalidProposer";
    //  "no deposits found"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrNoDeposits"] = 19] = "ErrNoDeposits";
    //  "voting period already ende")
    ChainGovErrorCodes[ChainGovErrorCodes["ErrVotingPeriodEnded"] = 20] = "ErrVotingPeriodEnded";
    //  "invalid proposal"
    ChainGovErrorCodes[ChainGovErrorCodes["ErrInvalidProposal"] = 21] = "ErrInvalidProposal";
})(ChainGovErrorCodes = exports.ChainGovErrorCodes || (exports.ChainGovErrorCodes = {}));
var ChainDistributionErrorCodes;
(function (ChainDistributionErrorCodes) {
    //  "delegator address is empty"
    ChainDistributionErrorCodes[ChainDistributionErrorCodes["ErrEmptyDelegatorAddr"] = 2] = "ErrEmptyDelegatorAddr";
    //  "withdraw address is empty"
    ChainDistributionErrorCodes[ChainDistributionErrorCodes["ErrEmptyWithdrawAddr"] = 3] = "ErrEmptyWithdrawAddr";
    //  "validator address is empty"
    ChainDistributionErrorCodes[ChainDistributionErrorCodes["ErrEmptyValidatorAddr"] = 4] = "ErrEmptyValidatorAddr";
    //  "no delegation distribution info"
    ChainDistributionErrorCodes[ChainDistributionErrorCodes["ErrEmptyDelegationDistInfo"] = 5] = "ErrEmptyDelegationDistInfo";
    //  "no validator distribution info"
    ChainDistributionErrorCodes[ChainDistributionErrorCodes["ErrNoValidatorDistInfo"] = 6] = "ErrNoValidatorDistInfo";
    //  "no validator commission to withdraw"
    ChainDistributionErrorCodes[ChainDistributionErrorCodes["ErrNoValidatorCommission"] = 7] = "ErrNoValidatorCommission";
    //  "set withdraw address disabled"
    ChainDistributionErrorCodes[ChainDistributionErrorCodes["ErrSetWithdrawAddrDisabled"] = 8] = "ErrSetWithdrawAddrDisabled";
    //  "community pool does not have sufficient coins to distribute"
    ChainDistributionErrorCodes[ChainDistributionErrorCodes["ErrBadDistribution"] = 9] = "ErrBadDistribution";
    //  "invalid community pool spend proposal amount"
    ChainDistributionErrorCodes[ChainDistributionErrorCodes["ErrInvalidProposalAmount"] = 10] = "ErrInvalidProposalAmount";
    //  "invalid community pool spend proposal recipient"
    ChainDistributionErrorCodes[ChainDistributionErrorCodes["ErrEmptyProposalRecipient"] = 11] = "ErrEmptyProposalRecipient";
    //  "validator does not exist"
    ChainDistributionErrorCodes[ChainDistributionErrorCodes["ErrNoValidatorExists"] = 12] = "ErrNoValidatorExists";
    //  "delegation does not exist"
    ChainDistributionErrorCodes[ChainDistributionErrorCodes["ErrNoDelegationExists"] = 13] = "ErrNoDelegationExists";
})(ChainDistributionErrorCodes = exports.ChainDistributionErrorCodes || (exports.ChainDistributionErrorCodes = {}));
var ChainBankErrorCodes;
(function (ChainBankErrorCodes) {
    // "no inputs to send transaction"
    ChainBankErrorCodes[ChainBankErrorCodes["ErrNoInputs"] = 2] = "ErrNoInputs";
    // "no outputs to send transaction"
    ChainBankErrorCodes[ChainBankErrorCodes["ErrNoOutputs"] = 3] = "ErrNoOutputs";
    // "sum inputs != sum outputs"
    ChainBankErrorCodes[ChainBankErrorCodes["ErrInputOutputMismatch"] = 4] = "ErrInputOutputMismatch";
    // "send transactions are disabled"
    ChainBankErrorCodes[ChainBankErrorCodes["ErrSendDisabled"] = 5] = "ErrSendDisabled";
    // "client denom metadata not found"
    ChainBankErrorCodes[ChainBankErrorCodes["ErrDenomMetadataNotFound"] = 6] = "ErrDenomMetadataNotFound";
    // "invalid key"
    ChainBankErrorCodes[ChainBankErrorCodes["ErrInvalidKey"] = 7] = "ErrInvalidKey";
    // "duplicate entry"
    ChainBankErrorCodes[ChainBankErrorCodes["ErrDuplicateEntry"] = 8] = "ErrDuplicateEntry";
    // "multiple senders not allowed"
    ChainBankErrorCodes[ChainBankErrorCodes["ErrMultipleSenders"] = 9] = "ErrMultipleSenders";
})(ChainBankErrorCodes = exports.ChainBankErrorCodes || (exports.ChainBankErrorCodes = {}));
var ChainWasmErrorCodes;
(function (ChainWasmErrorCodes) {
    // ErrCreateFailed error for wasm code that has already been uploaded or failed
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrCreateFailed"] = 2] = "ErrCreateFailed";
    // ErrAccountExists error for a contract account that already exists
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrAccountExists"] = 3] = "ErrAccountExists";
    // ErrInstantiateFailed error for rust instantiate contract failure
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrInstantiateFailed"] = 4] = "ErrInstantiateFailed";
    // ErrExecuteFailed error for rust execution contract failure
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrExecuteFailed"] = 5] = "ErrExecuteFailed";
    // ErrGasLimit error for out of gas
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrGasLimit"] = 6] = "ErrGasLimit";
    // ErrInvalidGenesis error for invalid genesis file syntax
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrInvalidGenesis"] = 7] = "ErrInvalidGenesis";
    // ErrNotFound error for an entry not found in the store
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrNotFound"] = 8] = "ErrNotFound";
    // ErrQueryFailed error for rust smart query contract failure
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrQueryFailed"] = 9] = "ErrQueryFailed";
    // ErrInvalidMsg error when we cannot process the error returned from the contract
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrInvalidMsg"] = 10] = "ErrInvalidMsg";
    // ErrMigrationFailed error for rust execution contract failure
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrMigrationFailed"] = 11] = "ErrMigrationFailed";
    // ErrEmpty error for empty content
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrEmpty"] = 12] = "ErrEmpty";
    // ErrLimit error for content that exceeds a limit
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrLimit"] = 13] = "ErrLimit";
    // ErrInvalid error for content that is invalid in this context
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrInvalid"] = 14] = "ErrInvalid";
    // ErrDuplicate error for content that exists
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrDuplicate"] = 15] = "ErrDuplicate";
    // ErrMaxIBCChannels error for maximum number of ibc channels reached
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrMaxIBCChannels"] = 16] = "ErrMaxIBCChannels";
    // ErrUnsupportedForContract error when a capability is used that is not supported for/ by this contract
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrUnsupportedForContract"] = 17] = "ErrUnsupportedForContract";
    // ErrPinContractFailed error for pinning contract failures
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrPinContractFailed"] = 18] = "ErrPinContractFailed";
    // ErrUnpinContractFailed error for unpinning contract failures
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrUnpinContractFailed"] = 19] = "ErrUnpinContractFailed";
    // ErrUnknownMsg error by a message handler to show that it is not responsible for this message type
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrUnknownMsg"] = 20] = "ErrUnknownMsg";
    // ErrInvalidEvent error if an attribute/event from the contract is invalid
    ChainWasmErrorCodes[ChainWasmErrorCodes["ErrInvalidEvent"] = 21] = "ErrInvalidEvent";
})(ChainWasmErrorCodes = exports.ChainWasmErrorCodes || (exports.ChainWasmErrorCodes = {}));
exports.UnspecifiedErrorCode = -1;
exports.GRPC_REQUEST_FAILED = grpc_web_1.grpc.Code.Unavailable;
//# sourceMappingURL=codes.js.map