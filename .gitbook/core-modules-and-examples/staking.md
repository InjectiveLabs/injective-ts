# Staking

The module enables Cosmos SDK-based blockchain to support an advanced Proof-of-Stake (PoS) system. In this system, holders of the native staking token of the chain can become validators and can delegate tokens to validators, ultimately determining the effective validator set for the system.

### Messages

Let's explore (and provide examples) the Messages that the Staking module exports and we can use to interact with the Injective chain.

### MsgBeginRedelegate

This Message is used to Redelegate staked INJ from one validator to another.

```ts
import { MsgBeginRedelegate, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { toChainFormat } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'

const denom = 'inj'
const privateKey = '0x...'
const injectiveAddress = 'inj1...'
const sourceValidatorAddress = 'inj1...'
const destinationValidatorAddress = 'inj1...'
const amount = toChainFormat(5).toFixed()

const msg = MsgBeginRedelegate.fromJSON({
  injectiveAddress,
  dstValidatorAddress: destinationValidatorAddress,
  srcValidatorAddress: sourceValidatorAddress,
  amount: {
    denom,
    amount,
  },
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
}).broadcast({
  msgs: msg,
})

console.log(txHash)
```

### MsgDelegate

This Message is used to Delegate INJ to a validator.

```ts
import { Network } from '@injectivelabs/networks'
import { toChainFormat } from '@injectivelabs/utils'
import { MsgDelegate, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'

const denom = 'inj'
const injectiveAddress = 'inj1...'
const privateKey = '0x...'
const amount = toChainFormat(5).toFixed()
const validatorAddress = 'inj1...'

const msg = MsgDelegate.fromJSON({
  injectiveAddress,
  validatorAddress,
  amount: {
    denom,
    amount,
  },
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
}).broadcast({
  msgs: msg,
})

console.log(txHash)
```

### MsgCancelUnbondingDelegation

This message is used to cancel unbonding from a validator, reset the bonding period, and delegate back to the previous validator.

```ts
import { Network } from '@injectivelabs/networks'
import { toChainFormat } from '@injectivelabs/utils'
import { MsgCancelUnbondingDelegation, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'

const denom = 'inj'
const privateKey = '0x...'
const delegatorAddress = 'inj1...'
const validatorAddress = 'inj1...'
const creationHeight = '123456' // the height at which the unbonding was initiated
const amount = toChainFormat(5).toFixed()

const msg = MsgCancelUnbondingDelegation.fromJSON({
  delegatorAddress,
  validatorAddress,
  amount: {
    denom,
    amount,
  },
  creationHeight,
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
}).broadcast({
  msgs: msg,
})

console.log(txHash)
```
