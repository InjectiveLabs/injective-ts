import * as grpcPkg from '@injectivelabs/grpc-web'
import { StatusCodes } from 'http-status-codes'

export enum GrpcErrorCode {
  OK = 0,
  Canceled = 1,
  Unknown = 2,
  InvalidArgument = 3,
  DeadlineExceeded = 4,
  NotFound = 5,
  AlreadyExists = 6,
  PermissionDenied = 7,
  ResourceExhausted = 8,
  FailedPrecondition = 9,
  Aborted = 10,
  OutOfRange = 11,
  Unimplemented = 12,
  Internal = 13,
  Unavailable = 14,
  DataLoss = 15,
  Unauthenticated = 16,
}

export const grpcErrorCodeToErrorCode = <T extends number>(
  grpcErrorCode: T,
): GrpcErrorCode => {
  return grpcErrorCode as GrpcErrorCode
}

export enum TransactionChainErrorModule {
  Auction = 'auction',
  CosmosSdk = 'sdk',
  Staking = 'staking',
  Bank = 'bank',
  Distribution = 'distribution',
  Gov = 'gov',
  Exchange = 'exchange',
  Insurance = 'insurance',
  Ocr = 'ocr',
  Oracle = 'oracle',
  Peggy = 'peggy',
  TokenFactory = 'tokenfactory',
  Wasmx = 'wasmx',
  Wasm = 'wasm',
  AuthZ = 'authz',
}

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
  // Invalid funds direction
  ErrInvalidFundsDirection = 85,
  // No funds provided
  ErrNoFundsProvided = 86,
  // Invalid signature
  ErrInvalidSignature = 87,
  // no funds to unlock
  ErrNoFundsToUnlock = 88,
  // No msgs provided
  ErrNoMsgsProvided = 89,
  // No msg provided
  ErrNoMsgProvided = 90,
  // Invalid amount
  ErrInvalidAmount = 91,
  // The current feature has been disabled
  ErrFeatureDisabled = 92,
  // Order has too much margin
  ErrTooMuchOrderMargin = 93,
  // Order has too much margin
  ErrBadSubaccountNonce = 94,
  ErrInsufficientFunds = 95,
  // Exchange is in post-only mode
  ErrPostOnlyMode = 96,
  // client order id already exists
  ErrClientOrderIdAlreadyExists = 97,
  // client order id is invalid. Max length is 36 chars
  ErrInvalidCid = 98,
}

export enum ChainAuctionErrorCodes {
  // invalid bid denom
  ErrBidInvalid = 1,
  // invalid bid round
  ErrBidRound = 2,
}

export enum ChainAuthZErrorCodes {
  // ErrNoAuthorizationFound error if there is no authorization found given a grant key
  ErrNoAuthorizationFound = 2,
  // ErrInvalidExpirationTime error if the set expiration time is in the past
  ErrInvalidExpirationTime = 3,
  // ErrUnknownAuthorizationType error for unknown authorization type
  ErrUnknownAuthorizationType = 4,
  // ErrNoGrantKeyFound error if the requested grant key does not exist
  ErrNoGrantKeyFound = 5,
  // ErrAuthorizationExpired error if the authorization has expired
  ErrAuthorizationExpired = 6,
  // ErrGranteeIsGranter error if the grantee and the granter are the same
  ErrGranteeIsGranter = 7,
  // ErrAuthorizationNumOfSigners error if an authorization message does not have only one signer
  ErrAuthorizationNumOfSigners = 9,
  // ErrNegativeMaxTokens error if the max tokens is negative
  ErrNegativeMaxTokens = 12,
}

export enum ChainInsuranceErrorCodes {
  // insurance fund already exists
  ErrInsuranceFundAlreadyExists = 1,
  // insurance fund not found
  ErrInsuranceFundNotFound = 2,
  // redemption already exists
  ErrRedemptionAlreadyExists = 3,
  // invalid deposit amount
  ErrInvalidDepositAmount = 4,
  // invalid deposit denom
  ErrInvalidDepositDenom = 5,
  // insurance payout exceeds deposits
  ErrPayoutTooLarge = 6,
  // invalid ticker
  ErrInvalidTicker = 7,
  // invalid quote denom
  ErrInvalidQuoteDenom = 8,
  // invalid oracle
  ErrInvalidOracle = 9,
  // invalid expiration time
  ErrInvalidExpirationTime = 10,
  // invalid marketID
  ErrInvalidMarketID = 11,
  // invalid share denom
  ErrInvalidShareDenom = 12,
}

export enum ChainOcrErrorCodes {
  // stale report
  ErrStaleReport = 1,
  // incomplete proposal
  ErrIncompleteProposal = 2,
  // repeated oracle address
  ErrRepeatedAddress = 3,
  // too many signers
  ErrTooManySigners = 4,
  // incorrect config
  ErrIncorrectConfig = 5,
  // config digest doesn't match
  ErrConfigDigestNotMatch = 6,
  // wrong number of signatures
  ErrWrongNumberOfSignatures = 7,
  // incorrect signature
  ErrIncorrectSignature = 8,
  // no transmitter specified
  ErrNoTransmitter = 9,
  // incorrect transmission data
  ErrIncorrectTransmissionData = 10,
  // no transmissions found
  ErrNoTransmissionsFound = 11,
  // median value is out of bounds
  ErrMedianValueOutOfBounds = 12,
  // LINK denom doesn't match
  ErrIncorrectRewardPoolDenom = 13,
  // Reward Pool doesn't exist
  ErrNoRewardPool = 14,
  // wrong number of payees and transmitters
  ErrInvalidPayees = 15,
  // action is restricted to the module admin
  ErrModuleAdminRestricted = 16,
  // feed already exists
  ErrFeedAlreadyExists = 17,
  // feed doesnt exists
  ErrFeedDoesntExists = 19,
  // action is admin-restricted
  ErrAdminRestricted = 20,
  // insufficient reward pool
  ErrInsufficientRewardPool = 21,
  // payee already set
  ErrPayeeAlreadySet = 22,
  // action is payee-restricted
  ErrPayeeRestricted = 23,
  // feed config not found
  ErrFeedConfigNotFound = 24,
}

export enum ChainOracleErrorCodes {
  // relayer address is empty
  ErrEmptyRelayerAddr = 1,
  // bad rates count
  ErrBadRatesCount = 2,
  // bad resolve times
  ErrBadResolveTimesCount = 3,
  // bad request ID
  ErrBadRequestIDsCount = 4,
  // relayer not authorized
  ErrRelayerNotAuthorized = 5,
  // bad price feed base count
  ErrBadPriceFeedBaseCount = 6,
  // bad price feed quote count
  ErrBadPriceFeedQuoteCount = 7,
  // unsupported oracle type
  ErrUnsupportedOracleType = 8,
  // bad messages count
  ErrBadMessagesCount = 9,
  // bad Coinbase message
  ErrBadCoinbaseMessage = 10,
  // bad Ethereum signature
  ErrInvalidEthereumSignature = 11,
  // bad Coinbase message timestamp
  ErrBadCoinbaseMessageTimestamp = 12,
  // Coinbase price not found
  ErrCoinbasePriceNotFound = 13,
  // Prices must be positive
  ErrBadPrice = 14,
  // Prices must be less than 10 million.
  ErrPriceTooLarge = 15,
  // Invalid Band IBC Request
  ErrInvalidBandIBCRequest = 16,
  // sample error
  ErrSample = 17,
  // invalid packet timeout
  ErrInvalidPacketTimeout = 18,
  // invalid symbols count
  ErrBadSymbolsCount = 19,
  // could not claim port capability
  ErrBadIBCPortBind = 20,
  // invalid IBC Port ID
  ErrInvalidPortID = 21,
  // invalid IBC Channel ID
  ErrInvalidChannelID = 22,
  // invalid Band IBC request interval
  ErrBadRequestInterval = 23,
  // Invalid Band IBC Update Request Proposal
  ErrInvalidBandIBCUpdateRequest = 24,
  // Band IBC Oracle Request not found
  ErrBandIBCRequestNotFound = 25,
  // Base Info is empty
  ErrEmptyBaseInfo = 26,
  // provider is empty
  ErrEmptyProvider = 27,
  // invalid provider name
  ErrInvalidProvider = 28,
  // invalid symbol
  ErrInvalidSymbol = 29,
  // relayer already exists
  ErrRelayerAlreadyExists = 30,
  // provider price not found
  ErrProviderPriceNotFound = 31,
  // invalid oracle request
  ErrInvalidOracleRequest = 32,
  // no price for oracle was found
  ErrOraclePriceNotFound = 33,
}

export enum ChainPeggyErrorCodes {
  // internal
  ErrInternal = 1,
  // duplicate
  ErrDuplicate = 2,
  // invalid
  ErrInvalid = 3,
  // timeout
  ErrTimeout = 4,
  // unknown
  ErrUnknown = 5,
  // empty
  ErrEmpty = 6,
  // outdated
  ErrOutdated = 7,
  // unsupported
  ErrUnsupported = 8,
  // non contiguous event nonce
  ErrNonContiguousEventNonce = 9,
  // no unbatched txs found
  ErrNoUnbatchedTxsFound = 10,
  // can not set orchestrator addresses more than once
  ErrResetDelegateKeys = 11,
  // supply cannot exceed max ERC20 value
  ErrSupplyOverflow = 12,
  // invalid ethereum sender on claim
  ErrInvalidEthSender = 13,
  // invalid ethereum destination
  ErrInvalidEthDestination = 14,
}

export enum ChainTokenFactoryErrorCodes {
  // attempting to create a denom that already exists (has bank metadata)
  ErrDenomExists = 2,
  // unauthorized account
  ErrUnauthorized = 3,
  // invalid denom
  ErrInvalidDenom = 4,
  // invalid creator
  ErrInvalidCreator = 5,
  // invalid authority metadata
  ErrInvalidAuthorityMetadata = 6,
  // invalid genesis
  ErrInvalidGenesis = 7,
  // subdenom too long, max length is %d bytes
  ErrSubdenomTooLong = 8,
  // subdenom too short, min length is %d bytes
  ErrSubdenomTooShort = 9,
  // nested subdenom too short, each one should have at least %d bytes
  ErrSubdenomNestedTooShort = 10,
  // creator too long, max length is %d bytes
  ErrCreatorTooLong = 11,
  // denom does not exist
  ErrDenomDoesNotExist = 12,
  // amount has to be positive
  ErrAmountNotPositive = 13,
}

export enum ChainWasmXErrorCodes {
  // invalid gas limit
  ErrInvalidGasLimit = 1,
  // invalid gas price
  ErrInvalidGasPrice = 2,
  // invalid contract address
  ErrInvalidContractAddress = 3,
  // contract already registered
  ErrAlreadyRegistered = 4,
  // duplicate contract
  ErrDuplicateContract = 5,
  // no contract addresses found
  ErrNoContractAddresses = 6,
  // invalid code id
  ErrInvalidCodeId = 7,
}

export enum ChainStakingErrorCodes {
  // "empty validator address"
  ErrEmptyValidatorAddr = 2,
  // "validator does not exist"
  ErrNoValidatorFound = 3,
  // "validator already exist for this operator address; must use new validator operator address"
  ErrValidatorOwnerExists = 4,
  // "validator already exist for this pubkey; must use new validator pubkey"
  ErrValidatorPubKeyExists = 5,
  // "validator pubkey type is not supported"
  ErrValidatorPubKeyTypeNotSupported = 6,
  // "validator for this address is currently jailed"
  ErrValidatorJailed = 7,
  // "failed to remove validator"
  ErrBadRemoveValidator = 8,
  // "commission must be positive"
  ErrCommissionNegative = 9,
  // "commission cannot be more than 100%"
  ErrCommissionHuge = 10,
  // "commission cannot be more than the max rate"
  ErrCommissionGTMaxRate = 11,
  // "commission cannot be changed more than once in 24h"
  ErrCommissionUpdateTime = 12,
  // "commission change rate must be positive"
  ErrCommissionChangeRateNegative = 13,
  // "commission change rate cannot be more than the max rate"
  ErrCommissionChangeRateGTMaxRate = 14,
  // "commission cannot be changed more than max change rate"
  ErrCommissionGTMaxChangeRate = 15,
  // "validator's self delegation must be greater than their minimum self delegation"
  ErrSelfDelegationBelowMinimum = 16,
  // "minimum self delegation cannot be decrease"
  ErrMinSelfDelegationDecreased = 17,
  // "empty delegator address"
  ErrEmptyDelegatorAddr = 18,
  // "no delegation for (address, validator) tuple"
  ErrNoDelegation = 19,
  // "delegator does not exist with address"
  ErrBadDelegatorAddr = 20,
  // "delegator does not contain delegation"
  ErrNoDelegatorForAddress = 21,
  // "insufficient delegation shares"
  ErrInsufficientShares = 22,
  // "cannot delegate to an empty validator"
  ErrDelegationValidatorEmpty = 23,
  // "not enough delegation shares"
  ErrNotEnoughDelegationShares = 24,
  // "entry not mature"
  ErrNotMature = 25,
  // "no unbonding delegation found"
  ErrNoUnbondingDelegation = 26,
  // "too many unbonding delegation entries for (delegator, validator) tuple"
  ErrMaxUnbondingDelegationEntries = 27,
  // "no redelegation found"
  ErrNoRedelegation = 28,
  // "cannot redelegate to the same validator"
  ErrSelfRedelegation = 29,
  // "too few tokens to redelegate (truncates to zero tokens)"
  ErrTinyRedelegationAmount = 30,
  // "redelegation destination validator not found"
  ErrBadRedelegationDst = 31,
  // "redelegation to this validator already in progress; first redelegation to this validator must complete before next redelegation"
  ErrTransitiveRedelegation = 32,
  // "too many redelegation entries for (delegator, src-validator, dst-validator) tuple"
  ErrMaxRedelegationEntries = 33,
  // "cannot delegate to validators with invalid (zero) ex-rate"
  ErrDelegatorShareExRateInvalid = 34,
  // "both shares amount and shares percent provided"
  ErrBothShareMsgsGiven = 35,
  // "neither shares amount nor shares percent provided"
  ErrNeitherShareMsgsGiven = 36,
  // "invalid historical info"
  ErrInvalidHistoricalInfo = 37,
  // "no historical info found"
  ErrNoHistoricalInfo = 38,
  // "empty validator public key"
  ErrEmptyValidatorPubKey = 39,
  // "commission cannot be less than min rate"
  ErrCommissionLTMinRate = 40,
  // "unbonding operation not found"
  ErrUnbondingNotFound = 41,
  // "cannot un-hold unbonding operation that is not on hold"
  ErrUnbondingOnHoldRefCountNegative = 42,
}

export enum ChainGovErrorCodes {
  //  "unknown proposal"
  ErrUnknownProposal = 2,
  //  "inactive proposal"
  ErrInactiveProposal = 3,
  //  "proposal already active)
  ErrAlreadyActiveProposal = 4,
  //  "invalid proposal content"
  ErrInvalidProposalContent = 5,
  //  "invalid proposal type"
  ErrInvalidProposalType = 6,
  //  "invalid vote option"
  ErrInvalidVote = 7,
  //  "invalid genesis state"
  ErrInvalidGenesis = 8,
  //  "no handler exists for proosal type")
  ErrNoProposalHandlerExists = 9,
  //  "proposal message not recognized by router")
  ErrUnroutableProposalMsg = 10,
  //  "no messages proposed"
  ErrNoProposalMsgs = 11,
  //  "invalid proposal message"
  ErrInvalidProposalMsg = 12,
  //  "expected gov account as ony signer for proposal message")
  ErrInvalidSigner = 13,
  //  "signal message is invalid"
  ErrInvalidSignalMsg = 14,
  //  "metadata too long"
  ErrMetadataTooLong = 15,
  //  "minimum deposit is too smal")
  ErrMinDepositTooSmall = 16,
  //  "proposal is not found"
  ErrProposalNotFound = 17,
  //  "invalid proposer"
  ErrInvalidProposer = 18,
  //  "no deposits found"
  ErrNoDeposits = 19,
  //  "voting period already ende")
  ErrVotingPeriodEnded = 20,
  //  "invalid proposal"
  ErrInvalidProposal = 21,
}

export enum ChainDistributionErrorCodes {
  //  "delegator address is empty"
  ErrEmptyDelegatorAddr = 2,
  //  "withdraw address is empty"
  ErrEmptyWithdrawAddr = 3,
  //  "validator address is empty"
  ErrEmptyValidatorAddr = 4,
  //  "no delegation distribution info"
  ErrEmptyDelegationDistInfo = 5,
  //  "no validator distribution info"
  ErrNoValidatorDistInfo = 6,
  //  "no validator commission to withdraw"
  ErrNoValidatorCommission = 7,
  //  "set withdraw address disabled"
  ErrSetWithdrawAddrDisabled = 8,
  //  "community pool does not have sufficient coins to distribute"
  ErrBadDistribution = 9,
  //  "invalid community pool spend proposal amount"
  ErrInvalidProposalAmount = 10,
  //  "invalid community pool spend proposal recipient"
  ErrEmptyProposalRecipient = 11,
  //  "validator does not exist"
  ErrNoValidatorExists = 12,
  //  "delegation does not exist"
  ErrNoDelegationExists = 13,
}

export enum ChainBankErrorCodes {
  // "no inputs to send transaction"
  ErrNoInputs = 2,
  // "no outputs to send transaction"
  ErrNoOutputs = 3,
  // "sum inputs != sum outputs"
  ErrInputOutputMismatch = 4,
  // "send transactions are disabled"
  ErrSendDisabled = 5,
  // "client denom metadata not found"
  ErrDenomMetadataNotFound = 6,
  // "invalid key"
  ErrInvalidKey = 7,
  // "duplicate entry"
  ErrDuplicateEntry = 8,
  // "multiple senders not allowed"
  ErrMultipleSenders = 9,
}

export enum ChainWasmErrorCodes {
  // ErrCreateFailed error for wasm code that has already been uploaded or failed
  ErrCreateFailed = 2,
  // ErrAccountExists error for a contract account that already exists
  ErrAccountExists = 3,
  // ErrInstantiateFailed error for rust instantiate contract failure
  ErrInstantiateFailed = 4,
  // ErrExecuteFailed error for rust execution contract failure
  ErrExecuteFailed = 5,
  // ErrGasLimit error for out of gas
  ErrGasLimit = 6,
  // ErrInvalidGenesis error for invalid genesis file syntax
  ErrInvalidGenesis = 7,
  // ErrNotFound error for an entry not found in the store
  ErrNotFound = 8,
  // ErrQueryFailed error for rust smart query contract failure
  ErrQueryFailed = 9,
  // ErrInvalidMsg error when we cannot process the error returned from the contract
  ErrInvalidMsg = 10,
  // ErrMigrationFailed error for rust execution contract failure
  ErrMigrationFailed = 11,
  // ErrEmpty error for empty content
  ErrEmpty = 12,
  // ErrLimit error for content that exceeds a limit
  ErrLimit = 13,
  // ErrInvalid error for content that is invalid in this context
  ErrInvalid = 14,
  // ErrDuplicate error for content that exists
  ErrDuplicate = 15,
  // ErrMaxIBCChannels error for maximum number of ibc channels reached
  ErrMaxIBCChannels = 16,
  // ErrUnsupportedForContract error when a capability is used that is not supported for/ by this contract
  ErrUnsupportedForContract = 17,
  // ErrPinContractFailed error for pinning contract failures
  ErrPinContractFailed = 18,
  // ErrUnpinContractFailed error for unpinning contract failures
  ErrUnpinContractFailed = 19,
  // ErrUnknownMsg error by a message handler to show that it is not responsible for this message type
  ErrUnknownMsg = 20,
  // ErrInvalidEvent error if an attribute/event from the contract is invalid
  ErrInvalidEvent = 21,
}

export type IndexerApiErrorCode = number

export const UnspecifiedErrorCode = -1

export type ErrorCode =
  | grpcPkg.grpc.Code
  | StatusCodes
  | typeof UnspecifiedErrorCode
  | GrpcErrorCode
export const GRPC_REQUEST_FAILED = GrpcErrorCode.Unavailable

export type ErrorContextCode =
  | ChainAuctionErrorCodes
  | ChainAuthZErrorCodes
  | ChainCosmosErrorCode
  | ChainExchangeModuleErrorCode
  | ChainInsuranceErrorCodes
  | ChainOcrErrorCodes
  | ChainOracleErrorCodes
  | ChainPeggyErrorCodes
  | ChainTokenFactoryErrorCodes
  | ChainWasmXErrorCodes
  | ChainDistributionErrorCodes
  | ChainBankErrorCodes
  | ChainGovErrorCodes
  | ChainStakingErrorCodes
  | ChainWasmErrorCodes
  | ErrorCode
  | number
  | typeof UnspecifiedErrorCode
