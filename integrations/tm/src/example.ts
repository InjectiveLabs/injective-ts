import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { CometBFTIndexer } from './client/indexer'

const endpoint =
  process.env.TM_ENDPOINT ||
  `${getNetworkEndpoints(Network.Mainnet).rpc}/websocket`
const endpoints = [endpoint]

const indexer = new CometBFTIndexer(endpoints)

export function startIndexerSubscription() {
  return indexer.subscribe()
}

startIndexerSubscription()
