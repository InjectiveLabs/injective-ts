import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { CometBFTIndexer } from './client/indexer.js'

const endpoints = [`${getNetworkEndpoints(Network.Mainnet).rpc}/websocket`]

const indexer = new CometBFTIndexer(endpoints)

await indexer.subscribe()

setInterval(() => {
  //
}, 1000)
