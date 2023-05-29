# Querying Chain - Auth Module

Example code snippets to query the auth module on the chain.

#### Using gRPC

* Get parameters such as max memo characters or tsx signature limit

```ts
import { ChainGrpcAuthApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcAuthApi = new ChainGrpcAuthApi(endpoints.grpc)

const moduleParams = await chainGrpcAuthApi.fetchModuleParams()

console.log(moduleParams)
```

* Get account details associated with an injective address such as the account's address, sequence, or pub\_key

```ts
import { ChainGrpcAuthApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcAuthApi = new ChainGrpcAuthApi(endpoints.grpc)
const injectiveAddress = 'inj...'

const accountDetailsResponse = await chainGrpcAuthApi.fetchAccount(injectiveAddress)

console.log(accountDetailsResponse)
```

* Get a list of accounts on chain

```ts
import { PaginationOption, ChainGrpcAuthApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcAuthApi = new ChainGrpcAuthApi(endpoints.grpc)
const injectiveAddress = 'inj...'
const pagination = {...} as PaginationOption

const accounts = await chainGrpcAuthApi.fetchAccounts(/* optional pagination params*/)

console.log(accounts)
```

#### Using HTTP REST

* Get account details associated with an injective address such as the account's address, sequence, or pub\_key

```ts
import { ChainRestAuthApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainRestAuthApi = new ChainRestAuthApi(endpoints.rest)
const injectiveAddress = 'inj...'

const accountDetailsResponse = await chainRestAuthApi.fetchAccount(injectiveAddress)

console.log(accountDetailsResponse)
```

* Get cosmos address from an injective address

```ts
import { ChainRestAuthApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainRestAuthApi = new ChainRestAuthApi(endpoints.rest)
const injectiveAddress = 'inj...'

const cosmosAddress = await chainRestAuthApi.fetchCosmosAccount(injectiveAddress)

console.log(cosmosAddress)
```
