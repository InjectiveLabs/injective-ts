# Querying Chain: IBC

Example code snippets to query the chain for IBC related data.

#### Using gRPC

* Get the denom trace from the IBC hash

```ts
import { ChainGrpcIbcApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcIbcApi = new ChainGrpcIbcApi(endpoints.grpc)
const hash = '...'

const denomTrace = await chainGrpcIbcApi.fetchDenomTrace(hash)

console.log(denomTrace)
```

* Get a list of denom traces

```ts
import { ChainGrpcIbcApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcIbcApi = new ChainGrpcIbcApi(endpoints.grpc)

const denomTraces = await chainGrpcIbcApi.fetchDenomsTrace()

console.log(denomTraces)
```
