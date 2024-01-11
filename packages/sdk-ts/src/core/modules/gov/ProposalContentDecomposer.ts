import {
  CosmosGovV1Tx,
  CosmosGovV1Beta1Gov,
  CosmosParamsV1Beta1Params,
  CosmosUpgradeV1Beta1Upgrade,
  InjectiveExchangeV1Beta1Proposal,
  InjectiveOracleV1Beta1Proposal,
} from '@injectivelabs/core-proto-ts'

export class ProposalDecomposer {
  static getMsgExecLegacyContent(content: Uint8Array) {
    return CosmosGovV1Tx.MsgExecLegacyContent.decode(content)
  }

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
    return InjectiveExchangeV1Beta1Proposal.SpotMarketLaunchProposal.decode(content)
  }

  static exchangeEnableProposal(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Proposal.ExchangeEnableProposal.decode(content)
  }

  static spotMarketUpdate(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Proposal.SpotMarketParamUpdateProposal.decode(
      content,
    )
  }

  static perpetualMarketLaunch(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Proposal.PerpetualMarketLaunchProposal.decode(
      content,
    )
  }

  static expiryFuturesMarketLaunch(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Proposal.ExpiryFuturesMarketLaunchProposal.decode(
      content,
    )
  }

  static derivativeMarketUpdate(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Proposal.DerivativeMarketParamUpdateProposal.decode(
      content,
    )
  }

  static FeeDiscount(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Proposal.FeeDiscountProposal.decode(content)
  }

  static TradingRewardCampaignLaunch(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Proposal.TradingRewardCampaignLaunchProposal.decode(
      content,
    )
  }

  static TradingRewardCampaignUpdate(content: Uint8Array) {
    return InjectiveExchangeV1Beta1Proposal.TradingRewardCampaignUpdateProposal.decode(
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
