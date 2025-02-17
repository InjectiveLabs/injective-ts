# Denom Client (deprecated)

This is deprecated, refer to the [injective-list](../../readme/assets/readme/token-metadata/injective-list.md) guide instead.

~~The easiest way to get the token metadata information for a particular denom is to utilize the `TokenFactory` class and use its methods:~~

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

~~There are few edge cases that we have to consider while using the \`TokenFactory\`:~~

* ~~If you are trying to query token metadata for a denom that doesn't exist in the~~ [~~list of tokens~~](https://github.com/InjectiveLabs/injective-ts/blob/master/deprecated/token-metadata/src/tokens/tokens/tokens.ts) ~~the `TokenFactory` will return undefined. If so, you should follow our~~ [~~CONTRIBUTION guide~~](https://github.com/InjectiveLabs/injective-ts/blob/master/deprecated/token-metadata/CONTRIBUTING.md) ~~to add the token metadata information in the package.~~
* ~~**IMPORTANT**~~ ~~`TokenFactory` does not have the logic to query a denom trace for an IBC denom. Instead, we have a list of pre-defined IBC hashes which we use to get metadata from. We'll explore how to have this possibility as well below.~~

#### DenomClientAsync (deprecated)

~~As part of the `@injectivelabs/sdk-ui-ts` package we have an abstraction class~~ [~~DenomClientAsync~~](../../../packages/sdk-ui-ts/src/denom/DenomClientAsync.ts) ~~which uses the `TokenFactory` class under the hood, has a caching mechanism for IBC hashes, fetches token metadata from the chain, ERC20 contract details, CW20 contract details, etc. With it, you can ensure that you get all of the `Token` information for the denoms used within your application.~~

~~The usage is pretty simple, here is an example:~~

```ts
import { DenomClientAsync } from '@injectivelabs/sdk-ui-ts'
import { Network } from '@injectivelabs/networks'

const network = Network.Mainnet
const denomClient = new DenomClientAsync(network) // you can omit the network argument if you want to have the TokenFactory for mainnet

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
