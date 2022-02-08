export enum AccountMetrics {
  Deposit = 'MsgDeposit',
  Withdraw = 'MsgWithdraw',
  IbcTransfer = 'MsgIbcTransfer',
  SendToEth = 'MsgSendToEth',
  Send = 'MsgSend',
}

export enum ChainMetrics {
  FetchValidators = 'QueryValidatorsRequest',
  FetchValidator = 'QueryValidatorRequest',
  FetchValidatorDelegations = 'QueryValidatorDelegationsRequest',
  FetchDelegation = 'QueryDelegationRequest',
  FetchDelegations = 'QueryDelegationsRequest',
  FetchReDelegations = 'QueryRedelegationsRequest',
  FetchValidatorRewards = 'QueryDelegationRewardsRequest',
  FetchRewards = 'QueryDelegationTotalRewardsRequest',
  FetchUnbondingDelegations = 'QueryDelegatorUnbondingDelegationsRequest',
  FetchProposals = 'QueryProposalsRequest',
  FetchProposalDeposits = 'QueryDepositsRequest',
  FetchProposalVotes = 'QueryVotesRequest',
  FetchProposalTally = 'QueryTallyResultRequest',
  FetchProposal = 'QueryProposalRequest',
  FetchAllProposals = 'QueryProposalsRequestWithLimit1000',
  FetchBalances = 'QueryAllBalancesRequest',
  FetchBalance = 'QueryBalanceRequest',
  FetchMintParams = 'QueryMintParamsRequest',
  FetchInflation = 'QueryInflation',
  FetchAnnualProvisions = 'QueryAnnualProvisions',
  FetchStakingParams = 'QueryStakingParamsRequest',
  FetchInsuranceParams = 'QueryInsuranceParamsRequest',
  FetchOracleParams = 'QueryOracleParamsRequest',
  FetchExchangeParams = 'QueryExchangeParamsRequest',
  FetchBankParams = 'QueryBankParamsRequest',
  FetchPeggyParams = 'QueryPeggyParamsRequest',
  FetchDistributionParams = 'QueryDistributionParamsRequest',
  FetchGovernanceDepositParams = 'QueryGovernanceDepositParamsRequest',
  FetchGovernanceTallyingParams = 'QueryGovernanceTallyingParamsRequest',
  FetchGovernanceVotingParams = 'QueryGovernanceVotingParamsRequest',
  Delegate = 'MsgDelegate',
  ReDelegate = 'MsgBeginRedelegate',
  Unbond = 'MsgUndelegate',
  Vote = 'MsgGovVote',
  Deposit = 'MsgGovDeposit',
  ClaimRewards = 'MsgWithdrawDelegatorReward',
  InstantSpotMarketLaunch = 'InstantSpotMarketLaunch',
  ProposeSpotMarket = 'SpotMarketLaunchProposal',
  ProposePerpetualMarket = 'PerpetualMarketLaunchProposal',
  Bid = 'MsgBid',
}

export enum DerivativesMetrics {
  FetchMarket = 'DerivativeMarketRequest',
}

export enum ExchangeMetrics {
  FetchOracles = 'OracleListRequest',
  FetchInsuranceFunds = 'FundsRequest',
  FetchRedemptions = 'RedemptionsRequest',
  CreateInsuranceFund = 'CreateInsuranceFund', // TODO
  Underwrite = 'MsgUnderwrite',
  RequestRedemption = 'MsgRequestRedemption',
  FetchAuctions = 'FetchAuctions',
  FetchAuction = 'FetchAuction',
  FetchIBCTransferTxs = 'FetchIBCTransferTxs',
  FetchPeggyDepositTxs = 'FetchPeggyDepositTxs',
  FetchPeggyWithdrawalTxs = 'FetchPeggyWithdrawalTxs',
}

export enum ExplorerMetrics {
  FetchBlocks = 'FetchBlocks',
  FetchTransactions = 'FetchTransactions',
}

export enum SpotMetrics {
  FetchMarket = 'SpotMarketRequest',
}

export enum CoinGeckoMetrics {
  FetchCoin = 'FetchCoin',
  FetchCoins = 'FetchCoins',
  FetchChart = 'FetchChart',
}
