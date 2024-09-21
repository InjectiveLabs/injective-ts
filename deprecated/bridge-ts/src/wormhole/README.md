The use-case of the `WormholeClient` is to enable a bridge between Injective and Wormhole. This abstraction is mainly used to transfer assets between Injective and Solana using Wormhole. Let's quickly see the process of transferring assets between Injective and Solana using the `WormholeClient`.

### Solana -> Injective

To transfer assets to Injective through Wormhole from the Solana network we need to:

1. Determine the address on Injective where we're sending the tokens.

2. Submit a transfer message on Solana using the recipient address. This will output a log that contains a sequence number (a unique number for the message) and an emitter address (the ETH Token Bridge Address in Wormhole format).

3. Retrieve the VAA (Verified Action Approval) from the Guardian Network.

4. After retrieving, we post the VAA to Injective in order to mint the wrapped tokens.

5. Finally, we claim the tokens on Injective

### Injective -> Solana

🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧

This documentation is currently under work in progress.

🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧 🚧
