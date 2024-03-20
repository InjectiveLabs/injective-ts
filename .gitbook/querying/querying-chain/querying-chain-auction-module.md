# Auction

Example code snippets to query the auction module on the chain.

### Using gRPC

#### Fetch module params such as the auction period

```ts
import { ChainGrpcBankApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcAuctionApi = new ChainGrpcAuctionApi(endpoints.grpc)

const moduleParams = await chainGrpcAuctionApi.fetchModuleParams()

console.log(moduleParams)
```

#### Fetch the state of the current auction, such as the latest round

```ts
import { ChainGrpcBankApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcAuctionApi = new ChainGrpcAuctionApi(endpoints.grpc)

const latestAuctionModuleState = await auctionApi.fetchModuleState()

console.log(latestAuctionModuleState)
```

#### Fetch the current auction basket and get info such as the highest bidder and amount

```ts
import { ChainGrpcBankApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcAuctionApi = new ChainGrpcAuctionApi(endpoints.grpc)

const currentBasket = await chainGrpcAuctionApi.fetchCurrentBasket()

console.log(currentBasket)
```
