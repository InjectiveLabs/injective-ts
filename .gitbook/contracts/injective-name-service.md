# Injective Name Service

Within this section, we will look at how to query the Injective name service contracts.

## Abstraction Service

You can use our `InjNameService` [abstraction](../../packages/sdk-ui-ts/src/services/nameservice/InjNameService.ts) to query the smart contracts with a single method call. Below this example, you can also find the raw implementation on how to query the smart contracts in case you need more flexibility.&#x20;

<pre class="language-typescript"><code class="lang-typescript">import { getNetworkEndpoints, Network } from '@injectivelabs/network'
import { InjNameService } from '@injectivelabs/sdk-ui-ts'

const injNameService = new InjNameService(Network.Testnet)
<strong>const name = 'ninja.inj'
</strong>
// Fetch the address for the particular name
const addressForName = await injNameService.fetchInjAddress(name)

// Fetch the name for the particular address
const nameFromAddress = await injNameService.fetchInjName(addressForName)
</code></pre>

## Raw Smart Contract Querying

Example code snippets to resolve .inj domain name.

### Domain Resolution

* Get resolver address

```ts
import {
  Network,
  getNetworkEndpoints,
  getInjNameRegistryContractForNetwork
} from '@injectivelabs/networks'
import {
  ChainGrpcWasmApi,
  QueryResolverAddress,
  InjNameServiceQueryTransformer
} from '@injectivelabs/sdk-ts'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const registryContractAddress = getInjNameRegistryContractForNetwork(
  Network.Testnet
)

const node = ''

const query = new QueryResolverAddress({ node }).toPayload()

const response = await chainGrpcWasmApi.fetchSmartContractState(
  registryContractAddress,
  query
)

const resolverAddress =
  InjNameServiceQueryTransformer.resolverAddressResponseToResolverAddress(
    response
  )

console.log(resolverAddress)
```

* Get address for .inj domain name.

```ts
import {
  Network,
  getNetworkEndpoints,
  getInjNameReverseResolverContractForNetwork
} from '@injectivelabs/networks'
import {
  ChainGrpcWasmApi,
  QueryInjectiveAddress,
  InjNameServiceQueryTransformer
} from '@injectivelabs/sdk-ts'
import { nameToNode, normalizeName } from '@injectivelabs/sdk-ui-ts'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const reverseResolverContractAddress =
  getInjNameReverseResolverContractForNetwork(Network.Testnet)

const name = 'allen.inj'

const normalizedName = normalizeName(name)
const node = nameToNode(normalizedName)

const query = new QueryInjectiveAddress({ node }).toPayload()

const response = await chainGrpcWasmApi.fetchSmartContractState(
  reverseResolverContractAddress,
  query
)

const injectiveAddress =
  InjNameServiceQueryTransformer.injectiveAddressResponseToInjectiveAddress(
    response
  )

if (!injectiveAddress) {
  throw new Error(`address not found for ${name}`)
}

console.log(injectiveAddress)
```

### Reverse Resolution

* Get the primary name for injective address.

```ts
import {
  QueryInjName,
  ChainGrpcWasmApi,
  InjNameServiceQueryTransformer
} from '@injectivelabs/sdk-ts'
  import {
  Network,
  getNetworkEndpoints,
  getInjNameReverseResolverContractForNetwork
} from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcWasmApi = new ChainGrpcWasmApi(endpoints.grpc)

const reverseResolverContractAddress =
  getInjNameReverseResolverContractForNetwork(Network.Testnet)
const injectiveAddress = ''

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
