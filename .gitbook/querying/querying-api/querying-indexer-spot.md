# Querying Indexer: Spot

Example code snippets to query the indexer for spot market module related data.

#### Using gRPC

* Get markets

```ts
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotApi = new IndexerGrpcSpotApi(endpoints.indexer)

const markets = await indexerGrpcSpotApi.fetchMarkets()

console.log(markets)
```

* Get market based on market id

```ts
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotApi = new IndexerGrpcSpotApi(endpoints.indexer)

const marketId = '0x...'

const market = await indexerGrpcSpotApi.fetchMarket(marketId)

console.log(market)
```

* fetch a market's orders

```ts
import { PaginationOption, IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { OrderSide } from '@injectivelabs/ts-types'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotApi = new IndexerGrpcSpotApi(endpoints.indexer)

const marketId = '0x...' /* optional param */
const orderSide = OrderSide.Buy /* optional param */
const subaccountId = '0x...' /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const orders = await indexerGrpcSpotApi.fetchOrders({
  marketId,
  orderSide,
  subaccountId,
  pagination
})

console.log(orders)
```

* fetch a market's order history

```ts
import {
  TradeDirection,
  PaginationOption,
  TradeExecutionType,
  IndexerGrpcSpotApi
} from '@injectivelabs/sdk-ts'
import { OrderSide } from '@injectivelabs/ts-types'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotApi = new IndexerGrpcSpotApi(endpoints.indexer)

const marketIds = ['0x...'] /* optional param */
const executionTypes = [TradeExecutionType.Market] /* optional param */
const orderTypes = OrderSide.Buy /* optional param */
const direction = TradeDirection.Buy /* optional param */
const subaccountId = '0x...' /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const orderHistory = await indexerGrpcSpotApi.fetchOrderHistory({
  marketIds,
  executionTypes,
  orderTypes,
  direction,
  subaccountId,
  pagination
})

console.log(orderHistory)
```

* fetch a market's trades

```ts
import {
  TradeDirection,
  PaginationOption,
  TradeExecutionType,
  IndexerGrpcSpotApi
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotApi = new IndexerGrpcSpotApi(endpoints.indexer)

const marketId = '0x...' /* optional param */
const executionTypes = [TradeExecutionType.Market] /* optional param */
const direction = TradeDirection.Buy /* optional param */
const subaccountId = '0x...'/* optional param */
const pagination = {...} as PaginationOption /* optional param */

const trades = await indexerGrpcSpotApi.fetchTrades({
  marketId,
  executionTypes,
  direction,
  subaccountId,
  pagination
})

console.log(trades)
```

* get a list of subaccount orders

```ts
import {
  PaginationOption,
  IndexerGrpcSpotApi
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotApi = new IndexerGrpcSpotApi(endpoints.indexer)

const marketId = '0x...' /* optional param */
const subaccountId = '0x...' /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const subaccountOrders = await indexerGrpcSpotApi.fetchSubaccountOrdersList({
  marketId,
  subaccountId,
  pagination
})

console.log(subaccountOrders)
```

* get a list of subaccount trades

```ts
import {
  TradeDirection,
  TradeExecutionType,
  PaginationOption,
  IndexerGrpcSpotApi
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotApi = new IndexerGrpcSpotApi(endpoints.indexer)

const marketId = '0x...' /* optional param */
const subaccountId = '0x...' /* optional param */
const executionType = TradeExecutionType.LimitFill /* optional param */
const direction = TradeDirection.Sell /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const subaccountTrades = await indexerGrpcSpotApi.fetchSubaccountTradesList({
  marketId,
  subaccountId,
  executionType,
  direction,
  pagination
})

console.log(subaccountTrades)
```

* get orderbooks for multiple markets

```ts
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotApi = new IndexerGrpcSpotApi(endpoints.indexer)

const marketIds = ['0x...']

const orderbooks = await indexerGrpcSpotApi.fetchOrderbooksV2(marketIds)

console.log(orderbooks)
```

* get orderbook for a market

```ts
import { IndexerGrpcSpotApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotApi = new IndexerGrpcSpotApi(endpoints.indexer)

const marketId = '0x...'

const orderbook = await indexerGrpcSpotApi.fetchOrderbookV2(marketId)

console.log(orderbook)
```

#### Using HTTP REST

* get market summary, such as a history of prices and 24 hr volume

```ts
import { IndexerRestSpotChronosApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestSpotChronosApi = new IndexerRestSpotChronosApi(`${endpoints.chronos}/api/chronos/v1/spot`)

const marketId = '0x...'

const marketSummary = await indexerRestSpotChronosApi.fetchMarketSummary(marketId)

console.log(marketSummary)
```

* get all markets' summaries, such as a history of prices and 24 hr volume

```ts
import { IndexerRestSpotChronosApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerRestSpotChronosApi = new IndexerRestSpotChronosApi(`${endpoints.chronos}/api/chronos/v1/spot`)

const marketSummaries = await indexerRestSpotChronosApi.fetchMarketsSummary(marketId)

console.log(marketSummaries)
```
