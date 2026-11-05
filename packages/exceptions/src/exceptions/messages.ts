import { exchangeErrors } from './messages/exchange.js'
import { insuranceErrors } from './messages/insurance.js'
import {
  ChainOcrErrorCodes,
  ChainGovErrorCodes,
  ChainBankErrorCodes,
  ChainWasmErrorCodes,
  ChainAuthZErrorCodes,
  ChainPeggyErrorCodes,
  ChainCosmosErrorCode,
  ChainWasmXErrorCodes,
  ChainOracleErrorCodes,
  ChainStakingErrorCodes,
  ChainAuctionErrorCodes,
  ChainTokenFactoryErrorCodes,
  ChainDistributionErrorCodes,
  TransactionChainErrorModule,
} from './types/index.js'
import type { ErrorContextCode } from './types/index.js'

const auctionErrorMap = {
  [ChainAuctionErrorCodes.ErrBidInvalid]:
    'The gas limit provided in the transaction is not valid',
  [ChainAuctionErrorCodes.ErrBidRound]:
    'The gas limit provided in the transaction is not valid',
}

const authZErrorMap = {
  // ErrNoAuthorizationFound error if there is no authorization found given a grant key
  [ChainAuthZErrorCodes.ErrNoAuthorizationFound]: 'Authorization not found',
  // ErrInvalidExpirationTime error if the set expiration time is in the past
  [ChainAuthZErrorCodes.ErrInvalidExpirationTime]:
    'Expiration time of authorization should be more than current time',
  // ErrUnknownAuthorizationType error for unknown authorization type
  [ChainAuthZErrorCodes.ErrUnknownAuthorizationType]:
    'Unknown authorization type',
  // ErrNoGrantKeyFound error if the requested grant key does not exist
  [ChainAuthZErrorCodes.ErrNoGrantKeyFound]: 'Grant key not found',
  // ErrAuthorizationExpired error if the authorization has expired
  [ChainAuthZErrorCodes.ErrAuthorizationExpired]: 'Authorization expired',
  // ErrGranteeIsGranter error if the grantee and the granter are the same
  [ChainAuthZErrorCodes.ErrGranteeIsGranter]:
    'Grantee and granter should be different',
  // ErrAuthorizationNumOfSigners error if an authorization message does not have only one signer
  [ChainAuthZErrorCodes.ErrAuthorizationNumOfSigners]:
    'Authorization can be given to msg with only one signer',
  // ErrNegativeMaxTokens error if the max tokens is negative
  [ChainAuthZErrorCodes.ErrNegativeMaxTokens]: 'Max tokens should be positive',
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
  [ChainCosmosErrorCode.ErrKeyNotFound]:
    'Address is not yet active on the chain as it has a $0 balance. To activate it, please send a small amount of funds. Once funded, the network will recognize the address, allowing you to proceed.',
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

const wasmxErrorMap = {
  [ChainWasmXErrorCodes.ErrInvalidGasLimit]: 'invalid gas limit',
  [ChainWasmXErrorCodes.ErrInvalidGasPrice]: 'invalid gas price',
  [ChainWasmXErrorCodes.ErrInvalidContractAddress]: 'invalid contract address',
  [ChainWasmXErrorCodes.ErrAlreadyRegistered]: 'contract already registered',
  [ChainWasmXErrorCodes.ErrDuplicateContract]: 'duplicate contract',
  [ChainWasmXErrorCodes.ErrNoContractAddresses]: 'no contract addresses found',
  [ChainWasmXErrorCodes.ErrInvalidCodeId]: 'invalid code id',
}

const stakingErrorMap = {
  [ChainStakingErrorCodes.ErrEmptyValidatorAddr]: 'empty validator address',
  [ChainStakingErrorCodes.ErrNoValidatorFound]: 'validator does not exist',
  [ChainStakingErrorCodes.ErrValidatorOwnerExists]:
    'validator already exist for this operator address; must use new validator operator address',
  [ChainStakingErrorCodes.ErrValidatorPubKeyExists]:
    'validator already exist for this pubkey; must use new validator pubkey',
  [ChainStakingErrorCodes.ErrValidatorPubKeyTypeNotSupported]:
    'validator pubkey type is not supported',
  [ChainStakingErrorCodes.ErrValidatorJailed]:
    'validator for this address is currently jailed',
  [ChainStakingErrorCodes.ErrBadRemoveValidator]: 'failed to remove validator',
  [ChainStakingErrorCodes.ErrCommissionNegative]: 'commission must be positive',
  [ChainStakingErrorCodes.ErrCommissionHuge]:
    'commission cannot be more than 100%',
  [ChainStakingErrorCodes.ErrCommissionGTMaxRate]:
    'commission cannot be more than the max rate',
  [ChainStakingErrorCodes.ErrCommissionUpdateTime]:
    'commission cannot be changed more than once in 24h',
  [ChainStakingErrorCodes.ErrCommissionChangeRateNegative]:
    'commission change rate must be positive',
  [ChainStakingErrorCodes.ErrCommissionChangeRateGTMaxRate]:
    'commission change rate cannot be more than the max rate',
  [ChainStakingErrorCodes.ErrCommissionGTMaxChangeRate]:
    'commission cannot be changed more than max change rate',
  [ChainStakingErrorCodes.ErrSelfDelegationBelowMinimum]:
    "validator's self delegation must be greater than their minimum self delegation",
  [ChainStakingErrorCodes.ErrMinSelfDelegationDecreased]:
    'minimum self delegation cannot be decrease',
  [ChainStakingErrorCodes.ErrEmptyDelegatorAddr]: 'empty delegator address',
  [ChainStakingErrorCodes.ErrNoDelegation]:
    'no delegation for (address, validator) tuple',
  [ChainStakingErrorCodes.ErrBadDelegatorAddr]:
    'delegator does not exist with address',
  [ChainStakingErrorCodes.ErrNoDelegatorForAddress]:
    'delegator does not contain delegation',
  [ChainStakingErrorCodes.ErrInsufficientShares]:
    'insufficient delegation shares',
  [ChainStakingErrorCodes.ErrDelegationValidatorEmpty]:
    'cannot delegate to an empty validator',
  [ChainStakingErrorCodes.ErrNotEnoughDelegationShares]:
    'not enough delegation shares',
  [ChainStakingErrorCodes.ErrNotMature]: 'entry not mature',
  [ChainStakingErrorCodes.ErrNoUnbondingDelegation]:
    'no unbonding delegation found',
  [ChainStakingErrorCodes.ErrMaxUnbondingDelegationEntries]:
    'too many unbonding delegation entries for (delegator, validator) tuple',
  [ChainStakingErrorCodes.ErrNoRedelegation]: 'no redelegation found',
  [ChainStakingErrorCodes.ErrSelfRedelegation]:
    'cannot redelegate to the same validator',
  [ChainStakingErrorCodes.ErrTinyRedelegationAmount]:
    'too few tokens to redelegate (truncates to zero tokens)',
  [ChainStakingErrorCodes.ErrBadRedelegationDst]:
    'redelegation destination validator not found',
  [ChainStakingErrorCodes.ErrTransitiveRedelegation]:
    'redelegation to this validator already in progress; first redelegation to this validator must complete before next redelegation',
  [ChainStakingErrorCodes.ErrMaxRedelegationEntries]:
    'too many redelegation entries for (delegator, src-validator, dst-validator) tuple',
  [ChainStakingErrorCodes.ErrDelegatorShareExRateInvalid]:
    'cannot delegate to validators with invalid (zero) ex-rate',
  [ChainStakingErrorCodes.ErrBothShareMsgsGiven]:
    'both shares amount and shares percent provided',
  [ChainStakingErrorCodes.ErrNeitherShareMsgsGiven]:
    'neither shares amount nor shares percent provided',
  [ChainStakingErrorCodes.ErrInvalidHistoricalInfo]: 'invalid historical info',
  [ChainStakingErrorCodes.ErrNoHistoricalInfo]: 'no historical info found',
  [ChainStakingErrorCodes.ErrEmptyValidatorPubKey]:
    'empty validator public key',
  [ChainStakingErrorCodes.ErrCommissionLTMinRate]:
    'commission cannot be less than min rate',
  [ChainStakingErrorCodes.ErrUnbondingNotFound]:
    'unbonding operation not found',
  [ChainStakingErrorCodes.ErrUnbondingOnHoldRefCountNegative]:
    'cannot un-hold unbonding operation that is not on hold',
}

const govErrorMap = {
  [ChainGovErrorCodes.ErrUnknownProposal]: 'unknown proposal',
  [ChainGovErrorCodes.ErrInactiveProposal]: 'inactive proposal',
  [ChainGovErrorCodes.ErrAlreadyActiveProposal]: 'proposal already active',
  [ChainGovErrorCodes.ErrInvalidProposalContent]: 'invalid proposal content',
  [ChainGovErrorCodes.ErrInvalidProposalType]: 'invalid proposal type',
  [ChainGovErrorCodes.ErrInvalidVote]: 'invalid vote option',
  [ChainGovErrorCodes.ErrInvalidGenesis]: 'invalid genesis state',
  [ChainGovErrorCodes.ErrNoProposalHandlerExists]:
    'no handler exists for proposal type',
  [ChainGovErrorCodes.ErrUnroutableProposalMsg]:
    'proposal message not recognized by router',
  [ChainGovErrorCodes.ErrNoProposalMsgs]: 'no messages proposed',
  [ChainGovErrorCodes.ErrInvalidProposalMsg]: 'invalid proposal message',
  [ChainGovErrorCodes.ErrInvalidSigner]:
    'expected gov account as only signer for proposal message',
  [ChainGovErrorCodes.ErrInvalidSignalMsg]: 'signal message is invalid',
  [ChainGovErrorCodes.ErrMetadataTooLong]: 'metadata too long',
  [ChainGovErrorCodes.ErrMinDepositTooSmall]: 'minimum deposit is too small',
  [ChainGovErrorCodes.ErrProposalNotFound]: 'proposal is not found',
  [ChainGovErrorCodes.ErrInvalidProposer]: 'invalid proposer',
  [ChainGovErrorCodes.ErrNoDeposits]: 'no deposits found',
  [ChainGovErrorCodes.ErrVotingPeriodEnded]: 'voting period already ended',
  [ChainGovErrorCodes.ErrInvalidProposal]: 'invalid proposal',
}

const bankErrorMap = {
  [ChainBankErrorCodes.ErrNoInputs]: 'no inputs to send transaction',
  [ChainBankErrorCodes.ErrNoOutputs]: 'no outputs to send transaction',
  [ChainBankErrorCodes.ErrInputOutputMismatch]: 'sum inputs != sum outputs',
  [ChainBankErrorCodes.ErrSendDisabled]: 'send transactions are disabled',
  [ChainBankErrorCodes.ErrDenomMetadataNotFound]:
    'client denom metadata not found',
  [ChainBankErrorCodes.ErrInvalidKey]: 'invalid key',
  [ChainBankErrorCodes.ErrDuplicateEntry]: 'duplicate entry',
  [ChainBankErrorCodes.ErrMultipleSenders]: 'multiple senders not allowed',
}

const distributionErrorMap = {
  [ChainDistributionErrorCodes.ErrEmptyDelegatorAddr]:
    'delegator address is empty',
  [ChainDistributionErrorCodes.ErrEmptyWithdrawAddr]:
    'withdraw address is empty',
  [ChainDistributionErrorCodes.ErrEmptyValidatorAddr]:
    'validator address is empty',
  [ChainDistributionErrorCodes.ErrEmptyDelegationDistInfo]:
    'no delegation distribution info',
  [ChainDistributionErrorCodes.ErrNoValidatorDistInfo]:
    'no validator distribution info',
  [ChainDistributionErrorCodes.ErrNoValidatorCommission]:
    'no validator commission to withdraw',
  [ChainDistributionErrorCodes.ErrSetWithdrawAddrDisabled]:
    'set withdraw address disabled',
  [ChainDistributionErrorCodes.ErrBadDistribution]:
    'community pool does not have sufficient coins to distribute',
  [ChainDistributionErrorCodes.ErrInvalidProposalAmount]:
    'invalid community pool spend proposal amount',
  [ChainDistributionErrorCodes.ErrEmptyProposalRecipient]:
    'invalid community pool spend proposal recipient',
  [ChainDistributionErrorCodes.ErrNoValidatorExists]:
    'validator does not exist',
  [ChainDistributionErrorCodes.ErrNoDelegationExists]:
    'delegation does not exist',
}

const wasmErrorMap = {
  [ChainWasmErrorCodes.ErrCreateFailed]: 'create wasm contract failed',
  [ChainWasmErrorCodes.ErrAccountExists]: 'contract account already exists',
  [ChainWasmErrorCodes.ErrInstantiateFailed]:
    'instantiate wasm contract failed',
  [ChainWasmErrorCodes.ErrExecuteFailed]: 'Contract execution failed',
  [ChainWasmErrorCodes.ErrGasLimit]: 'insufficient gas',
  [ChainWasmErrorCodes.ErrInvalidGenesis]: 'invalid genesis',
  [ChainWasmErrorCodes.ErrNotFound]: 'not found',
  [ChainWasmErrorCodes.ErrQueryFailed]: 'query wasm contract failed',
  [ChainWasmErrorCodes.ErrInvalidMsg]: 'invalid CosmosMsg from the contract',
  [ChainWasmErrorCodes.ErrMigrationFailed]: 'migrate wasm contract failed',
  [ChainWasmErrorCodes.ErrEmpty]: 'empty',
  [ChainWasmErrorCodes.ErrLimit]: 'exceeds limit',
  [ChainWasmErrorCodes.ErrInvalid]: 'invalid',
  [ChainWasmErrorCodes.ErrDuplicate]: 'duplicate',
  [ChainWasmErrorCodes.ErrMaxIBCChannels]: 'max transfer channels',
  [ChainWasmErrorCodes.ErrUnsupportedForContract]:
    'unsupported for this contract',
  [ChainWasmErrorCodes.ErrPinContractFailed]: 'pinning contract failed',
  [ChainWasmErrorCodes.ErrUnpinContractFailed]: 'unpinning contract failed',
  [ChainWasmErrorCodes.ErrUnknownMsg]: 'unknown message from the contract',
  [ChainWasmErrorCodes.ErrInvalidEvent]: 'invalid event',
}

export const chainModuleCodeErrorMessagesMap: Record<
  string,
  Record<number, string>
> = {
  [TransactionChainErrorModule.AuthZ]: authZErrorMap,
  [TransactionChainErrorModule.Auction]: auctionErrorMap,
  [TransactionChainErrorModule.CosmosSdk]: cosmosErrorMap,
  [TransactionChainErrorModule.Exchange]: exchangeErrors.byCode,
  [TransactionChainErrorModule.Insurance]: insuranceErrors.byCode,
  [TransactionChainErrorModule.Ocr]: ocrErrorMap,
  [TransactionChainErrorModule.Oracle]: oracleErrorMap,
  [TransactionChainErrorModule.Peggy]: peggyErrorMap,
  [TransactionChainErrorModule.TokenFactory]: tokenFactoryErrorMap,
  [TransactionChainErrorModule.Wasmx]: wasmxErrorMap,
  [TransactionChainErrorModule.Wasm]: wasmErrorMap,
  [TransactionChainErrorModule.Staking]: stakingErrorMap,
  [TransactionChainErrorModule.Bank]: bankErrorMap,
  [TransactionChainErrorModule.Gov]: govErrorMap,
  [TransactionChainErrorModule.Distribution]: distributionErrorMap,
}

/**
 * **Legacy** but needed for error messages from broadcasting transactions
 * where we don't control the response and only have the message
 * i.e Keplr, Leap, etc
 */
export const chainErrorMessagesMap: Record<
  string,
  {
    message: string
    code: ErrorContextCode
    module: TransactionChainErrorModule
  }
> = {
  'insufficient fee': {
    message: 'You do not have enough funds to cover the transaction fees.',
    code: ChainCosmosErrorCode.ErrInsufficientFee,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'insufficient funds': {
    message: 'You do not have enough funds.',
    code: ChainCosmosErrorCode.ErrInsufficientFunds,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'tx timeout height': {
    message: 'The transaction failed to be included within a block on time.',
    code: ChainCosmosErrorCode.ErrTxTimeoutHeight,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'tx parse error': {
    message: 'There is an issue while parsing the transaction',
    code: ChainCosmosErrorCode.ErrTxDecode,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'invalid sequence': {
    message: 'The sequence number is not valid',
    code: ChainCosmosErrorCode.ErrInvalidSequence,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  unauthorized: {
    message: 'Unauthorized',
    code: ChainCosmosErrorCode.ErrUnauthorized,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'invalid address': {
    message: 'The address is not valid',
    code: ChainCosmosErrorCode.ErrInvalidAddress,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'cosmos account not exists': {
    message:
      'You need to create your address on Injective by transferring funds',
    code: ChainCosmosErrorCode.ErrInsufficientFee,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'invalid pubkey': {
    message: 'The public key is not valid',
    code: ChainCosmosErrorCode.ErrInvalidPubKey,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'unknown address': {
    message: 'The address is unknown',
    code: ChainCosmosErrorCode.ErrUnknownAddress,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'invalid coins': {
    message: 'The coins are not valid',
    code: ChainCosmosErrorCode.ErrInvalidCoins,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'out of gas': {
    message: 'The transaction run out of gas',
    code: ChainCosmosErrorCode.ErrOutOfGas,
    module: TransactionChainErrorModule.CosmosSdk,
  },
  'memo too large': {
    message: 'The memo field in the transaction is too large',
    code: ChainCosmosErrorCode.ErrMemoTooLarge,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'maximum number of signatures exceeded': {
    message: 'The transaction exceeded the maximum number of signatures',
    code: ChainCosmosErrorCode.ErrTooManySignatures,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'no signatures supplied': {
    message: 'There are no signatures appended on the transaction',
    code: ChainCosmosErrorCode.ErrNoSignatures,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'failed to marshal JSON bytes': {
    message: 'There is an issue while parsing the transaction',
    code: ChainCosmosErrorCode.ErrJSONMarshal,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'failed to unmarshal JSON bytes': {
    message: 'There is an issue while parsing the transaction',
    code: ChainCosmosErrorCode.ErrJSONUnmarshal,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'invalid request': {
    message: 'invalid request',
    code: ChainCosmosErrorCode.ErrInvalidRequest,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'tx already in mempool': {
    message: 'The transaction is already in the mempool',
    code: ChainCosmosErrorCode.ErrTxInMempoolCache,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'mempool is full': {
    message: 'The transaction failed to be included within a block on time.',
    code: ChainCosmosErrorCode.ErrMempoolIsFull,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'tx too large': {
    message: 'The transaction is too large',
    code: ChainCosmosErrorCode.ErrTxTooLarge,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'key not found': {
    message:
      'Address is not yet active on the chain as it has a $0 balance. To activate it, please send a small amount of funds. Once funded, the network will recognize the address, allowing you to proceed.',
    code: ChainCosmosErrorCode.ErrKeyNotFound,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'invalid account password': {
    message: 'invalid account password',
    code: ChainCosmosErrorCode.ErrWrongPassword,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'tx intended signer does not match the given signer': {
    message: 'tx intended signer does not match the given signer',
    code: ChainCosmosErrorCode.ErrorInvalidSigner,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'invalid gas adjustment': {
    message: 'invalid gas adjustment',
    code: ChainCosmosErrorCode.ErrorInvalidGasAdjustment,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'invalid height': {
    message: 'The height provided in the transaction is not valid',
    code: ChainCosmosErrorCode.ErrInvalidHeight,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'invalid version': {
    message: 'The version provided in the transaction is not valid',
    code: ChainCosmosErrorCode.ErrInvalidVersion,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'invalid chain-id': {
    message: 'The chainId provided in the transaction is not valid',
    code: ChainCosmosErrorCode.ErrInvalidChainID,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'invalid type': {
    message: 'The type provided in the transaction is not valid',
    code: ChainCosmosErrorCode.ErrInvalidType,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'unknown extension options': {
    message: 'The extension options provided in the transaction is unknown',
    code: ChainCosmosErrorCode.ErrUnknownExtensionOptions,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'incorrect account sequence': {
    message: 'The sequence number provided in the transaction is incorrect',
    code: ChainCosmosErrorCode.ErrWrongSequence,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'failed packing protobuf message to Any': {
    message: 'failed packing protobuf message to Any',
    code: ChainCosmosErrorCode.ErrPackAny,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'failed unpacking protobuf message from Any': {
    message: 'failed unpacking protobuf message from Any',
    code: ChainCosmosErrorCode.ErrUnpackAny,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'internal logic error': {
    message: 'Internal logic error',
    code: ChainCosmosErrorCode.ErrLogic,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  conflict: {
    message: 'conflict',
    code: ChainCosmosErrorCode.ErrConflict,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'feature not supported': {
    message: 'The feature is not supported',
    code: ChainCosmosErrorCode.ErrNotSupported,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'Internal IO error': {
    message: 'Internal IO error',
    code: ChainCosmosErrorCode.ErrIO,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'error in app.toml': {
    message: 'error in app.toml',
    code: ChainCosmosErrorCode.ErrAppConfig,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'invalid gas limit': {
    message: 'The gas limit provided in the transaction is not valid',
    code: ChainCosmosErrorCode.ErrInvalidGasLimit,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  // Auction Module Messages
  'invalid bid denom': {
    message: 'The gas limit provided in the transaction is not valid',
    code: ChainAuctionErrorCodes.ErrBidInvalid,
    module: TransactionChainErrorModule.Auction,
  },

  'invalid bid round': {
    message: 'The gas limit provided in the transaction is not valid',
    code: ChainAuctionErrorCodes.ErrBidRound,
    module: TransactionChainErrorModule.Auction,
  },

  // Insurance Module Messages
  ...insuranceErrors.byMessage,

  // Exchange Module Messages
  ...exchangeErrors.byMessage,

  'empty validator address': {
    message: 'empty validator address',
    code: ChainStakingErrorCodes.ErrEmptyValidatorAddr,
    module: TransactionChainErrorModule.Staking,
  },

  'validator does not exist': {
    message: 'validator does not exist',
    code: ChainStakingErrorCodes.ErrNoValidatorFound,
    module: TransactionChainErrorModule.Staking,
  },

  'validator already exist for this operator address; must use new validator operator address':
    {
      message:
        'validator already exist for this operator address; must use new validator operator address',
      code: ChainStakingErrorCodes.ErrValidatorOwnerExists,
      module: TransactionChainErrorModule.Staking,
    },

  'validator already exist for this pubkey; must use new validator pubkey': {
    message:
      'validator already exist for this pubkey; must use new validator pubkey',
    code: ChainStakingErrorCodes.ErrValidatorPubKeyExists,
    module: TransactionChainErrorModule.Staking,
  },

  'validator pubkey type is not supported': {
    message: 'validator pubkey type is not supported',
    code: ChainStakingErrorCodes.ErrValidatorPubKeyTypeNotSupported,
    module: TransactionChainErrorModule.Staking,
  },

  'validator for this address is currently jailed': {
    message: 'validator for this address is currently jailed',
    code: ChainStakingErrorCodes.ErrValidatorJailed,
    module: TransactionChainErrorModule.Staking,
  },

  'failed to remove validator': {
    message: 'failed to remove validator',
    code: ChainStakingErrorCodes.ErrBadRemoveValidator,
    module: TransactionChainErrorModule.Staking,
  },

  'commission must be positive': {
    message: 'commission must be positive',
    code: ChainStakingErrorCodes.ErrCommissionNegative,
    module: TransactionChainErrorModule.Staking,
  },

  'commission cannot be more than 100%': {
    message: 'commission cannot be more than 100%',
    code: ChainStakingErrorCodes.ErrCommissionHuge,
    module: TransactionChainErrorModule.Staking,
  },

  'commission cannot be more than the max rate': {
    message: 'commission cannot be more than the max rate',
    code: ChainStakingErrorCodes.ErrCommissionGTMaxRate,
    module: TransactionChainErrorModule.Staking,
  },

  'commission cannot be changed more than once in 24h': {
    message: 'commission cannot be changed more than once in 24h',
    code: ChainStakingErrorCodes.ErrCommissionUpdateTime,
    module: TransactionChainErrorModule.Staking,
  },

  'commission change rate must be positive': {
    message: 'commission change rate must be positive',
    code: ChainStakingErrorCodes.ErrCommissionChangeRateNegative,
    module: TransactionChainErrorModule.Staking,
  },

  'commission change rate cannot be more than the max rate': {
    message: 'commission change rate cannot be more than the max rate',
    code: ChainStakingErrorCodes.ErrCommissionChangeRateGTMaxRate,
    module: TransactionChainErrorModule.Staking,
  },

  'commission cannot be changed more than max change rate': {
    message: 'commission cannot be changed more than max change rate',
    code: ChainStakingErrorCodes.ErrCommissionGTMaxChangeRate,
    module: TransactionChainErrorModule.Staking,
  },

  "validator's self delegation must be greater than their minimum self delegation":
    {
      message:
        "validator's self delegation must be greater than their minimum self delegation",
      code: ChainStakingErrorCodes.ErrSelfDelegationBelowMinimum,
      module: TransactionChainErrorModule.Staking,
    },

  'minimum self delegation cannot be decrease': {
    message: 'minimum self delegation cannot be decrease',
    code: ChainStakingErrorCodes.ErrMinSelfDelegationDecreased,
    module: TransactionChainErrorModule.Staking,
  },

  'empty delegator address': {
    message: 'empty delegator address',
    code: ChainStakingErrorCodes.ErrEmptyDelegatorAddr,
    module: TransactionChainErrorModule.Staking,
  },

  'no delegation for (address, validator) tuple': {
    message: 'no delegation for (address, validator) tuple',
    code: ChainStakingErrorCodes.ErrNoDelegation,
    module: TransactionChainErrorModule.Staking,
  },

  'delegator does not exist with address': {
    message: 'delegator does not exist with address',
    code: ChainStakingErrorCodes.ErrBadDelegatorAddr,
    module: TransactionChainErrorModule.Staking,
  },

  'delegator does not contain delegation': {
    message: 'delegator does not contain delegation',
    code: ChainStakingErrorCodes.ErrNoDelegatorForAddress,
    module: TransactionChainErrorModule.Staking,
  },

  'insufficient delegation shares': {
    message: 'insufficient delegation shares',
    code: ChainStakingErrorCodes.ErrInsufficientShares,
    module: TransactionChainErrorModule.Staking,
  },

  'cannot delegate to an empty validator': {
    message: 'cannot delegate to an empty validator',
    code: ChainStakingErrorCodes.ErrDelegationValidatorEmpty,
    module: TransactionChainErrorModule.Staking,
  },

  'not enough delegation shares': {
    message: 'not enough delegation shares',
    code: ChainStakingErrorCodes.ErrNotEnoughDelegationShares,
    module: TransactionChainErrorModule.Staking,
  },

  'entry not mature': {
    message: 'entry not mature',
    code: ChainStakingErrorCodes.ErrNotMature,
    module: TransactionChainErrorModule.Staking,
  },

  'no unbonding delegation found': {
    message: 'no unbonding delegation found',
    code: ChainStakingErrorCodes.ErrNoUnbondingDelegation,
    module: TransactionChainErrorModule.Staking,
  },

  'too many unbonding delegation entries for (delegator, validator) tuple': {
    message:
      'too many unbonding delegation entries for (delegator, validator) tuple',
    code: ChainStakingErrorCodes.ErrMaxUnbondingDelegationEntries,
    module: TransactionChainErrorModule.Staking,
  },

  'no redelegation found': {
    message: 'no redelegation found',
    code: ChainStakingErrorCodes.ErrNoRedelegation,
    module: TransactionChainErrorModule.Staking,
  },

  'cannot redelegate to the same validator': {
    message: 'cannot redelegate to the same validator',
    code: ChainStakingErrorCodes.ErrSelfRedelegation,
    module: TransactionChainErrorModule.Staking,
  },

  'too few tokens to redelegate (truncates to zero tokens)': {
    message: 'too few tokens to redelegate (truncates to zero tokens)',
    code: ChainStakingErrorCodes.ErrTinyRedelegationAmount,
    module: TransactionChainErrorModule.Staking,
  },

  'redelegation destination validator not found': {
    message: 'redelegation destination validator not found',
    code: ChainStakingErrorCodes.ErrBadRedelegationDst,
    module: TransactionChainErrorModule.Staking,
  },

  'redelegation to this validator already in progress; first redelegation to this validator must complete before next redelegation':
    {
      message:
        'redelegation to this validator already in progress; first redelegation to this validator must complete before next redelegation',
      code: ChainStakingErrorCodes.ErrTransitiveRedelegation,
      module: TransactionChainErrorModule.Staking,
    },

  'too many redelegation entries for (delegator, src-validator, dst-validator) tuple':
    {
      message:
        'too many redelegation entries for (delegator, src-validator, dst-validator) tuple',
      code: ChainStakingErrorCodes.ErrMaxRedelegationEntries,
      module: TransactionChainErrorModule.Staking,
    },

  'cannot delegate to validators with invalid (zero) ex-rate': {
    message: 'cannot delegate to validators with invalid (zero) ex-rate',
    code: ChainStakingErrorCodes.ErrDelegatorShareExRateInvalid,
    module: TransactionChainErrorModule.Staking,
  },

  'both shares amount and shares percent provided': {
    message: 'both shares amount and shares percent provided',
    code: ChainStakingErrorCodes.ErrBothShareMsgsGiven,
    module: TransactionChainErrorModule.Staking,
  },

  'neither shares amount nor shares percent provided': {
    message: 'neither shares amount nor shares percent provided',
    code: ChainStakingErrorCodes.ErrNeitherShareMsgsGiven,
    module: TransactionChainErrorModule.Staking,
  },

  'invalid historical info': {
    message: 'invalid historical info',
    code: ChainStakingErrorCodes.ErrInvalidHistoricalInfo,
    module: TransactionChainErrorModule.Staking,
  },

  'no historical info found': {
    message: 'no historical info found',
    code: ChainStakingErrorCodes.ErrNoHistoricalInfo,
    module: TransactionChainErrorModule.Staking,
  },

  'empty validator public key': {
    message: 'empty validator public key',
    code: ChainStakingErrorCodes.ErrEmptyValidatorPubKey,
    module: TransactionChainErrorModule.Staking,
  },

  'commission cannot be less than min rate': {
    message: 'commission cannot be less than min rate',
    code: ChainStakingErrorCodes.ErrCommissionLTMinRate,
    module: TransactionChainErrorModule.Staking,
  },

  'unbonding operation not found': {
    message: 'unbonding operation not found',
    code: ChainStakingErrorCodes.ErrUnbondingNotFound,
    module: TransactionChainErrorModule.Staking,
  },

  'cannot un-hold unbonding operation that is not on hold': {
    message: 'cannot un-hold unbonding operation that is not on hold',
    code: ChainStakingErrorCodes.ErrUnbondingOnHoldRefCountNegative,
    module: TransactionChainErrorModule.Staking,
  },

  'delegator address is empty': {
    message: 'delegator address is empty',
    code: ChainDistributionErrorCodes.ErrEmptyDelegatorAddr,
    module: TransactionChainErrorModule.Distribution,
  },

  'withdraw address is empty': {
    message: 'withdraw address is empty',
    code: ChainDistributionErrorCodes.ErrEmptyWithdrawAddr,
    module: TransactionChainErrorModule.Distribution,
  },

  'validator address is empty': {
    message: 'validator address is empty',
    code: ChainDistributionErrorCodes.ErrEmptyValidatorAddr,
    module: TransactionChainErrorModule.Distribution,
  },

  'no delegation distribution info': {
    message: 'no delegation distribution info',
    code: ChainDistributionErrorCodes.ErrEmptyDelegationDistInfo,
    module: TransactionChainErrorModule.Distribution,
  },

  'no validator distribution info': {
    message: 'no validator distribution info',
    code: ChainDistributionErrorCodes.ErrNoValidatorDistInfo,
    module: TransactionChainErrorModule.Distribution,
  },

  'no validator commission to withdraw': {
    message: 'no validator commission to withdraw',
    code: ChainDistributionErrorCodes.ErrNoValidatorCommission,
    module: TransactionChainErrorModule.Distribution,
  },

  'set withdraw address disabled': {
    message: 'set withdraw address disabled',
    code: ChainDistributionErrorCodes.ErrSetWithdrawAddrDisabled,
    module: TransactionChainErrorModule.Distribution,
  },

  'community pool does not have sufficient coins to distribute': {
    message: 'community pool does not have sufficient coins distribute',
    code: ChainDistributionErrorCodes.ErrBadDistribution,
    module: TransactionChainErrorModule.Distribution,
  },

  'invalid community pool spend proposal amount': {
    message: 'invalid community pool spend proposal amount',
    code: ChainDistributionErrorCodes.ErrInvalidProposalAmount,
    module: TransactionChainErrorModule.Distribution,
  },

  'invalid community pool spend proposal recipient': {
    message: 'invalid community pool spend proposal recipient',
    code: ChainDistributionErrorCodes.ErrEmptyProposalRecipient,
    module: TransactionChainErrorModule.Distribution,
  },

  'delegation does not exist': {
    message: 'delegation does not exist',
    code: ChainDistributionErrorCodes.ErrNoDelegationExists,
    module: TransactionChainErrorModule.Distribution,
  },

  'unknown proposal': {
    message: 'unknown proposal',
    code: ChainGovErrorCodes.ErrUnknownProposal,
    module: TransactionChainErrorModule.Gov,
  },

  'inactive proposal': {
    message: 'inactive proposal',
    code: ChainGovErrorCodes.ErrInactiveProposal,
    module: TransactionChainErrorModule.Gov,
  },

  'proposal already active': {
    message: 'proposal already active',
    code: ChainGovErrorCodes.ErrAlreadyActiveProposal,
    module: TransactionChainErrorModule.Gov,
  },

  'invalid proposal content': {
    message: 'invalid proposal content',
    code: ChainGovErrorCodes.ErrInvalidProposalContent,
    module: TransactionChainErrorModule.Gov,
  },

  'invalid proposal type': {
    message: 'invalid proposal type',
    code: ChainGovErrorCodes.ErrInvalidProposalType,
    module: TransactionChainErrorModule.Gov,
  },

  'invalid vote option': {
    message: 'invalid vote option',
    code: ChainGovErrorCodes.ErrInvalidVote,
    module: TransactionChainErrorModule.Gov,
  },

  'invalid genesis state': {
    message: 'invalid genesis state',
    code: ChainGovErrorCodes.ErrInvalidGenesis,
    module: TransactionChainErrorModule.Gov,
  },

  'no handler exists for proposal type': {
    message: 'no handler exists for proposal type',
    code: ChainGovErrorCodes.ErrNoProposalHandlerExists,
    module: TransactionChainErrorModule.Gov,
  },

  'proposal message not recognized by router': {
    message: 'proposal message not recognized by router',
    code: ChainGovErrorCodes.ErrUnroutableProposalMsg,
    module: TransactionChainErrorModule.Gov,
  },

  'no messages proposed': {
    message: 'no messages proposed',
    code: ChainGovErrorCodes.ErrNoProposalMsgs,
    module: TransactionChainErrorModule.Gov,
  },

  'invalid proposal message': {
    message: 'invalid proposal message',
    code: ChainGovErrorCodes.ErrInvalidProposalMsg,
    module: TransactionChainErrorModule.Gov,
  },

  'expected gov account as only signer for proposal message': {
    message: 'expected gov account as only signer for proposal message',
    code: ChainGovErrorCodes.ErrInvalidSigner,
    module: TransactionChainErrorModule.Gov,
  },

  'signal message is invalid': {
    message: 'signal message is invalid',
    code: ChainGovErrorCodes.ErrInvalidSignalMsg,
    module: TransactionChainErrorModule.Gov,
  },

  'metadata too long': {
    message: 'metadata too long',
    code: ChainGovErrorCodes.ErrMetadataTooLong,
    module: TransactionChainErrorModule.Gov,
  },

  'minimum deposit is too small': {
    message: 'minimum deposit is too small',
    code: ChainGovErrorCodes.ErrMinDepositTooSmall,
    module: TransactionChainErrorModule.Gov,
  },

  'proposal is not found': {
    message: 'proposal is not found',
    code: ChainGovErrorCodes.ErrProposalNotFound,
    module: TransactionChainErrorModule.Gov,
  },

  'invalid proposer': {
    message: 'invalid proposer',
    code: ChainGovErrorCodes.ErrInvalidProposer,
    module: TransactionChainErrorModule.Gov,
  },

  'no deposits found': {
    message: 'no deposits found',
    code: ChainGovErrorCodes.ErrNoDeposits,
    module: TransactionChainErrorModule.Gov,
  },

  'voting period already ended': {
    message: 'voting period already ended',
    code: ChainGovErrorCodes.ErrVotingPeriodEnded,
    module: TransactionChainErrorModule.Gov,
  },

  'invalid proposal': {
    message: 'invalid proposal',
    code: ChainGovErrorCodes.ErrInvalidProposal,
    module: TransactionChainErrorModule.Gov,
  },

  'no inputs to send transaction': {
    message: 'no inputs to send transaction',
    code: ChainBankErrorCodes.ErrNoInputs,
    module: TransactionChainErrorModule.Bank,
  },

  'no outputs to send transaction': {
    message: 'no outputs to send transaction',
    code: ChainBankErrorCodes.ErrNoOutputs,
    module: TransactionChainErrorModule.Bank,
  },

  'sum inputs != sum outputs': {
    message: 'sum inputs != sum outputs',
    code: ChainBankErrorCodes.ErrInputOutputMismatch,
    module: TransactionChainErrorModule.Bank,
  },

  'send transactions are disabled': {
    message: 'send transactions are disabled',
    code: ChainBankErrorCodes.ErrSendDisabled,
    module: TransactionChainErrorModule.Bank,
  },

  'client denom metadata not found': {
    message: 'client denom metadata not found',
    code: ChainBankErrorCodes.ErrDenomMetadataNotFound,
    module: TransactionChainErrorModule.Bank,
  },

  'invalid key': {
    message: 'invalid key',
    code: ChainBankErrorCodes.ErrInvalidKey,
    module: TransactionChainErrorModule.Bank,
  },

  'duplicate entry': {
    message: 'duplicate entry',
    code: ChainBankErrorCodes.ErrDuplicateEntry,
    module: TransactionChainErrorModule.Bank,
  },

  'multiple senders not allowed': {
    message: 'multiple senders not allowed',
    code: ChainBankErrorCodes.ErrMultipleSenders,
    module: TransactionChainErrorModule.Bank,
  },

  'create wasm contract failed': {
    code: ChainWasmErrorCodes.ErrCreateFailed,
    message: 'create wasm contract failed',
    module: TransactionChainErrorModule.Wasm,
  },
  'contract account already exists': {
    code: ChainWasmErrorCodes.ErrAccountExists,
    message: 'contract account already exists',
    module: TransactionChainErrorModule.Wasm,
  },
  'instantiate wasm contract failed': {
    code: ChainWasmErrorCodes.ErrInstantiateFailed,
    message: 'instantiate wasm contract failed',
    module: TransactionChainErrorModule.Wasm,
  },
  'execute wasm contract failed': {
    code: ChainWasmErrorCodes.ErrExecuteFailed,
    message: 'Contract execution failed',
    module: TransactionChainErrorModule.Wasm,
  },
  'insufficient gas': {
    code: ChainWasmErrorCodes.ErrGasLimit,
    message: 'insufficient gas',
    module: TransactionChainErrorModule.Wasm,
  },
  'invalid genesis': {
    code: ChainWasmErrorCodes.ErrInvalidGenesis,
    message: 'invalid genesis',
    module: TransactionChainErrorModule.Wasm,
  },
  'query wasm contract failed': {
    code: ChainWasmErrorCodes.ErrQueryFailed,
    message: 'query wasm contract failed',
    module: TransactionChainErrorModule.Wasm,
  },
  'invalid CosmosMsg from the contract': {
    code: ChainWasmErrorCodes.ErrInvalidMsg,
    message: 'invalid CosmosMsg from the contract',
    module: TransactionChainErrorModule.Wasm,
  },
  'migrate wasm contract failed': {
    code: ChainWasmErrorCodes.ErrMigrationFailed,
    message: 'migrate wasm contract failed',
    module: TransactionChainErrorModule.Wasm,
  },
  empty: {
    code: ChainWasmErrorCodes.ErrEmpty,
    message: 'empty',
    module: TransactionChainErrorModule.Wasm,
  },
  'exceeds limit': {
    code: ChainWasmErrorCodes.ErrLimit,
    message: 'exceeds limit',
    module: TransactionChainErrorModule.Wasm,
  },
  invalid: {
    code: ChainWasmErrorCodes.ErrInvalid,
    message: 'invalid',
    module: TransactionChainErrorModule.Wasm,
  },
  duplicate: {
    code: ChainWasmErrorCodes.ErrDuplicate,
    message: 'duplicate',
    module: TransactionChainErrorModule.Wasm,
  },
  'max transfer channels': {
    code: ChainWasmErrorCodes.ErrMaxIBCChannels,
    message: 'max transfer channels',
    module: TransactionChainErrorModule.Wasm,
  },
  'unsupported for this contract': {
    code: ChainWasmErrorCodes.ErrUnsupportedForContract,
    message: 'unsupported for this contract',
    module: TransactionChainErrorModule.Wasm,
  },
  'pinning contract failed': {
    code: ChainWasmErrorCodes.ErrPinContractFailed,
    message: 'pinning contract failed',
    module: TransactionChainErrorModule.Wasm,
  },
  'unpinning contract failed': {
    code: ChainWasmErrorCodes.ErrUnpinContractFailed,
    message: 'unpinning contract failed',
    module: TransactionChainErrorModule.Wasm,
  },
  'unknown message from the contract': {
    code: ChainWasmErrorCodes.ErrUnknownMsg,
    message: 'unknown message from the contract',
    module: TransactionChainErrorModule.Wasm,
  },

  'invalid event': {
    code: ChainWasmErrorCodes.ErrInvalidEvent,
    message: 'invalid event',
    module: TransactionChainErrorModule.Wasm,
  },

  'authorization not found': {
    code: ChainAuthZErrorCodes.ErrNoAuthorizationFound,
    message: 'Authorization not found',
    module: TransactionChainErrorModule.Wasm,
  },

  'expiration time of authorization': {
    code: ChainAuthZErrorCodes.ErrAuthorizationExpired,
    message: 'Authorization expired',
    module: TransactionChainErrorModule.Wasm,
  },

  'not found': {
    message: 'not found',
    code: ChainCosmosErrorCode.ErrNotFound,
    module: TransactionChainErrorModule.CosmosSdk,
  },

  'failed to fetch account num/seq': {
    message:
      'Address is not yet active on the chain as it has a $0 balance. To activate it, please send a small amount of funds. Once funded, the network will recognize the address, allowing you to proceed.',
    code: ChainCosmosErrorCode.ErrKeyNotFound,
    module: TransactionChainErrorModule.CosmosSdk,
  },
}
