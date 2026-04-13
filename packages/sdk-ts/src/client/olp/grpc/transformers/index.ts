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
      status: epoch.status,
      epochId: epoch.epochId,
      resultCount: epoch.resultCount,
      snapshotCount: epoch.snapshotCount,
      endHeight: epoch.endHeight?.toString(),
      startHeight: epoch.startHeight?.toString(),
      config: epoch.config
        ? {
            number: epoch.config.number,
            rewardInj: epoch.config.rewardInj,
            isMiniEpoch: epoch.config.isMiniEpoch,
            uptimeExponent: epoch.config.uptimeExponent,
            volumeExponent: epoch.config.volumeExponent,
            liquidityScoreExponent: epoch.config.liquidityScoreExponent,
            permanenceVolumeThreshold: epoch.config.permanenceVolumeThreshold,
            qualifyingVolumeThreshold: epoch.config.qualifyingVolumeThreshold,
            startDate: epoch.config.startDate
              ? new Date(epoch.config.startDate)
              : undefined,
            endDate: epoch.config.endDate
              ? new Date(epoch.config.endDate)
              : undefined,
            markets: epoch.config.markets.map((market) => ({
              ticker: market.ticker,
              marketId: market.marketId,
              startDate: market.startDate
                ? new Date(market.startDate)
                : undefined,
              preAllocatedReward: market.preAllocatedReward,
            })),
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
      reward: marketReward.reward,
      epochId: marketReward.epochId,
      marketId: marketReward.marketId,
      liquidity: marketReward.liquidity,
      totalScore: marketReward.totalScore,
      height: marketReward.height?.toString(),
      rewardPercentage: marketReward.rewardPercentage,
      miniEpochsReward: marketReward.miniEpochsReward,
      startDate: marketReward.startDate
        ? new Date(marketReward.startDate)
        : undefined,
      endDate: marketReward.endDate
        ? new Date(marketReward.endDate)
        : undefined,
      createdAt: marketReward.createdAt
        ? new Date(marketReward.createdAt)
        : undefined,
      updatedAt: marketReward.updatedAt
        ? new Date(marketReward.updatedAt)
        : undefined,
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
      source: eligibleAddress.source,
      epochId: eligibleAddress.epochId,
      height: eligibleAddress.height?.toString(),
      accountAddress: eligibleAddress.accountAddress,
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
      volume: score.volume,
      reward: score.reward,
      epochId: score.epochId,
      qualifies: score.qualifies,
      totalScore: score.totalScore,
      uptimeScore: score.uptimeScore,
      volumeScore: score.volumeScore,
      makerVolume: score.makerVolume,
      takerVolume: score.takerVolume,
      height: score.height?.toString(),
      accountAddress: score.accountAddress,
      liquidityScore: score.liquidityScore,
      uptimePercentage: score.uptimePercentage,
      rewardPercentage: score.rewardPercentage,
      volumePercentage: score.volumePercentage,
      startHeight: score.startHeight?.toString(),
      uptimeScorePonderated: score.uptimeScorePonderated,
      volumeScorePonderated: score.volumeScorePonderated,
      liquidityScorePonderated: score.liquidityScorePonderated,
      blockTime: score.blockTime ? new Date(score.blockTime) : undefined,
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
      bid: score.bid,
      ask: score.ask,
      depth: score.depth,
      volume: score.volume,
      reward: score.reward,
      epochId: score.epochId,
      marketId: score.marketId,
      totalScore: score.totalScore,
      uptimeScore: score.uptimeScore,
      startVolume: score.startVolume,
      volumeScore: score.volumeScore,
      takerVolume: score.takerVolume,
      makerVolume: score.makerVolume,
      height: score.height?.toString(),
      snapshotCount: score.snapshotCount,
      currentVolume: score.currentVolume,
      accountAddress: score.accountAddress,
      liquidityScore: score.liquidityScore,
      uptimePercentage: score.uptimePercentage,
      takerStartVolume: score.takerStartVolume,
      makerStartVolume: score.makerStartVolume,
      rewardPercentage: score.rewardPercentage,
      startHeight: score.startHeight?.toString(),
      takerCurrentVolume: score.takerCurrentVolume,
      makerCurrentVolume: score.makerCurrentVolume,
      uptimeScorePonderated: score.uptimeScorePonderated,
      volumeScorePonderated: score.volumeScorePonderated,
      liquidityScorePonderated: score.liquidityScorePonderated,
      blockTime: score.blockTime ? new Date(score.blockTime) : undefined,
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
      depth: reward.depth,
      reward: reward.reward,
      epochId: reward.epochId,
      height: reward.height?.toString(),
      accountAddress: reward.accountAddress,
      miniEpochsReward: reward.miniEpochsReward,
      startHeight: reward.startHeight?.toString(),
      blockTime: reward.blockTime ? new Date(reward.blockTime) : undefined,
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
      date: reward.date,
      volume: reward.volume,
      epochId: reward.epochId,
      takerVolume: reward.takerVolume,
      makerVolume: reward.makerVolume,
      dailyVolume: reward.dailyVolume,
      height: reward.height?.toString(),
      accountAddress: reward.accountAddress,
      dailyQualified: reward.dailyQualified,
      volumePercentage: reward.volumePercentage,
      dailyMakerVolume: reward.dailyMakerVolume,
      dailyTakerVolume: reward.dailyTakerVolume,
      makerVolumePercentage: reward.makerVolumePercentage,
      takerVolumePercentage: reward.takerVolumePercentage,
      dailyVolumePercentage: reward.dailyVolumePercentage,
      dailyMakerVolumePercentage: reward.dailyMakerVolumePercentage,
      dailyTakerVolumePercentage: reward.dailyTakerVolumePercentage,
      blockTime: reward.blockTime ? new Date(reward.blockTime) : undefined,
      createdAt: reward.createdAt ? new Date(reward.createdAt) : undefined,
      updatedAt: reward.updatedAt ? new Date(reward.updatedAt) : undefined,
      dateTimestamp: reward.dateTimestamp
        ? new Date(reward.dateTimestamp)
        : undefined,
    }
  }

  static rewardsEligibilityResponseToRewardsEligibility(
    response: DmmPb.GetRewardsEligibilityResponse,
  ): RewardsEligibility {
    const volumes = response.volumes

    return {
      estimatedReward: response.estimatedReward,
      eligibleForNextEpoch: response.eligibleForNextEpoch,
      eligibleForCurrentEpoch: response.eligibleForCurrentEpoch,
      currentMakerVolumePercentage: response.currentMakerVolumePercentage,
      updatedAt: response.updatedAt ? new Date(response.updatedAt) : undefined,
      averageDailyMakerVolumePercentage:
        response.averageDailyMakerVolumePercentage,
      volumes: volumes.map(
        DmmGrpcTransformer.grpcAccountVolumesToAccountVolumes,
      ),
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
