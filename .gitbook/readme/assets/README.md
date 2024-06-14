# Assets (Token Metadata)

## Denom

A denom is how assets are represented within the Bank module of Injective. These assets can be used for trading, creating new markets on the exchange module, participating in auctions, transferring to another address, etc.

Depending on the origin of the denom and how it was created on Injective we have different types of denoms:

- **Native denoms** - there is only one denom of this type, the `inj` denom which represented the native coin of Injective,
- **Peggy denoms** - these denoms represent assets bridged over from Ethereum to Injective using the Peggy bridge. They have the following format `peggy{ERC20_CONTRACT_ADDRESS}`
- **IBC denoms** - these denoms represent assets bridged over from other Cosmos chains through IBC. They have the following format `ibc/{hash}`.
- **Insurance Fund Denoms** - these denoms represent token shares of the insurance funds created on Injective. They have the following format `share{id}`
- **Factory Denoms** - these denoms are a representation of a CW20 token from Cosmwasm on the Injective native bank module. They have the following format `factory/{OWNER}/{SUBDENOM}` where the `OWNER` is the owner who created the factory denom. One example is the CW20 token factory denom `factory/{CW20_ADAPTER_CONTRACT}/{CW20_CONTRACT_ADDRESS}` where the `CW20_ADAPTER_CONTRACT` is the adapter contract address which does the conversion between CW20 and the native Bank module.

#### Token

Token is simply a denom on the Injective chain with some meta information. The metadata includes information like symbol, name, decimals, logo for the particular denom, etc. The metadata of the denom is quite important for a dApp developer as information on the chain is stored in its raw form (for example `1inj` on the chain is represented as `1*10^18inj`) so we need to have a way to show the user human-readable information (numbers, logo, symbol, etc).

## Token Metadata

Assets on Injective are represented as denoms. Denoms (and the amounts) are not human readable and this is why we need to have a way to "attach" token metadata information for a particular denom.

Let's recap the types of denoms we have in the Getting Started section:

- **Native denoms** - there is only one denom of this type, the `inj` denom which represented the native coin of Injective,
- **Peggy denoms** - these denoms represent assets bridged over from Ethereum to Injective using the Peggy bridge. They have the following format `peggy{ERC20_CONTRACT_ADDRESS}`
- **IBC denoms** - these denoms represent assets bridged over from other Cosmos chains through IBC. They have the following format `ibc/{hash}`.
- **Insurance Fund Denoms** - these denoms represent token shares of the insurance funds created on Injective. The have the following format `share{id}`
- **Factory Denoms** - these denoms are a representation of a CW20 token from Cosmwasm on the Injective native bank module. They have the following format `factory/{CW20_ADAPTER_CONTRACT}/{CW20_CONTRACT_ADDRESS}` where the `CW20_ADAPTER_CONTRACT` is the adapter contract address which does the conversion between CW20 and the native Bank module.

We maintain our own token metadata list off-chain for faster access on the [injective-list](https://github.com/InjectiveLabs/injective-list) repository.

### Token Verification

Verifying your token's metadata can be done in a couple of ways. Here are the verification levels and what they mean:&#x20;

- **Verified** -> Your asset metadata has been **submitted and verified** to the `@injectivelabs/token-metadata` package. You can find a tutorial on how to add your token's metadata to the package [here](../../../deprecated/token-metadata/CONTRIBUTING.md).
- **Submitted** -> Your asset metadata has been **submitted** to the `@injectivelabs/token-metadata` package. You can find a tutorial on how to add your token's metadata to the package [here](../../../deprecated/token-metadata/CONTRIBUTING.md).
- **Internal** -> Your asset's metadata has been verified on-chain using the `MsgSetDenomMetadata` message, as explained [here](https://docs.ts.injective.network/core-modules/token-factory#msgsetdenommetadata).
- **External** -> Your asset's metadata has been verified on some external source like from Ethereum's contract details, etc.
- **Unverified** -> Your asset's metadata has not been provided anywhere.
