import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcExplorerTransformer } from '../transformers'
import { IndexerGrpcExplorerApi } from './IndexerGrpcExplorerApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcExplorerApi = new IndexerGrpcExplorerApi(endpoints.indexer)

describe('IndexerGrpcExplorerApi', () => {
  //
})
