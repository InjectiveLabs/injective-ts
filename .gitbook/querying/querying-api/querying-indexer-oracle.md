# Querying Indexer: Oracle

Example code snippets to query the indexer for oracle module related data.

#### Using gRPC

* Get a list of oracles

```ts
import { IndexerGrpcOracleApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcOracleApi = new IndexerGrpcOracleApi(endpoints.indexer)

const oracleList = await indexerGrpcOracleApi.fetchOracleList()

console.log(oracleList)
```

* Get price from oracle

```ts
import { IndexerGrpcOracleApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcOracleApi = new IndexerGrpcOracleApi(endpoints.indexer)

const baseSymbol = 'INJ'
const quoteSymbol = 'USDT'
const oracleType = 'bandibc' // primary oracle we use

const oraclePrice = await indexerGrpcOracleApi.fetchOraclePriceNoThrow({
  baseSymbol,
  quoteSymbol,
  oracleType
})

console.log(oraclePrice)
```
