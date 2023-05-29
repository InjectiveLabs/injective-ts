# Querying Indexer: Account

Example code snippets to query the indexer for subaccount related data.

#### Using gRPC

* Get the user's portfolio details, such as their available balance, unrealized Pnl, or their portfolio value.

```ts
import { IndexerGrpcAccountApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcAccountApi = new IndexerGrpcAccountApi(endpoints.indexer)

const injectiveAddress = 'inj...'

const portfolio = await indexerGrpcAccountApi.fetchPortfolio(injectiveAddress)

console.log(portfolio)
```

* Get the user's trading rewards per epoch

```ts
import { IndexerGrpcAccountApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcAccountApi = new IndexerGrpcAccountApi(endpoints.indexer)

const injectiveAddress = 'inj...'
const epoch = -1 // current epoch

const tradingRewards = await indexerGrpcAccountApi.fetchRewards({
  address: injectiveAddress,
  epoch
})

console.log(tradingRewards)
```

* Get a list of subaccounts associated with an injective address

```ts
import { IndexerGrpcAccountApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcAccountApi = new IndexerGrpcAccountApi(endpoints.indexer)

const injectiveAddress = 'inj...'

const subaccountsList = await indexerGrpcAccountApi.fetchSubaccountsList(injectiveAddress)

console.log(subaccountsList)
```

* Get the balance of a subaccount for a specific denom

```ts
import { IndexerGrpcAccountApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcAccountApi = new IndexerGrpcAccountApi(endpoints.indexer)

const subaccountId = '0x...'
const denom = 'inj'

const subaccountBalance = await indexerGrpcAccountApi.fetchSubaccountBalance(subaccountId, denom)

console.log(subaccountBalance)
```

* Get a list of balances for a subaccount

```ts
import { IndexerGrpcAccountApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcAccountApi = new IndexerGrpcAccountApi(endpoints.indexer)

const subaccountId = '0x...'

const subaccountBalanceList = await indexerGrpcAccountApi.fetchSubaccountBalancesList(subaccountId)

console.log(subaccountBalanceList)
```

* Get the history of a subaccount

```ts
import { PaginationOption, IndexerGrpcAccountApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcAccountApi = new IndexerGrpcAccountApi(endpoints.indexer)

const subaccountId = '0x...'
const denom = 'inj'
const pagination = {...} as PaginationOption

const subaccountHistory = await indexerGrpcAccountApi.fetchSubaccountHistory({
  subaccountId,
  denom,
  pagination /* optional param */
})

console.log(subaccountHistory)
```

* Get a summary of a subaccount's orders

```ts
import { IndexerGrpcAccountApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcAccountApi = new IndexerGrpcAccountApi(endpoints.indexer)

const subaccountId = '0x...'
const marketId = '0x'
const orderDirection = 'buy'

const orderSummary = await indexerGrpcAccountApi.fetchSubaccountOrderSummary({
  subaccountId,
  marketId,
  orderDirection
})

console.log(orderSummary)
```

* Get states of a list of spot and/or derivatives orders

```ts
import { IndexerGrpcAccountApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcAccountApi = new IndexerGrpcAccountApi(endpoints.indexer)

const spotOrderHashes = ['0x...']
const derivativeOrderHashes = ['0x...']

const orderStates = await indexerGrpcAccountApi.fetchOrderStates({
  spotOrderHashes,
  derivativeOrderHashes
})

console.log(orderStates)
```
