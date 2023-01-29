import {
  GrantBandOraclePrivilegeProposal,
  RevokeBandOraclePrivilegeProposal,
  GrantPriceFeederPrivilegeProposal,
  RevokePriceFeederPrivilegeProposal,
  AuthorizeBandOracleRequestProposal,
  EnableBandIBCProposal,
} from '@injectivelabs/core-proto-ts/injective/oracle/v1beta1/proposal'
import { TextProposal } from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/gov'
import { SoftwareUpgradeProposal } from '@injectivelabs/core-proto-ts/cosmos/upgrade/v1beta1/upgrade'
import { ParameterChangeProposal } from '@injectivelabs/core-proto-ts/cosmos/params/v1beta1/params'
import {
  DerivativeMarketParamUpdateProposal,
  ExchangeEnableProposal,
  ExpiryFuturesMarketLaunchProposal,
  FeeDiscountProposal,
  PerpetualMarketLaunchProposal,
  SpotMarketLaunchProposal,
  SpotMarketParamUpdateProposal,
  TradingRewardCampaignLaunchProposal,
  TradingRewardCampaignUpdateProposal,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'

export class ProposalDecomposer {
  static grantBandOraclePrivilegeProposal(content: Uint8Array) {
    return GrantBandOraclePrivilegeProposal.decode(content)
  }

  static removeBandOraclePrivilegeProposal(content: Uint8Array) {
    return RevokeBandOraclePrivilegeProposal.decode(content)
  }

  static grantPriceFeederPrivilegeProposal(content: Uint8Array) {
    return GrantPriceFeederPrivilegeProposal.decode(content)
  }

  static removePriceFeederPrivilegeProposal(content: Uint8Array) {
    return RevokePriceFeederPrivilegeProposal.decode(content)
  }

  static textProposal(content: Uint8Array) {
    return TextProposal.decode(content)
  }

  static SoftwareUpgrade(content: Uint8Array) {
    return SoftwareUpgradeProposal.decode(content)
  }

  static spotMarketLaunch(content: Uint8Array) {
    return SpotMarketLaunchProposal.decode(content)
  }

  static exchangeEnableProposal(content: Uint8Array) {
    return ExchangeEnableProposal.decode(content)
  }

  static spotMarketUpdate(content: Uint8Array) {
    return SpotMarketParamUpdateProposal.decode(content)
  }

  static perpetualMarketLaunch(content: Uint8Array) {
    return PerpetualMarketLaunchProposal.decode(content)
  }

  static expiryFuturesMarketLaunch(content: Uint8Array) {
    return ExpiryFuturesMarketLaunchProposal.decode(content)
  }

  static derivativeMarketUpdate(content: Uint8Array) {
    return DerivativeMarketParamUpdateProposal.decode(content)
  }

  static FeeDiscount(content: Uint8Array) {
    return FeeDiscountProposal.decode(content)
  }

  static TradingRewardCampaignLaunch(content: Uint8Array) {
    return TradingRewardCampaignLaunchProposal.decode(content)
  }

  static TradingRewardCampaignUpdate(content: Uint8Array) {
    return TradingRewardCampaignUpdateProposal.decode(content)
  }

  static parametersChange(content: Uint8Array) {
    return ParameterChangeProposal.decode(content)
  }

  static EnableBandIBC(content: Uint8Array) {
    return EnableBandIBCProposal.decode(content)
  }

  static AuthorizeBandOracleRequest(content: Uint8Array) {
    return AuthorizeBandOracleRequestProposal.decode(content)
  }
}
