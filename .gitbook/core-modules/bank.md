# Bank

The bank module is responsible for handling multi-asset coin transfers between accounts and tracking special-case pseudo-transfers which must work differently with particular kinds of accounts (notably delegating/undelegating for vesting accounts). It exposes several interfaces with varying capabilities for secure interaction with other modules which must alter user balances.

In addition, the bank module tracks and provides query support for the total supply of all assets used in the application.

### Messages

Let's explore (and provide examples) the Messages that the Bank module exports and we can use to interact with the Injective chain.

#### MsgSend

This Message is used to send coins from one address to another.

```ts
import { MsgSend, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'
import { ChainId } from '@injectivelabs/ts-types'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'
const amount = {
  denom: 'inj',
  amount: new BigNumberInBase(1).toWei()
}
const msg = MsgSend.fromJSON({
  amount,
  srcInjectiveAddress: injectiveAddress,
  dstInjectiveAddress: injectiveAddress,
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress,
})

console.log(txHash)
```
