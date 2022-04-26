/* eslint-disable no-underscore-dangle */
import {
  LCS,
  VCS,
  Epoch,
  EpochMeta,
  EpochResultRecord,
  LCSResultRecord,
  MarketConfig,
  OrderValueMultiplier,
  VCSResultRecord,
  GrpcLCS,
  GrpcVCS,
  GrpcEpoch,
  GrpcEpochMeta,
  GrpcEpochResultRecord,
  GrpcLCSResultRecord,
  GrpcMarketConfig,
  GrpcOrderValueMultiplier,
  GrpcVCSResultRecord,
} from '../types'

export class DMMTransformer {
  static grpcOrderValueMultiplierToOrderValueMultiplier(
    orderValueMultiplier: GrpcOrderValueMultiplier,
  ): OrderValueMultiplier {
    return {
      orderPriceBiasThreshold:
        orderValueMultiplier.getOrderPriceBiasThreshold(),
      multiplier: orderValueMultiplier.getMultiplier(),
    }
  }

  static grpcMarketConfigToMarketConfig(
    marketConfig: GrpcMarketConfig,
  ): MarketConfig {
    return {
      lcsAdjustFactor: marketConfig.getLcsAdjustFactor(),
      vcsAdjustFactor: marketConfig.getVcsAdjustFactor(),
      orderValueMultipliersList: marketConfig
        .getOrderValueMultipliersList()
        .map(DMMTransformer.grpcOrderValueMultiplierToOrderValueMultiplier),
    }
  }

  static grpcEpochMetaToEpochMeta(epochMeta: GrpcEpochMeta): EpochMeta {
    const marketsMap = epochMeta
      .getMarketsMap()
      .entries()
      // @ts-ignore
      .arr_.map(([marketId, marketConfig]: [string, GrpcMarketConfig]) => [
        marketId,
        DMMTransformer.grpcMarketConfigToMarketConfig(marketConfig),
      ])

    return {
      id: epochMeta.getId(),
      startTime: epochMeta.getStartTime(),
      endTime: epochMeta.getEndTime(),
      rewardInjNum: epochMeta.getRewardInjNum(),
      lcsRewardFraction: epochMeta.getLcsRewardFraction(),
      vcsRewardFraction: epochMeta.getVcsRewardFraction(),
      marketsMap,
    }
  }

  static grpcLCStoLCS(lcs: GrpcLCS): LCS {
    return {
      lcs: lcs.getLcs(),
      normBuy: lcs.getNormBuy(),
      normSell: lcs.getNormSell(),
    }
  }

  static grpcMapOfStrLCSToLCS(
    mapOfStrLCS: GrpcLCSResultRecord.MapOfStrLCS,
  ): [string, LCS][] {
    return (
      mapOfStrLCS
        .getLcsDictMap()
        // @ts-ignore
        .arr_.map(
          ([name, [lcs, normBuy, normSell]]: [
            string,
            [string, string, string],
          ]) => [name, { lcs, normBuy, normSell }],
        )
    )
  }

  static grpcLCSResultRecordToLCSResultRecord(
    lCSResultRecord: GrpcLCSResultRecord,
  ): LCSResultRecord {
    const summaryMap = lCSResultRecord
      .getSummaryMap()
      .entries()
      // @ts-ignore
      .arr_.map(([name, dmmLcs]: [string, GrpcLCS]) => [
        name,
        DMMTransformer.grpcLCStoLCS(dmmLcs),
      ])

    const byMarketsMap = lCSResultRecord
      .getByMarketsMap()
      .entries()
      // @ts-ignore
      .arr_.map(
        ([marketId, grpcDmmLcs]: [string, GrpcLCSResultRecord.MapOfStrLCS]) => [
          marketId,
          Object.fromEntries(DMMTransformer.grpcMapOfStrLCSToLCS(grpcDmmLcs)),
        ],
      )

    return {
      summaryMap,
      byMarketsMap,
    }
  }

  static grpcVCStoVCS(vcs: GrpcVCS): VCS {
    return {
      vcs: vcs.getVcs(),
      volume: vcs.getVolume(),
    }
  }

  static grpcMapOfStringVCStoMapOfStringVCS(
    MapOfStrVCS: GrpcVCSResultRecord.MapOfStrVCS,
  ): [string, VCS][] {
    return (
      MapOfStrVCS.getFieldMap()
        // @ts-ignore
        .arr_.map(([name, [vcs, volume]]: [string, [string, string]]) => [
          name,
          { vcs, volume },
        ])
    )
  }

  static grpcVCSResultRecordToVCSResultRecords(
    vCSResultRecord: GrpcVCSResultRecord,
  ): VCSResultRecord {
    const summaryMap = vCSResultRecord
      .getSummaryMap()
      .entries()
      // @ts-ignore
      .arr_.map(([name, dmmVcs]: [string, GrpcVCS]) => [
        name,
        DMMTransformer.grpcVCStoVCS(dmmVcs),
      ])

    const byMarketsMap = vCSResultRecord
      .getByMarketsMap()
      .entries()
      // @ts-ignore
      .arr_.map(
        ([marketId, dmmVcs]: [string, GrpcVCSResultRecord.MapOfStrVCS]) => [
          marketId,
          Object.fromEntries(
            DMMTransformer.grpcMapOfStringVCStoMapOfStringVCS(dmmVcs),
          ),
        ],
      )

    const byDateMap = vCSResultRecord
      .getByDateMap()
      .entries()
      // @ts-ignore
      .arr_.map(([date, dmmVcs]: [string, GrpcVCSResultRecord.MapOfStrVCS]) => [
        date,
        Object.fromEntries(
          DMMTransformer.grpcMapOfStringVCStoMapOfStringVCS(dmmVcs),
        ),
      ])

    return {
      summaryMap,
      byMarketsMap,
      byDateMap,
    }
  }

  static grpcEpochResultRecordToEpochResultRecord(
    epochResultRecord: GrpcEpochResultRecord,
  ): EpochResultRecord {
    const lcs = epochResultRecord.getLcs()
    const vcs = epochResultRecord.getVcs()

    return {
      lcs: lcs
        ? DMMTransformer.grpcLCSResultRecordToLCSResultRecord(lcs)
        : undefined,
      vcs: vcs
        ? DMMTransformer.grpcVCSResultRecordToVCSResultRecords(vcs)
        : undefined,
      createdAt: epochResultRecord.getCreatedAt(),
    }
  }

  static grpcEpochToEpoch(epoch: GrpcEpoch): Epoch {
    const meta = epoch.getMeta()
    const result = epoch.getResult()

    return {
      meta: meta ? DMMTransformer.grpcEpochMetaToEpochMeta(meta) : undefined,
      result: result
        ? DMMTransformer.grpcEpochResultRecordToEpochResultRecord(result)
        : undefined,
    }
  }
}
