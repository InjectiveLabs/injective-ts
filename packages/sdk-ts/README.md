# 🌟 Injective Protocol - SDK TS

[![downloads](https://img.shields.io/npm/dm/@injectivelabs/sdk-ts.svg)](https://www.npmjs.com/package/@injectivelabs/sdk-ts)
[![npm-version](https://img.shields.io/npm/v/@injectivelabs/sdk-ts.svg)](https://www.npmjs.com/package/@injectivelabs/sdk-ts)
[![license](https://img.shields.io/npm/l/express.svg)]()

_Accessing decentralized finance through TypeScript (for Web and Node environment)_

---

## 📚 Installation

```bash
yarn add @injectivelabs/sdk-ts
```

---

## 📖 Documentation

There are couple of components within this package. This package offers clients that can be easily instantiated so you can access all functionalities easily. Also, it offer decoupled exports so you can instantiate classes that you only need so you can utilize tree-shaking in the build process and reduce the file-size of the imports.

We are going to go through all of the components of the package and explain them in depth.

### Classes

This package contains some utility classes that can enhance the developer experience.

- `Address` class -> Can be used to get details about an injective address,

### Client

This package contains utility classes which ease the way we consume data from data sources.

There are two data sources available:
- Chain -> Consuming data directly from the chain,
- Exchange -> Consuming data directly from the exchange (indexer) API,

At the moment, only the gRPC method of consuming the data is supported, we might introduce REST as well in the future.

### Core

This package contains utility message classes that can help generate messages which can be packed into a transaction and broadcasted to the chain. Messages are separated into folders that correspond to a module on the Injective chain.

Every message is represented as a `MsgBase` class, which has couple of mapping functionalities:
- `toData` -> Converts the Message to a simple Object representation,
- `toProto` -> Returns a proto representation of the message,
- `toDirectSign` -> Converts the Message to a proto representation + type (ready for client side usage),
- `toWeb3` -> Converts the Message to a web3 representation + type (ready for web3-gateway usage i.e browser),

### Utils

This package contains some utility functions and constants.

### Local

This package contains some utility functions and constants for client-side usage (a local - node environment)

- `Network` class -> Can be used to get a pre-defined set of endpoints (sentry, api, etc) for easier usage,
- `PrivateKey` class -> Can be used to sign transactions, etc
- `InjectiveTx` class -> Can be used to prepare a transaction for signing/broadcasting on the client side,
- `TxService` class -> Can be used for simulating or broadcasting a transaction on the client side

---

## 🎒 Usage

Let's go through couple of use-cases of the `sdk-ts` so developers can have a reference codebase that they can look at.

### Consuming data

- Fetching user's balance from the chain

```ts
// Using the client
import { ChainClient, Network } from '@injectivelabs/sdk-ts'

const network = Network.testnet()
const injectiveAddress = 'inj1hkhdaj2a2clmq5jq6mspsggqs32vynpk228q3r'
const denom = 'inj'
const chainGrpcClient = new ChainClient.GrpcClient(network.sentryGrpcApi)
console.log(await chainGrpcClient.bankApi.balance({ injectiveAddress, denom }))
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

- Creating a spot limit order transaction and broadcasting it to the chain

```ts
import { Network, ExchangeCore, ExchangeClient, PrivateKey, InjectiveTx, TxService } from '@injectivelabs/sdk-ts'

const network = Network.testnet()
const privateKey = PrivateKey.fromPrivateKey('f9db9bf330e23cb7839039e944adef6e9df447b90b503d5b4464c90bea9022f3')

/** Account Details **/
const injectiveAddress = "inj1ql0alrq4e4ec6rv9svqjwer0k6ewfjkaay9lne";
const authApi = new ExchangeClient.AuthApi(network.sentryGrpcApi)
const accountDetails = await authApi.account(injectiveAddress)

/** Limit Order Details */
const price = 5;
const quantity = 10;
const baseDecimals = 18; // INJ has 18 decimals
const quoteDecimals = 6; // USDT has 6 decimals
const marketId =
  "0xa508cb32923323679f29a032c70342c147c17d0145625922b0ef22e955c844c0"; // INJ/USDT on testnet;
const subaccountId =
  "0x07dfdf8c15cd738d0d85830127646fb6b2e4cadd000000000000000000000000";
const orderType = 1; /* Buy, 2 for Sale */

/** Preparing the transaction */
const msg = new ExchangeCore.MsgCreateSpotLimitOrder({
  marketId,
  subaccountId,
  injectiveAddress,
  orderType,
  price,
  quantity,
  triggerPrice: '0',
  feeRecipient: injectiveAddress
})
const injectiveTx = new InjectiveTx({
  accountDetails,
  tx: {
    msgs: [msg],
    chainId: network.chainId,
    address: injectiveAddress
  }
})
const signature = privateKey.sign(injectiveTx.signDoc.serializeBinary())
const txRaw = injectiveTx.toTxRaw(signature)
console.log(`Transaction Hash: ${InjectiveTx.getTxHash(txRaw)}`);

/** Simulating and Broadcasting a transaction */
const txService = new TxService({ txRaw, endpoint: network.sentryGrpcApi })
const simulationResponse = await txService.simulate()
console.log(
  `Transaction simulation response: ${JSON.stringify(simulationResponse.gasInfo)}`
);

const txResponse = await txService.broadcast()
console.log(
  `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`
);
```

### Streaming Data

---

## 🖱️ Examples

To run an example, `cd` into the `examples` folder and execute the desired example by running:

```bash
yarn ts-node pathToExample

## Example: yarn ts-node ./core/MsgBid.ts
```

Don't forget to do `yarn` and install dependencies before executing any example.

---

## ⛑ Support

Reach out to us at one of the following places!

- Website at <a href="https://injectiveprotocol.com" target="_blank">`injectiveprotocol.com`</a>
- Twitter at <a href="https://twitter.com/InjectiveLabs" target="_blank">`@InjectiveLabs`</a>

---

## 🔓 License
