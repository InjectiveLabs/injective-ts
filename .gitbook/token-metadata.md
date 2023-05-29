# Token Metadata

Assets on Injective are represented as denoms. Denoms (and the amounts) are not human readable and this is why we need to have a way to "attach" token metadata information for a particular denom. This is achievable using the `@injectivelabs/token-metadata` package.

Let's recap the types of denoms we have in the Getting Started section:

* **Native denoms** - there is only one denom of this type, the `inj` denom which represented the native coin of Injective,
* **Peggy denoms** - these denoms represent assets bridged over from Ethereum to Injective using the Peggy bridge. They have the following format `peggy{ERC20_CONTRACT_ADDRESS}`
* **IBC denoms** - these denoms represent assets bridged over from other Cosmos chains through IBC. They have the following format `ibc/{hash}`.
* **Insurance Fund Denoms** - these denoms represent token shares of the insurance funds created on Injective. The have the following format `share{id}`
* **Factory Denoms** - these denoms are a representation of a CW20 token from Cosmwasm on the Injective native bank module. They have the following format `factory/{CW20_ADAPTER_CONTRACT}/{CW20_CONTRACT_ADDRESS}` where the `CW20_ADAPTER_CONTRACT` is the adapter contract address which does the conversion between CW20 and the native Bank module.

Token is simply a denom on the Injective chain with some meta information. The metadata includes information like symbol, name, decimals, logo for the particular denom, etc. It has the following interface (more details can be found in [types.ts](https://github.com/InjectiveLabs/injective-ts/blob/master/packages/token-metadata/src/types.ts))

```ts
export interface Token {
  denom: string

  name: string
  logo: string
  symbol: string
  decimals: number
  tokenType?: TokenType
  coinGeckoId: string

  ibc?: IbcTokenMeta
  spl?: SplTokenMeta
  cw20?: Cw20TokenMeta
  cw20s?: Cw20TokenMetaWithSource[] // When there are multiple variations of the same CW20 token
  erc20?: Erc20TokenMeta
}
```

### Usage

The easiest way to get the token metadata information for a particular denom is to utilize the `TokenFactory` class and use its methods:

```ts
import { TokenFactory } from '@injectivelabs/token-metadata'
import { Network } from '@injectivelabs/networks'

const network = Network.Mainnet
const tokenFactory = TokenFactory.make(network) // you can omit the network argument if you want to have the TokenFactory for mainnet

// After instantiating, we can start using it in our dApp
const denom = 'peggy0x...'
const token = tokenFactory.toToken(denom)

console.log(token)
```

There are few edge cases that we have to consider while using the `TokenFactory`:

* If you are trying to query token metadata for a denom that doesn't exist in the [list of tokens](https://github.com/InjectiveLabs/injective-ts/blob/master/packages/token-metadata/src/tokens/tokens/tokens.ts) the `TokenFactory` will return undefined. If this is the case, you should follow our [CONTRIBUTION guide](https://github.com/InjectiveLabs/injective-ts/blob/master/packages/token-metadata/CONTRIBUTING.md) to add the token metadata information in the package.
* **IMPORTANT** `TokenFactory` does not have the logic to query a denom trace for an IBC denom. Instead, we have a list of pre-defined IBC hashes which we use to get metadata from. We'll explore how to have this possibility as well below.

#### DenomClient

As part of the `@injectivelabs/sdk-ts` package we have an abstraction class [DenomClient](https://github.com/InjectiveLabs/injective-ts/blob/master/packages/sdk-ts/src/core/utils/Denom/DenomClient.ts) which uses the `TokenFactory` class under the hood and has a caching mechanism for IBC hashes. With it, you can ensure that you get all of the `Token` information for the denoms used within your application.

The usage is pretty simple, here is an example:

```ts
import { DenomClient } from '@injectivelabs/sdk-ts'
import { Network } from '@injectivelabs/networks'

const network = Network.Mainnet
const denomClient = new DenomClient(network)  // you can omit the network argument if you want to have the TokenFactory for mainnet

// After instantiating, we can start using it in our dApp
const denom = 'peggy0x...'

/**
 * We have to use await here in case the IBC denom hash is not 
 * in the list of hardcoded IBC hashes so we fetch all of the 
 * denom traces from the chain and cache them in the local instance of the
 * DenomClient class so we can access them easily 
 */
const token = await denomClient.getDenomToken(denom)

console.log(token)
```
