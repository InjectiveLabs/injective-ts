import * as CosmosGovV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/tx_pb'
import * as CosmosGovV1Beta1GovPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1beta1/gov_pb'
import * as CosmosParamsV1Beta1ParamsPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/params/v1beta1/params_pb'
import * as CosmosUpgradeV1Beta1UpgradePb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/upgrade/v1beta1/upgrade_pb'
import * as InjectiveExchangeV2ProposalPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/proposal_pb'
import * as InjectiveOracleV1Beta1ProposalPb from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/proposal_pb'
import * as InjectiveExchangeV1Beta1ProposalPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/proposal_pb'

export class ProposalDecomposer {
  static getMsgExecLegacyContent(content: Uint8Array) {
    return CosmosGovV1TxPb.MsgExecLegacyContent.fromBinary(content)
  }

  static grantBandOraclePrivilegeProposal(content: Uint8Array) {
    return InjectiveOracleV1Beta1ProposalPb.GrantBandOraclePrivilegeProposal.fromBinary(
      content,
    )
  }

  static grantProviderPrivilegeProposal(content: Uint8Array) {
    return InjectiveOracleV1Beta1ProposalPb.GrantProviderPrivilegeProposal.fromBinary(
      content,
    )
  }

  static removeBandOraclePrivilegeProposal(content: Uint8Array) {
    return InjectiveOracleV1Beta1ProposalPb.RevokeBandOraclePrivilegeProposal.fromBinary(
      content,
    )
  }

  static grantPriceFeederPrivilegeProposal(content: Uint8Array) {
    return InjectiveOracleV1Beta1ProposalPb.GrantPriceFeederPrivilegeProposal.fromBinary(
      content,
    )
  }

  static removePriceFeederPrivilegeProposal(content: Uint8Array) {
    return InjectiveOracleV1Beta1ProposalPb.RevokePriceFeederPrivilegeProposal.fromBinary(
      content,
    )
  }

  static textProposal(content: Uint8Array) {
    return CosmosGovV1Beta1GovPb.TextProposal.fromBinary(content)
  }

  static SoftwareUpgrade(content: Uint8Array) {
    return CosmosUpgradeV1Beta1UpgradePb.SoftwareUpgradeProposal.fromBinary(
      content,
    )
  }

  static spotMarketLaunch(content: Uint8Array) {
    return InjectiveExchangeV1Beta1ProposalPb.SpotMarketLaunchProposal.fromBinary(
      content,
    )
  }

  static exchangeEnableProposal(content: Uint8Array) {
    return InjectiveExchangeV1Beta1ProposalPb.ExchangeEnableProposal.fromBinary(
      content,
    )
  }

  static spotMarketUpdate(content: Uint8Array) {
    return InjectiveExchangeV1Beta1ProposalPb.SpotMarketParamUpdateProposal.fromBinary(
      content,
    )
  }

  static perpetualMarketLaunchV1Beta1(content: Uint8Array) {
    return InjectiveExchangeV1Beta1ProposalPb.PerpetualMarketLaunchProposal.fromBinary(
      content,
    )
  }

  static perpetualMarketLaunchV2(content: Uint8Array) {
    return InjectiveExchangeV2ProposalPb.PerpetualMarketLaunchProposal.fromBinary(
      content,
    )
  }

  static expiryFuturesMarketLaunch(content: Uint8Array) {
    return InjectiveExchangeV1Beta1ProposalPb.ExpiryFuturesMarketLaunchProposal.fromBinary(
      content,
    )
  }

  static derivativeMarketUpdate(content: Uint8Array) {
    return InjectiveExchangeV1Beta1ProposalPb.DerivativeMarketParamUpdateProposal.fromBinary(
      content,
    )
  }

  static FeeDiscount(content: Uint8Array) {
    return InjectiveExchangeV1Beta1ProposalPb.FeeDiscountProposal.fromBinary(
      content,
    )
  }

  static TradingRewardCampaignLaunch(content: Uint8Array) {
    return InjectiveExchangeV1Beta1ProposalPb.TradingRewardCampaignLaunchProposal.fromBinary(
      content,
    )
  }

  static TradingRewardCampaignUpdate(content: Uint8Array) {
    return InjectiveExchangeV1Beta1ProposalPb.TradingRewardCampaignUpdateProposal.fromBinary(
      content,
    )
  }

  static parametersChange(content: Uint8Array) {
    return CosmosParamsV1Beta1ParamsPb.ParameterChangeProposal.fromBinary(
      content,
    )
  }

  static EnableBandIBC(content: Uint8Array) {
    return InjectiveOracleV1Beta1ProposalPb.EnableBandIBCProposal.fromBinary(
      content,
    )
  }

  static AuthorizeBandOracleRequest(content: Uint8Array) {
    return InjectiveOracleV1Beta1ProposalPb.AuthorizeBandOracleRequestProposal.fromBinary(
      content,
    )
  }
}
