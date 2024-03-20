# Token Factory

Example code snippets to query the chain for token factory module related data.

### Using gRPC

#### Fetch all denoms created by _creator_

<pre class="language-ts"><code class="lang-ts"><strong>import { ChainGrpcTokenFactoryApi } from '@injectivelabs/sdk-ts'
</strong>import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcTokenFactoryApi = new ChainGrpcTokenFactoryApi(endpoints.grpc)

const creator = 'inj...'
const denoms = await chainGrpcTokenFactoryApi.fetchDenomsFromCreator(creator)

console.log(denoms)
</code></pre>

#### Fetch denom authority metadata (i.e fetch admin of a token)

```ts
import { ChainGrpcTokenFactoryApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const chainGrpcTokenFactoryApi = new ChainGrpcTokenFactoryApi(endpoints.grpc)

const creator = 'inj...'
const subdenom = 'NINJA'
const metadata = await chainGrpcTokenFactoryApi.fetchDenomAuthorityMetadata(
  creator,
  subdenom,
)

console.log(metadata)
```
