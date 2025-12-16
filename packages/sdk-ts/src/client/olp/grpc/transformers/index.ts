import { protobufTimestampToDate } from '../../../../utils/time.js'
import type * as DmmPb from '@injectivelabs/olp-proto-ts-v2/generated/dmm_pb'
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
            startDate: protobufTimestampToDate(epoch.config.startDate),
            endDate: protobufTimestampToDate(epoch.config.endDate),
            rewardInj: epoch.config.rewardInj,
            markets: epoch.config.markets.map((market) => ({
              marketId: market.marketId,
              ticker: market.ticker,
              startDate: protobufTimestampToDate(market.startDate),
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
      createdAt: protobufTimestampToDate(epoch.createdAt),
      updatedAt: protobufTimestampToDate(epoch.updatedAt),
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
      startDate: protobufTimestampToDate(marketReward.startDate),
      endDate: protobufTimestampToDate(marketReward.endDate),
      totalScore: marketReward.totalScore,
      createdAt: protobufTimestampToDate(marketReward.createdAt),
      updatedAt: protobufTimestampToDate(marketReward.updatedAt),
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
      createdAt: protobufTimestampToDate(eligibleAddress.createdAt),
      updatedAt: protobufTimestampToDate(eligibleAddress.updatedAt),
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
      blockTime: protobufTimestampToDate(score.blockTime),
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
      createdAt: protobufTimestampToDate(score.createdAt),
      updatedAt: protobufTimestampToDate(score.updatedAt),
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
      blockTime: protobufTimestampToDate(score.blockTime),
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
      createdAt: protobufTimestampToDate(score.createdAt),
      updatedAt: protobufTimestampToDate(score.updatedAt),
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
      blockTime: protobufTimestampToDate(reward.blockTime),
      depth: reward.depth,
      reward: reward.reward,
      createdAt: protobufTimestampToDate(reward.createdAt),
      updatedAt: protobufTimestampToDate(reward.updatedAt),
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
      blockTime: protobufTimestampToDate(reward.blockTime),
      date: reward.date,
      dateTimestamp: protobufTimestampToDate(reward.dateTimestamp),
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
      createdAt: protobufTimestampToDate(reward.createdAt),
      updatedAt: protobufTimestampToDate(reward.updatedAt),
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
      updatedAt: protobufTimestampToDate(response.updatedAt),
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
