# 🌟 Injective Protocol - SDK TS

[![downloads](https://img.shields.io/npm/dm/@injectivelabs/sdk-ts.svg)](https://www.npmjs.com/package/@injectivelabs/sdk-ts)
[![npm-version](https://img.shields.io/npm/v/@injectivelabs/sdk-ts.svg)](https://www.npmjs.com/package/@injectivelabs/sdk-ts)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/InjectiveLabs/injective-ts.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/InjectiveLabs/injective-ts/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/InjectiveLabs/injective-ts.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/InjectiveLabs/injective-ts/context:javascript)
[![license](https://img.shields.io/npm/l/express.svg)]()

_Accessing decentralized finance through TypeScript (for Web, Node and React Native environment)_

`@injectivelabs/sdk-ts` is a TypeScript SDK for writing applications on top of the Injective chain in both a Node.js,  browser and react native environment.

<p align="center">
  <a href="https://github.com/InjectiveLabs/injective-ts/tree/master/packages/sdk-ts" target="_blank"><strong>Documentation</strong></a>
  ·
  <a href="https://github.com/InjectiveLabs/sdk-ts-examples" target="_blank">Examples</a>
  ·
  <a href="https://injectivelabs.github.io/injective-ts/modules/_injectivelabs_sdk_ts.html" target="_blank">API Reference</a>
  ·
  <a href="https://www.npmjs.com/package/@injectivelabs/sdk-ts" target="_blank">NPM Package</a>
  ·
  <a href="https://github.com/InjectiveLabs/injective-ts/tree/master/packages/sdk-ts" target="_blank">GitHub</a>
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

Read more and find example usages on our [Querying Wiki](https://github.com/InjectiveLabs/injective-ts/wiki/01Querying)

### Making Transactions

Read more and find example usages on our [Transactions Wiki](https://github.com/InjectiveLabs/injective-ts/wiki/02Transactions)

---

## 🎒 Usage

Let's go through couple of use-cases of the `sdk-ts` so developers can have a reference codebase that they can look at.

### Consuming data

- Fetching user's inj balance from the chain

```ts
// Importing only the needed API
import { ChainGrpcBankApi, Network } from '@injectivelabs/sdk-ts'

const network = Network.testnet()
const injectiveAddress = 'inj1hkhdaj2a2clmq5jq6mspsggqs32vynpk228q3r'
const denom = 'inj'
const chainGrpcBankApi = new ChainGrpcBankApi(network.sentryGrpcApi)
console.log(await chainGrpcBankApi.fetchBalance({ injectiveAddress, denom }))
```

```ts
// Using the client
import { ChainGrpcClient, Network } from '@injectivelabs/sdk-ts'

const network = Network.testnet()
const injectiveAddress = 'inj1hkhdaj2a2clmq5jq6mspsggqs32vynpk228q3r'
const denom = 'inj'
const chainGrpcClient = new ChainGrpcClient(network.sentryGrpcApi)
console.log(await chainGrpcClient.bank.fetchBalance({ injectiveAddress, denom }))
```

- Fetching all derivative markets from the exchange (indexer) API

```ts
// Importing only the needed API
import { IndexerGrpcDerivativesApi, Network } from '@injectivelabs/sdk-ts'

const network = Network.testnet()
const exchangeGrpcDerivativesApi = new IndexerGrpcDerivativesApi(network.indexerApi)
console.log(await exchangeGrpcDerivativesApi.fetchMarkets())
```

```ts
// Using the client
import { IndexerGrpcClient, Network } from '@injectivelabs/sdk-ts'

const network = Network.testnet()
const exchangeGrpcClient = new IndexerGrpcClient(network.indexerApi)
console.log(await exchangeGrpcClient.derivatives.fetchMarkets())
```

### Broadcasting Transactions

- Sending INJ to another address

```ts
import { getNetworkInfo, Network } from "@injectivelabs/networks";
import { ChainRestAuthApi } from "@injectivelabs/sdk-ts";
import {
  PrivateKey,
  privateKeyToPublicKeyBase64,
  MsgSend,
  DEFAULT_STD_FEE,
} from "@injectivelabs/sdk-ts";
import { createTransaction, TxGrpcClient, TxClient } from "@injectivelabs/sdk-ts/dist/core/transaction";
import { BigNumberInBase } from "@injectivelabs/utils";

/** MsgSend Example */
(async () => {
  const network = getNetworkInfo(Network.Public);
  const privateKeyHash =
    "f9db9bf330e23cb7839039e944adef6e9df447b90b503d5b4464c90bea9022f3";
  const privateKey = PrivateKey.fromPrivateKey(privateKeyHash);
  const injectiveAddress = privateKey.toBech32();
  const publicKey = privateKeyToPublicKeyBase64(
    Buffer.from(privateKeyHash.replace("0x", ""), "hex")
  );

  /** Account Details **/
  const accountDetails = await new ChainRestAuthApi(
    network.sentryHttpApi
  ).fetchAccount(injectiveAddress);

  /** Prepare the Message */
  const amount = {
    amount: new BigNumberInBase(0.01).toWei().toFixed(),
    denom: "inj",
  };

  const msg = MsgSend.fromJSON({
    amount,
    srcInjectiveAddress: injectiveAddress,
    dstInjectiveAddress: injectiveAddress,
  });

  /** Prepare the Transaction */
  const { signBytes, txRaw } = createTransaction({
    message: msg.toDirectSign(),
    memo: "",
    fee: DEFAULT_STD_FEE,
    pubKey: publicKey,
    sequence: parseInt(accountDetails.account.base_account.sequence, 10),
    accountNumber: parseInt(
      accountDetails.account.base_account.account_number,
      10
    ),
    chainId: network.chainId,
  });

  /** Sign transaction */
  const signature = await privateKey.sign(signBytes);

  /** Append Signatures */
  txRaw.setSignaturesList([signature]);

  /** Calculate hash of the transaction */
  console.log(`Transaction Hash: ${await TxClient.hash(txRaw)}`);

  const txService = new TxGrpcClient(network.sentryGrpcApi);

  /** Simulate transaction */
  const simulationResponse = await txService.simulate(txRaw);
  console.log(
    `Transaction simulation response: ${JSON.stringify(
      simulationResponse.gasInfo
    )}`
  );

  /** Broadcast transaction */
  const txResponse = await txService.broadcast(txRaw);
  console.log(
    `Broadcasted transaction hash: ${JSON.stringify(txResponse.txhash)}`
  );
})();
```

### Streaming Data

- Streaming users subaccount balances from the indexer API

```ts
import { getNetworkInfo, Network } from "@injectivelabs/networks";
import { IndexerGrpcStreamClient } from "@injectivelabs/sdk-ts/dist/client/indexer/IndexerGrpcStreamClient";

(async () => {
  const network = getNetworkInfo(Network.TestnetK8s);

  const subaccountId =
    "0xaf79152ac5df276d9a8e1e2e22822f9713474902000000000000000000000000";

  const exchangeClient = new IndexerGrpcStreamClient(
    network.indexerApi
  );

  await exchangeClient.account.streamSubaccountBalance({
    subaccountId,
    callback: (subaccountBalance) => {
      console.log(subaccountBalance);
    },
    onEndCallback: (status) => {
      console.log("Stream has ended with status: " + status);
    },
  });
})();
```

---

## 📜 Contribution

**Contribution guides and practices will be available once there is a stable foundation of the whole package set within the `injective-ts` repo.**

---

## ⛑ Support

Reach out to us at one of the following places!

- Website at <a href="https://injective.com" target="_blank">`injective.com`</a>
- Twitter at <a href="https://twitter.com/Injective_" target="_blank">`@Injective`</a>
- Discord at <a href="https://discord.com/invite/NK4qdbv" target="_blank">`Discord`</a>
- Telegram at <a href="https://t.me/joininjective" target="_blank">`Telegram`</a>

---

## 🔓 License

This software is licensed under the MIT license. See [LICENSE](./LICENSE) for full disclosure.

<p>&nbsp;</p>
<div align="center">
  <sub><em>Powering the future of decentralized finance.</em></sub>
</div>
