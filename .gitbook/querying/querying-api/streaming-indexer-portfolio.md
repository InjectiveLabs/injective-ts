# Streaming Indexer: Portfolio

Example code snippets to stream from the indexer for portfolio module related data.

#### Using gRPC Stream

* stream an account's portfolio

```ts
import { IndexerGrpcAccountPortfolioStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcAccountPortfolioStream = new IndexerGrpcAccountPortfolioStream(endpoints.indexer)

const accountAddress = 'inj...'

const streamFn = indexerGrpcAccountPortfolioStream.streamAccountPortfolio.bind(indexerGrpcAccountPortfolioStream)

const callback = (portfolioResults) => {
  console.log(portfolioResults)
}

const streamFnArgs = {
  accountAddress,
  callback
}

streamFn(streamFnArgs)
```
