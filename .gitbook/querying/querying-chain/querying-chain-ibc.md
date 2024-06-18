# IBC

Example code snippets to query the chain for IBC related data.

### Using gRPC

#### Fetch denom trace from the IBC hash

```ts
import { ChainGrpcIbcApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcIbcApi = new ChainGrpcIbcApi(endpoints.grpc)
const hash = '...'

const denomTrace = await chainGrpcIbcApi.fetchDenomTrace(hash)

console.log(denomTrace)
```

#### Fetch list of denom traces

```ts
import { ChainGrpcIbcApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcIbcApi = new ChainGrpcIbcApi(endpoints.grpc)

const denomTraces = await chainGrpcIbcApi.fetchDenomsTrace()

console.log(denomTraces)
```
