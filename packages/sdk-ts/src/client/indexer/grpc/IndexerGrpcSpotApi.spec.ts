import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcSpotTransformer } from '../transformers'
import { IndexerGrpcSpotApi } from './IndexerGrpcSpotApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcSpotApi = new IndexerGrpcSpotApi(endpoints.indexer)

describe('IndexerGrpcSpotApi', () => {
  //
})
