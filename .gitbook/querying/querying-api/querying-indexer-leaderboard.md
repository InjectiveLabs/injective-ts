# Querying Indexer: Leaderboard

Example code snippets to query the indexer for leaderboard module related data.

#### Using HTTP REST

* get the leaderboard

```ts
import { IndexerRestLeaderboardChronosApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.TestnetK8s)
const indexerGrpcExplorerApi = new IndexerRestLeaderboardChronosApi(`${endpoints.chronos}/api/chronos/v1/leaderboard`)

const SelectList = {
  Day: '1d',
  Week: '7d'
}

const resolution = SelectList.Day

const leaderboard = await indexerGrpcExplorerApi.fetchLeaderboard(resolution)

console.log(leaderboard)
```
