import {
  CosmosGovV1Beta1Gov,
  CosmosParamsV1Beta1Params,
  CosmosUpgradeV1Beta1Upgrade,
  InjectiveExchangeV1Beta1Tx,
  InjectiveOracleV1Beta1Proposal,
} from '@injectivelabs/core-proto-ts'

export class ProposalDecomposer {
  static grantBandOraclePrivilegeProposal(content: Uint8Array) {
    return InjectiveOracleV1Beta1Proposal.GrantBandOraclePrivilegeProposal.decode(
      content,
    )
  }

  static removeBandOraclePrivilegeProposal(content: Uint8Array) {
    return InjectiveOracleV1Beta1Proposal.RevokeBandOraclePrivilegeProposal.decode(
      content,
    )
  }

  static grantPriceFeederPrivilegeProposal(content: Uint8Array) {
    return InjectiveOracleV1Beta1Proposal.GrantPriceFeederPrivilegeProposal.decode(
      content,
    )
  }

  static removePriceFeederPrivilegeProposal(content: Uint8Array) {
    return InjectiveOracleV1Beta1Proposal.RevokePriceFeederPrivilegeProposal.decode(
      content,
    )
  }

  static textProposal(content: Uint8Array) {
    return CosmosGovV1Beta1Gov.TextProposal.decode(content)
  }

  static SoftwareUpgrade(content: Uint8Array) {
    return CosmosUpgradeV1Beta1Upgrade.SoftwareUpgradeProposal.decode(content)
  }

  static spotMarketLaunch(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Tx.SpotMarketLaunchProposal.decode(content)
  }

  static exchangeEnableProposal(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Tx.ExchangeEnableProposal.decode(content)
  }

  static spotMarketUpdate(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Tx.SpotMarketParamUpdateProposal.decode(
      content,
    )
  }

  static perpetualMarketLaunch(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Tx.PerpetualMarketLaunchProposal.decode(
      content,
    )
  }

  static expiryFuturesMarketLaunch(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Tx.ExpiryFuturesMarketLaunchProposal.decode(
      content,
    )
  }

  static derivativeMarketUpdate(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Tx.DerivativeMarketParamUpdateProposal.decode(
      content,
    )
  }

  static FeeDiscount(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Tx.FeeDiscountProposal.decode(content)
  }

  static TradingRewardCampaignLaunch(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Tx.TradingRewardCampaignLaunchProposal.decode(
      content,
    )
  }

  static TradingRewardCampaignUpdate(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Tx.TradingRewardCampaignUpdateProposal.decode(
      content,
    )
  }

  static parametersChange(content: Uint8Array) {
    return CosmosParamsV1Beta1Params.ParameterChangeProposal.decode(content)
  }

  static EnableBandIBC(content: Uint8Array) {
    return InjectiveOracleV1Beta1Proposal.EnableBandIBCProposal.decode(content)
  }

  static AuthorizeBandOracleRequest(content: Uint8Array) {
    return InjectiveOracleV1Beta1Proposal.AuthorizeBandOracleRequestProposal.decode(
      content,
    )
  }
}
