# Wallet

Injective defines its own custom `Account` type that uses Ethereum's ECDSA secp256k1 curve for keys. In simple words said, it means that Injective's Account is native (compatible) with Ethereum accounts. This allows users to use Ethereum native wallets to interact with Injective.

Injective is built on top of the CosmosSDK. This means that (with some modifications, since Cosmos uses different curve for keys) users can also use Cosmos native wallets to interact with Injective.

***

### Topics

| Topic                                        | Description                                                 |
| -------------------------------------------- | ----------------------------------------------------------- |
| [Accounts on Injective](wallet-accounts.md)  | Accounts/Wallets definition on Injective                    |
| [Wallet Connections](wallet-connections.md)  | Connecting directly using Metamask or Keplr                 |
| [Wallet Strategy](wallet-wallet-strategy.md) | Using the WalletStrategy to connect using different wallets |
