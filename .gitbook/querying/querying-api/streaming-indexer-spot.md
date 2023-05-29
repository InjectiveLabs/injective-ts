# Streaming Indexer: Spot

Example code snippets to stream from the indexer for spot market module related data.

#### Using gRPC Stream

* stream the spot orderbook

```ts
import { IndexerGrpcSpotStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotStream = new IndexerGrpcSpotStream(endpoints.indexer)

const marketIds = ['0x...']

const streamFn = indexerGrpcSpotStream.streamSpotOrderbookV2.bind(indexerGrpcSpotStream)

const callback = (orderbooks) => {
  console.log(orderbooks)
}

const streamFnArgs = {
  marketIds,
  callback
}

streamFn(streamFnArgs)
```

* stream spot orders

```ts
import { IndexerGrpcSpotsStream } from '@injectivelabs/sdk-ts'
import { OrderSide } from '@injectivelabs/ts-types'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotStream = new IndexerGrpcSpotsStream(endpoints.indexer)

const marketId = '0x...'
const subaccountId = '0x...' /* optional param */
const orderSide = OrderSide.Buy /* optional param */

const streamFn = indexerGrpcSpotStream.streamSpotOrders.bind(indexerGrpcSpotStream)

const callback = (orders) => {
  console.log(orders)
}

const streamFnArgs = {
  marketId,
  subaccountId,
  orderside,
  callback
}

streamFn(streamFnArgs)
```

* stream spot order history

```ts
import {
  TradeDirection,
  TradeExecutionType,
  IndexerGrpcSpotStream
} from '@injectivelabs/sdk-ts'
import { OrderSide } from '@injectivelabs/ts-types'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotStream = new IndexerGrpcSpotStream(endpoints.indexer)

const marketId = '0x...' /* optional param */
const subaccountId = '0x...' /* optional param */
const orderTypes = [OrderSide.Buy] /* optional param */
const executionTypes = [TradeExecutionType.Market] /* optional param */
const direction = TradeDirection.Buy /* optional param*/

const streamFn = indexerGrpcSpotStream.streamSpotOrderHistory.bind(indexerGrpcSpotStream)

const callback = (orderHistory) => {
  console.log(orderHistory)
}

const streamFnArgs = {
  marketId,
  subaccountId,
  orderTypes,
  executionTypes,
  direction,
  callback
}

streamFn(streamFnArgs)
```

* stream spot trades

```ts
import {
  PaginationOption,
  TradeDirection,
  IndexerGrpcSpotStream
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotStream = new IndexerGrpcSpotStream(endpoints.indexer)

const marketIds = ['0x...'] /* optional param */
const subaccountId = '0x...' /* optional param */
const direction = TradeDirection.Buy /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const streamFn = indexerGrpcSpotStream.streamSpotTrades.bind(indexerGrpcSpotStream)

const callback = (trades) => {
  console.log(trades)
}

const streamFnArgs = {
  marketIds,
  subaccountId,
  orderTypes,
  direction,
  pagination,
  callback
}

streamFn(streamFnArgs)
```

* stream markets

```ts
import {
  IndexerGrpcSpotStream
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotStream = new IndexerGrpcSpotStream(endpoints.indexer)

const marketIds = ['0x...'] /* optional param */

const streamFn = indexerGrpcSpotStream.streamSpotMarket.bind(indexerGrpcSpotStream)

const callback = (markets) => {
  console.log(markets)
}

const streamFnArgs = {
  marketIds,
  callback
}

streamFn(streamFnArgs)
```

* stream orderbook updates

```ts
import {
  IndexerGrpcSpotStream
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcSpotStream = new IndexerGrpcSpotStream(endpoints.indexer)

const marketIds = ['0x...']

const streamFn = indexerGrpcSpotStream.streamDerivativeOrderbookUpdate.bind(indexerGrpcSpotStream)

const callback = (orderbookUpdates) => {
  console.log(orderbookUpdates)
}

const streamFnArgs = {
  marketIds,
  callback
}

streamFn(streamFnArgs)
```
