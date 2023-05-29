# Web3 Gateway

_Pre-requisite reading #1:_ [Transaction Lifecycle](https://docs.cosmos.network/main/basics/tx-lifecycle)

_Pre-requisite reading #2:_ Transactions on Injective

The Web3Gateway microservice exposes an API to the end user with the main purpose of providing fee delegation for transactions that happen on Injective. This allows users to enjoy a gasless environment while interacting with Injective as the gas is being paid by the runner of the Web3Gateway service.

Alongside fee delegation support, Web3Gateway allows developers to convert Messages to EIP712 typed data. After converting the Message te EIP712 data, it can be signed by any Ethereum native wallet and then broadcasted to Injective.

### Fee Delegation

As said before, fee delegation allows users to interact with Injective (submit transactions) without having to pay for gas. As a part of the _Transaction Lifecycle_ of every Cosmos-SDK powered chain, we have _AnteHandler_s, which, among other things perform signature verification, gas calculation and fee deduction.

There are couple of things that we need to know:

* Transactions can have multiple signers (i.e we can include multiple signatures within a transaction),
* Gas Fee for the transaction is deducted from the `authInfo.fee.feePayer` value and the signature that gets verified against the `feePayer` is the first signature within the signatures list of the Transaction ([reference](https://github.com/cosmos/cosmos-sdk/blob/e2d6cbdeb55555893ffde3f2ae0ed6db7179fd0d/x/auth/ante/fee.go#L15-L24)),
* The rest of the signatures are being verified against the actual sender of the transaction.

Knowing this, to achieve fee delegation, we have to sign the transaction using the private key of the Web3Gateway microservice, include the address of that privateKey as a `feePayer`, sign this transaction using the privateKey that we actually want to interact with Injective from and broadcast that transaction.

### Web3Gateway API

Everyone can run the Web3Gateway microservice and provide fee delegation services to their users. As an example usage, developers who build exchange dApps on top of Injective can run this microservice to offer gasless trading environment to their traders.

This microservice exposes an API containing two core methods:

* `PrepareTx`
* `BroadcastTx`

#### PrepareTx

The `PrepareTx` method accepts a Message(s) including context for the transaction the user wants to execute (`chainId`, `signerAddress`, `timeoutHeight`, etc), and returns an EIP712 typed data of the particular message which includes the `feePayer` and its signature within the EIP712 typed data. We can use this EIP712 typed data to sign it using any Ethereum native wallet and get the signature for the user that wants to interact with Injective.

The EIP712 typed data is generated from the proto definition of the Message we pass to the `PrepareTx` method.

#### BroadcastTx

The `BroadcastTx` method is responsible for broadcasting the transaction to the node. Alongside the full response of the `PrepareTx` API call, we pass in the signature of the EIP712 typed data. Then, the `BroadcastTx` packs the Message into a native Cosmos transaction, prepares the transaction (including its context) and broadcasts it to Injective. As a result, the transaction hash is being returned to the user.

***

🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧

This wiki page is currently under work in progress.

🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧
