# 🌟 Injective Protocol - TX TS

[![downloads](https://img.shields.io/npm/dm/@injectivelabs/tx-ts.svg)](https://www.npmjs.com/package/@injectivelabs/tx-ts)
[![npm-version](https://img.shields.io/npm/v/@injectivelabs/tx-ts.svg)](https://www.npmjs.com/package/@injectivelabs/tx-ts)
[![license](https://img.shields.io/npm/l/express.svg)]()

_Accessing decentralized finance through TypeScript (for Web and Node environment)_

`@injectivelabs/tx-ts` is a TypeScript package for generating transactions from Messages easily that can be broadcasted to Injective. It also provides broadcasting clients that broadcast the transaction to Injective.

### 📚 Installation

```bash
yarn add @injectivelabs/tx-ts
```

---

## 📖 Documentation

There are three pieces of the `tx-ts` - **generating a transaction**, **broadcasting a transactions** and utility functions that can be performed on a transaction.

### Generating a transaction

To generate a transaction that can be broadcasted to Injective, you can use the `createTransaction` function from the `@injectivelabs/tx-ts` package. Here is its definition and the params it receives / result it gives so its easier to understand:

```ts
export function createTransaction = (args: CreateTransactionArgs): CreateTransactionResult

/** @type {CreateTransactionArgs} */
export interface CreateTransactionArgs {
  message: MsgArg | MsgArg[] // the message that should be packed into the transaction
  memo: string // the memo to include in the transaction
  fee: StdFee // the fee to include in the transaction
  pubKey: string // the pubKey of the signer of the transaction in base64
  sequence: number // the sequence (nonce) of the signer of the transaction
  accountNumber: number // the account number of the signer of the transaction
  chainId: string // the chain id of the chain that the transaction is going to be broadcasted to
}

/** @type {CreateTransactionResult} */
export interface CreateTransactionResult {
  txRaw: TxRaw // the Tx raw that was created
  signDoc: SignDoc // the SignDoc that was created - used for signing of the transaction
  accountNumber: number // the account number of the signer of the transaction
  bodyBytes: Uint8Array // the body bytes of the transaction
  authInfoBytes: Uint8Array // the auth info bytes of the transaction
  signBytes: Uint8Array // the sign bytes of the transaction (SignDoc serialized to binary)
  signHashedBytes: Uint8Array // the sign bytes of the transaction (SignDoc serialized to binary) and hashed using keccak256
}
```

After the transaction is created, usually the `signBytes` of the result is getting signed and the signature gets appended on the `txRaw` that is also returned from the `createTransaction` function. Then, the `txRaw` is broadcasted to the Injective chain.

### Broadcasting a transaction

There are two ways to broadcast a transaction to the Injective chain. First, as mentioned above we need to get the `txRaw` transaction (with added signatures) and use one of the two available clients exported from this package:

- TxGrpcClient (which broadcast the transaction using the gRPC protocol), the endpoint passed to the constructor should be the `sentryGrpcEndpoint`
- TxRestClient (which broadcast the transaction using the REST protocol), the endpoint passed to the constructor should be the `sentryHttpEndpoint`

There are pre-defined endpoints for different environments that can be found in the `@injectivelabs/networks` package.

Also, both of the clients have a `simulate` method which simulates the transaction before executing it on the chain.

---

## ⛑ Support

Reach out to us at one of the following places!

- Website at <a href="https://injective.com" target="_blank">`injective.com`</a>
- Twitter at <a href="https://twitter.com/Injective_" target="_blank">`@Injective`</a>
- Discord at <a href="https://discord.com/invite/NK4qdbv" target="_blank">`Discord`</a>
- Telegram at <a href="https://t.me/joininjective" target="_blank">`Telegram`</a>

---

## 🔓 License

This software is licensed under the MIT license. See [LICENSE](./LICENSE) for full disclosure.

<p>&nbsp;</p>
<div align="center">
  <sub><em>Powering the future of decentralized finance.</em></sub>
</div>
