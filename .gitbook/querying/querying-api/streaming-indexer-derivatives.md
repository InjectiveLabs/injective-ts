# Streaming Indexer: Derivatives

Example code snippets to query the indexer for derivative module related data.

#### Using gRPC Stream

* stream the derivatives orderbook

```ts
import { IndexerGrpcDerivativesStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcDerivativesStream = new IndexerGrpcDerivativesStream(endpoints.indexer)

const marketIds = ['0x...']

const streamFn = indexerGrpcDerivativesStream.streamDerivativeOrderbookV2.bind(indexerGrpcDerivativesStream)

const callback = (orderbooks) => {
  console.log(orderbooks)
}

const streamFnArgs = {
  marketIds,
  callback
}

streamFn(streamFnArgs)
```

* stream derivative orders

```ts
import { IndexerGrpcDerivativesStream } from '@injectivelabs/sdk-ts'
import { OrderSide } from '@injectivelabs/ts-types'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcDerivativesStream = new IndexerGrpcDerivativesStream(endpoints.indexer)

const marketId = '0x...'
const subaccountId = '0x...' /* optional param */
const orderSide = OrderSide.Buy /* optional param */

const streamFn = indexerGrpcDerivativesStream.streamDerivativeOrders.bind(indexerGrpcDerivativesStream)

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

* stream derivative order history

```ts
import {
  TradeDirection,
  TradeExecutionType,
  IndexerGrpcDerivativesStream
} from '@injectivelabs/sdk-ts'
import { OrderSide } from '@injectivelabs/ts-types'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcDerivativesStream = new IndexerGrpcDerivativesStream(endpoints.indexer)

const marketId = '0x...' /* optional param */
const subaccountId = '0x...' /* optional param */
const orderTypes = [OrderSide.Buy] /* optional param */
const executionTypes = [TradeExecutionType.Market] /* optional param */
const direction = TradeDirection.Buy /* optional param*/

const streamFn = indexerGrpcDerivativesStream.streamDerivativeOrderHistory.bind(indexerGrpcDerivativesStream)

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

* stream derivative trades

```ts
import {
  PaginationOption,
  TradeDirection,
  IndexerGrpcDerivativesStream
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcDerivativesStream = new IndexerGrpcDerivativesStream(endpoints.indexer)

const marketIds = ['0x...'] /* optional param */
const subaccountId = '0x...' /* optional param */
const direction = TradeDirection.Buy /* optional param */
const pagination = {...} as PaginationOption /* optional param */

const streamFn = indexerGrpcDerivativesStream.streamDerivativeTrades.bind(indexerGrpcDerivativesStream)

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

* stream derivative positions

```ts
import {
  IndexerGrpcDerivativesStream
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcDerivativesStream = new IndexerGrpcDerivativesStream(endpoints.indexer)

const marketId = '0x...' /* optional param */
const subaccountId = '0x...' /* optional param */

const streamFn = indexerGrpcDerivativesStream.streamDerivativePositions.bind(indexerGrpcDerivativesStream)

const callback = (positions) => {
  console.log(positions)
}

const streamFnArgs = {
  marketId,
  subaccountId,
  callback
}

streamFn(streamFnArgs)
```

* stream markets

```ts
import {
  IndexerGrpcDerivativesStream
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcDerivativesStream = new IndexerGrpcDerivativesStream(endpoints.indexer)

const marketIds = ['0x...'] /* optional param */

const streamFn = indexerGrpcDerivativesStream.streamDerivativeMarket.bind(indexerGrpcDerivativesStream)

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
  IndexerGrpcDerivativesStream
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcDerivativesStream = new IndexerGrpcDerivativesStream(endpoints.indexer)

const marketIds = ['0x...']

const streamFn = indexerGrpcDerivativesStream.streamDerivativeOrderbookUpdate.bind(indexerGrpcDerivativesStream)

const callback = (orderbookUpdates) => {
  console.log(orderbookUpdates)
}

const streamFnArgs = {
  marketIds,
  callback
}

streamFn(streamFnArgs)
```
