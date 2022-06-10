# 🌟 Injective's TypeScript Monorepo

_Access Limitless DeFi Markets with Zero Barriers._

`injective-ts` is a TypeScript monorepo that contains packages which can be used to interact with Injective from a Node.js or browser environments and which provide simple abstractions over core data structures, serialization, key management, and API request generation, etc. The packages can be found in the `packages` folder and each package is a `npm` module that is published on the `npm` registry.

---

## 📚 Overview

To get a sense of the packages and their functionality, we are going to list them a provide a simple explanation about their core functionality and how they can be used by developers to build applications on top Injective.

**Detailed documentation and usage can be found within each package's respective folder in the `packages` folder**

- `@injectivelabs/sdk-ts` is the sdk powerhouse that provides easily accessing data from any data source (chain, api), regardless of the type of access (grpc, rest), and provides a way to easily compose Messages, pack them into Transactions that can be broadcasted to Injective


- `@injectivelabs/wallet-ts` provides a way for different wallet provides to be used to prepare, sign and broadcast transactions on the Injective Chain. There are also some implementations and utility functions for specific blockchains that are not exported as default from the package but they can be reused based on the developers needs.


- `@injectivelabs/contracts` is a npm package used for providing an abstraction over some Ethereum smart contracts that can be useful while building applications on top of Injective. These include the `ERC20Contract`, and the `PeggyContract` which is the contract deployed on the Ethereum Network used for the Peggy bridge between Ethereum and Injective. It can also be used to fetch some common contract addresses based on the `ethereumChainId`

- `@injectivelabs/exceptions` provides some exception classes that can be used to provide more context about the Error type thrown from within the applications built on top of Injective


- `@injectivelabs/networks` provides a way for developers to get pre-defined endpoints for accessing the sentry nodes (the read-only versions of the chain, which are used to serve data directly from Injective), the exchange api (an indexer that indexes events from the Injective Chain and stores the data in a MongoDB for easier access), tendermint rpc (the default rpc for blockchains built using the CosmosSDK), etc.


- `@injectivelabs/sdk-ui-ts` provides some abstractions and mappers (transformers) which can transform the data from data sources (whether its the chain itself or the API) so its more convenient to use them while building UIs.


- `@injectivelabs/token-metadata` provides token metadata information for denoms that are used on the Injective chain. Denoms are represented in a different format depending on the source they were bridged over to the Injective Chain (peggy, ibc, etc), so this package provides a way to fetch token meta data about these denoms (name, symbol, decimals, etc).


- `@injectivelabs/token-utils` provides some abstractions over some utilities for denoms that are on the Injective chain (ex: fetching their usd price, etc)


- `@injectivelabs/ts-types` provides some commonly used TypeScript types/enums


- `@injectivelabs/utils` provides some commonly used utility functions and classes


- `@injectivelabs/tx-ts` provides a way to prepare and broadcast transactions for Injective


- `@injectivelabs/dmm-consumer` provides abstractions over some `dmm` functionalities that are used to power up the DMM Dashboard which is part of the Astro incentives program on Injective.


- `@injectivelabs/referral-consumer` provides abstractions over a simple off-chain service built for enabling referrals functionality for exchanges built on top of Injective.


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
