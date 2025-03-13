import { InjectiveDmmRpc } from '@injectivelabs/olp-proto-ts'
import {
  GrpcEpochV2,
  EpochV2,
  MarketReward,
  EligibleAddress,
  EligibleAddresses,
  EpochScoresHistory,
  GrpcMarketReward,
  GrpcEligibleAddress,
  GrpcTotalScore,
  EpochScores,
  TotalScore,
  AccountVolume,
  TotalScores,
  GrpcEpochScore,
  EpochScore,
  TotalScoresHistory,
  GrpcRewardDistribution,
  RewardsDistribution,
  RewardDistribution,
  RewardsEligibility,
  GrpcAccountVolume,
  MinMaxRewards,
} from '../types/index.js'

export class DmmGrpcTransformer {
  static epochsResponseToEpochs(
    response: InjectiveDmmRpc.GetEpochsResponse,
  ): EpochV2[] {
    const epochs = response.epochs

    return epochs.map(DmmGrpcTransformer.grpcEpochToEpoch)
  }

  static grpcEpochToEpoch(epoch: GrpcEpochV2): EpochV2 {
    return {
      epochId: epoch.epochId,
      status: epoch.status,
      startHeight: epoch.startHeight,
      endHeight: epoch.endHeight,
      snapshotCount: epoch.snapshotCount,
      resultCount: epoch.resultCount,
      config: epoch.config,
      createdAt: epoch.createdAt,
      updatedAt: epoch.updatedAt,
    }
  }

  static marketRewardsResponseToMarketRewards(
    response: InjectiveDmmRpc.GetMarketRewardsResponse,
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
      height: marketReward.height,
      reward: marketReward.reward,
      rewardPercentage: marketReward.rewardPercentage,
      liquidity: marketReward.liquidity,
      startDate: marketReward.startDate,
      endDate: marketReward.endDate,
      totalScore: marketReward.totalScore,
      createdAt: marketReward.createdAt,
      updatedAt: marketReward.updatedAt,
      miniEpochsReward: marketReward.miniEpochsReward,
    }
  }

  static eligibleAddressesResponseToEligibleAddresses(
    response: InjectiveDmmRpc.GetEligibleAddressesResponse,
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
      height: eligibleAddress.height,
      source: eligibleAddress.source,
      createdAt: eligibleAddress.createdAt,
      updatedAt: eligibleAddress.updatedAt,
    }
  }

  static epochScoresResponseToEpochScores(
    response: InjectiveDmmRpc.GetEpochScoresResponse,
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
      height: score.height,
      blockTime: score.blockTime,
      startHeight: score.startHeight,
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
      createdAt: score.createdAt,
      updatedAt: score.updatedAt,
    }
  }

  static epochScoresHistoryResponseToEpochScoresHistory(
    response: InjectiveDmmRpc.GetEpochScoresHistoryResponse,
  ): EpochScoresHistory {
    const scores = response.scores

    return {
      next: response.next,
      scores: scores.map(DmmGrpcTransformer.grpcEpochScoresToEpochScores),
    }
  }

  static totalScoresResponseToTotalScores(
    response: InjectiveDmmRpc.GetTotalScoresResponse,
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
      height: score.height,
      startHeight: score.startHeight,
      blockTime: score.blockTime,
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
      createdAt: score.createdAt,
      updatedAt: score.updatedAt,
    }
  }

  static totalScoresHistoryResponseToTotalScoresHistory(
    response: InjectiveDmmRpc.GetTotalScoresHistoryResponse,
  ): TotalScoresHistory {
    const scores = response.scores

    return {
      next: response.next,
      scores: scores.map(DmmGrpcTransformer.grpcTotalScoresToTotalScores),
    }
  }

  static rewardsDistributionResponseToRewardsDistribution(
    response: InjectiveDmmRpc.GetRewardsDistributionResponse,
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
      height: reward.height,
      startHeight: reward.startHeight,
      blockTime: reward.blockTime,
      depth: reward.depth,
      reward: reward.reward,
      createdAt: reward.createdAt,
      updatedAt: reward.updatedAt,
    }
  }

  static accountVolumesResponseToAccountVolumes(
    response: InjectiveDmmRpc.GetAccountVolumesResponse,
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
      height: reward.height,
      blockTime: reward.blockTime,
      date: reward.date,
      dateTimestamp: reward.dateTimestamp,
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
      createdAt: reward.createdAt,
      updatedAt: reward.updatedAt,
    }
  }

  static rewardsEligibilityResponseToRewardsEligibility(
    response: InjectiveDmmRpc.GetRewardsEligibilityResponse,
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
      updatedAt: response.updatedAt,
    }
  }

  static marketRewardsRangeResponseToMarketRewardsRange(
    response: InjectiveDmmRpc.GetMarketRewardsRangeResponse,
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
