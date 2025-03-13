# 🌟 Injective Protocol - Wallet Core

<!-- TODO -->

[![downloads](https://img.shields.io/npm/dm/@injectivelabs/wallet-core.svg)](https://www.npmjs.com/package/@injectivelabs/wallet-core)
[![npm-version](https://img.shields.io/npm/v/@injectivelabs/wallet-core.svg)](https://www.npmjs.com/package/@injectivelabs/wallet-core)
[![license](https://img.shields.io/npm/l/express.svg)]()

_Package to use Wallets on Injective via the wallet strategy._

---

## 📚 Installation

```bash
yarn add @injectivelabs/wallet-core
```

---

## 📖 Documentation

To instantiate your MsgBroadcaster, you need to pass it an instance of `BaseWalletStrategy`. You can specify any strategy you want in the `BaseWalletStrategy` constructor and pass it to the `MsgBroadcaster`.

```ts
import { Wallet } from '@injectivelabs/wallet-base'
import { BaseWalletStrategy, MsgBroadcaster } from '@injectivelabs/wallet-core'
import { PrivateKeyWalletStrategy } from '@injectivelabs/wallet-private-key'

const strategyArgs: WalletStrategyArguments = {} /** define the args */
const strategyEthArgs: ConcreteEthereumWalletStrategyArgs = {} /** if the wallet is an Ethereum wallet */
const strategies = {
  [Wallet.PrivateKey]: new PrivateKeyWalletStrategy(strategyEthArgs)
}

export const walletStrategy = new BaseWalletStrategy({...strategyArgs, strategies})

const broadcasterArgs: MsgBroadcasterOptions = {} /** define the broadcaster args */
export const msgBroadcaster = new MsgBroadcaster({...broadcasterArgs, walletStrategy})
```

Read more and find example usages on our [WalletStrategy Docs](https://docs.ts.injective.network/wallet/wallet-wallet-strategy)

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

Copyright © 2021 - 2022 Injective Labs Inc. (https://injectivelabs.org/)

<a href="https://iili.io/mNneZN.md.png"><img src="https://iili.io/mNneZN.md.png" style="width: 300px; max-width: 100%; height: auto" />

Originally released by Injective Labs Inc. under: <br />
Apache License <br />
Version 2.0, January 2004 <br />
http://www.apache.org/licenses/

<p>&nbsp;</p>
<div align="center">
  <sub><em>Powering the future of decentralized finance.</em></sub>
</div>
