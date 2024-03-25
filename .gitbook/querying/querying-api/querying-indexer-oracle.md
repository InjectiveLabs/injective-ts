# Oracle

Example code snippets to query the indexer for oracle module related data.

### Using gRPC

#### Fetch list of oracles

```ts
import { IndexerGrpcOracleApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcOracleApi = new IndexerGrpcOracleApi(endpoints.indexer)

const oracleList = await indexerGrpcOracleApi.fetchOracleList()

console.log(oracleList)
```

#### Fetch price from the oracle

Base and Quote oracle symbols are always fetched from the market itself. They can be in a different representation than plain symbols (i.e hashes for `pyth` oracle).

```ts
import {
  IndexerGrpcOracleApi,
  IndexerGrpcDerivativeApi,
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const markets = new IndexerGrpcDerivativeApi(endpoints.indexer)
const indexerGrpcOracleApi = new IndexerGrpcOracleApi(endpoints.indexer)

const market = markets.find((market) => market.ticker === 'INJ/USDT PERP')

// These values are a part of the market object
// fetched from the chain i.e `oracle_base` and `oracle_quote`
const baseSymbol = market.oracle_base
const quoteSymbol = market.oracle_quote
const oracleType = market.oracle_type

const oraclePrice = await indexerGrpcOracleApi.fetchOraclePriceNoThrow({
  baseSymbol,
  quoteSymbol,
  oracleType,
})

console.log(oraclePrice)
```
