# WasmX

Example code snippets to query the wasmX module on chain

### Using gRPC

#### Fetch parameters related to the wasmX module

```ts
import { ChainGrpcWasmXApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmXApi = new ChainGrpcWasmXApi(endpoints.grpc)

const moduleParams = await chainGrpcWasmXApi.fetchModuleParams()

console.log(moduleParams)
```

#### Fetch the wasmX module state

```ts
import { ChainGrpcWasmXApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmXApi = new ChainGrpcWasmXApi(endpoints.grpc)

const moduleState = await chainGrpcWasmXApi.fetchModuleState()

console.log(moduleState)
```
