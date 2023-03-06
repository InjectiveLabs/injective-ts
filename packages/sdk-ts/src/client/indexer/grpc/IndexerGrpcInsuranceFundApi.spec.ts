import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcInsuranceFundTransformer } from '../transformers'
import { IndexerGrpcInsuranceFundApi } from './IndexerGrpcInsuranceFundApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcInsuranceFundApi = new IndexerGrpcInsuranceFundApi(
  endpoints.indexer,
)

describe('IndexerGrpcInsuranceFundApi', () => {
  //
})
