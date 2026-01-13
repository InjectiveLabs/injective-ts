import type * as DmmPb from '@injectivelabs/olp-proto-ts-v2/generated/goagen_olp_injective_dmm_v2_pb'
import type {
  EpochV2,
  TotalScore,
  EpochScore,
  GrpcEpochV2,
  EpochScores,
  TotalScores,
  MarketReward,
  AccountVolume,
  MinMaxRewards,
  GrpcTotalScore,
  GrpcEpochScore,
  EligibleAddress,
  GrpcMarketReward,
  EligibleAddresses,
  GrpcAccountVolume,
  EpochScoresHistory,
  TotalScoresHistory,
  RewardDistribution,
  RewardsEligibility,
  GrpcEligibleAddress,
  RewardsDistribution,
  GrpcRewardDistribution,
} from '../types/index.js'

export class DmmGrpcTransformer {
  static epochsResponseToEpochs(response: DmmPb.GetEpochsResponse): EpochV2[] {
    const epochs = response.epochs

    return epochs.map(DmmGrpcTransformer.grpcEpochToEpoch)
  }

  static grpcEpochToEpoch(epoch: GrpcEpochV2): EpochV2 {
    return {
      epochId: epoch.epochId,
      status: epoch.status,
      startHeight: epoch.startHeight?.toString(),
      endHeight: epoch.endHeight?.toString(),
      snapshotCount: epoch.snapshotCount,
      resultCount: epoch.resultCount,
      config: epoch.config
        ? {
            startDate: epoch.config.startDate
              ? new Date(epoch.config.startDate)
              : undefined,
            endDate: epoch.config.endDate
              ? new Date(epoch.config.endDate)
              : undefined,
            rewardInj: epoch.config.rewardInj,
            markets: epoch.config.markets.map((market) => ({
              marketId: market.marketId,
              ticker: market.ticker,
              startDate: market.startDate
                ? new Date(market.startDate)
                : undefined,
              preAllocatedReward: market.preAllocatedReward,
            })),
            liquidityScoreExponent: epoch.config.liquidityScoreExponent,
            uptimeExponent: epoch.config.uptimeExponent,
            volumeExponent: epoch.config.volumeExponent,
            permanenceVolumeThreshold: epoch.config.permanenceVolumeThreshold,
            qualifyingVolumeThreshold: epoch.config.qualifyingVolumeThreshold,
            number: epoch.config.number,
            isMiniEpoch: epoch.config.isMiniEpoch,
          }
        : undefined,
      createdAt: epoch.createdAt ? new Date(epoch.createdAt) : undefined,
      updatedAt: epoch.updatedAt ? new Date(epoch.updatedAt) : undefined,
    }
  }

  static marketRewardsResponseToMarketRewards(
    response: DmmPb.GetMarketRewardsResponse,
  ): MarketReward[] {
    const rewards = response.rewards

    return rewards.map(DmmGrpcTransformer.grpcMarketRewardToMarketReward)
  }

  static grpcMarketRewardToMarketReward(
    marketReward: GrpcMarketReward,
  ): MarketReward {
    return {
      epochId: marketReward.epochId,
      marketId: marketReward.marketId,
      height: marketReward.height?.toString(),
      reward: marketReward.reward,
      rewardPercentage: marketReward.rewardPercentage,
      liquidity: marketReward.liquidity,
      startDate: marketReward.startDate
        ? new Date(marketReward.startDate)
        : undefined,
      endDate: marketReward.endDate
        ? new Date(marketReward.endDate)
        : undefined,
      totalScore: marketReward.totalScore,
      createdAt: marketReward.createdAt
        ? new Date(marketReward.createdAt)
        : undefined,
      updatedAt: marketReward.updatedAt
        ? new Date(marketReward.updatedAt)
        : undefined,
      miniEpochsReward: marketReward.miniEpochsReward,
    }
  }

  static eligibleAddressesResponseToEligibleAddresses(
    response: DmmPb.GetEligibleAddressesResponse,
  ): EligibleAddresses {
    const addresses = response.addresses

    return {
      next: response.next,
      addresses: addresses.map(
        DmmGrpcTransformer.grpcEligibleAddresssesToEligibileAddresses,
      ),
    }
  }

  static grpcEligibleAddresssesToEligibileAddresses(
    eligibleAddress: GrpcEligibleAddress,
  ): EligibleAddress {
    return {
      epochId: eligibleAddress.epochId,
      accountAddress: eligibleAddress.accountAddress,
      height: eligibleAddress.height?.toString(),
      source: eligibleAddress.source,
      createdAt: eligibleAddress.createdAt
        ? new Date(eligibleAddress.createdAt)
        : undefined,
      updatedAt: eligibleAddress.updatedAt
        ? new Date(eligibleAddress.updatedAt)
        : undefined,
    }
  }

  static epochScoresResponseToEpochScores(
    response: DmmPb.GetEpochScoresResponse,
  ): EpochScores {
    const scores = response.scores

    return {
      next: response.next,
      scores: scores.map(DmmGrpcTransformer.grpcEpochScoresToEpochScores),
    }
  }

  static grpcEpochScoresToEpochScores(score: GrpcEpochScore): EpochScore {
    return {
      epochId: score.epochId,
      accountAddress: score.accountAddress,
      height: score.height?.toString(),
      blockTime: score.blockTime ? new Date(score.blockTime) : undefined,
      startHeight: score.startHeight?.toString(),
      liquidityScore: score.liquidityScore,
      liquidityScorePonderated: score.liquidityScorePonderated,
      uptimeScore: score.uptimeScore,
      uptimeScorePonderated: score.uptimeScorePonderated,
      uptimePercentage: score.uptimePercentage,
      volumeScore: score.volumeScore,
      volumeScorePonderated: score.volumeScorePonderated,
      totalScore: score.totalScore,
      volume: score.volume,
      makerVolume: score.makerVolume,
      takerVolume: score.takerVolume,
      reward: score.reward,
      rewardPercentage: score.rewardPercentage,
      qualifies: score.qualifies,
      volumePercentage: score.volumePercentage,
      createdAt: score.createdAt ? new Date(score.createdAt) : undefined,
      updatedAt: score.updatedAt ? new Date(score.updatedAt) : undefined,
    }
  }

  static epochScoresHistoryResponseToEpochScoresHistory(
    response: DmmPb.GetEpochScoresHistoryResponse,
  ): EpochScoresHistory {
    const scores = response.scores

    return {
      next: response.next,
      scores: scores.map(DmmGrpcTransformer.grpcEpochScoresToEpochScores),
    }
  }

  static totalScoresResponseToTotalScores(
    response: DmmPb.GetTotalScoresResponse,
  ): TotalScores {
    const scores = response.scores

    return {
      next: response.next,
      scores: scores.map(DmmGrpcTransformer.grpcTotalScoresToTotalScores),
    }
  }

  static grpcTotalScoresToTotalScores(score: GrpcTotalScore): TotalScore {
    return {
      epochId: score.epochId,
      marketId: score.marketId,
      accountAddress: score.accountAddress,
      height: score.height?.toString(),
      startHeight: score.startHeight?.toString(),
      blockTime: score.blockTime ? new Date(score.blockTime) : undefined,
      bid: score.bid,
      ask: score.ask,
      depth: score.depth,
      snapshotCount: score.snapshotCount,
      liquidityScore: score.liquidityScore,
      liquidityScorePonderated: score.liquidityScorePonderated,
      uptimeScore: score.uptimeScore,
      uptimeScorePonderated: score.uptimeScorePonderated,
      uptimePercentage: score.uptimePercentage,
      startVolume: score.startVolume,
      currentVolume: score.currentVolume,
      volume: score.volume,
      volumeScore: score.volumeScore,
      volumeScorePonderated: score.volumeScorePonderated,
      takerStartVolume: score.takerStartVolume,
      takerCurrentVolume: score.takerCurrentVolume,
      takerVolume: score.takerVolume,
      makerStartVolume: score.makerStartVolume,
      makerCurrentVolume: score.makerCurrentVolume,
      makerVolume: score.makerVolume,
      totalScore: score.totalScore,
      reward: score.reward,
      rewardPercentage: score.rewardPercentage,
      createdAt: score.createdAt ? new Date(score.createdAt) : undefined,
      updatedAt: score.updatedAt ? new Date(score.updatedAt) : undefined,
    }
  }

  static totalScoresHistoryResponseToTotalScoresHistory(
    response: DmmPb.GetTotalScoresHistoryResponse,
  ): TotalScoresHistory {
    const scores = response.scores

    return {
      next: response.next,
      scores: scores.map(DmmGrpcTransformer.grpcTotalScoresToTotalScores),
    }
  }

  static rewardsDistributionResponseToRewardsDistribution(
    response: DmmPb.GetRewardsDistributionResponse,
  ): RewardsDistribution {
    const rewards = response.rewards

    return {
      next: response.next,
      rewards: rewards.map(
        DmmGrpcTransformer.grpcRewardsDistributionToRewardsDistribution,
      ),
    }
  }

  static grpcRewardsDistributionToRewardsDistribution(
    reward: GrpcRewardDistribution,
  ): RewardDistribution {
    return {
      epochId: reward.epochId,
      accountAddress: reward.accountAddress,
      height: reward.height?.toString(),
      startHeight: reward.startHeight?.toString(),
      blockTime: reward.blockTime ? new Date(reward.blockTime) : undefined,
      depth: reward.depth,
      reward: reward.reward,
      createdAt: reward.createdAt ? new Date(reward.createdAt) : undefined,
      updatedAt: reward.updatedAt ? new Date(reward.updatedAt) : undefined,
    }
  }

  static accountVolumesResponseToAccountVolumes(
    response: DmmPb.GetAccountVolumesResponse,
  ): AccountVolume[] {
    const volumes = response.volumes

    return volumes.map(DmmGrpcTransformer.grpcAccountVolumesToAccountVolumes)
  }

  static grpcAccountVolumesToAccountVolumes(
    reward: GrpcAccountVolume,
  ): AccountVolume {
    return {
      epochId: reward.epochId,
      accountAddress: reward.accountAddress,
      height: reward.height?.toString(),
      blockTime: reward.blockTime ? new Date(reward.blockTime) : undefined,
      date: reward.date,
      dateTimestamp: reward.dateTimestamp
        ? new Date(reward.dateTimestamp)
        : undefined,
      volume: reward.volume,
      takerVolume: reward.takerVolume,
      makerVolume: reward.makerVolume,
      volumePercentage: reward.volumePercentage,
      makerVolumePercentage: reward.makerVolumePercentage,
      takerVolumePercentage: reward.takerVolumePercentage,
      dailyVolume: reward.dailyVolume,
      dailyMakerVolume: reward.dailyMakerVolume,
      dailyTakerVolume: reward.dailyTakerVolume,
      dailyVolumePercentage: reward.dailyVolumePercentage,
      dailyMakerVolumePercentage: reward.dailyMakerVolumePercentage,
      dailyTakerVolumePercentage: reward.dailyTakerVolumePercentage,
      dailyQualified: reward.dailyQualified,
      createdAt: reward.createdAt ? new Date(reward.createdAt) : undefined,
      updatedAt: reward.updatedAt ? new Date(reward.updatedAt) : undefined,
    }
  }

  static rewardsEligibilityResponseToRewardsEligibility(
    response: DmmPb.GetRewardsEligibilityResponse,
  ): RewardsEligibility {
    const volumes = response.volumes

    return {
      volumes: volumes.map(
        DmmGrpcTransformer.grpcAccountVolumesToAccountVolumes,
      ),
      currentMakerVolumePercentage: response.currentMakerVolumePercentage,
      averageDailyMakerVolumePercentage:
        response.averageDailyMakerVolumePercentage,
      eligibleForNextEpoch: response.eligibleForNextEpoch,
      eligibleForCurrentEpoch: response.eligibleForCurrentEpoch,
      estimatedReward: response.estimatedReward,
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
    }
  }

  static marketRewardsRangeResponseToMarketRewardsRange(
    response: DmmPb.GetMarketRewardsRangeResponse,
  ): MinMaxRewards {
    const formattedMinCurrentEpochRewards: Record<string, string> = {}
    const formattedMaxCurrentEpochRewards: Record<string, string> = {}

    response.ranges.forEach((item) => {
      formattedMinCurrentEpochRewards[item.marketId] = item.min
      formattedMaxCurrentEpochRewards[item.marketId] = item.max
    })

    return {
      minRewards: formattedMinCurrentEpochRewards,
      maxRewards: formattedMaxCurrentEpochRewards,
    }
  }
}
