# Auction

Example code snippets to query the indexer for auction module related data.

### Using gRPC

#### Fetch auction based off the round

```ts
import { IndexerGrpcAuctionApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcAuctionApi = new IndexerGrpcAuctionApi(endpoints.indexer)

const round = 1

const auction = await indexerGrpcAuctionApi.fetchAuction(round)

console.log(auction)
```

#### Fetch auctions

```ts
import { IndexerGrpcAuctionApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcAuctionApi = new IndexerGrpcAuctionApi(endpoints.indexer)

const auction = await indexerGrpcAuctionApi.fetchAuctions()

console.log(auction)
```
