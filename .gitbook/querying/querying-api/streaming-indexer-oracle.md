# Streaming Indexer: Oracle

Example code snippets to query the indexer for oracle module related data.

#### Using gRPC Stream

* stream oracle prices

```ts
import { IndexerGrpcOracleStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcOracleStream = new IndexerGrpcOracleStream(endpoints.indexer)

const streamFn = indexerGrpcOracleStream.streamOraclePrices.bind(indexerGrpcOracleStream)

const callback = (oraclePrices) => {
  console.log(oraclePrices)
}

const streamFnArgs = {
  callback
}

streamFn(streamFnArgs)
```

* stream oracle prices by market

```ts
import { IndexerGrpcOracleStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcOracleStream = new IndexerGrpcOracleStream(endpoints.indexer)

const marketIds = ['0x...'] /* optional param */

const streamFn = indexerGrpcOracleStream.streamOraclePricesByMarkets.bind(indexerGrpcOracleStream)

const callback = (oraclePrices) => {
  console.log(oraclePrices)
}

const streamFnArgs = {
  marketIds,
  callback
}

streamFn(streamFnArgs)
```
