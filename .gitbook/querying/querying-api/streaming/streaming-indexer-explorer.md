# Explorer

Example code snippets to stream from the indexer for explorer module related data.

### Using gRPC Stream

#### Stream blocks

```ts
import { IndexerGrpcExplorerStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerStream = new IndexerGrpcExplorerStream(
  endpoints.indexer,
)

const streamFn = indexerGrpcExplorerStream.blocks.bind(
  indexerGrpcExplorerStream,
)

const callback = (blocks) => {
  console.log(blocks)
}

const streamFnArgs = {
  callback,
}

streamFn(streamFnArgs)
```

#### Stream blocks with transactions

```ts
import { IndexerGrpcExplorerStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerStream = new IndexerGrpcExplorerStream(
  endpoints.indexer,
)

const streamFn = indexerGrpcExplorerStream.blocksWithTxs.bind(
  indexerGrpcExplorerStream,
)

const callback = (blocksWithTransactions) => {
  console.log(blocksWithTransactions)
}

const streamFnArgs = {
  callback,
}

streamFn(streamFnArgs)
```

#### Stream transactions

```ts
import { IndexerGrpcExplorerStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcExplorerStream = new IndexerGrpcExplorerStream(
  endpoints.indexer,
)

const streamFn = indexerGrpcExplorerStream.streamTransactions.bind(
  indexerGrpcExplorerStream,
)

const callback = (transactions) => {
  console.log(transactions)
}

const streamFnArgs = {
  callback,
}

streamFn(streamFnArgs)
```
