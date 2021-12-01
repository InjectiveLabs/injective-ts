import {
  ArrayOfString,
  DMMLCS,
  DMMVCS,
  Epoch,
  EpochMeta,
  EpochResultRecord,
  LCSResultRecord,
  MapOfStringDMMLCS,
  MapOfStringDMMVCS,
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

  static grpcArrayOfStringToArrayOfString(
    arrayOfString: GrpcArrayOfString,
  ): ArrayOfString {
    return {
      fieldList: arrayOfString.getFieldList(),
    }
  }

  static grpcEpochMetaToEpochMeta(epochMeta: GrpcEpochMeta): EpochMeta {
    return {
      id: epochMeta.getId(),
      startTime: epochMeta.getStartTime(),
      endTime: epochMeta.getEndTime(),
      rewardInjNum: epochMeta.getRewardInjNum(),
      lcsRewardFraction: epochMeta.getLcsRewardFraction(),
      vcsRewardFraction: epochMeta.getVcsRewardFraction(),
      marketsMap: epochMeta
        .getMarketsMap()
        .map(DMMTransformer.grpcMarketConfigToMarketConfig),
      dmmAddressesList: epochMeta
        .getDmmAddressesMap()
        .map(DMMTransformer.grpcArrayOfStringToArrayOfString),
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
  ): MapOfStringDMMLCS {
    return {
      fieldMap: mapOfStringDMMLCS.getFieldMap(),
    }
  }

  static grpcLCSResultRecordToLCSResultRecord(
    lCSResultRecord: GrpcLCSResultRecord,
  ): LCSResultRecord {
    return {
      summaryMap: lCSResultRecord
        .getSummaryMap()
        .map(DMMTransformer.grpcDMMLCStoDMMLCS),
      byMarketsMap: lCSResultRecord
        .getByMarketsMap()
        .map(DMMTransformer.grpcMapOfStringDMMLCSToDMMLCS),
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
  ): MapOfStringDMMVCS {
    return {
      fieldMap: mapOfStringDMMVCS.getFieldMap(),
    }
  }

  static grpcVCSResultRecordToVCSResultRecords(
    vCSResultRecord: GrpcVCSResultRecord,
  ): VCSResultRecord {
    return {
      summaryMap: vCSResultRecord
        .getSummaryMap()
        .map(DMMTransformer.grpcDMMVCStoDMMVCS),
      byMarketsMap: vCSResultRecord
        .getByMarketsMap()
        .map(DMMTransformer.grpcMapOfStringDMMVCStoMapOfStringDMMVCS),
      byDateMap: vCSResultRecord
        .getByDateMap()
        .map(DMMTransformer.grpcMapOfStringDMMVCStoMapOfStringDMMVCS),
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
