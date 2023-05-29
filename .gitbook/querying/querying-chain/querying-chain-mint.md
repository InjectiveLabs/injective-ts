# Querying Chain: Mint

Example code snippets to query the mint module on the chain.

#### Using gRPC

* Get parameters related to the mint module

```ts
import { ChainGrpcMintApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcMintApi = new ChainGrpcMintApi(endpoints.grpc)

const moduleParams = await chainGrpcMintApi.fetchModuleParams()

console.log(moduleParams)
```

* Get the inflation

```ts
import { ChainGrpcMintApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcMintApi = new ChainGrpcMintApi(endpoints.grpc)

const inflation = await chainGrpcMintApi.fetchInflation()

console.log(inflation)
```

* Get the annual provisions

```ts
import { ChainGrpcMintApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcMintApi = new ChainGrpcMintApi(endpoints.grpc)

const annualProvisions = await chainGrpcMintApi.fetchAnnualProvisions()

console.log(annualProvisions)
```
