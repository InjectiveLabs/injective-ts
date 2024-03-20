# Derivatives

Example code snippets to query the indexer for derivative module related data.

### Using gRPC

#### Fetch markets

```ts
import { IndexerGrpcDerivativesApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(
  endpoints.indexer,
)

const markets = await indexerGrpcDerivativesApi.fetchMarkets()

console.log(markets)
```

#### Fetch market based on a market id

```ts
import { IndexerGrpcDerivativesApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(
  endpoints.indexer,
)

const marketId = '0x...'

const market = await indexerGrpcDerivativesApi.fetchMarket(marketId)

console.log(market)
```

#### Fetch binary options markets

```ts
import { IndexerGrpcDerivativesApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(
  endpoints.indexer,
)

const binaryOptionsMarket =
  await indexerGrpcDerivativesApi.fetchBinaryOptionsMarkets()

console.log(binaryOptionsMarket)
```

#### Fetch binary options market based on market id

```ts
import { IndexerGrpcDerivativesApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(
  endpoints.indexer,
)

const marketId = '0x...'

const binaryOptionsMarket =
  await indexerGrpcDerivativesApi.fetchBinaryOptionsMarket(marketId)

console.log(binaryOptionsMarket)
```

#### Fetch a market's orderbook based on market id

```ts
import { IndexerGrpcDerivativesApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(
  endpoints.indexer,
)

const marketId = '0x...'

const orderbook = await indexerGrpcDerivativesApi.fetchOrderbook(marketId)

console.log(orderbook)
```

#### Fetch a market's orders

```ts
import { PaginationOption, IndexerGrpcDerivativesApi } from '@injectivelabs/sdk-ts'
import { OrderSide } from '@injectivelabs/ts-types'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer)

const marketId = '0x...' /* optional param */
const orderSide = OrderSide.Buy /* optional param */
const subaccountId = '0x...' /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const orders = await indexerGrpcDerivativesApi.fetchOrders({
  marketId,
  orderSide,
  subaccountId,
  pagination
})

console.log(orders)
```

#### Fetch a market's order history

```ts
import {
  TradeDirection,
  PaginationOption,
  TradeExecutionType,
  IndexerGrpcDerivativesApi
} from '@injectivelabs/sdk-ts'
import { OrderSide } from '@injectivelabs/ts-types'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer)

const marketIds = ['0x...'] /* optional param */
const executionTypes = [TradeExecutionType.Market] /* optional param */
const orderTypes = OrderSide.StopBuy /* optional param */
const direction = TradeDirection.Buy /* optional param */
const subaccountId = '0x...' /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const orderHistory = await indexerGrpcDerivativesApi.fetchOrderHistory({
  marketIds,
  executionTypes,
  orderTypes,
  direction,
  subaccountId,
  pagination
})

console.log(orderHistory)
```

#### Fetch a market's positions

```ts
import {
  TradeDirection,
  PaginationOption,
  IndexerGrpcDerivativesApi
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer)

const marketIds = ['0x...'] /* optional param */
const direction = TradeDirection.Buy /* optional param */
const subaccountId = '0x...' /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const positions = await indexerGrpcDerivativesApi.fetchPositions({
  marketIds,
  direction,
  subaccountId,
  pagination
})

console.log(positions)
```

#### Fetch a market's trades

```ts
import {
  TradeDirection,
  PaginationOption,
  TradeExecutionType,
  IndexerGrpcDerivativesApi
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer)

const marketId = '0x...' /* optional param */
const executionTypes = [TradeExecutionType.Market] /* optional param */
const direction = TradeDirection.Buy /* optional param */
const subaccountId = '0x...'/* optional param */
const pagination = {...} as PaginationOption /* optional param */

const trades = await indexerGrpcDerivativesApi.fetchTrades({
  marketId,
  executionTypes,
  direction,
  subaccountId,
  pagination
})

console.log(trades)
```

#### Fetch funding payments for a market

```ts
import {
  PaginationOption,
  IndexerGrpcDerivativesApi
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer)

const marketIds = ['0x...'] /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const fundingPayments = await indexerGrpcDerivativesApi.fetchFundingPayments({
  marketIds,
  pagination
})

console.log(fundingPayments)
```

#### Fetch funding rates for a market

```ts
import {
  PaginationOption,
  IndexerGrpcDerivativesApi
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer)

const marketId = '0x...' /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const fundingRates = await indexerGrpcDerivativesApi.fetchFundingRates({
  marketId,
  pagination
})

console.log(fundingRates)
```

#### Fetch subaccount orders

```ts
import {
  PaginationOption,
  IndexerGrpcDerivativesApi
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer)

const marketId = '0x...' /* optional param */
const subaccountId = '0x...' /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const subaccountOrders = await indexerGrpcDerivativesApi.fetchSubaccountOrdersList({
  marketId,
  subaccountId,
  pagination
})

console.log(subaccountOrders)
```

#### Fetch subaccount trades

```ts
import {
  TradeDirection,
  TradeExecutionType,
  PaginationOption,
  IndexerGrpcDerivativesApi
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer)

const marketId = '0x...' /* optional param */
const subaccountId = '0x...' /* optional param */
const executionType = TradeExecutionType.LimitFill /* optional param */
const direction = TradeDirection.Sell /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const subaccountTrades = await indexerGrpcDerivativesApi.fetchSubaccountTradesList({
  marketId,
  subaccountId,
  executionType,
  direction,
  pagination
})

console.log(subaccountTrades)
```

#### Fetch orderbooks for multiple markets

```ts
import { IndexerGrpcDerivativesApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(
  endpoints.indexer,
)

const marketIds = ['0x...']

const orderbooks = await indexerGrpcDerivativesApi.fetchOrderbooksV2(marketIds)

console.log(orderbooks)
```

#### Fetch orderbook for a market

```ts
import { IndexerGrpcDerivativesApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcDerivativesApi = new IndexerGrpcDerivativesApi(
  endpoints.indexer,
)

const marketId = '0x...'

const orderbook = await indexerGrpcDerivativesApi.fetchOrderbookV2(marketId)

console.log(orderbook)
```

### Using HTTP REST

#### Fetch market summary, such as a history of prices and 24 hr volume

```ts
import { IndexerRestDerivativesChronosApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestDerivativesChronosApi = new IndexerRestDerivativesChronosApi(
  `${endpoints.chronos}/api/chronos/v1/derivative`,
)

const marketId = '0x...'

const marketSummary = await indexerRestDerivativesChronosApi.fetchMarketSummary(
  marketId,
)

console.log(marketSummary)
```

#### Fetch all markets' summaries, such as a history of prices and 24 hr volume

```ts
import { IndexerRestDerivativesChronosApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestDerivativesChronosApi = new IndexerRestDerivativesChronosApi(
  `${endpoints.chronos}/api/chronos/v1/derivative`,
)

const marketSummaries =
  await indexerRestDerivativesChronosApi.fetchMarketsSummary(marketId)

console.log(marketSummaries)
```
