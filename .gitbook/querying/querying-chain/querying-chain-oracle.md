# Querying Chain: Oracle

Example code snippets to query the chain via the oracle api.

#### Using gRPC

* Get parameters related to the oracle

```ts
import { ChainGrpcOracleApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcOracleApi = new ChainGrpcOracleApi(endpoints.grpc)

const moduleParams = await chainGrpcOracleApi.fetchModuleParams()

console.log(moduleParams)
```
