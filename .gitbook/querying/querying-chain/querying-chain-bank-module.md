# Querying Chain: Bank Module

Example code snippets to query the chain for bank module related data.

#### Using gRPC

* Get bank module params

```ts
import { ChainGrpcBankApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc)

const moduleParams = await chainGrpcBankApi.fetchModuleParams()

console.log(moduleParams)
```

* Fetching injective address's balances

```ts
import { ChainGrpcBankApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc)

const injectiveAddress = 'inj...'

const balances = await chainGrpcBankApi.fetchBalances(injectiveAddress)

console.log(balances)
```

* Fetching cosmos address' balances per base denom

```ts
import { ChainGrpcBankApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc)

const injectiveAddress = 'inj1' /* example is using Cosmos Hub */
const denom = 'inj'

const balance = await chainGrpcBankApi.fetchBalance({
  accountAddress: injectiveAddress,
  denom
})

console.log(balance)
```

* Fetching total supply on chain

```ts
import { PaginationOption, ChainGrpcBankApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcBankApi = new ChainGrpcBankApi(endpoints.grpc)

const pagination = {...} as PaginationOption

const totalSupply = await chainGrpcBankApi.fetchTotalSupply(
  pagination /* optional pagination parameter */
)

console.log(totalSupply)
```

#### Using HTTP REST

* Fetching address's balances

```ts
import { ChainRestBankApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainRestBankApi = new ChainRestBankApi(endpoints.rest)

const injectiveAddress = 'inj...'

const balances = await chainGrpcBankApi.fetchBalances(injectiveAddress)

console.log(balances)
```

* Fetching cosmos address' balances per base denom

```ts
import { ChainRestBankApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainRestBankApi = new ChainRestBankApi(endpoints.rest)

const cosmosAddress = 'cosmos...' /* example is using Cosmos Hub */
const denom = 'uatom'

const balance = await chainGrpcBankApi.fetchBalance(cosmosAddress, denom)

console.log(balance)
```
