# Technical Concepts

Learning these concepts can help you be a more efficient dApps developer on top of Injective. We'll keep the explanations brief so only the necessary context is shared with the reader. We encourage developers to explore these concepts more thoroughly at their own convenience.

### Sentry Node

Sentry node is a read-only full node running the Injective chain. A full node is a server running a chain's binary (its software) that fully validates transactions and blocks of a blockchain and keeps a full record of all historic activity. A full node is distinct from a pruned node that processes only block headers and a small subset of transactions. Running a full node requires more resources than a pruned node. Validators can decide to run either a full node or a pruned node, but they need to make sure they retain enough blocks to be able to validate new blocks.

We query the sentry node to get on-chain data served on our decentralized application.

### Indexer API

The Indexer API is a collection of microservices that serve data indexed from the Injective chain. The Injective Chain emits events when a transaction is included and there is an event listener within the Indexer API that listens for these events, processes them, and stores the data in a MongoDB. Querying the chain directly is an expensive (and less performant) API call than querying an API serving data from a MongoDB which is why the Indexer API exists.

Another benefit of using the Indexer API is streaming. MongoDB can stream updates in the collections/documents which can be quite beneficial for a nice user experience. This way we don't need to poll for the data, instead, we can subscribe for a stream and update the state of our dApp on updates broadcasted within the stream.

Finally, the Indexer API can serve historical data or processed data over a period of time (ex: for drawing charts, etc).

### Transactions

Learn more about making transactions on Injective [here](technical-concepts.md#transactions).

### Denom

A denom is how assets are represented within the Bank module of Injective. These assets can be used for trading, creating new markets on the exchange module, participating in auctions, transferring to another address, etc.

Depending on the origin of the denom and how it was created on Injective we have different types of denoms:

* **Native denoms** - there is only one denom of this type, the `inj` denom which represented the native coin of Injective,
* **Peggy denoms** - these denoms represent assets bridged over from Ethereum to Injective using the Peggy bridge. They have the following format `peggy{ERC20_CONTRACT_ADDRESS}`
* **IBC denoms** - these denoms represent assets bridged over from other Cosmos chains through IBC. They have the following format `ibc/{hash}`.
* **Insurance Fund Denoms** - these denoms represent token shares of the insurance funds created on Injective. They have the following format `share{id}`
* **Factory Denoms** - these denoms are a representation of a CW20 token from Cosmwasm on the Injective native bank module. They have the following format `factory/{CW20_ADAPTER_CONTRACT}/{CW20_CONTRACT_ADDRESS}` where the `CW20_ADAPTER_CONTRACT` is the adapter contract address which does the conversion between CW20 and the native Bank module.

### Token

Token is simply a denom on the Injective chain with some meta information. The metadata includes information like symbol, name, decimals, logo for the particular denom, etc. The metadata of the denom is quite important for a dApp developer as information on the chain is stored in its raw form (for example `1inj` on the chain is represented as `1*10^18inj`) so we need to have a way to show the user human-readable information (numbers, logo, symbol, etc). To convert a denom to a Token, we’ve built an abstraction class within the `sdk-ts` which uses the `token-metadata` package to convert known denoms to a Token representation.

### Trading Account

Subaccounts or Trading Accounts are a concept that allows you to decouple the funds in the native Injective Bank module (which can be used for staking, bidding on auctions, participating in governance, creating markets, etc) into an isolated trading account from which you can execute trades. One Injective address can have an unlimited number of trading accounts. The way they are represented is `${ethereumAddress}${subaccountNonce}` where the `ethereumAddress` is the `hex` version of the `bech32` Injective address and the `subaccountNonce` is the nonce represented in 12 bytes. An example trading account at nonce 1 would be `0xc7dca7c15c364865f77a4fb67ab11dc95502e6fe000000000000000000000001`.

Starting the v1.10.0 chain upgrade, the Bank balance and the default trading account (at nonce = 0) will be merged and the Bank funds will be directly used when executing trades originating from the default trading account.

### gRPC & Protobuf

gRPC is a modern open-source high-performance Remote Procedure Call (RPC) framework that can run in any environment. It can efficiently connect services in and across data centers with pluggable support for load balancing, tracing, health checking, and authentication. It is also applicable in the last mile of distributed computing to connect devices, mobile applications, and browsers to backend services.

Protobuf is the most commonly used IDL (Interface Definition Language) for gRPC. It's where you basically store your data and function contracts in the form of a proto file.

```proto
message Person {
    required string name = 1;
    required int32 id = 2;
    optional string email = 3;
}
```
