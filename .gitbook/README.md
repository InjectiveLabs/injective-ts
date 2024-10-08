# Getting Started

**Supported Node Versions **<mark style="color:green;">**> 18x**</mark>

<div align="left">

<img src="http://img.shields.io/badge/node-18.x-brightgreen.svg" alt="Supported Node Version" width="188">

</div>

**Stable Package Version**

![](https://img.shields.io/npm/v/%40injectivelabs/sdk-ts/latest?label=%40injectivelabs%2Fsdk-ts) ![](https://img.shields.io/npm/v/%40injectivelabs/wallet-ts/latest?label=%40injectivelabs%2Fwallet-ts) ![](https://img.shields.io/npm/v/%40injectivelabs/networks/latest?label=%40injectivelabs%2Fnetworks) ![](https://img.shields.io/npm/v/%40injectivelabs/ts-types/latest?label=%40injectivelabs%2Fts-types) ![](https://img.shields.io/npm/v/%40injectivelabs/utils/latest?label=%40injectivelabs%2Futils)

**Latest Package Versions:**

![](https://img.shields.io/npm/v/%40injectivelabs/sdk-ts/next?label=%40injectivelabs%2Fsdk-ts) ![](https://img.shields.io/npm/v/%40injectivelabs/wallet-ts/next?label=%40injectivelabs%2Fwallet-ts) ![](https://img.shields.io/npm/v/%40injectivelabs/networks/next?label=%40injectivelabs%2Fnetworks) ![](https://img.shields.io/npm/v/%40injectivelabs/ts-types/next?label=%40injectivelabs%2Fts-types) ![](https://img.shields.io/npm/v/%40injectivelabs/utils/next?label=%40injectivelabs%2Futils)

_**Note:** The latest versions are published using the `next` tag. For stable versions use the `latest` tag or check npm registry for the latest stable version._

The purpose of this Wiki is to help developers build decentralized applications on top of Injective. Let's dive a bit deeper into each section and explain its purpose so its easier to get the bigger picture.

_Note: Reading the Technical Concepts section after reading the overview below is highly recommended. There are some concepts that can have a bit steeper learning curve than others, so we recommend going through them to understand a bit more about Injective._

* [Wallets](wallet/) - In this section, we are going to explain (in technical terms) how Accounts are derived on Injective, how you can connect your wallet straight from the dApp itself, and finally have a look at the **WalletStrategy** - a package built by the InjectiveLabs team which offers out of the box solution for providing multiple wallet solutions to the user to connect and interact with your dApp.
* [Querying](querying/) - In this section we are going to explore different ways to obtain data from different data sources needed to build your dApps. First, we are going to see how to query the chain directly and then we are going to explore the Indexer API - an indexer solution for easier data access/streaming including historical data.
* [Transaction](transactions/) - In this section, we are going to explore different ways to make transactions on Injective. First, we are going to explain (in technical terms) how Transactions work on Injective and some technical concepts around them and then we are going to have a look at how to prepare, sign, and broadcast transactions on Injective in several ways. There are a couple of ways to do this.
  1. Using the Cosmos native approach in creating a transaction, sign it using a **Cosmos native wallet** and broadcast it to Injective,
  2. Using the Ethereum native approach in creating a transaction using EIP712 typed data, sign it using an **Ethereum native wallet** and broadcast it to Injective,
  3. Using the Ethereum native approach in creating a transaction using EIP712 typed data, sign it using a **Ledger device** and broadcast it to Injective,
  4. Using the Cosmos native approach in creating a transaction, sign it using a **raw PrivateKey** and broadcast it to Injective,
  5. Using the Web3Gateway microservice - an API that provides fee delegation services.
* [Core Modules](core-modules/) - In this section we are going to have a quick summary of the core modules on Injective and show examples of how to create some Messages (+ pack them into a transaction, sign them using a private key, and broadcast them on Injective) within these core modules.
* [Bridge](bridge/) - In this section, we are going to have a look at Injective's interoperability and explain how developers can utilize the Peggy bridge and the IBC bridge to bridge assets over to Injective.
* [Networks](readme/networks.md) - In this section, we will look at different (pre-defined) available Networks for developers to utilize while building dApps on top of Injective, allowing them to start building without the need to make their own infrastructure.
* [Calculations](calculations/) - In this section, we will look at different calculations formula converting values between UI human-readable and chain format.

**Deprecated Packages:**

![](https://img.shields.io/npm/v/%40injectivelabs/bridge-ts/latest?label=%40injectivelabs%2Fbridge-ts) ![](https://img.shields.io/npm/v/%40injectivelabs/contracts/latest?label=%40injectivelabs%2Fcontracts) ![](https://img.shields.io/npm/v/%40injectivelabs/sdk-ui-ts/latest?label=%40injectivelabs%2Fsdk-ui-ts) ![](https://img.shields.io/npm/v/%40injectivelabs/token-utils/latest?label=%40injectivelabs%2Ftoken-utils) ![](https://img.shields.io/npm/v/%40injectivelabs%2Ftoken-metadata/latest?label=%40injectivelabs%2Ftoken-metadata)
