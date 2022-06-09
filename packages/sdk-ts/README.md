# 🌟 Injective Protocol - SDK TS

[![downloads](https://img.shields.io/npm/dm/@injectivelabs/sdk-ts.svg)](https://www.npmjs.com/package/@injectivelabs/sdk-ts)
[![npm-version](https://img.shields.io/npm/v/@injectivelabs/sdk-ts.svg)](https://www.npmjs.com/package/@injectivelabs/sdk-ts)
[![license](https://img.shields.io/npm/l/express.svg)]()

_Accessing decentralized finance through TypeScript (for Web and Node environment)_

`@injectivelabs/sdk-ts` is a TypeScript SDK for writing applications on top of the Injective chain in both a Node.js and a browser environment.

<p align="center">
  <a href="#"><strong>Documentation</strong></a>
  ·
  <a href="https://github.com/InjectiveLabs/sdk-ts-examples">Examples</a>
  ·
  <a href="#">API Reference</a>
  ·
  <a href="https://www.npmjs.com/package/@injectivelabs/sdk-ts">NPM Package</a>
  ·
  <a href="https://github.com/injectivelabs/sdk-ts">GitHub</a>
</p>

### ✨ Features

- **Written in TypeScript**, with type definitions,
- Works in Node.js and in the browser,
- Exposes on-chain data and the exchange-api data,
- Parses responses into native JavaScript types
- much more ...

We highly suggest using the `@injectivelabs/sdk-ts` with TypeScript, or JavaScript in a code editor that has support for type declarations, so you can take advantage of the helpful type hints that are included with the package.


### 📚 Installation

```bash
yarn add @injectivelabs/sdk-ts
```

---

## 📖 Documentation

There are two pieces of the `sdk-ts` - **querying a data source** and **making transactions**.

### Querying a data source

There are 2 data sources that can be accessed through the `sdk-ts`:

- The Injective chain itself through a sentry node,
- The Exchange API indexer (indexer of events from the Injective chain to a MongoDB),

For each of the data sources there are two ways that they can be queried:

- using the gRPC protocol,
- using REST

We also have a GraphQL consumer of the Peggy subgraph on Ethereum (used only for tracking deposits and withdrawals on Ethereum).

For the 2 main data sources, there are abstraction classes that developers can use to access specific modules of the Injective Chain **or** specific modules within the Exchange API. The responses of these requests are always mapped into normal JavaScript objects (regardless of the data source type) and served to the end user.

### Making Transactions

To interact with Injective, the user has to issue a transaction. Each transaction that is broadcasted to Injective can hold multiple messages that can change the state of the Injective chain. Within the `core` folder, developers can find a convenient way to make these messages with methods that can convert these messages in a way that they can be used by developers in different scenarios (broadcasting using the normal cosmos way or converted to EIP712 to be signed using Ethereum wallets).

Every message extends the `MsgBase` interface, which has couple of mapping functionalities:
- `toData` -> Converts the Message to a simple Object representation,
- `toProto` -> Returns a proto representation of the Message,
- `toDirectSign` -> Converts the Message to a proto representation (ready to be used in the normal Cosmos way of handling transactions),
- `toWeb3` -> Converts the Message to a web3 representation + type (ready to be used in the Ethereum way of handling transactions using EIP712 typed data),

There are also some utility classes and functions that are exposed from the package. There is also a `local` folder that exposes some utility classes that can be used to make developers life easier in a Node environment.

---

## 🎒 Usage

Let's go through couple of use-cases of the `sdk-ts` so developers can have a reference codebase that they can look at.

### Consuming data

- Fetching user's inj balance from the chain

```ts
import { getNetworkInfo, Network } from "@injectivelabs/networks";
import { ExchangeGrpcClient } from "@injectivelabs/sdk-ts/dist/client/exchange/ExchangeGrpcClient";

(async () => {
  const network = getNetworkInfo(Network.TestnetK8s);
  const injectiveAddress = "inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku";
  const chainClient = new ExchangeGrpcClient(
    network.sentryGrpcApi
  );

  const balances = await chainClient.bank.fetchBalances(
    injectiveAddress
  );
  const injBalance = balances.find(balace => balance.denom === 'inj')

  console.log(injBalance);
})();

```

- Fetching user's subaccount balance from the exchange api

```ts
import { getNetworkInfo, Network } from "@injectivelabs/networks";
import { ChainGrpcClient } from "@injectivelabs/sdk-ts/dist/client/chain/ChainGrpcClient";

(async () => {
  const network = getNetworkInfo(Network.TestnetK8s);
  const subaccountId = "0xaf79152ac5df276d9a8e1e2e22822f9713474902000000000000000000000000";
  const exchangeClient = new ChainGrpcClient(
    network.exchangeApi
  );

  const subaccountBalancesList = await exchangeClient.account.fetchSubaccountBalancesList(
    subaccountId
  );

  console.log(subaccountBalancesList);
})();
```

```ts
// Importing only the needed API
import { ChainClient, Network } from '@injectivelabs/sdk-ts'

const network = Network.testnet()
const injectiveAddress = 'inj1hkhdaj2a2clmq5jq6mspsggqs32vynpk228q3r'
const denom = 'inj'
const bankApi = new ChainClient.BankApi(network.sentryGrpcApi)
console.log(await bankApi.balance({ injectiveAddress, denom }))
```

- Fetching all derivative markets from the exchange (indexer) API

```ts
// Using the client
import { ExchangeClient, Network } from '@injectivelabs/sdk-ts'

const network = Network.testnet()
const exchangeGrpcClient = new ExchangeClient.GrpcClient(network.exchangeApi)
console.log(await exchangeGrpcClient.derivativesApi.markets())
```

```ts
// Importing only the needed API
import { ExchangeClient, Network } from '@injectivelabs/sdk-ts'

const network = Network.testnet()
const derivativesApi = new ExchangeClient.DerivativesApi(network.exchangeApi)
console.log(await derivativesApi.markets())
```

### Broadcasting Transactions

- Bidding on an auction

```ts
import { getNetworkInfo, Network } from "@injectivelabs/networks";
import {
  AuctionCore,
  ChainClient,
  PrivateKey,
  BaseAccount,
  TxInjective,
  TxService,
} from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";

/** MsgBid Example */
(async () => {
  const network = getNetworkInfo(Network.TestnetK8s);
  const privateKey = PrivateKey.fromPrivateKey(
    "f9db9bf330e23cb7839039e944adef6e9df447b90b503d5b4464c90bea9022f3"
  );
  const injectiveAddress = privateKey.toBech32();
  console.log(injectiveAddress, privateKey.toHex());

  /** Account Details **/
  const accountDetails = await new ChainClient.AuthRestApi(
    network.sentryHttpApi
  ).account(injectiveAddress);
  const baseAccount = BaseAccount.fromRestApi(accountDetails);

  /** Prepare the Message */
  const auctionModuleState = await new ChainClient.AuctionApi(
    network.sentryGrpcApi
  ).moduleState();
  const latestRound = auctionModuleState.getState()?.getAuctionRound();
  const round = latestRound || 1;
  const bid = 1; /** 100 INJ */
  const amount = {
    amount: new BigNumberInBase(bid).toWei().toFixed(),
    denom: "inj",
  };
  const msg = new AuctionCore.MsgBid({
    round,
    amount,
    injectiveAddress,
  });

  /** Prepare the Transaction **/
  const txInjective = new TxInjective({
    baseAccount,
    msgs: [msg],
    chainId: network.chainId,
    address: injectiveAddress,
  });

  /** Sign transaction */
  const signature = await privateKey.sign(txInjective.signBytes);
  const signedTxInjective = txInjective.withSignature(signature);

  /** Calculate hash of the transaction */
  console.log(`Transaction Hash: ${signedTxInjective.getTxHash()}`);

  const txService = new TxService({
    txInjective: signedTxInjective,
    endpoint: network.sentryGrpcApi,
  });

  /** Simulate transaction */
  const simulationResponse = await txService.simulate();
  console.log(
    `Transaction simulation response: ${JSON.stringify(
      simulationResponse.gasInfo
    )}`
  );

  /** Broadcast transaction */
  const txResponse = await txService.broadcast();
  console.log(
    `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`
  );
})();
```

### Streaming Data

- Streaming users subaccount balances from the exchange API

```ts
import { getNetworkInfo, Network } from "@injectivelabs/networks";
import { protoObjectToJson } from "@injectivelabs/sdk-ts";
import { ExchangeGrpcStreamClient } from "@injectivelabs/sdk-ts/dist/client/exchange/ExchangeGrpcStreamClient";

(async () => {
  const network = getNetworkInfo(Network.TestnetK8s);

  const subaccountId =
    "0xaf79152ac5df276d9a8e1e2e22822f9713474902000000000000000000000000";

  const exchangeClient = new ExchangeGrpcStreamClient(
    network.exchangeApi
  );

  await exchangeClient.account.streamSubaccountBalance({
    subaccountId,
    callback: (subaccountBalance) => {
      console.log(protoObjectToJson(subaccountBalance));
    },
    onEndCallback: (status) => {
      console.log("Stream has ended with status: " + status);
    },
  });
})();
```

---

## ⛑ Support

Reach out to us at one of the following places!

- Website at <a href="https://injective.com" target="_blank">`injective.com`</a>
- Twitter at <a href="https://twitter.com/InjectiveLabs" target="_blank">`@InjectiveLabs`</a>
- Discord at <a href="https://discord.com/invite/NK4qdbv" target="_blank">`Discord`</a>
- Telegram at <a href="https://t.me/joininjective" target="_blank">`Telegram`</a>

---

## 🔓 License

This software is licensed under the MIT license. See [LICENSE](./LICENSE) for full disclosure.

<p>&nbsp;</p>
<div align="center">
  <sub><em>Powering the future of decentralized finance.</em></sub>
</div>
