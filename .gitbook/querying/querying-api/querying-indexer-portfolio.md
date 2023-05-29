# Querying Indexer: Portfolio

Example code snippets to query the indexer for portfolio module related data.

#### Using gRPC

* Get a portfolio based off injective address, such as bank balances and subaccount balances

```ts
import { IndexerGrpcAccountPortfolioApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcAccountPortfolioApi = new IndexerGrpcAccountPortfolioApi(endpoints.indexer)

const injectiveAddress = 'inj...'

const portfolio = await indexerGrpcAccountPortfolioApi.fetchAccountPortfolio(injectiveAddress)

console.log(portfolio)
```
