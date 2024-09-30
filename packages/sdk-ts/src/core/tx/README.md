### Generating a transaction

To generate a transaction that can be broadcasted to Injective, you can use the `createTransaction` function. Here is its definition and the params it receives / result it gives so its easier to understand:

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
  signers: {
    pubKey: string // the pubKey of the signer of the transaction in base64
    sequence: number // the sequence (nonce) of the signer of the transaction
    accountNumber: number // the account number of the signer of the transaction
  }
  bodyBytes: Uint8Array // the body bytes of the transaction
  authInfoBytes: Uint8Array // the auth info bytes of the transaction
  signBytes: Uint8Array // the sign bytes of the transaction (SignDoc serialized to binary)
  signHashedBytes: Uint8Array // the sign bytes of the transaction (SignDoc serialized to binary) and hashed using keccak256
}
```

After the transaction is created, usually the `signBytes` of the result is getting signed and the signature gets appended on the `txRaw` that is also returned from the `createTransaction` function. Then, the `txRaw` is broadcasted to the Injective chain.

### Broadcasting a transaction

There are two ways to broadcast a transaction to the Injective chain. First, as mentioned above we need to get the `txRaw` transaction (with added signatures) and use one of the two available clients in this folder:

- TxGrpcClient (which broadcast the transaction using the gRPC protocol), the endpoint passed to the constructor should be the `sentryGrpcEndpoint`
- TxRestClient (which broadcast the transaction using the REST protocol), the endpoint passed to the constructor should be the `sentryHttpEndpoint`

There are pre-defined endpoints for different environments that can be found in the `@injectivelabs/networks` package.

Also, both of the clients have a `simulate` method which simulates the transaction before executing it on the chain.
