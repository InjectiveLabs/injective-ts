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
    // eslint-disable-next-line no-underscore-dangle
    const marketsMap = epochMeta
      .getMarketsMap()
      .entries()
      .arr_.map(([marketId, marketConfig]: [string, GrpcMarketConfig]) => [
        marketId,
        DMMTransformer.grpcMarketConfigToMarketConfig(marketConfig),
      ])

    // eslint-disable-next-line no-underscore-dangle
    const dmmAddressesList = epochMeta
      .getDmmAddressesMap()
      .entries()
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
      // eslint-disable-next-line no-underscore-dangle
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
    // eslint-disable-next-line no-underscore-dangle
    return mapOfStringDMMLCS
      .getFieldMap()
      .arr_.map(
        ([name, [lcs, normBuy, normSell]]: [
          string,
          [string, string, string],
        ]) => [name, { lcs, normBuy, normSell }],
      )
  }

  static grpcLCSResultRecordToLCSResultRecord(
    lCSResultRecord: GrpcLCSResultRecord,
  ): LCSResultRecord {
    // eslint-disable-next-line no-underscore-dangle
    const summaryMap = lCSResultRecord
      .getSummaryMap()
      .entries()
      .arr_.map(([name, dmmLcs]: [string, GrpcDMMLCS]) => [
        name,
        DMMTransformer.grpcDMMLCStoDMMLCS(dmmLcs),
      ])

    // eslint-disable-next-line no-underscore-dangle
    const byMarketsMap = lCSResultRecord
      .getByMarketsMap()
      .entries()
      .arr_.map(([marketId, grpcDmmLcs]: [string, GrpcMapOfStringDMMLCS]) => [
        marketId,
        Object.fromEntries(
          DMMTransformer.grpcMapOfStringDMMLCSToDMMLCS(grpcDmmLcs),
        ),
      ])

    return {
      // eslint-disable-next-line no-underscore-dangle
      summaryMap: Object.fromEntries(summaryMap),
      // eslint-disable-next-line no-underscore-dangle
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
    // eslint-disable-next-line no-underscore-dangle
    return mapOfStringDMMVCS
      .getFieldMap()
      .arr_.map(([name, [vcs, volume]]: [string, [string, string]]) => [
        name,
        { vcs, volume },
      ])
  }

  static grpcVCSResultRecordToVCSResultRecords(
    vCSResultRecord: GrpcVCSResultRecord,
  ): VCSResultRecord {
    // eslint-disable-next-line no-underscore-dangle
    const summaryMap = vCSResultRecord
      .getSummaryMap()
      .entries()
      .arr_.map(([name, dmmVcs]: [string, GrpcDMMVCS]) => [
        name,
        DMMTransformer.grpcDMMVCStoDMMVCS(dmmVcs),
      ])

    // eslint-disable-next-line no-underscore-dangle
    const byMarketsMap = vCSResultRecord
      .getByMarketsMap()
      .entries()
      .arr_.map(([marketId, dmmVcs]: [string, GrpcMapOfStringDMMVCS]) => [
        marketId,
        Object.fromEntries(
          DMMTransformer.grpcMapOfStringDMMVCStoMapOfStringDMMVCS(dmmVcs),
        ),
      ])

    // eslint-disable-next-line no-underscore-dangle
    const byDateMap = vCSResultRecord
      .getByDateMap()
      .entries()
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
