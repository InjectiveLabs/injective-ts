import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcAccountPortfolioTransformer } from '../transformers'
import { IndexerGrpcAccountPortfolioApi } from './IndexerGrpcPortfolioApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcPortfolioApi = new IndexerGrpcAccountPortfolioApi(
  endpoints.indexer,
)

describe('IndexerGrpcAccountPortfolioApi', () => {
  //
})
