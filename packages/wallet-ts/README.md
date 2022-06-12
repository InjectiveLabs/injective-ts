# 🌟 Injective Protocol - Wallet Strategy

[![downloads](https://img.shields.io/npm/dm/@injectivelabs/wallet-ts.svg)](https://www.npmjs.com/package/@injectivelabs/wallet-ts)
[![npm-version](https://img.shields.io/npm/v/@injectivelabs/wallet-ts.svg)](https://www.npmjs.com/package/@injectivelabs/wallet-ts)
[![license](https://img.shields.io/npm/l/express.svg)]()

_A convenient way to use different types of wallets on Injective._

---

## 📚 Installation

```bash
yarn add @injectivelabs/wallet-ts
```

## 📖 Documentation

The main purpose of this package is to offer developers a way to have different wallet implementations on Injective. All of these wallets implementations are exposing the same `ConcreteStrategy` interface which means that users can just use these methods without the need to know the underlying implementation for specific wallets as they are abstracted away.

To start, you have to make an instance of the `WalletStrategy` class which gives you the ability to use different wallets out of the box. You can switch the current wallet that is used by using the `setWallet` method on the `walletStrategy` instance.

Lets have a look at the methods that `WalletStrategy` strategy exposes and what do they mean:

- `getAddresses` gets the addresses from the connected wallet strategy,

- `sendEthereumTransaction` sends an Ethereum transaction using the connected wallet strategy,

- `sendTransaction` sends an Injective transaction using the connected wallet strategy,

- `signTransaction` signs an Injective transaction using the connected wallet strategy,

- `getNetworkId` get the network id for the Ethereum native wallet strategies,

- `getChainId`  get the chain id for the Ethereum native wallet strategies,

- `getEthereumTransactionReceipt`  get the transaction receipt for Ethereum native transactions for the wallet strategy,

- `getWeb3` gets an Web3 instance. Depending on the wallet strategy it uses a different web3 provider (user provided RPC for some, the window object injected provider for Metamask, etc)


### Example usage
```ts
import { WalletStrategy } from '@injectivelabs/wallet-ts'
import { EthereumChainId } from '@injectivelabs/ts-types'
import { CHAIN_ID, ETHEREUM_CHAIN_ID, IS_TESTNET } from '~/app/utils/constants'

export const getRpcUrlsForChainIds = (): Record<EthereumChainId, string> => {
  return {
    [EthereumChainId.Ganache]: 'http://localhost:8545',
    [EthereumChainId.HardHat]: 'http://localhost:8545',
    [EthereumChainId.Kovan]: `https://eth-kovan.alchemyapi.io/v2/${process.env.APP_ALCHEMY_KOVAN_KEY}`,
    [EthereumChainId.Mainnet]: `https://eth-mainnet.alchemyapi.io/v2/${process.env.APP_ALCHEMY_KEY}`,
    [EthereumChainId.Injective]: '',
    [EthereumChainId.Rinkeby]: '',
    [EthereumChainId.Ropsten]: ''
  }
}

export const getRpcWsUrlsForChainIds = (): Record<EthereumChainId, string> => {
  return {
    [EthereumChainId.Ganache]: 'ws://localhost:1318',
    [EthereumChainId.HardHat]: 'ws://localhost:1318',
    [EthereumChainId.Kovan]: `wss://eth-kovan.ws.alchemyapi.io/v2/${process.env.APP_ALCHEMY_KOVAN_KEY}`,
    [EthereumChainId.Mainnet]: `wss://eth-mainnet.ws.alchemyapi.io/v2/${process.env.APP_ALCHEMY_KEY}`,
    [EthereumChainId.Injective]: '',
    [EthereumChainId.Rinkeby]: '',
    [EthereumChainId.Ropsten]: ''
  }
}

export const alchemyRpcEndpoint = IS_TESTNET
  ? `https://eth-kovan.alchemyapi.io/v2/${process.env.APP_ALCHEMY_KOVAN_KEY}`
  : `https://eth-mainnet.alchemyapi.io/v2/${process.env.APP_ALCHEMY_KEY}`

const rpcUrls = getRpcUrlsForChainIds()
const wsRpcUrls = getRpcWsUrlsForChainIds()

export const walletStrategy = new WalletStrategy({
  chainId: CHAIN_ID,
  ethereumChainId: ETHEREUM_CHAIN_ID,
  options: {
    wsRpcUrls,
    rpcUrls
  }
})

// Get wallet's addresses
export const getAddresses = async (): Promise<string[]> => {
  const addresses = await walletStrategy.getAddresses()

  if (addresses.length === 0) {
    throw new Web3Exception('There are no addresses linked in this wallet.')
  }

  return addresses
}

// Sign an Injective transaction
export const signTransaction = async (tx: any): Promise<string[]> => {
  const response = await walletStrategy.signTransaction(tx, { address: 'inj1...', chainId: 'injective-1'})

  return response
}
```


---

## 📜 Contribution

**Contribution guides and practices will be available once there is a stable foundation of the whole package set within the `injective-ts` repo.**

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
