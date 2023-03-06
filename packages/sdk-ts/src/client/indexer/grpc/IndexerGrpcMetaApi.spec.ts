import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcMetaApi } from './IndexerGrpcMetaApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcMetaApi = new IndexerGrpcMetaApi(endpoints.indexer)

describe('IndexerGrpcMetaApi', () => {
  //
})
