# Streaming Indexer: Explorer

Example code snippets to stream from the indexer for explorer module related data.

#### Using gRPC Stream

* stream blocks

```ts
import { IndexerGrpcExplorerStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerStream = new IndexerGrpcExplorerStream(endpoints.indexer)

const streamFn = indexerGrpcExplorerStream.blocks.bind(indexerGrpcExplorerStream)

const callback = (blocks) => {
  console.log(blocks)
}

const streamFnArgs = {
  callback
}

streamFn(streamFnArgs)
```

* stream blocks with transactions

```ts
import { IndexerGrpcExplorerStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerStream = new IndexerGrpcExplorerStream(endpoints.indexer)

const streamFn = indexerGrpcExplorerStream.blocksWithTxs.bind(indexerGrpcExplorerStream)

const callback = (blocksWithTransactions) => {
  console.log(blocksWithTransactions)
}

const streamFnArgs = {
  callback
}

streamFn(streamFnArgs)
```

* stream transactions

```ts
import { IndexerGrpcExplorerStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerStream = new IndexerGrpcExplorerStream(endpoints.indexer)

const streamFn = indexerGrpcExplorerStream.streamTransactions.bind(indexerGrpcExplorerStream)

const callback = (transactions) => {
  console.log(transactions)
}

const streamFnArgs = {
  callback
}

streamFn(streamFnArgs)
```
