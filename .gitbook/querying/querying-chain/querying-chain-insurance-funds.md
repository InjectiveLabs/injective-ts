# Querying Chain: Insurance Funds

Example code snippets to query data related to the insurance fund on chain.

#### Using gRPC

* Get the default redemption notice period duration

```ts
import { ChainGrpcInsuranceFundApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcInsuranceFundApi = new ChainGrpcInsuranceFundApi(endpoints.grpc)

const moduleParams = await chainGrpcInsuranceFundApi.fetchModuleParams()

console.log(moduleParams)
```

* Get the list insurance funds and associated metadata

```ts
import { ChainGrpcInsuranceFundApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcInsuranceFundApi = new ChainGrpcInsuranceFundApi(endpoints.grpc)

const insuranceFunds = await chainGrpcInsuranceFundApi.fetchInsuranceFunds()

console.log(insuranceFunds)
```

* Get the insurance fund and associated metadata based on the market ID

```ts
import { ChainGrpcInsuranceFundApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcInsuranceFundApi = new ChainGrpcInsuranceFundApi(endpoints.grpc)

const marketId = '0x...'
const insuranceFund = await chainGrpcInsuranceFundApi.fetchInsuranceFund(marketId)

console.log(insuranceFund)
```

* Get the estimated redemptions for a given injective address for a market

```ts
import { ChainGrpcInsuranceFundApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcInsuranceFundApi = new ChainGrpcInsuranceFundApi(endpoints.grpc)

const marketId = '0x...'
const injectiveAddress = 'inj...'

const estimatedRedemptions = await chainGrpcInsuranceFundApi.fetchEstimatedRedemptions({
  marketId,
  address: injectiveAddress
})

console.log(estimatedRedemptions)
```

* Get the pending redemptions for a given injective address for a market

```ts
import { ChainGrpcInsuranceFundApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcInsuranceFundApi = new ChainGrpcInsuranceFundApi(endpoints.grpc)

const marketId = '0x...'
const injectiveAddress = 'inj...'

const pendingRedemptions = await chainGrpcInsuranceFundApi.fetchPendingRedemptions({
  marketId,
  address: injectiveAddress
})

console.log(pendingRedemptions)
```
