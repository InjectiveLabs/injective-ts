# Exchange

Example code snippets to query the exchange module on the chain.

### Using gRPC

#### Fetch parameters such as the default spot and derivatives fees/trading rewards

```ts
import { ChainGrpcExchangeApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)

const moduleParams = await chainGrpcExchangeApi.fetchModuleParams()

console.log(moduleParams)
```

#### Fetch the fee discount schedules

```ts
import { ChainGrpcExchangeApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)

const feeDiscountSchedule =
  await chainGrpcExchangeApi.fetchFeeDiscountSchedule()

console.log(feeDiscountSchedule)
```

#### Fetch the fee discounts associated with an injective address

```ts
import { ChainGrpcExchangeApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)

const injectiveAddress = 'inj...'

const feeDiscountAccountInfo =
  await chainGrpcExchangeApi.fetchFeeDiscountAccountInfo(injectiveAddress)

console.log(feeDiscountAccountInfo)
```

#### Fetch the details regarding the trading reward campaign, such as the total reward points

```ts
import { ChainGrpcExchangeApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)

const tradingRewardsCampaign =
  await chainGrpcExchangeApi.fetchTradingRewardsCampaign()

console.log(tradingRewardsCampaign)
```

#### Fetch the trading rewards points for an injective address

```ts
import { ChainGrpcExchangeApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)

const injectiveAddress = 'inj...'

const tradeRewardsPoints = await chainGrpcExchangeApi.fetchTradeRewardsPoints(
  injectiveAddress,
)

console.log(tradeRewardsPoints)
```

#### Fetch the pending trading rewards points for injective addresses

```ts
import { ChainGrpcExchangeApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)

const injectiveAddresses = ['inj...']

const pendingTradeRewardsPoints =
  await chainGrpcExchangeApi.fetchPendingTradeRewardPoints(injectiveAddresses)

console.log(pendingTradeRewardsPoints)
```

#### Fetch the current positions, such as subaccountId, marketId, and position

```ts
import { ChainGrpcExchangeApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)

const positions = await chainGrpcExchangeApi.fetchPositions(injectiveAddresses)

console.log(positions)
```

#### Fetch the subaccount trade nonce

```ts
import { ChainGrpcExchangeApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)

const subaccountId = '0x...'

const subaccountTradeNonce =
  await chainGrpcExchangeApi.fetchSubaccountTradeNonce(subaccountId)

console.log(subaccountTradeNonce)
```
