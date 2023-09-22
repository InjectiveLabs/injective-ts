# Injective Name Service

Within this section we are going to have a look how to query the Injective name service contracts.

## Querying

Example code snippets to resolve .inj domain name.

### Domain Resolution

* Get resolver address

```ts
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainId } from '@injectivelabs/ts-types'
import {
  ChainGrpcWasmApi,
  QueryResolverAddress,
  InjNameServiceQueryTransformer
  INJ_NAME_REGISTRY_CONTRACT_BY_NETWORK,
  INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_NETWORK,
} from '@injectivelabs/sdk-ts'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const registryContractAddress = INJ_NAME_REGISTRY_CONTRACT_BY_NETWORK[Network.Testnet]
const reverseResolverContractAddress =
  INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_NETWORK[Network.Testnet]
const node = ''

const query = new QueryResolverAddress({ node }).toPayload()

const response = await chainGrpcWasmApi.fetchSmartContractState(
  registryContractAddress,
  query,
)

const resolverAddress = InjNameServiceQueryTransformer.resolverAddressResponseToResolverAddress(response)

console.log(resolverAddress)
```

* Get address for .inj domain name.

```ts
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainId } from '@injectivelabs/ts-types'
import {
  nameToNode,
  normalizeName,
  ChainGrpcWasmApi,
  QueryInjectiveAddress,
  InjNameServiceQueryTransformer
  INJ_NAME_REGISTRY_CONTRACT_BY_NETWORK,
} from '@injectivelabs/sdk-ts'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const registryContractAddress = INJ_NAME_REGISTRY_CONTRACT_BY_NETWORK[Network.Testnet]
const name = 'allen.inj'
const resolverAddress = '' /** from above query */

const normalizedName = normalizeName(name)
const node = nameToNode(normalized)

const query = new QueryInjectiveAddress({ node }).toPayload()

const response = await chainGrpcWasmApi.fetchSmartContractState(
  resolverAddress,
  query,
)

const injectiveAddress = InjNameServiceQueryTransformer.injectiveAddressResponseToInjectiveAddress(response)

if (!injectiveAddress) {
  throw new Error(`address not found for ${name}`)
}

console.log(injectiveAddress)
```

### Reverse Resolution

* Get primary name for injective address.

```ts
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { ChainId } from '@injectivelabs/ts-types'
import {
  nameToNode,
  normalizeName,
  ChainGrpcWasmApi,
  QueryInjectiveAddress,
  InjNameServiceQueryTransformer
  INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_NETWORK,
} from '@injectivelabs/sdk-ts'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const reverseResolverContractAddress =
  INJ_NAME_REVERSE_RESOLVER_CONTRACT_BY_NETWORK[Network.Testnet]
const injectiveAddress = ''
const resolverAddress = '' /** from above query */

const query = new QueryInjName({ address: injectiveAddress }).toPayload()

const response = await chainGrpcWasmApi.fetchSmartContractState(
  reverseResolverContractAddress,
  query,
)

const name = InjNameServiceQueryTransformer.injectiveNameResponseToInjectiveName(response)

if (!name) {
  throw new Error(`.inj not found for ${injectiveAddress}`)
}

const addressForName = /** fetch as above example */

if (addressForName.toLowerCase() !== address.toLowerCase()) {
  throw new Error(`.inj not found for ${injectiveAddress}`)
}

console.log(name)
```
