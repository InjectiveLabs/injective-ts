# Querying

There are 2 data sources that can be accessed through the `sdk-ts`:

* The Injective chain itself through a sentry node,
* The Indexer API (indexer of events from the Injective chain to a MongoDB),

For each of the data sources there are two ways that they can be queried:

* using the gRPC protocol,
* Using HTTP REST

We also have a GraphQL consumer of the Peggy subgraph on Ethereum (used only for tracking deposits and withdrawals on Ethereum).

For the 2 main data sources, there are abstraction classes that developers can use to access specific modules of the Injective Chain **or** specific modules within the Exchange API. The responses of these requests are always mapped into normal JavaScript objects (regardless of the data source type) and served to the end user.

***

### Topics

| Topic                                                                        | Description                         |
| ---------------------------------------------------------------------------- | ----------------------------------- |
| [Querying the Chain](querying-chain/)                                        | Querying data from the chain        |
| [Querying the Indexer API](querying-api/)                                    | Querying data from the Indexer API  |
| [Steaming from the Indexer API](querying-api/streaming-indexer-portfolio.md) | Streaming data from the Indexer API |
| [Querying Ethereum from the Graph](querying-ethereum.md)                     | Querying Ethereum via GraphQL       |
| [CosmWasm Query Payloads](querying-chain/querying-chain-cosmwasm.md)         | Get payloads for CosmWasm queries   |
