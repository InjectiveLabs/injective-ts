# 🌟 Injective Protocol - Networks and Endpoints

[![downloads](https://img.shields.io/npm/dm/@injectivelabs/tx-ts.svg)](https://www.npmjs.com/package/@injectivelabs/tx-ts)
[![npm-version](https://img.shields.io/npm/v/@injectivelabs/tx-ts.svg)](https://www.npmjs.com/package/@injectivelabs/tx-ts)
[![license](https://img.shields.io/npm/l/express.svg)]()

_Accessing decentralized finance through TypeScript (for Web and Node environment)_

`@injectivelabs/networks` is a TypeScript package for providing a pre-defined set of endpoints which can be used to fetch data from different data sources, broadcast transactions to sentry nodes, use the Tendermint RPC, etc, for different environments (Mainnet, Testnet, Devnet, etc).

### 📚 Installation

```bash
yarn add @injectivelabs/networks
```

---

## 📖 Documentation

This package exports an enum `Network` that developers can use for the different environments the Injective Chain can be run.

There are two key functions exported from this package:

- `export function getEndpointsForNetwork(network: Network): NetworkEndpoints`
- `export function getNetworkInfo(network: Network): ChainInfo`

The first one, `getEndpointsForNetwork` returns a pre-defined set of endpoints that can be used by the developers - depending on their need. Here is the interface that gets returned from this function:

```ts
export type NetworkEndpoints = {
  exchangeApi: string // @deprecated - the grpc-web port of the exchange API service
  indexerApi: string // the grpc-web port of the indexer API service
  sentryGrpcApi: string // the grpc-web port of the sentry node
  sentryHttpApi: string // the REST endpoint of the sentry node
  tendermintApi?: string // the REST endpoint of the Tendermint RPC
  chronosApi?: string // the REST endpoint of the chronos API service
  exchangeWeb3GatewayApi?: string // the grpc-web port of the web3-gateway service API
}
```

Lets explain these endpoints, and what do they mean:
- `exchangeApi` / `indexerApi` is the grpc-web endpoint that we can use to connect to the `exchange/indexer` service which listens for events from the chain, processes the events and stores the data into a mongoDB so its easier and much more performant to serve that data than querying it straight from the chain itself,
- `sentryGrpcApi` is the grpc-web endpoint that we can use to connect to a sentry node. A Sentry node is basically a read (and light) only version of the chain that we can use to query data directly from the chain.
- `sentryHttpApi` is the REST endpoint that we can use to connect to a sentry node.
- `tendermintApi` is the REST endpoint that we can use to connect to the Tendermint RPC,
- `chronosApi` is the REST endpoint that we can use to connect to the Chronos API which is part of the `exchange/indexer` service which is used for rendering the TradingView chart and getting OHLC data for the markets,
- `exchangeWeb3GatewayApi` is the grpc-web endpoint that we can use to connect to the web3-gateway which is part of the `exchange/indexer` service which is used for preparing and broadcasting Cosmos transactions using Ethereum native wallets + supports for fee delegation

The `getNetworkInfo` exports these endpoints plus the `chainId` and the default `fee` for the `Network` we want.

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
