# Querying Chain: Peggy

Example code snippets to query the chain via the peggy api.

#### Using gRPC

* Get parameters related to peggy

```ts
import { ChainGrpcPeggyApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcPeggyApi = new ChainGrpcPeggyApi(endpoints.grpc)

const moduleParams = await chainGrpcPeggyApi.fetchModuleParams()

console.log(moduleParams)
```
