## DEPRECATED - Please use @injectivelabs/sdk-ts

# 🌟 Injective Protocol - Spot Market Consumer

[![downloads](https://img.shields.io/npm/dm/@injectivelabs/spot-consumer.svg)](https://www.npmjs.com/package/@injectivelabs/spot-consumer)
[![npm-version](https://img.shields.io/npm/v/@injectivelabs/spot-consumer.svg)](https://www.npmjs.com/package/@injectivelabs/spot-consumer)
[![license](https://img.shields.io/npm/l/express.svg)]()

_A convenient way to consume Spot Markets_

---

## 📚 Installation

```bash
yarn add @injectivelabs/spot-consumer
```

## 📖 Documentation

This package is a TypeScript wrapper around the GRPC API provided by our Injective Exchange for spot markets.

The package is split between two separate concerns, "consumers" and "transformers". With the "consumers" we are making GRPC API calls to the Injective Exchange, and with the "transformers" we are transforming the data from a protobuf message to a plain TypeScript object that can be used more conveniently.

## 📖 Example Usage

```ts
// file: index.ts
import { SpotMarketConsumer, SpotMarketTransformer } from "@injectivelabs/spot-consumer"

const endpoint = '' // Exchange API endpoint
const spotMarketConsumer = new SpotMarketConsumer(endpoint)

(async() => {
  const markets = SpotMarketTransformer.marketsToUiMarkets(await spotMarketConsumer.fetchMarkets()) // returns UiSpotMarket[]

  console.log(markets)
})()
```

---

## 📜 Contribution

**Contribution guides and practices will be available once there is a stable foundation of the whole package set within the `injective-ts` repo.**

---

## ⛑ Support

Reach out to us at one of the following places!

- Website at <a href="https://injectiveprotocol.com" target="_blank">`injectiveprotocol.com`</a>
- Twitter at <a href="https://twitter.com/Injective_" target="_blank">`@Injective`</a>

---

## 🔓 License

[![License](https://img.shields.io/:license-mit-blue.svg?style=flat-square)](https://badges.mit-license.org)
