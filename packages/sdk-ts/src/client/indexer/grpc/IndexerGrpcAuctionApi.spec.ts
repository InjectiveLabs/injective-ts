import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcAuctionTransformer } from '../transformers'
import { IndexerGrpcAuctionApi } from './IndexerGrpcAuctionApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcAuctionApi = new IndexerGrpcAuctionApi(endpoints.indexer)

describe('IndexerGrpcAuctionApi', () => {
  //
})
