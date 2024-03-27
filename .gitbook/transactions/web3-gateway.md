# Web3 Gateway

_Pre-requisite reading #1:_ [Transaction Lifecycle](https://docs.cosmos.network/main/basics/tx-lifecycle)

_Pre-requisite reading #2:_ Transactions on Injective

The Web3Gateway microservice exposes an API to the end user with the main purpose of providing fee delegation for transactions that happen on Injective. This allows users to enjoy a gasless environment while interacting with Injective as the gas is paid for by the runner of the Web3Gateway service.

Alongside fee delegation support, Web3Gateway allows developers to convert Messages to EIP712 typed data. After converting the Message the EIP712 data, it can be signed by any Ethereum native wallet and then broadcasted to Injective.

### Fee Delegation

As said before, fee delegation allows users to interact with Injective (submit transactions) without having to pay for gas. As a part of the _Transaction Lifecycle_ of every Cosmos-SDK powered chain, we have `AnteHandler`'s, which, among other things perform a signature verification, gas calculation, and fee deduction.

There are a couple of things that we need to know:

* Transactions can have multiple signers (i.e we can include multiple signatures within a transaction),
* Gas Fee for the transaction is deducted from the `authInfo.fee.feePayer` value and the signature that gets verified against the `feePayer` is the first signature within the signatures list of the Transaction ([reference](https://github.com/cosmos/cosmos-sdk/blob/e2d6cbdeb55555893ffde3f2ae0ed6db7179fd0d/x/auth/ante/fee.go#L15-L24)),
* The rest of the signatures are being verified against the actual sender of the transaction.

Knowing this, to achieve fee delegation, we have to sign the transaction using the private key of the Web3Gateway microservice, including the address of that `privateKey` as a `feePayer`, sign this transaction using the privateKey that we want to interact with Injective from, and broadcast that transaction.

### Web3Gateway API

Everyone can run the Web3Gateway microservice and provide fee delegation services to their users. An example usage can be developers who build exchange dApps on top of Injective run this microservice to offer a gasless trading environment to their traders.

This microservice exposes an API containing two core methods:

* `PrepareTx`(and `PrepareCosmosTx`)
* `BroadcastTx` (and `BroadcastCosmosTx`)

### PrepareTx

The `PrepareTx` method accepts a Message(s) including context for the transaction the user wants to execute (`chainId`, `signerAddress`, `timeoutHeight`, etc), and returns an EIP712 typed data of the particular message, including its signature within the EIP712 typed data. We can use this EIP712 typed data to sign it using any Ethereum native wallet and get the signature for users who want to interact with Injective.

The EIP712 typed data is generated from the proto definition of the Message we pass to the `PrepareTx` method.

### BroadcastTx

The `BroadcastTx` method is responsible for broadcasting the transaction to the node. Alongside the full response of the `PrepareTx` API call, we pass in the signature of the EIP712 typed data. Then, the `BroadcastTx` packs the Message into a native Cosmos transaction, prepares the transaction (including its context) and broadcasts it to Injective. As a result, the transaction hash is being returned to the user.

### Prepare/BroadcastCosmosTx

The above methods are used when we use **Ethereum Native wallets** to sign and broadcast transactions as we sign an EIP712 transaction representation.&#x20;

If we want support fee delegation on Cosmos native wallets using the Web3Gateway, we can omit the PrepareCosmosTx call (or call it if we need the Web3Gateway signer's `publicKey`), prepare the transaction on the client side, sign it using a Cosmos wallet, and broadcast it using the `BroadcastCosmosTx` method.&#x20;

The way this works is we add the `publicKey` of the `Web3Gateway`'s signer to the `authInfo` object in the `TxRaw` and then sign the transaction using the `privateKey` on the API side when we broadcast&#x20;

{% hint style="info" %}
The difference with the previous EIP712 approach is that we need to sign the transaction using the `Web3Gateway`'s signer in advance i.e when we generate the EIP712 -> meaning that we need to use `PrepareTx` and can't generate the transaction on the client side.).
{% endhint %}
