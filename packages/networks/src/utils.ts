import { isTestnet } from './network'
import { Network } from './types'

export const CW20_CODE_IDS_BY_NETWORK = (
  network: Network = Network.Mainnet,
) => {
  if (isTestnet(network)) {
    return ['25']
  }

  return ['28', '5', '42']
}
