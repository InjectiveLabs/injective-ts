import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcNinjaTransformer } from '../transformers'
import { IndexerGrpcNinjaApi } from './IndexerGrpcNinjaApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcNinjaApi = new IndexerGrpcNinjaApi(endpoints.indexer)

describe('IndexerGrpcNinjaApi', () => {
  //
})
