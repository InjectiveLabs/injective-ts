# Querying Indexer: Ninja

Example code snippets to query the indexer for the ninja vault module related data.

#### Using gRPC

* Get a vault based off it's contract address, such as the vault's tvl or profits

```ts
import { IndexerGrpcNinjaApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcNinjaApi = new IndexerGrpcNinjaApi(endpoints.ninjaApi)

const contractAddress = '0x...' /* optional param */
const slug = 'derivative-vault' /* optional param */

const vault = await indexerGrpcNinjaApi.fetchVault({
  contractAddress,
  slug
 })

console.log(vault)
```

* Get vaults and associated details

```ts
import { IndexerGrpcNinjaApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcNinjaApi = new IndexerGrpcNinjaApi(endpoints.ninjaApi)

const vault = await indexerGrpcNinjaApi.fetchVaults()

console.log(vault)
```

* Get the lp token price chart for a vault based on the vault address

```ts
import { IndexerGrpcNinjaApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcNinjaApi = new IndexerGrpcNinjaApi(endpoints.ninjaApi)

const vaultAddress = 'inj...'
const from = 50 /* optional pagination params */
const to = 150 /* optional pagination params */

const lpTokenPriceChart = await indexerGrpcNinjaApi.fetchLpTokenPriceChart({
  vaultAddress,
  from,
  to
})

console.log(lpTokenPriceChart)
```

* Get the tvl token chart for a vault based on the vault address

```ts
import { IndexerGrpcNinjaApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcNinjaApi = new IndexerGrpcNinjaApi(endpoints.ninjaApi)

const vaultAddress = 'inj...'
const from = 50 /* optional pagination params */
const to = 150 /* optional pagination params */

const tvlChart = await indexerGrpcNinjaApi.fetchTVLChartRequest({
  vaultAddress,
  from,
  to
})

console.log(tvlChart)
```

* Get the vaults associated with a holder of its lp tokens

```ts
import { IndexerGrpcNinjaApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcNinjaApi = new IndexerGrpcNinjaApi(endpoints.ninjaApi)

const holderAddress = 'inj...'

const vaults = await indexerGrpcNinjaApi.fetchVaultsByHolderAddress({
  holderAddress
})

console.log(vaults)
```

* Get the lp token holders from the vault address

```ts
import { IndexerGrpcNinjaApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcNinjaApi = new IndexerGrpcNinjaApi(endpoints.ninjaApi)

const vaultAddress = 'inj...'

const holders = await indexerGrpcNinjaApi.fetchLPHolders({
  vaultAddress
})

console.log(holders)
```

* Get the lp holder's portfolio

```ts
import { IndexerGrpcNinjaApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcNinjaApi = new IndexerGrpcNinjaApi(endpoints.ninjaApi)

const holderAddress = 'inj...'

const portfolio = await indexerGrpcNinjaApi.fetchHolderPortfolio(holderAddress)

console.log(portfolio)
```

* Get the leaderboard to see Pnl rankings

```ts
import { IndexerGrpcNinjaApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcNinjaApi = new IndexerGrpcNinjaApi(endpoints.ninjaApi)

const leaderboard = await indexerGrpcNinjaApi.fetchLeaderboard()

console.log(leaderboard)
```
