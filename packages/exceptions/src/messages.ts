import {
  ChainAuctionErrorCodes,
  ChainCosmosErrorCode,
  ChainOcrErrorCodes,
  ChainOracleErrorCodes,
  ChainExchangeModuleErrorCode,
  ChainInsuranceErrorCodes,
  ChainPeggyErrorCodes,
  ChainTokenFactoryErrorCodes,
  ChainWasmXErrorCodes,
  ErrorModule,
} from './types'

const auctionErrorMap = {
  [ChainAuctionErrorCodes.ErrBidInvalid]:
    'The gas limit provided in the transaction is not valid',
  [ChainAuctionErrorCodes.ErrBidRound]:
    'The gas limit provided in the transaction is not valid',
}

const cosmosErrorMap = {
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
}

const exchangeErrorMap = {
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
  [ChainExchangeModuleErrorCode.ErrInvalidFundsDirection]:
    'Invalid funds direction',
  [ChainExchangeModuleErrorCode.ErrNoFundsProvided]: 'No funds provided',
  [ChainExchangeModuleErrorCode.ErrInvalidSignature]: 'Invalid signature',
  [ChainExchangeModuleErrorCode.ErrNoFundsToUnlock]: 'No funds to unlock',
  [ChainExchangeModuleErrorCode.ErrNoMsgsProvided]: 'No msgs provided',
  [ChainExchangeModuleErrorCode.ErrNoMsgProvided]: 'No msg provided',
  [ChainExchangeModuleErrorCode.ErrInvalidAmount]: 'Invalid amount',
  [ChainExchangeModuleErrorCode.ErrFeatureDisabled]:
    'The current feature has been disabled',
  [ChainExchangeModuleErrorCode.ErrTooMuchOrderMargin]:
    'Order has too much margin',
}

const insuranceErrorMap = {
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
}

const ocrErrorMap = {
  [ChainOcrErrorCodes.ErrStaleReport]: 'stale report',
  [ChainOcrErrorCodes.ErrIncompleteProposal]: 'incomplete proposal',
  [ChainOcrErrorCodes.ErrRepeatedAddress]: 'repeated oracle address',
  [ChainOcrErrorCodes.ErrTooManySigners]: 'too many signers',
  [ChainOcrErrorCodes.ErrIncorrectConfig]: 'incorrect config',
  [ChainOcrErrorCodes.ErrConfigDigestNotMatch]: "config digest doesn't match",
  [ChainOcrErrorCodes.ErrWrongNumberOfSignatures]: 'wrong number of signatures',
  [ChainOcrErrorCodes.ErrIncorrectSignature]: 'incorrect signature',
  [ChainOcrErrorCodes.ErrNoTransmitter]: 'no transmitter specified',
  [ChainOcrErrorCodes.ErrIncorrectTransmissionData]:
    'incorrect transmission data',
  [ChainOcrErrorCodes.ErrNoTransmissionsFound]: 'no transmissions found',
  [ChainOcrErrorCodes.ErrMedianValueOutOfBounds]:
    'median value is out of bounds',
  [ChainOcrErrorCodes.ErrIncorrectRewardPoolDenom]: "LINK denom doesn't match",
  [ChainOcrErrorCodes.ErrNoRewardPool]: "Reward Pool doesn't exist",
  [ChainOcrErrorCodes.ErrInvalidPayees]:
    'wrong number of payees and transmitters',
  [ChainOcrErrorCodes.ErrModuleAdminRestricted]:
    'action is restricted to the module admin',
  [ChainOcrErrorCodes.ErrFeedAlreadyExists]: 'feed already exists',
  [ChainOcrErrorCodes.ErrFeedDoesntExists]: 'feed doesnt exists',
  [ChainOcrErrorCodes.ErrAdminRestricted]: 'action is admin-restricted',
  [ChainOcrErrorCodes.ErrInsufficientRewardPool]: 'insufficient reward pool',
  [ChainOcrErrorCodes.ErrPayeeAlreadySet]: 'payee already set',
  [ChainOcrErrorCodes.ErrPayeeRestricted]: 'action is payee-restricted',
  [ChainOcrErrorCodes.ErrFeedConfigNotFound]: 'feed config not found',
}

const oracleErrorMap = {
  [ChainOracleErrorCodes.ErrEmptyRelayerAddr]: 'relayer address is empty',
  [ChainOracleErrorCodes.ErrBadRatesCount]: 'bad rates count',
  [ChainOracleErrorCodes.ErrBadResolveTimesCount]: 'bad resolve times',
  [ChainOracleErrorCodes.ErrBadRequestIDsCount]: 'bad request ID',
  [ChainOracleErrorCodes.ErrRelayerNotAuthorized]: 'relayer not authorized',
  [ChainOracleErrorCodes.ErrBadPriceFeedBaseCount]: 'bad price feed base count',
  [ChainOracleErrorCodes.ErrBadPriceFeedQuoteCount]:
    'bad price feed quote count',
  [ChainOracleErrorCodes.ErrUnsupportedOracleType]: 'unsupported oracle type',
  [ChainOracleErrorCodes.ErrBadMessagesCount]: 'bad messages count',
  [ChainOracleErrorCodes.ErrBadCoinbaseMessage]: 'bad Coinbase message',
  [ChainOracleErrorCodes.ErrInvalidEthereumSignature]: 'bad Ethereum signature',
  [ChainOracleErrorCodes.ErrBadCoinbaseMessageTimestamp]:
    'bad Coinbase message timestamp',
  [ChainOracleErrorCodes.ErrCoinbasePriceNotFound]: 'Coinbase price not found',
  [ChainOracleErrorCodes.ErrBadPrice]: 'Prices must be positive',
  [ChainOracleErrorCodes.ErrPriceTooLarge]:
    'Prices must be less than 10 million.',
  [ChainOracleErrorCodes.ErrInvalidBandIBCRequest]: 'Invalid Band IBC Request',
  [ChainOracleErrorCodes.ErrSample]: 'sample error',
  [ChainOracleErrorCodes.ErrInvalidPacketTimeout]: 'invalid packet timeout',
  [ChainOracleErrorCodes.ErrBadSymbolsCount]: 'invalid symbols count',
  [ChainOracleErrorCodes.ErrBadIBCPortBind]: 'could not claim port capability',
  [ChainOracleErrorCodes.ErrInvalidPortID]: 'invalid IBC Port ID',
  [ChainOracleErrorCodes.ErrInvalidChannelID]: 'invalid IBC Channel ID',
  [ChainOracleErrorCodes.ErrBadRequestInterval]:
    'invalid Band IBC request interval',
  [ChainOracleErrorCodes.ErrInvalidBandIBCUpdateRequest]:
    'Invalid Band IBC Update Request Proposal',
  [ChainOracleErrorCodes.ErrBandIBCRequestNotFound]:
    'Band IBC Oracle Request not found',
  [ChainOracleErrorCodes.ErrEmptyBaseInfo]: 'Base Info is empty',
  [ChainOracleErrorCodes.ErrEmptyProvider]: 'provider is empty',
  [ChainOracleErrorCodes.ErrInvalidProvider]: 'invalid provider name',
  [ChainOracleErrorCodes.ErrInvalidSymbol]: 'invalid symbol',
  [ChainOracleErrorCodes.ErrRelayerAlreadyExists]: 'relayer already exists',
  [ChainOracleErrorCodes.ErrProviderPriceNotFound]: 'provider price not found',
  [ChainOracleErrorCodes.ErrInvalidOracleRequest]: 'invalid oracle request',
  [ChainOracleErrorCodes.ErrOraclePriceNotFound]:
    'no price for oracle was found',
}

const peggyErrorMap = {
  [ChainPeggyErrorCodes.ErrInternal]: 'internal',
  [ChainPeggyErrorCodes.ErrDuplicate]: 'duplicate',
  [ChainPeggyErrorCodes.ErrInvalid]: 'invalid',
  [ChainPeggyErrorCodes.ErrTimeout]: 'timeout',
  [ChainPeggyErrorCodes.ErrUnknown]: 'unknown',
  [ChainPeggyErrorCodes.ErrEmpty]: 'empty',
  [ChainPeggyErrorCodes.ErrOutdated]: 'outdated',
  [ChainPeggyErrorCodes.ErrUnsupported]: 'unsupported',
  [ChainPeggyErrorCodes.ErrNonContiguousEventNonce]:
    'non contiguous event nonce',
  [ChainPeggyErrorCodes.ErrNoUnbatchedTxsFound]: 'no unbatched txs found',
  [ChainPeggyErrorCodes.ErrResetDelegateKeys]:
    'can not set orchestrator addresses more than once',
  [ChainPeggyErrorCodes.ErrSupplyOverflow]:
    'supply cannot exceed max ERC20 value',
  [ChainPeggyErrorCodes.ErrInvalidEthSender]:
    'invalid ethereum sender on claim',
  [ChainPeggyErrorCodes.ErrInvalidEthDestination]:
    'invalid ethereum destination',
}

const tokenFactoryErrorMap = {
  [ChainTokenFactoryErrorCodes.ErrDenomExists]:
    'attempting to create a denom that already exists',
  [ChainTokenFactoryErrorCodes.ErrUnauthorized]: 'unauthorized account',
  [ChainTokenFactoryErrorCodes.ErrInvalidDenom]: 'invalid denom',
  [ChainTokenFactoryErrorCodes.ErrInvalidCreator]: 'invalid creator',
  [ChainTokenFactoryErrorCodes.ErrInvalidAuthorityMetadata]:
    'invalid authority metadata',
  [ChainTokenFactoryErrorCodes.ErrInvalidGenesis]: 'invalid genesis',
  [ChainTokenFactoryErrorCodes.ErrSubdenomTooLong]: 'subdenom too long',
  [ChainTokenFactoryErrorCodes.ErrSubdenomTooShort]: 'subdenom too short',
  [ChainTokenFactoryErrorCodes.ErrSubdenomNestedTooShort]:
    'nested subdenom too short, each one should have at least',
  [ChainTokenFactoryErrorCodes.ErrCreatorTooLong]: 'creator too long',
  [ChainTokenFactoryErrorCodes.ErrDenomDoesNotExist]: 'denom does not exist',
}

const wamsxErrorMap = {
  [ChainWasmXErrorCodes.ErrInvalidGasLimit]: 'invalid gas limit',
  [ChainWasmXErrorCodes.ErrInvalidGasPrice]: 'invalid gas price',
  [ChainWasmXErrorCodes.ErrInvalidContractAddress]: 'invalid contract address',
  [ChainWasmXErrorCodes.ErrAlreadyRegistered]: 'contract already registered',
  [ChainWasmXErrorCodes.ErrDuplicateContract]: 'duplicate contract',
  [ChainWasmXErrorCodes.ErrNoContractAddresses]: 'no contract addresses found',
  [ChainWasmXErrorCodes.ErrInvalidCodeId]: 'invalid code id',
}

export const chainModuleCodeErrorMessagesMap: Record<
  string,
  Record<number, string>
> = {
  [ErrorModule.Auction]: auctionErrorMap,
  [ErrorModule.CosmosSdk]: cosmosErrorMap,
  [ErrorModule.Exchange]: exchangeErrorMap,
  [ErrorModule.Insurance]: insuranceErrorMap,
  [ErrorModule.Ocr]: ocrErrorMap,
  [ErrorModule.Oracle]: oracleErrorMap,
  [ErrorModule.Peggy]: peggyErrorMap,
  [ErrorModule.TokenFactory]: tokenFactoryErrorMap,
  [ErrorModule.Wasmx]: wamsxErrorMap,
}

export const chainCodeErrorMessagesMap: Record<number, string> = {}
