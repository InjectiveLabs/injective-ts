import {
  Network,
  type NetworkEndpoints,
  getNetworkChainInfo,
  getNetworkEndpoints,
} from '@injectivelabs/networks'
import {
  ChainGrpcAuthApi,
  ChainGrpcAuthZApi,
  ChainGrpcBankApi,
  ChainGrpcExchangeApi,
  ChainGrpcWasmApi,
  ChainRestAuthApi,
  IndexerGrpcAccountPortfolioApi,
  IndexerGrpcArchiverApi,
  IndexerGrpcDerivativesApi,
  IndexerGrpcExplorerApi,
  IndexerGrpcOracleApi,
  IndexerGrpcSpotApi,
  IndexerGrpcWeb3GwApi,
  IndexerRestDerivativesChronosApi,
  IndexerRestExplorerApi,
  IndexerRestMarketChronosApi,
  IndexerRestSpotChronosApi,
  TxGrpcApi,
} from '@injectivelabs/sdk-ts'

export function getInjectiveClients(network: Network) {
  const endpoints = (() => {
    if (network === 'mainnet') {
      const defaultEndpoints = getNetworkEndpoints(Network.Mainnet)
      const endpoints: NetworkEndpoints = {
        ...defaultEndpoints,
        cacheGrpc:
          import.meta.env.VITE_ENDPOINT_CACHE_GRPC ||
          defaultEndpoints.cacheGrpc,
        grpc: import.meta.env.VITE_ENDPOINT_GRPC || defaultEndpoints.grpc,
        rest: import.meta.env.VITE_ENDPOINT_REST || defaultEndpoints.rest,
        indexer:
          import.meta.env.VITE_ENDPOINT_INDEXER || defaultEndpoints.indexer,
        chronos:
          import.meta.env.VITE_ENDPOINT_CHRONOS || defaultEndpoints.chronos,
      }
      return endpoints
    }
    return getNetworkEndpoints(network)
  })()

  const IS_MAINNET = network === 'mainnet'
  const IS_TESTNET = network === 'testnet'

  return {
    network,
    chainGrpcWasmApi: new ChainGrpcWasmApi(endpoints.grpc),
    chainBankGrpcApi: new ChainGrpcBankApi(endpoints.grpc),
    chainGrpcAuthZApi: new ChainGrpcAuthZApi(endpoints.grpc),
    chainGrpcAuthApi: new ChainGrpcAuthApi(endpoints.grpc),
    chainRestAuthApi: new ChainRestAuthApi(endpoints.rest),
    chainGrpcExchangeApi: new ChainGrpcExchangeApi(endpoints.grpc),
    indexerRestDerivativesChronosApi: new IndexerRestDerivativesChronosApi(
      `${endpoints.chronos}/api/chronos/v1/derivative`,
    ),
    indexerRestSpotChronosApi: new IndexerRestSpotChronosApi(
      `${endpoints.chronos}/api/chronos/v1/spot/`,
    ),
    indexerGrpcOracleApi: new IndexerGrpcOracleApi(endpoints.indexer),
    indexerGrpcSpotApi: new IndexerGrpcSpotApi(endpoints.indexer),
    indexerGrpcArchiverApi: new IndexerGrpcArchiverApi(
      IS_MAINNET
        ? 'https://k8s.mainnet.archiver.grpc-web.injective.network'
        : IS_TESTNET
        ? 'https://k8s.testnet.archiver.grpc-web.injective.network'
        : endpoints.indexer,
    ),
    indexerGrpcWeb3GwApi: new IndexerGrpcWeb3GwApi(
      endpoints.web3gw ?? endpoints.indexer,
    ),
    txGrpcApi: new TxGrpcApi(endpoints.grpc),
    indexerGrpcDerivativesApi: new IndexerGrpcDerivativesApi(endpoints.indexer),
    indexerGrpcAccountPortfolioApi: new IndexerGrpcAccountPortfolioApi(
      endpoints.indexer,
    ),
    indexerGrpcExplorerApi: new IndexerGrpcExplorerApi(endpoints.indexer),
    indexerRestExplorerApi: new IndexerRestExplorerApi(endpoints.indexer),
    indexerRestMarketChronosApi: new IndexerRestMarketChronosApi(
      `${endpoints.chronos}/api/chronos/v1/market`,
    ),
    endpoints,
    ...getNetworkChainInfo(network),
  }
}

export const injectiveClients = getInjectiveClients(Network.Mainnet)
export type InjectiveClients = ReturnType<typeof getInjectiveClients>
