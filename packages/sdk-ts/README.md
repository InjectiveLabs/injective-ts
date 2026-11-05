# 🌟 Injective Protocol - SDK TS

[![downloads](https://img.shields.io/npm/dm/@injectivelabs/sdk-ts.svg)](https://www.npmjs.com/package/@injectivelabs/sdk-ts)
[![npm-version](https://img.shields.io/npm/v/@injectivelabs/sdk-ts.svg)](https://www.npmjs.com/package/@injectivelabs/sdk-ts)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/InjectiveLabs/injective-ts.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/InjectiveLabs/injective-ts/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/InjectiveLabs/injective-ts.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/InjectiveLabs/injective-ts/context:javascript)

_Accessing decentralized finance through TypeScript (for Web, Node and React Native environment)_

`@injectivelabs/sdk-ts` is a TypeScript SDK for writing applications on top of the Injective chain in both a Node.js, browser and react native environment.

<p align="center">
  <a href="https://docs.ts.injective.network" target="_blank"><strong>Documentation</strong></a>
  ·
  <a href="https://github.com/InjectiveLabs/injective-ts-examples" target="_blank">Examples</a>
  ·
  <a href="https://injectivelabs.github.io/injective-ts/modules/_injectivelabs_sdk_ts.html" target="_blank">API Reference</a>
  ·
  <a href="https://www.npmjs.com/package/@injectivelabs/sdk-ts" target="_blank">NPM Package</a>
  ·
  <a href="https://github.com/InjectiveLabs/injective-ts" target="_blank">GitHub</a>
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
pnpm add @injectivelabs/sdk-ts
```

---

## Core v1.21 compatibility

This SDK follows the feature removals in [injective-core #3013](https://github.com/InjectiveLabs/injective-core/pull/3013):

- Binary-options message builders and `MsgRewardsOptOut` are removed for both exchange versions. Batch-order inputs no longer accept binary-options operations; nonempty legacy inputs throw during serialization.
- Exchange queries for trading rewards, reward opt-outs, binary-options markets, historical trade records, and market volatility are removed, along with their SDK transformers and response types.
- `ChainGrpcWasmXApi` and `ChainGrpcClient.wasmX` are removed. CosmWasm, `MsgExecuteContractCompat`, and `ContractExecutionCompatAuthz` remain supported.
- Market-launch proposals, insurance funds, and Peggy rate limits reject the retired Coinbase, PriceFeed, and Stork oracle sources. Insurance funds also reject the binary-options expiry flag (`-2`). Provider prices, conditional orders (including TP/SL), fee discounts, volume queries, and perpetual funding remain supported.

Other v1.21 changes to be aware of:

- **Exchange V2 Amino names changed** from `exchange/<Msg>` to `exchange/v2/<Msg>` (core renamed the `amino.name` proto options). This is a hard cutover for Ledger / Amino / EIP712 v1 signing: this SDK version only signs V2 exchange messages correctly against a v1.21 chain, and earlier SDK versions fail against v1.21. EIP712 v2 and direct signing are unaffected.
- **EIP712 v1 is unsupported for messages the chain cannot type.** `getEip712TypedData()` throws (use `getEip712TypedDataV2()` / `broadcastV2()`) when one of these is a root message of the transaction: `MsgSubmitProposalPerpetualMarketLaunchV2` (`OpenNotionalCap` oneof), for `MsgUpdateSpotMarketV2`, `MsgUpdateDerivativeMarketV2`, `MsgInstantSpotMarketLaunchV2`, `MsgIncreasePositionMarginV2` and `MsgDecreasePositionMarginV2` (`LegacyDec` fields), and for the consolidated-insurance messages with `math.Int` fields (`MsgCreateConsolidatedInsurancePool`, `MsgUpdateConsolidatedInsurancePolicy`, `MsgUnderwriteConsolidatedInsurancePool`). The gateway rejects all of these for v1 as root messages (`invalid Go type ...`), but prepares them inside `MsgExec` and proposals, so nested they serialize like any other message. `MsgReclaimLockedFundsV2` cannot be signed with EIP712 v1 either: the chain declares its bytes as `uint8[]` but carries their base64 string, which no typed-data encoder can hash, so `getEip712TypedData()` rejects it (use v2).
- **EIP712 v1 payloads of the remaining V2 messages now follow the chain exactly** (verified against the gateway): zero / empty values are omitted from the typed-data values, an empty `cid` is omitted, `expiration_block` of a good-till-block order is included (it was previously dropped from the values while still declared in the types), `MsgUpdateSubaccountRiskProfileV2` includes and types `credit_line_id` when set, and `MsgUpdateSwapParamsV2` omits an empty allowlist from the types. This changes the v1 signing payload (Ledger / Trezor / private-key wallets using `broadcast()`); `broadcastV2` / EIP712 v2 is unaffected.
- **`getEip712TypedData()` rejects incomplete EIP712 v1 payloads before wallet signing.** The chain can declare fields that Amino omits, and its v1 hasher cannot hash those missing values. This includes disabled swaps, zero risk-profile enums, market-mode unpinning, insurance-pool resumption, and orders without an expiration block. Use `broadcastV2()` / `getEip712TypedDataV2()` for these cases. Amino serialization and the chain's type declarations are preserved.
- **`toAmino()` of the V2 exchange messages and `MsgSubmitProposalPerpetualMarketLaunchV2` now matches the chain's amino-json sign bytes** (LegacyDec fields as scaled integers, zero/empty fields omitted, oneof wrapper, amino names read from the proto). This is what Ledger (Cosmos app) signs. The values of `toWeb3Gw()`, `toEip712()` and `toEip712V2()` are unchanged (only the EIP712 v1 `type` strings carry the new `exchange/v2/` names, see the first bullet); the human-readable representation behind `toWeb3Gw()` stays available as `toAminoRaw()`. `MsgSubmitGenericProposal` embeds the inner messages' `toAmino()`, so inner V2 messages are now chain-format (scaled, zero-omitted) in its amino and EIP712 v1 payloads.
- **`toProto()` now takes human-readable decimals for `MsgUpdateSpotMarketV2`, `MsgUpdateDerivativeMarketV2` and `MsgInstantSpotMarketLaunchV2`** and scales them to the on-chain `LegacyDec` value (x 1e18), like the V2 order messages do. Their direct-sign / binary path previously sent the raw human value, which the chain cannot decode. Callers that worked around this by passing already-scaled values must switch to human-readable values or they will send values 1e18 times too large. As root messages these three are rejected by `getEip712TypedData()` (the chain's v1 typed-data generator cannot type their `LegacyDec` fields), use `getEip712TypedDataV2()`.
- Permissions `MsgUpdateParams` requires the new `ownerBlacklistQueryMaxGas` (the chain rejects `0`).
- New messages: `MsgUpdateSubaccountMarketRiskModeV2` and the consolidated-insurance messages (`MsgCreateConsolidatedInsurancePool`, `MsgSetConsolidatedInsurancePoolPause`, `MsgUpdateConsolidatedInsurancePolicy`, `MsgUnderwriteConsolidatedInsurancePool`, `MsgRequestConsolidatedRedemption`). New fields: `MsgLiquidateCrossMarginPoolV2.rfqAction`, `MsgUpdateDerivativeMarketV2.newReferencePriceGateConfig`, `syntheticTradeFeeRate` on the perpetual market launch proposal.
- `@injectivelabs/ts-types`: the type URLs of removed messages are now defined in `DeprecatedMsgType` (binary options, rewards opt-out, trading rewards, retired oracle relays, WasmX messages, OCR). `MsgType` still includes them, so existing `MsgType` references keep working.

Retired protobuf definitions, type URLs, oracle enum values, and Amino mappings remain available for historical decoding. Retired batch fields remain empty in the web3gw / EIP712 payloads to match core's retained protobuf schema (amino-json omits them, like the chain's encoder). Indexer and archive APIs are unchanged; this core PR does not change their service contracts.

---

## 📖 Documentation

- Read more and find example usages on our [Querying Docs](https://docs.ts.injective.network/querying)
- Read more and find example usages on our [Transactions Docs](https://docs.ts.injective.network/transactions)

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
