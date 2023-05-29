# Querying Indexer: Insurance Funds

Example code snippets to query the indexer for insurance fund module related data.

#### Using gRPC

* Get redemptions for an injective address

```ts
import { IndexerGrpcInsuranceFundApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcInsuranceFundApi = new IndexerGrpcInsuranceFundApi(endpoints.indexer)

const injectiveAddress = 'inj...'

const redemptions = await indexerGrpcInsuranceFundApi.fetchRedemptions({ injectiveAddress })

console.log(redemptions)
```

* Get insurance funds

```ts
import { IndexerGrpcInsuranceFundApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcInsuranceFundApi = new IndexerGrpcInsuranceFundApi(endpoints.indexer)

const insuranceFunds = await indexerGrpcInsuranceFundApi.fetchInsuranceFunds()

console.log(insuranceFunds)
```
