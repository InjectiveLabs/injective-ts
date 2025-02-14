# Wallet

Injective defines its own custom `Account` type that uses Ethereum's ECDSA secp256k1 curve for keys. In simple words said, it means that Injective's Account is native (compatible) with Ethereum accounts. This allows users to use Ethereum native wallets to interact with Injective.

Injective is built on top of the CosmosSDK. This means that (with some modifications, since Cosmos uses different curve for keys) users can also use Cosmos native wallets to interact with Injective.

### Technical Explanation

Let's briefly explain how the accounts (wallets) work on Injective and in crypto in general.&#x20;

* Everything starts from a **SeedPhase** (or mnemonic). A **SeedPhrase** is a list of 12 or 24 common words in a particular order.&#x20;
* From the **SeedPhase** you can have an **infinite** number of **PrivateKeys** derived using indexing (the first private key starts at index 0). This is why you can add multiple accounts on Metamask, Keplr, or any other popular wallet without generating a new **SeedPhase** _(the derivation itself is a bit complicated for this brief explanation so we are going to omit it for now)._&#x20;
* After a **PrivateKey** has been derived from your **seed phase**, you can use this **PrivateKey** to derive your **PublicKey**. **One PrivateKey always corresponds to one PublicKey!**&#x20;
* Once you have your P**ublicKey** you can derive your **PublicAddress**. These public addresses can be derived using different derivation schemes and representations (_base64_, _hex_, _bech32_, etc).&#x20;

With the explanation above, we can understand that once you have your **PublicKey** you can derive both your Ethereum address (represented in a hex format, `0x...`) and your Injective address (represented in a bech32 format, `inj1...`).&#x20;

***

### Topics

| Topic                                                   | Description                                                     |
| ------------------------------------------------------- | --------------------------------------------------------------- |
| [Accounts on Injective](wallet-accounts.md)             | Accounts/Wallets definition on Injective                        |
| [Wallet Connections](wallet-connections.md)             | Connecting directly using Metamask or Keplr                     |
| [Wallet Strategy](wallet-wallet-strategy.md)            | Using the WalletStrategy to connect using different wallets     |
| [Offchain (Arbitrary) Data](offchain-arbitrary-data.md) | Signing and verifying data offchain using the ADR-036 by Cosmos |
