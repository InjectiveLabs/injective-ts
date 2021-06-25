import {
  ExpiryFuturesMarketLaunchProposal,
  PerpetualMarketLaunchProposal,
  SpotMarketLaunchProposal,
  SpotMarketParamUpdateProposal,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'

export class ExchangeProposalDecomposer {
  static spotMarketLaunch(content: Uint8Array) {
    return SpotMarketLaunchProposal.deserializeBinary(content)
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

  static derivativeMarketUpdate() {
    //
  }

  static derivativeMarketStatusUpdate() {
    //
  }
}
