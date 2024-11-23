# Convert Cw20 to Bank and Place Market Order In One Transaction Example

This example helps you create messages to convert CW20 tokens to bank tokens on the Injective blockchain. This is particularly useful when you have CW20 tokens and need to convert them to their bank equivalents to perform operations like placing market orders. Note that this flow only works for cw20 tokens and their corresponding [factory tokens](../readme/application-concepts.md).

This guide will walk you through:

- Obtaining the user's CW20 token balance.
- Creating a message to convert CW20 tokens to bank tokens using ConvertCw20ToBankService
- Executing a market order using the converted bank balance and existing bank balance

## Get User's CW20 Balance

[Detailed here](../querying/querying-api/querying-indexer-explorer.md#fetch-cw20-balances)

- Find the cw20 address and balance from the result set that you want to convert to a bank factory token

## Create CW20 to Bank Conversion Message

- create the `convertMsg` using the steps detailed [here](../readme/application-concepts#example-on-how-to-convert-cw20-to-a-factory-denom) in order to convert your cw20 token to a bank factory token. No need to submit the tsx yet.

## Create a `MsgCreateSpotMarketOrder` message

- Create the `msg` using the steps detailed in [MsgCreateSpotMarketOrder](../core-modules/exchange.md#msgcreatespotmarketorder). No need to submit the tsx yet.
- Note that the buy order you create will have access to your converted cw20 balance + existing bank balance. Example:

```ts
const order = {
  price: 1,
  quantity: 10,
}
```

- If you had 5 Cw20 tokens and 5 bank tokens at a price of $1 each, then the order above will go through because we will convert the cw20 to bank before the chain executes this market order. This will be more clear in the next step.

## Place a Market Order Using Converted CW20 Balance and your existing bank balance

Now that you have both messages formatted, you can convert your cw20 tokens to bank factory tokens and then place a market order using the combined balance, all in one transaction

```ts
import { MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { Network } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.MainnetSentry,
}).broadcast({
  msgs: [convertMsg, msg], // the convert to bank message executes first, Then, you will have that additional balance to complete your market order in the following msg
})

console.log(txHash)
```
