# Auction

Example code snippets to stream from the indexer for auction module related data.

### Using gRPC Stream

#### Stream auction bids

```ts
import { IndexerGrpcAuctionStream } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcAuctionStream = new IndexerGrpcAuctionStream(endpoints.indexer)

const streamFn = indexerGrpcAuctionStream.streamBids.bind(
  indexerGrpcAuctionStream,
)

const callback = (bids) => {
  console.log(bids)
}

const streamFnArgs = {
  callback,
}

streamFn(streamFnArgs)
```
