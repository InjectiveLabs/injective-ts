# 🌟 Injective Protocol - Web3 Strategy

[![downloads](https://img.shields.io/npm/dm/@injectivelabs/web3-strategy.svg)](https://www.npmjs.com/package/@injectivelabs/web3-strategy)
[![npm-version](https://img.shields.io/npm/v/@injectivelabs/web3-strategy.svg)](https://www.npmjs.com/package/@injectivelabs/web3-strategy)
[![license](https://img.shields.io/npm/l/express.svg)]()

_A convenient way to use Web3 with a transaction signing provider._

---

## 📚 Installation

```bash
yarn add @injectivelabs/web3-strategy
```

## 📖 Documentation

```ts
// file: web3.ts
import { ChainId } from "@injectivelabs/ts-types"
import { Web3Strategy, Wallet, ConcreteStrategyOptions } from "@injectivelabs/web3-strategy";

/*
** Injective Chain's ChainId, Mainnet ChainId
** and other values can be used, but RPC and WS
** endpoint MUSt be provided for the ChainId
*/
const chainId: ChainId = 888
const pollingInterval = 500 // RPC's polling interval
const wallet = Wallet.Metamask
const privateKey = process.env.PRIVATE_KEY // Used only for Wallet based Subprovider (not needed for Metamask)

const getRpcUrlsForChainIds = () => {
  return {
    888: "http://localhost:1317",
  };
};

const getWsRpcUrlsForChainIds = () => {
  return {
    888: "ws://localhost:1317",
  };
};

const options = {
    pollingInterval,
    privateKey,
    wsRpcUrls: getWsRpcUrlsForChainIds(),
    rpcUrls: getRpcUrlsForChainIds(),
}: ConcreteStrategyOptions

export const web3Strategy = new Web3Strategy({
  chainId,
  options
  wallet,
})
```

```ts
// file: sign.service.ts
import { web3Strategy } from 'app/web3';

const transaction = /* ... */;
const txHash = await web3Strategy.sendTransaction(transaction, address);
```

---

## 📜 Contribution

**Contribution guides and practices will be available once there is a stable foundation of the whole package set within the `injective-ts` repo.**

---

## ⛑ Support

Reach out to us at one of the following places!

- Website at <a href="https://injectiveprotocol.com" target="_blank">`injectiveprotocol.com`</a>
- Twitter at <a href="https://twitter.com/InjectiveLabs" target="_blank">`@InjectiveLabs`</a>

---

## 🔓 License

[![License](https://img.shields.io/:license-mit-blue.svg?style=flat-square)](https://badges.mit-license.org)
