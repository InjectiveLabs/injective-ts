import {
  GrantBandOraclePrivilegeProposal,
  RevokeBandOraclePrivilegeProposal,
  GrantPriceFeederPrivilegeProposal,
  RevokePriceFeederPrivilegeProposal,
  AuthorizeBandOracleRequestProposal,
  EnableBandIBCProposal,
} from '@injectivelabs/chain-api/injective/oracle/v1beta1/proposal_pb'
import { TextProposal } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import { SoftwareUpgradeProposal } from '@injectivelabs/chain-api/cosmos/upgrade/v1beta1/upgrade_pb'
import { ParameterChangeProposal } from '@injectivelabs/chain-api/cosmos/params/v1beta1/params_pb'
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
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'

export class ProposalDecomposer {
  static grantBandOraclePrivilegeProposal(content: Uint8Array) {
    return GrantBandOraclePrivilegeProposal.deserializeBinary(content)
  }

  static removeBandOraclePrivilegeProposal(content: Uint8Array) {
    return RevokeBandOraclePrivilegeProposal.deserializeBinary(content)
  }

  static grantPriceFeederPrivilegeProposal(content: Uint8Array) {
    return GrantPriceFeederPrivilegeProposal.deserializeBinary(content)
  }

  static removePriceFeederPrivilegeProposal(content: Uint8Array) {
    return RevokePriceFeederPrivilegeProposal.deserializeBinary(content)
  }

  static textProposal(content: Uint8Array) {
    return TextProposal.deserializeBinary(content)
  }

  static SoftwareUpgrade(content: Uint8Array) {
    return SoftwareUpgradeProposal.deserializeBinary(content)
  }

  static spotMarketLaunch(content: Uint8Array) {
    return SpotMarketLaunchProposal.deserializeBinary(content)
  }

  static exchangeEnableProposal(content: Uint8Array) {
    return ExchangeEnableProposal.deserializeBinary(content)
  }

  static spotMarketUpdate(content: Uint8Array) {
    return SpotMarketParamUpdateProposal.deserializeBinary(content)
  }

  static perpetualMarketLaunch(content: Uint8Array) {
    return PerpetualMarketLaunchProposal.deserializeBinary(content)
  }

  static expiryFuturesMarketLaunch(content: Uint8Array) {
    return ExpiryFuturesMarketLaunchProposal.deserializeBinary(content)
  }

  static derivativeMarketUpdate(content: Uint8Array) {
    return DerivativeMarketParamUpdateProposal.deserializeBinary(content)
  }

  static FeeDiscount(content: Uint8Array) {
    return FeeDiscountProposal.deserializeBinary(content)
  }

  static TradingRewardCampaignLaunch(content: Uint8Array) {
    return TradingRewardCampaignLaunchProposal.deserializeBinary(content)
  }

  static TradingRewardCampaignUpdate(content: Uint8Array) {
    return TradingRewardCampaignUpdateProposal.deserializeBinary(content)
  }

  static parametersChange(content: Uint8Array) {
    return ParameterChangeProposal.deserializeBinary(content)
  }

  static EnableBandIBC(content: Uint8Array) {
    return EnableBandIBCProposal.deserializeBinary(content)
  }

  static AuthorizeBandOracleRequest(content: Uint8Array) {
    return AuthorizeBandOracleRequestProposal.deserializeBinary(content)
  }
}
