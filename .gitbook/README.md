# Getting Started

The purpose of this Wiki is to help developers build decentralized applications on top of Injective. Let's dive a bit deeper into each section and explain its purpose so its easier to get the bigger picture.

_Note: It is highly recommended to read the Technical Concepts section after reading the overview below. There are some concepts that can have a bit steeper learning curve than others, so we recommend going through them to understand a bit more about Injective._

* [Wallets](wallet/) - In this section we are going to explain (in technical terms) how Accounts are derived on Injective, how you can connect your wallet straight from the dApp itself and finally have a look at the **WalletStrategy** - a package built by the InjectiveLabs team which offers out of the box solution for offering multiple wallet solutions to the user to connect and interact with your dApp.
* [Querying](querying/) - In this section we are going to explore different ways to obtain data from different data sources needed to build your dApps. First, we are going to see how to query the chain directly and then we are going to explore the Indexer API - an indexer solution for easier data access/streaming including historical data.
* [Transactions](./#transactions) - In this section we are going to explore different ways on how to make transactions on Injective. First, we are going to explain (in technical terms) how Transactions work on Injective and some technical concepts around them and then we are going to have a look how to prepare, sign and broadcast transactions on Injective in several ways. There are couple of ways in doing this.
  1. Using the Cosmos native approach in creating a transaction, sign it using a **Cosmos native wallet** and broadcast it to Injective,
  2. Using the Ethereum native approach in creating a transaction using EIP712 typed data, sign it using an **Ethereum native wallet** and broadcast it to Injective,
  3. Using the Ethereum native approach in creating a transaction using EIP712 typed data, sign it using a **Ledger device** and broadcast it to Injective,
  4. Using the Cosmos native approach in creating a transaction, sign it using a **raw PrivateKey** and broadcast it to Injective,
  5. Using the Web3Gateway microservice - an API which provides fee delegation services.
* [Core Modules](core-modules/) - In this section we are going to have a quick summary of the core modules on Injective and show examples on how to create some Messages (+ pack them into a transaction, sign them using a private key and broadcast them on Injective) within these core modules.
* [Bridge](bridge/) - In this section we are going to have a look at Injective's interoperability and explain how developers can utilize the Peggy bridge and the IBC bridge to bridge assets over to Injective.
* [Networks](networks.md) - In this section we are going to have a look at different (pre-defined) available Networks for developers to utilize while building dApps on top of Injective allowing them to start building without the need to make their own infrastructure.

### Technical Concepts

Learning these concepts can help you be a more efficient dApps developer on top of Injective. We'll keep the explanations brief so only the necessary context is shared with the reader. We encourage developers to explore these concepts more thoroughly at their own convenience.

#### Sentry Node

Sentry node is a readonly full node running the Injective chain. A full node is a server running a chain's binary (its software) that fully validates transactions and blocks of a blockchain and keeps a full record of all historic activity. A full node is distinct from a pruned node that processes only block headers and a small subset of transactions. Running a full node requires more resources than a pruned node. Validators can decide to run either a full node or a pruned node, but they need to make sure they retain enough blocks to be able to validate new blocks.

We query the sentry node to get on-chain data served on our decentralized application.

#### Indexer API

The Indexer API is a collection of microservices which serve data indexed from the Injective chain. The Injective Chain emits events when a transaction in included and there is an event listener within the Indexer API that listens for these events, processes them and stores the data in a MongoDB. Querying the chain directly is an expensive (and less performant) API call than querying an API serving data from a MongoDB which is why the Indexer API exists.

Another benefit of using the Indexer API is streaming. MongoDB can stream updates in the collections/documents which can be quite beneficial for a nice user experience. This way we don't need to poll for the data, instead, we ca subscribe for a stream and update the state of our dApp on updates broadcasted within the stream.

Finally, the Indexer API can serve historical data or processed data over period of time (ex: for drawing charts, etc).

#### Transactions

Learn more about making transactions on Injective [here](./#transactions).

#### Denom

A denom is how assets are represented within the Bank module of Injective. These assets can be used for trading, creating new markets on the exchange module, participate in auction, transfer to another address, etc.

Depending of the origin of the denom and how it was created on Injective we have different types of denoms:

* **Native denoms** - there is only one denom of this type, the `inj` denom which represented the native coin of Injective,
* **Peggy denoms** - these denoms represent assets bridged over from Ethereum to Injective using the Peggy bridge. They have the following format `peggy{ERC20_CONTRACT_ADDRESS}`
* **IBC denoms** - these denoms represent assets bridged over from other Cosmos chains through IBC. They have the following format `ibc/{hash}`.
* **Insurance Fund Denoms** - these denoms represent token shares of the insurance funds created on Injective. The have the following format `share{id}`
* **Factory Denoms** - these denoms are a representation of a CW20 token from Cosmwasm on the Injective native bank module. They have the following format `factory/{CW20_ADAPTER_CONTRACT}/{CW20_CONTRACT_ADDRESS}` where the `CW20_ADAPTER_CONTRACT` is the adapter contract address which does the conversion between CW20 and the native Bank module.

#### Token

Token is simply a denom on the Injective chain with some meta information. The metadata includes information like symbol, name, decimals, logo for the particular denom, etc. The metadata of the denom is quite important for a dApp developer as information on the chain is stored in its raw form (for example `1inj` on the chain is represented as `1*10^18inj`) so we need to have a way to show the user a human-readable information (numbers, logo, symbol, etc). To convert a denom to a Token, we’ve build an abstraction class within the `sdk-ts` which uses the `token-metadata` package to convert known denoms to a Token representation.

#### Trading Account

Subaccounts or Trading Accounts are a concept that allows you to decouple the funds in the native Injective Bank module (which can be used for staking, bidding on auction, participating in governance, creating markets, etc) into an isolated trading account from which you can execute trades. One Injective address can have unlimited number of trading accounts. The way they are represented is `${ethereumAddress}${subaccountNonce}` where the `ethereumAddress` is the `hex` version of the `bech32` Injective address and the `subaccountNonce` is the nonce represented in 12 bytes. An example trading account at nonce 1 would be `0xc7dca7c15c364865f77a4fb67ab11dc95502e6fe000000000000000000000001`.

Starting the v1.10.0 chain upgrade, the Bank balance and the default trading account (at nonce = 0) will be merged and the Bank funds will be directly used when executing trades originating from the default trading account.

#### gRPC & Protobuf

gRPC is a modern open source high performance Remote Procedure Call (RPC) framework that can run in any environment. It can efficiently connect services in and across data centers with pluggable support for load balancing, tracing, health checking and authentication. It is also applicable in last mile of distributed computing to connect devices, mobile applications and browsers to backend services.

Protobuf is the most commonly used IDL (Interface Definition Language) for gRPC. It's where you basically store your data and function contracts in the form of a proto file.

```proto
message Person {
    required string name = 1;
    required int32 id = 2;
    optional string email = 3;
}
```

### Application Concepts

In this section we are going to explain some application (Injective) specific concepts.

#### Token Factory

The Token Factory module on Injective which allows users and contracts to create new native tokens and swap native tokens with CW20 tokens using the Mint + Burn model. This is an important feature to have on chain because representing assets from different sources to a native bank denom is crucial to allow users to access the rest of the on-chain modules like exchange, auction, insurance funds, etc. The token factory denoms are in the following format `factory/{creator address}/{subdenom}`.

Combined with the `CW20AdapterContract` which acts as an creator, we allow CW20 assets to be natively represented on Injective as Token Factory denoms. The way it works is that CW20 assets are held by the `CW20AdapterContract` and minted as a factory denom for the injective address and when we want to redeem them back to CW20, they are burned from the bank module and unlocked from the `CW20AdapterContract` back to the owner address.

Example on how to redeem a factory denom to CW20:

```ts
import { MsgExecuteContractCompat, ExecArgCW20AdapterRedeemAndTransfer } from '@injectivelabs/sdk-ts'

const CW20_ADAPTER_CONTRACT = 'inj...'
const contractCw20Address = 'inj...'
const injectiveAddress = 'inj...'

const message = MsgExecuteContractCompat.fromJSON({
  sender: injectiveAddress,
  contractAddress: CW20_ADAPTER_CONTRACT,
  funds: {
    denom: `factory/${CW20_ADAPTER_CONTRACT}/${contractCw20Address}`,
    amount: actualAmount.toFixed()
  },
  execArgs: ExecArgCW20AdapterRedeemAndTransfer.fromJSON({
    recipient: injectiveAddress
  })
})

// Then pack the message in a transaction, sign it and broadcast to the chain
```

Example on how to convert CW20 to a factory denom:

```ts
import { MsgExecuteContractCompat, ExecArgCW20Send } from '@injectivelabs/sdk-ts'

const CW20_ADAPTER_CONTRACT = 'inj...'
const contractCw20Address = 'inj...'
const injectiveAddress = 'inj...'
const amount = '1000000' // 1 USDT represented as on the chain as it has 6 decimals

const message = MsgExecuteContractCompat.fromJSON({
  contractAddress: contractCw20Address,
  sender: injectiveAddress,
  execArgs: ExecArgCW20Send.fromJSON({
    amount,
    contractAddress: CW20_ADAPTER_CONTRACT
  })
})

// Then pack the message in a transaction, sign it and broadcast to the chain
```
