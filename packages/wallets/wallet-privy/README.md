# 🌟 Injective Protocol - Privy Wallet Strategy

[![downloads](https://img.shields.io/npm/dm/@injectivelabs/wallet-privy.svg)](https://www.npmjs.com/package/@injectivelabs/wallet-privy)
[![npm-version](https://img.shields.io/npm/v/@injectivelabs/wallet-privy.svg)](https://www.npmjs.com/package/@injectivelabs/wallet-privy)
[![license](https://img.shields.io/npm/l/express.svg)]()

_Package to use a Privy embedded wallet on Injective via the wallet strategy._

---

## 📚 Installation

```bash
pnpm add @injectivelabs/wallet-privy
```

---

## 📖 Documentation

The strategy does not depend on a Privy SDK. Your app signs the user in with Privy
(`@privy-io/js-sdk-core` on web, `@privy-io/expo` on mobile) and hands the strategy
the embedded wallet's address and a function that returns its EIP-1193 provider.
Privy keeps the key; the strategy only sends requests to that provider, so the
provider must support these methods:

| Strategy method       | Provider request                                                  |
| --------------------- | ----------------------------------------------------------------- |
| `signEip712TypedData` | `secp256k1_sign` on the EIP-712 digest, like the Turnkey strategy |
| `signArbitrary`       | `personal_sign`                                                   |
| `sendEvmTransaction`  | `eth_signTransaction`, then sent through `evmOptions.rpcUrl`      |
| `sendTransaction`     | none: broadcasts the signed Injective transaction over gRPC       |

`Wallet.Privy` is an EVM wallet, so `MsgBroadcaster` uses the same EIP-712 path as
`Wallet.Turnkey`, including fee delegation.

The Privy wallet only exists after sign-in, so select the wallet first and set its
metadata afterwards. `setMetadata` only reaches strategies that are already loaded:

```typescript
import { Wallet } from '@injectivelabs/wallet-base'
import { WalletStrategy } from '@injectivelabs/wallet-strategy'
import { MsgBroadcaster } from '@injectivelabs/wallet-core'
import { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'

const walletStrategy = new WalletStrategy({
  chainId: ChainId.Testnet,
  strategies: {}, // WalletStrategy loads the Privy strategy itself
  evmOptions: { evmChainId: EvmChainId.TestnetEvm, rpcUrl: '<injective evm rpc>' },
})

// After the user signs in with Privy, e.g. privy.embeddedWallet.getEthereumProvider(...)
// on web or wallets[0].getProvider() from useEmbeddedEthereumWallet() on Expo.
await walletStrategy.setWallet(Wallet.Privy)
await walletStrategy.setMetadata({
  privy: {
    address: embeddedWalletAddress,
    getProvider: () => getPrivyEthereumProvider(),
  },
})

const broadcaster = new MsgBroadcaster({
  walletStrategy,
  network: Network.Testnet,
  evmChainId: EvmChainId.TestnetEvm,
})

await broadcaster.broadcastWithFeeDelegation({ msgs, injectiveAddress })
```

When the user switches accounts, call `setMetadata({ privy })` again; other wallets'
metadata never replaces it. `walletStrategy.disconnect()` forgets the wallet, but
sign the user out of Privy through the Privy SDK. The strategy reads the metadata on
every request and refuses to sign for any other address (0x or inj1).

Without Privy metadata (signed out, or after a page reload before the app has
restored the Privy session) every request throws `PrivyWalletSessionException`
from `@injectivelabs/exceptions`, the Privy counterpart of
`TurnkeyWalletSessionException`, so apps can treat both the same way: disconnect
and send the user back to sign-in. A `getProvider` that throws it is passed on
unchanged.

`getEip1193Provider()` returns Privy's provider as it is, on whatever chain Privy
selected. If you use it directly, add the Injective EVM chain to Privy's
`supportedChains`. The strategy's own EVM transactions don't need this: they are
prepared and sent through `evmOptions`.

The strategy never creates a wallet. Create one with Privy only for users who never
had an embedded wallet; existing users import their key first (see Privy's Turnkey
migration guide).

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
