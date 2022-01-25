import {
  Validator as GrpcValidator,
  Delegation as GrpcDelegation,
  Description as GrpcValidatorDescription,
  Commission as GrpcValidatorCommission,
  CommissionRates as GrpcValidatorCommissionRates,
  UnbondingDelegation as GrpcUnbondingDelegation,
  Redelegation as GrpcReDelegation,
  DelegationResponse as GrpcDelegationResponse,
  RedelegationResponse as GrpcReDelegationResponse,
  Params as GrpcStakingParams,
} from '@injectivelabs/chain-api/cosmos/staking/v1beta1/staking_pb'
import { Params as GrpcInsuranceParams } from '@injectivelabs/chain-api/injective/insurance/v1beta1/insurance_pb'
import { Params as GrpcMintParams } from '@injectivelabs/chain-api/cosmos/mint/v1beta1/mint_pb'
import { Params as GrpcPeggyParams } from '@injectivelabs/chain-api/injective/peggy/v1/genesis_pb'
import { Params as GrpcOracleParams } from '@injectivelabs/chain-api/injective/oracle/v1beta1/oracle_pb'
import {
  Params as GrpcAuctionParams,
  Bid as GrpcBid,
  EventBid as GrpcEventBid,
  EventAuctionResult as GrpcEventAuctionResult,
} from '@injectivelabs/chain-api/injective/auction/v1beta1/auction_pb'
import {
  DelegationDelegatorReward as GrpcDelegationDelegatorReward,
  Params as GrpcDistributionParams,
} from '@injectivelabs/chain-api/cosmos/distribution/v1beta1/distribution_pb'
import {
  Proposal as GrpcProposal,
  Deposit as GrpcProposalDeposit,
  TallyParams as GrpcGovernanceTallyParams,
  VotingParams as GrpcGovernanceVotingParams,
  DepositParams as GrpcGovernanceDepositParams,
  TallyResult as GrpcTallyResult,
  Vote as GrpcVote,
  ProposalStatusMap as GrpcProposalStatus,
} from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import {
  SpotMarket as GrpcSpotMarket,
  MarketStatus as GrpcMarketStatus,
  MarketStatusMap as GrpcMarketStatusMap,
  SpotLimitOrder as GrpcSpotLimitOrder,
  SpotMarketOrder as GrpcSpotMarketOrder,
  SpotOrder as GrpcSpotOrder,
  Params as GrpcExchangeParams,
  FeeDiscountTierInfo as GrpcFeeDiscountTierInfo,
  FeeDiscountTierTTL as GrpcFeeDiscountTierTTL,
  FeeDiscountSchedule as GrpcFeeDiscountSchedule,
  PointsMultiplier as GrpcPointsMultiplier,
  TradingRewardCampaignBoostInfo as GrpcTradingRewardCampaignBoostInfo,
  TradingRewardCampaignInfo as GrpcTradingRewardCampaignInfo,
  CampaignRewardPool as GrpcCampaignRewardPool,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import {
  Supply as GrpcSupply,
  Params as GrpcBankParams,
} from '@injectivelabs/chain-api/cosmos/bank/v1beta1/bank_pb'
import { Coin as GrpcCoin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { Coin } from '@injectivelabs/ts-types'
import { QueryCurrentAuctionBasketResponse as GrpcQueryCurrentAuctionBasketResponse } from '@injectivelabs/chain-api/injective/auction/v1beta1/query_pb'
import {
  QueryFeeDiscountAccountInfoResponse as GrpcFeeDiscountAccountInfo,
  QueryTradeRewardCampaignResponse as GrpcTradeRewardCampaign,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/query_pb'

export interface PaginationOption {
  key: string
  offset?: number
  skip?: number
  limit?: number
  reverse?: boolean
  countTotal?: boolean
}

export interface DepositProposalParams {
  amount: string
  denom: string
}

export interface FeeDiscountTierInfo {
  makerDiscountRate: string
  takerDiscountRate: string
  stakedAmount: string
  feePaidAmount: string
}

export interface FeeDiscountSchedule {
  bucketCount: number
  bucketDuration: number
  quoteDenomsList: Array<string>
  tierInfosList: Array<FeeDiscountTierInfo>
  disqualifiedMarketIdsList: Array<string>
}

export interface PointsMultiplier {
  makerPointsMultiplier: string
  takerPointsMultiplier: string
}

export interface TradingRewardCampaignBoostInfo {
  boostedSpotMarketIdsList: Array<string>
  spotMarketMultipliersList: Array<PointsMultiplier>
  boostedDerivativeMarketIdsList: Array<string>
  derivativeMarketMultipliersList: Array<PointsMultiplier>
}

export interface TradingRewardCampaignInfo {
  campaignDurationSeconds: number
  quoteDenomsList: Array<string>
  tradingRewardBoostInfo?: TradingRewardCampaignBoostInfo
  disqualifiedMarketIdsList: Array<string>
}

export interface CampaignRewardPool {
  startTimestamp: number
  maxCampaignRewardsList: Coin[]
}

export interface GrpcCurrentBasket
  extends GrpcQueryCurrentAuctionBasketResponse.AsObject {
  //
}

export interface CurrentBasket {
  amountList: Coin[]
  auctionRound: number
  auctionClosingTime: number
  highestBidder: string
  highestBidAmount: string
}

export interface AuctionModuleStateParams {
  auctionPeriod: number
  minNextBidIncrementRate: string
}

export interface AuctionModuleHighestBid {
  bidder: string
  amount: string
}

export interface AuctionModuleState {
  params: AuctionModuleStateParams | undefined
  auctionRound: number
  highestBid: AuctionModuleHighestBid | undefined
  auctionEndingTimestamp: number
}

export interface FeeDiscountTierTTL {
  tier: number
  ttlTimestamp: number
}

export interface FeeDiscountAccountInfo {
  tierLevel: number
  accountInfo?: FeeDiscountTierInfo
  accountTtl?: FeeDiscountTierTTL
}

export interface TradeRewardCampaign {
  tradingRewardCampaignInfo?: TradingRewardCampaignInfo
  tradingRewardPoolCampaignScheduleList: CampaignRewardPool[]
  totalTradeRewardPoints: string
  pendingTradingRewardPoolCampaignScheduleList: CampaignRewardPool[]
  pendingTotalTradeRewardPointsList: string[]
}

export interface ExchangeParams {
  spotMarketInstantListingFee?: Coin
  derivativeMarketInstantListingFee?: Coin
  defaultSpotMakerFeeRate: string
  defaultSpotTakerFeeRate: string
  defaultDerivativeMakerFeeRate: string
  defaultDerivativeTakerFeeRate: string
  defaultInitialMarginRatio: string
  defaultMaintenanceMarginRatio: string
  defaultFundingInterval: number
  fundingMultiple: number
  relayerFeeShareRate: string
  defaultHourlyFundingRateCap: string
  defaultHourlyInterestRate: string
  maxDerivativeOrderSideCount: number
  injRewardStakedRequirementThreshold: string
  tradingRewardsVestingDuration: number
}

export {
  GrpcBid,
  GrpcEventAuctionResult,
  GrpcEventBid,
  GrpcAuctionParams,
  GrpcFeeDiscountSchedule,
  GrpcFeeDiscountTierInfo,
  GrpcFeeDiscountTierTTL,
  GrpcTradeRewardCampaign,
  GrpcFeeDiscountAccountInfo,
  GrpcTradingRewardCampaignInfo,
  GrpcTradingRewardCampaignBoostInfo,
  GrpcPointsMultiplier,
  GrpcCampaignRewardPool,
  GrpcCoin,
  GrpcValidator,
  GrpcDelegation,
  GrpcValidatorDescription,
  GrpcValidatorCommission,
  GrpcValidatorCommissionRates,
  GrpcUnbondingDelegation,
  GrpcDelegationResponse,
  GrpcProposal,
  GrpcProposalDeposit,
  GrpcGovernanceTallyParams,
  GrpcGovernanceVotingParams,
  GrpcGovernanceDepositParams,
  GrpcTallyResult,
  GrpcVote,
  GrpcProposalStatus,
  GrpcSupply,
  GrpcDelegationDelegatorReward,
  GrpcSpotMarket,
  GrpcMarketStatus,
  GrpcMarketStatusMap,
  GrpcSpotLimitOrder,
  GrpcSpotMarketOrder,
  GrpcSpotOrder,
  GrpcReDelegation,
  GrpcReDelegationResponse,
  GrpcBankParams,
  GrpcDistributionParams,
  GrpcInsuranceParams,
  GrpcStakingParams,
  GrpcExchangeParams,
  GrpcMintParams,
  GrpcPeggyParams,
  GrpcOracleParams,
}
