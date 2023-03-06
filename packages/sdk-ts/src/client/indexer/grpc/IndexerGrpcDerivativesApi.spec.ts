import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { mockFactory } from '@injectivelabs/test-utils'
import { IndexerGrpcDerivativeTransformer } from '../transformers'
import { IndexerGrpcDerivativesApi } from './IndexerGrpcDerivativesApi'

const injectiveAddress = mockFactory.injectiveAddress
const endpoints = getNetworkEndpoints(Network.MainnetK8s)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(
  endpoints.indexer,
)

describe('IndexerGrpcDerivativesApi', () => {
  //
})
