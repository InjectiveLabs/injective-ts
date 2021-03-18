import {
  SpotMarketLaunchProposal,
  SpotMarketParamUpdateProposal,
  SpotMarketStatusSetProposal,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'

export class ProposalDecomposer {
  static spotMarketLaunch(content: Uint8Array) {
    return SpotMarketLaunchProposal.deserializeBinary(content)
  }

  static spotMarketUpdate(content: Uint8Array) {
    return SpotMarketParamUpdateProposal.deserializeBinary(content)
  }

  static spotMarketStatusUpdate(content: Uint8Array) {
    return SpotMarketStatusSetProposal.deserializeBinary(content)
  }

  static perpetualMarketLaunch() {
    //
  }

  static expiryFuturesMarketLaunch() {
    //
  }

  static derivativeMarketUpdate() {
    //
  }

  static derivativeMarketStatusUpdate() {
    //
  }
}
