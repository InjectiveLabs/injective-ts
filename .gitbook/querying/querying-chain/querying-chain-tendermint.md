# Querying Chain: Tendermint

Example code snippets to query for chain node related data.

#### Using HTTP REST

* get latest block info

```ts
import { ChainRestTendermintApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainRestTendermintApi = new ChainRestTendermintApi(endpoints.rest)

const latestBlock = await chainRestTendermintApi.fetchLatestBlock()

console.log(latestBlock)
```

* get chain node info

```ts
import { ChainRestTendermintApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const chainRestTendermintApi = new ChainRestTendermintApi(endpoints.rest)

const nodeInfo = await chainRestTendermintApi.fetchNodeInfo()

console.log(nodeInfo)
```
