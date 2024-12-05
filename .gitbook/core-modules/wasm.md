# Wasm

The `wasm` module is the heart of interacting with the wasm smart contracts deployed on the injective chain, here you can find a list of [smart contracts](https://explorer.injective.network/contracts/) that are deployed on the Injective chain.

{% hint style="info" %}
`MsgUpdateCode` and `MsgStoreCode` are not support by the Metamask wallet.
{% endhint %}



### MsgExecuteContract (Transfer)

This message is used to execute contract function, below we will use the [CW20 spec](https://github.com/CosmWasm/cw-plus/blob/main/packages/cw20/README.md) transfer message as an example.

```ts
import { MsgExecuteContract, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { Network } from '@injectivelabs/networks'

const injectiveAddress = 'inj1...'
const recipientAddress = 'inj2...'
const contractAddress = 'cw...'

const msg = MsgExecuteContract.fromJSON({
  contractAddress,
  sender: injectiveAddress,
  exec: {
    action: 'transfer',
    msg: {
      recipient: recipientAddress,
      amount: 100000,
    },
  },
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Mainnet,
}).broadcast({
  msgs: msg,
})

console.log(txHash)
```

### MsgExecuteContract (funds example)

In some scenarios, depending on the smart contract's function we have to transfer tokens to the smart contract, following cosmwasm convention, we use the funds field to transfer tokens to the smart contract from the user's bank module.

Below is an example of how we can send the `MsgExecuteContract` using an `test` contract function.

```ts
import { MsgExecuteContract, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { INJ_DENOM } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'

const injectiveAddress = 'inj1...'
const contractAddress = 'cw...'

const msg = MsgExecuteContract.fromJSON({
  contractAddress,
  sender: injectiveAddress,
  exec: {
    action: 'test',
    funds: [
      {
        denom: 'inj',
        amount: new BigNumberInBase(1).toWei().toFixed(),
      },
    ],
  },
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Mainnet,
}).broadcast({
  msgs: msg,
})

console.log(txHash)
```

### MsgExecuteContractCompat

There are some compatibility issues parsing the `funds` array and `msgs` object in the previous example with EIP712. Since `MsgExecuteContract` can't be properly converted to EIP712 and then signed by Ethereum wallets, we introduced `MsgExecuteContractCompat` which is fully compatible with EIP712.

_**Note:**_ _`MsgExecuteContract` and `MsgExecuteContractCompat` underlying messages are the same. `MsgExecuteContractCompat` is just EIP712 compatible._

Below is an example of how we can send the `MsgExecuteContractCompact` using an `test` contract function.

```ts
import {
  MsgBroadcasterWithPk,
  MsgExecuteContractCompat,
} from '@injectivelabs/sdk-ts'
import { INJ_DENOM } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'

const injectiveAddress = 'inj1...'
const contractAddress = 'cw...'

const msg = MsgExecuteContractCompat.fromJSON({
  contractAddress,
  sender: injectiveAddress,
  exec: {
    action: 'test',
    funds: [
      {
        denom: INJ_DENOM,
        amount: new BigNumberInBase(1).toWei().toFixed(),
      },
    ],
  },
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Mainnet,
}).broadcast({
  msgs: msg,
})

console.log(txHash)
```
