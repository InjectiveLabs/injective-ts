# Streaming Indexer: Account

Example code snippets to stream from the indexer for subaccount related data.

#### Using gRPC stream

* Stream a subaccount balance

```ts
import { IndexerGrpcAccountStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcAccountStream = new IndexerGrpcAccountStream(endpoints.indexer)

const subaccountId = '0x...'

const streamFn = indexerGrpcAccountStream.streamSubaccountBalance.bind(indexerGrpcAccountStream)

const callback = (subaccountBalance) => {
  console.log(subaccountBalance)
}

const streamFnArgs = {
  subaccountId,
  callback
}

streamFn(streamFnArgs)
```
