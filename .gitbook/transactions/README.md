# Transactions

_Pre-requisite reading:_ [Cosmos SDK Transactions](https://docs.cosmos.network/main/core/transactions.html)

State changes on Injective can be done through transactions. Users create transactions, sign them and broadcast them to Injective.

When broadcasted and only after every validation is successfully passed (these validations include signature validation, parameters validations, etc) the transaction is included within a block which is approved by the network through a consensus process.

### Messages

Messages are the instructions included in transactions to specify the state change the user want to do. Every transaction has to have at least one message. Messages are module-specific objects that trigger state transitions within the scope of the module they belong to. We can pack multiple messages within the same transaction.

There is an abstraction class (_MsgBase_) that we export from the `@injectivelabs/sdk-ts` and every message extends the `MsgBase` interface, which has couple of mapping functionalities:

* `toData` -> Converts the Message to a simple Object representation,
* `toProto` -> Returns a proto representation of the Message,
* `toDirectSign` -> Converts the Message to a proto representation,
* `toAmino` -> Converts the Message to a amino representation + type,
* `toWeb3` -> alternative for `toAmino`, with the difference of the Message path type,
* `toEip712Types` -> Generates the EIP712 types for the Message,
* `toEip712` -> Generates the Message EIP712 value
* `toJSON` -> Converts the message to a JSON representation,

### Transaction Context

Besides Message(s), every transaction has context. These details include `fees`, `accountDetails`, `memo`, `signatures`, etc.

### Transaction Flow

Every transaction we want to broadcast to Injective has the same flow. The flow consists of three steps: preparing, signing and broadcasting the transaction.

***

### Topics

| Topic                                               | Description                                                |
| --------------------------------------------------- | ---------------------------------------------------------- |
| [Using the Ethereum approach](ethereum.md)          | Prepare/Sign EIP712 typed data then broadcast              |
| [Using the Cosmos approach](transactions-cosmos.md) | Prepare/Sign/Broadcast Cosmos transactions                 |
| [Using a Private Key](private-key.md)               | Prepare/Sign/Broadcast Cosmos transaction with private key |
| [Web3Gateway Microservice](web3-gateway.md)         | A microservice for supporting fee Delegation               |
| [Msg Broadcaster](msgbroadcaster.md)                | Abstraction for broadcasting messages                      |

***

**The messages that are available (and examples) can be found in Core Modules section of the Wiki.**
