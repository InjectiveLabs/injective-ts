# 🌟 Injective Protocol - Ledger Wallet Strategy

<!-- TODO -->

[![downloads](https://img.shields.io/npm/dm/@injectivelabs/wallet-ledger.svg)](https://www.npmjs.com/package/@injectivelabs/wallet-ledger)
[![npm-version](https://img.shields.io/npm/v/@injectivelabs/wallet-ledger.svg)](https://www.npmjs.com/package/@injectivelabs/wallet-ledger)
[![license](https://img.shields.io/npm/l/express.svg)]()

_Package to use Ledger Wallets on Injective via the wallet strategy._

---

## 📚 Installation

```bash
yarn add @injectivelabs/wallet-ledger
```

---

## 📖 Documentation

Injective's wallet packages are intended to make it easy for developers to choose exactly what wallets - and subsequent dependencies - they
want to include in their projects.

Regardless of which wallet package(s) you choose to use you must also have `@injectivelabs/wallet-core` and `@injectivelabs/wallet-base`
installed. These contain all of the types and core wallet functionality, with the separate wallet packages only providing the necessary
dependencies and implementations for their specific wallets.

Here's a brief example of how to use this package to send 1 INJ.:

```typescript
import { Wallet } from '@injectivelabs/wallet-base';
import { BaseWalletStrategy, MsgBroadcaster } from '@injectivelabs/wallet-core';
import { LedgerLive  } from '@injectivelabs/wallet-ledger';


const strategyArgs: WalletStrategyArguments = {
  chainId: ChainId.Mainnet,
  wallet: Wallet.Ledger,
  strategies: {
    [Wallet.Ledger]: new LedgerLive({
      chainId: ChainId.Mainnet,
      ethereumOptions: {
        ethereumChainId: EthereumChainId.Mainnet,
      },
    }),
  },
}
const walletStrategy = new BaseWalletStrategy(strategyArgs)

const msgBroadcaster = new MsgBroadcaster({
  walletStrategy,
  simulateTx: true,
  network: Network.Mainnet,
})

const sendTX = async () => {
    const injectiveAddress = 'someInjectiveAddress'

    const message = MsgSend.fromJSON({
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
      amount: {
        amount: '1',
        denom: 'inj',
      },
    })

    return await msgBroadcaster.broadcast({ msgs: message })
  }

  const result = await sendTX()
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
