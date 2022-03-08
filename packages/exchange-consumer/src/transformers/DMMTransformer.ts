/* eslint-disable no-underscore-dangle */
import {
  DMMLCS,
  DMMVCS,
  Epoch,
  EpochMeta,
  EpochResultRecord,
  LCSResultRecord,
  MarketConfig,
  OrderValueMultiplier,
  VCSResultRecord,
  GrpcArrayOfString,
  GrpcDMMLCS,
  GrpcDMMVCS,
  GrpcEpoch,
  GrpcEpochMeta,
  GrpcEpochResultRecord,
  GrpcLCSResultRecord,
  GrpcMapOfStringDMMLCS,
  GrpcMapOfStringDMMVCS,
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

    const dmmAddressesList = epochMeta
      .getDmmAddressesMap()
      .entries()
      // @ts-ignore
      .arr_.map(([name, values]: [string, GrpcArrayOfString]) => [
        name,
        values.getFieldList(),
      ])

    return {
      id: epochMeta.getId(),
      startTime: epochMeta.getStartTime(),
      endTime: epochMeta.getEndTime(),
      rewardInjNum: epochMeta.getRewardInjNum(),
      lcsRewardFraction: epochMeta.getLcsRewardFraction(),
      vcsRewardFraction: epochMeta.getVcsRewardFraction(),
      marketsMap: Object.fromEntries(marketsMap),
      dmmAddressesList: Object.fromEntries(dmmAddressesList),
    }
  }

  static grpcDMMLCStoDMMLCS(dMMLCS: GrpcDMMLCS): DMMLCS {
    return {
      lcs: dMMLCS.getLcs(),
      normBuy: dMMLCS.getNormBuy(),
      normSell: dMMLCS.getNormSell(),
    }
  }

  static grpcMapOfStringDMMLCSToDMMLCS(
    mapOfStringDMMLCS: GrpcMapOfStringDMMLCS,
  ): [string, DMMLCS][] {
    return (
      mapOfStringDMMLCS
        .getFieldMap()
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
      .arr_.map(([name, dmmLcs]: [string, GrpcDMMLCS]) => [
        name,
        DMMTransformer.grpcDMMLCStoDMMLCS(dmmLcs),
      ])

    const byMarketsMap = lCSResultRecord
      .getByMarketsMap()
      .entries()
      // @ts-ignore
      .arr_.map(([marketId, grpcDmmLcs]: [string, GrpcMapOfStringDMMLCS]) => [
        marketId,
        Object.fromEntries(
          DMMTransformer.grpcMapOfStringDMMLCSToDMMLCS(grpcDmmLcs),
        ),
      ])

    return {
      summaryMap: Object.fromEntries(summaryMap),
      byMarketsMap: Object.fromEntries(byMarketsMap),
    }
  }

  static grpcDMMVCStoDMMVCS(dMMVCS: GrpcDMMVCS): DMMVCS {
    return {
      vcs: dMMVCS.getVcs(),
      volume: dMMVCS.getVolume(),
    }
  }

  static grpcMapOfStringDMMVCStoMapOfStringDMMVCS(
    mapOfStringDMMVCS: GrpcMapOfStringDMMVCS,
  ): [string, DMMVCS][] {
    return (
      mapOfStringDMMVCS
        .getFieldMap()
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
      .arr_.map(([name, dmmVcs]: [string, GrpcDMMVCS]) => [
        name,
        DMMTransformer.grpcDMMVCStoDMMVCS(dmmVcs),
      ])

    const byMarketsMap = vCSResultRecord
      .getByMarketsMap()
      .entries()
      // @ts-ignore
      .arr_.map(([marketId, dmmVcs]: [string, GrpcMapOfStringDMMVCS]) => [
        marketId,
        Object.fromEntries(
          DMMTransformer.grpcMapOfStringDMMVCStoMapOfStringDMMVCS(dmmVcs),
        ),
      ])

    const byDateMap = vCSResultRecord
      .getByDateMap()
      .entries()
      // @ts-ignore
      .arr_.map(([date, dmmVcs]: [string, GrpcMapOfStringDMMVCS]) => [
        date,
        Object.fromEntries(
          DMMTransformer.grpcMapOfStringDMMVCStoMapOfStringDMMVCS(dmmVcs),
        ),
      ])

    return {
      summaryMap: Object.fromEntries(summaryMap),
      byMarketsMap: Object.fromEntries(byMarketsMap),
      byDateMap: Object.fromEntries(byDateMap),
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
