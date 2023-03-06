import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcOracleTransformer } from '../transformers'
import { IndexerGrpcOracleApi } from './IndexerGrpcOracleApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcOracleApi = new IndexerGrpcOracleApi(endpoints.indexer)

describe('IndexerGrpcOracleApi', () => {
  //
})
