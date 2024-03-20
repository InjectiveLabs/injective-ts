# Insurance Funds

Example code snippets to query the indexer for insurance fund module related data.

### Using gRPC

#### Fetch redemptions for an injective address

```ts
import { IndexerGrpcInsuranceFundApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcInsuranceFundApi = new IndexerGrpcInsuranceFundApi(
  endpoints.indexer,
)

const injectiveAddress = 'inj...'

const redemptions = await indexerGrpcInsuranceFundApi.fetchRedemptions({
  injectiveAddress,
})

console.log(redemptions)
```

#### Fetch insurance funds

```ts
import { IndexerGrpcInsuranceFundApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcInsuranceFundApi = new IndexerGrpcInsuranceFundApi(
  endpoints.indexer,
)

const insuranceFunds = await indexerGrpcInsuranceFundApi.fetchInsuranceFunds()

console.log(insuranceFunds)
```
