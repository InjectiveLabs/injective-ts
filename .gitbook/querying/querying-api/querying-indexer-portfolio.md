# Portfolio

Example code snippets to query the indexer for portfolio module related data.

### Using gRPC

#### Fetch portfolio based on injective address, such as bank balances and subaccount balances

<pre class="language-ts"><code class="lang-ts"><strong>import { IndexerGrpcAccountPortfolioApi } from '@injectivelabs/sdk-ts'
</strong>import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Testnet)
const indexerGrpcAccountPortfolioApi = new IndexerGrpcAccountPortfolioApi(
  endpoints.indexer,
)

const injectiveAddress = 'inj...'

const portfolio = await indexerGrpcAccountPortfolioApi.fetchAccountPortfolioBalances(
  injectiveAddress,
)

console.log(portfolio)
</code></pre>
