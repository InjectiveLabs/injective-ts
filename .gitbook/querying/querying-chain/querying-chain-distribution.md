# Querying Chain: Distribution

Example code snippets to query data related to delegating to validators from the chain.

#### Using gRPC

* Get parameters such as the base and bonus proposer reward

```ts
import { ChainGrpcDistributionApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcDistributionApi = new ChainGrpcDistributionApi(endpoints.grpc)

const moduleParams = await chainGrpcDistributionApi.fetchModuleParams()

console.log(moduleParams)
```

* Get the amount and denom of rewards for a delegator delagating to a specific validator

```ts
import { ChainGrpcDistributionApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcDistributionApi = new ChainGrpcDistributionApi(endpoints.grpc)

const delegatorAddress = 'inj...'
const validatorAddress = 'injvaloper...'

const delegatorRewardsFromValidator = await chainGrpcDistributionApi.fetchDelegatorRewardsForValidatorNoThrow({
  delegatorAddress,
  validatorAddress
})

console.log(delegatorRewardsFromValidator)
```

* Get the amount and denom of all rewards for a delegator

```ts
import { ChainGrpcDistributionApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainGrpcDistributionApi = new ChainGrpcDistributionApi(endpoints.grpc)

const delegatorAddress = 'inj...'

const totalDelegatorRewards = await chainGrpcDistributionApi.fetchDelegatorRewardsNoThrow(delegatorAddress)

console.log(totalDelegatorRewards)
```
