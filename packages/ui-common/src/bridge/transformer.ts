import { BridgingNetwork } from './types'

export const getNetworkFromSender = (sender: string): BridgingNetwork => {
  if (sender.startsWith('osmo')) {
    return BridgingNetwork.Osmosis
  }

  if (sender.startsWith('chihuahua')) {
    return BridgingNetwork.Chihuahua
  }

  if (sender.startsWith('axelar')) {
    return BridgingNetwork.Axelar
  }

  return BridgingNetwork.CosmosHub
}

export class BridgeTransformer {
  static getNetworkFromSender = getNetworkFromSender
}
