# Oracle

Example code snippets to query the indexer for oracle module related data.

### Using gRPC

* Get a list of oracles

```ts
import { IndexerGrpcOracleApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcOracleApi = new IndexerGrpcOracleApi(endpoints.indexer)

const oracleList = await indexerGrpcOracleApi.fetchOracleList()

console.log(oracleList)
```

* Get price from the oracle

Base and Quote oracle symbols are always fetched from the market itself. They can be in a different representation than plain symbols (i.e hashes for `pyth` oracle).&#x20;

```ts
import { IndexerGrpcOracleApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcOracleApi = new IndexerGrpcOracleApi(endpoints.indexer)

// These values are a part of the market object 
// fetched from the chain i.e `oracle_base` and `oracle_quote` 
const baseSymbol = 'INJ'
const quoteSymbol = 'USDT'
const oracleType = 'bandibc' // primary oracle we use

const oraclePrice = await indexerGrpcOracleApi.fetchOraclePriceNoThrow({
  baseSymbol,
  quoteSymbol,
  oracleType,
})

console.log(oraclePrice)
```
