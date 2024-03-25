# Wasm

Example code snippets to query the wasm module on chain

### Using gRPC

#### Fetch contacts' account balance Note that pagination parameters can be passed to obtain additional accounts.

```ts
import { ChainGrpcWasmApi, PaginationOption } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const contractAddress = 'inj...'
const pagination = {...} as PaginationOption

const contractAccountsBalance = await chainGrpcWasmApi.fetchContractAccountsBalance({
    contractAddress,
    pagination /* optional pagination options */
})

console.log(contractAccountsBalance)
```

#### Fetch info related to a contract

```ts
import { ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const contractAddress = 'inj...'

const contractInfo = await chainGrpcWasmApi.fetchContractInfo(contractAddress)

console.log(contractInfo)
```

#### Fetch contract history

```ts
import { ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const contractAddress = 'inj...'

const contractHistory = await chainGrpcWasmApi.fetchContractHistory(
  contractAddress,
)

console.log(contractHistory)
```

#### Fetch the state of a smart contract

```ts
import { ChainGrpcWasmApi, toBase64 } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const contractAddress = 'inj...'
const query = '...'
const queryFromObject = toBase64({ get_coin: {} })

const contractState = await chainGrpcWasmApi.fetchSmartContractState({
  contractAddress,
  query /* optional string query - HAS to be in base64 or use queryFromObject */,
})

console.log(contractState)
```

#### Fetch the raw state of a smart contract

```ts
import { ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const contractAddress = 'inj...'
const query = '...'
const queryFromObject = toBase64({ get_coin: {} })

const rawContractState = await chainGrpcWasmApi.fetchRawContractState({
  contractAddress,
  query /* optional string query - HAS to be in base64 or use queryFromObject */,
})

console.log(rawContractState)
```

#### Fetch the codes associated with a contract

```ts
import { PaginationOption, ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const pagination = {...} as PaginationOption


const rawContractState = await chainGrpcWasmApi.fetchRawContractState(
pagination /* optional pagination options */
)

console.log(rawContractState)
```

#### Fetch info associated with a contract code

```ts
import { ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const codeId = 1

const codeDetails = await chainGrpcWasmApi.fetchContractCode(codeId)

console.log(codeDetails)
```

#### Fetch the contracts associated with a code

```ts
import { PaginationOption, ChainGrpcWasmApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const codeId = 1
const pagination = {...} as PaginationOption

const contracts = await chainGrpcWasmApi.fetchContractCodeContracts({
  codeId,
  pagination /* optional pagination options */
})

console.log(contracts)
```
