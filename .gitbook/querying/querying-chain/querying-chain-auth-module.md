# Auth

Example code snippets to query the auth module on the chain.

### Using gRPC

#### Fetch parameters such as max memo characters or tsx signature limit

```ts
import { ChainGrpcAuthApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcAuthApi = new ChainGrpcAuthApi(endpoints.grpc)

const moduleParams = await chainGrpcAuthApi.fetchModuleParams()

console.log(moduleParams)
```

#### Fetch ccount details associated with an injective address such as the account's address, sequence, or pub\_key

```ts
import { ChainGrpcAuthApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcAuthApi = new ChainGrpcAuthApi(endpoints.grpc)
const injectiveAddress = 'inj...'

const accountDetailsResponse = await chainGrpcAuthApi.fetchAccount(
  injectiveAddress,
)

console.log(accountDetailsResponse)
```

#### Fetch list of accounts on chain

```ts
import { PaginationOption, ChainGrpcAuthApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcAuthApi = new ChainGrpcAuthApi(endpoints.grpc)
const injectiveAddress = 'inj...'
const pagination = {...} as PaginationOption

const accounts = await chainGrpcAuthApi.fetchAccounts(/* optional pagination params*/)

console.log(accounts)
```

### Using HTTP REST

#### Fetch account details associated with an injective address such as the account's address, sequence, or pub\_key

```ts
import { ChainRestAuthApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainRestAuthApi = new ChainRestAuthApi(endpoints.rest)
const injectiveAddress = 'inj...'

const accountDetailsResponse = await chainRestAuthApi.fetchAccount(
  injectiveAddress,
)

console.log(accountDetailsResponse)
```

#### Fetch cosmos address from an injective address

```ts
import { ChainRestAuthApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainRestAuthApi = new ChainRestAuthApi(endpoints.rest)
const injectiveAddress = 'inj...'

const cosmosAddress = await chainRestAuthApi.fetchCosmosAccount(
  injectiveAddress,
)

console.log(cosmosAddress)
```
