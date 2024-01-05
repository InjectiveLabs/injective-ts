# Markets

Example code snippets to query the indexer for all markets data

### Using HTTP REST

- get the marketsHistory resolution: MARKETS_HISTORY_CHART_ONE_HOUR, countback: MARKETS_HISTORY_CHART_SEVEN_DAYS

```ts
import { IndexerRestMarketChronosApi } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerRestMarketChronosApi = new IndexerRestMarketChronosApi(
  `${endpoints.chronos}/api/chronos/v1/market`,
)

const SelectList = {
  Hour: '60',
  Day: '1d',
  Week: '7d',
}

const marketIds = ['0x']
const countback = 154 // in unit of hours
const resolution = SelectList.Day

const marketsHistory = await indexerRestMarketChronosApi.fetchMarketsHistory({
  marketIds,
  resolution,
  countback,
})

console.log(marketsHistory)
```
