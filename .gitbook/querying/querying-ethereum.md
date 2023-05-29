# Querying: Ethereum

### Querying Ethereum

Example code snippets to query data from Ethereum.

#### Using GraphQL

* Get the user's deposits on ethereum chain

```ts
import { ApolloConsumer } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { peggyGraphQlEndpointForNetwork } from '@injectivelabs/sdk-ui-ts'

const apolloConsumer = new ApolloConsumer(peggyGraphQlEndpointForNetwork(Network.TestnetK8s))

const ethereumAddress = '0x...'

const userDeposits = apolloConsumer.fetchUserDeposits(ethereumAddress)

console.log(userDeposits)
```

* Get the user's deposits on ethereum chain at a specific time

```ts
import { ApolloConsumer } from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { peggyGraphQlEndpointForNetwork } from '@injectivelabs/sdk-ui-ts'

const apolloConsumer = new ApolloConsumer(peggyGraphQlEndpointForNetwork(Network.TestnetK8s))

const ethereumAddress = '0x...'
const timestamp = 13434333

const userDeposits = apolloConsumer.fetchUserBridgeDeposits(ethereumAddress, timestamp)

console.log(userDeposits)
```
