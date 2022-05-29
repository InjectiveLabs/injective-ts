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

export class ExchangeProposalDecomposer {
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
}
