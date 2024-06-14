# Ethereum (GraphQL)

Example code snippets to query data from Ethereum.

### Using GraphQL

#### Fetch user's deposits on Ethereum chain

```ts
import { ApolloConsumer } from '@injectivelabs/sdk-ts'
import {
  Network,
  getNetworkEndpoints,
  getPeggyGraphQlEndpointForNetwork,
} from '@injectivelabs/networks'

const apolloConsumer = new ApolloConsumer(
  getPeggyGraphQlEndpointForNetwork(Network.Testnet),
)

const ethereumAddress = '0x...'

const userDeposits = apolloConsumer.fetchUserDeposits(ethereumAddress)

console.log(userDeposits)
```

#### Fetch user's deposits on Ethereum chain at a specific time

```ts
import { ApolloConsumer } from '@injectivelabs/sdk-ts'
import {
  Network,
  getNetworkEndpoints,
  getPeggyGraphQlEndpointForNetwork,
} from '@injectivelabs/networks'

const apolloConsumer = new ApolloConsumer(
  getPeggyGraphQlEndpointForNetwork(Network.Testnet),
)

const ethereumAddress = '0x...'
const timestamp = 13434333

const userDeposits = apolloConsumer.fetchUserBridgeDeposits(
  ethereumAddress,
  timestamp,
)

console.log(userDeposits)
```
