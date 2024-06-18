# Mint

Example code snippets to query the mint module on the chain.

### Using gRPC

#### Fetch parameters related to the mint module

```ts
import { ChainGrpcMintApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcMintApi = new ChainGrpcMintApi(endpoints.grpc)

const moduleParams = await chainGrpcMintApi.fetchModuleParams()

console.log(moduleParams)
```

#### Fetch inflation

```ts
import { ChainGrpcMintApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcMintApi = new ChainGrpcMintApi(endpoints.grpc)

const inflation = await chainGrpcMintApi.fetchInflation()

console.log(inflation)
```

#### Fetch the annual provisions

```ts
import { ChainGrpcMintApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcMintApi = new ChainGrpcMintApi(endpoints.grpc)

const annualProvisions = await chainGrpcMintApi.fetchAnnualProvisions()

console.log(annualProvisions)
```
