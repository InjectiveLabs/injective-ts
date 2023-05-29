# MsgBroadcaster

The `MsgBroadcast`er abstraction class is a way to broadcast transactions on Injective with ease. With it, you can just pass a Message that you want to be packed in a transaction and the signer address and the transaction will be prepared, signed and broadcasted.

### MsgBroadcaster + Wallet Strategy

This MsgBroadcaster is used alongside the Wallet Strategy class for building decentralized applications.

To instantiate (and use) the `MsgBroadcaster` class, you can use the following code snippet

```ts
import { MsgBroadcaster } from '@injectivelabs/wallet-ts'
import { MsgSend } from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'

export const msgBroadcastClient = new MsgBroadcaster({
  walletStrategy, /* instantiated wallet strategy */
  network: NETWORK,
}) 

// Usage Example
(async () => {
  const signer = 'inj1...'
  
  const msg = MsgSend.fromJSON({
    amount: {
        denom: 'inj',
        amount: new BigNumberInBase(0.01).toWei().toFixed()
    },
    srcInjectiveAddress: signer,
    dstInjectiveAddress: 'inj1...',
  });

  // Prepare + Sign + Broadcast the transaction using the Wallet Strategy
  await msgBroadcastClient.broadcast({
      injectiveAddress: signer, 
      msgs: msg
  })
})()
```

### MsgBroadcaster with Private Key

This MsgBroadcaster is used by passing a private key (mostly used for CLI environments).

```ts
import { MsgBroadcasterWithPk } from '@injectivelabs/wallet-ts'
import { MsgSend } from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'

export const msgBroadcasterWithPk = new MsgBroadcasterWithPk({
  privateKey: `0x...`, /** private key hash or PrivateKey class from sdk-ts */
  network: NETWORK,
}) 

// Usage Example
(async () => {
  const signer = 'inj1...'
  
  const msg = MsgSend.fromJSON({
    amount: {
        denom: 'inj',
        amount: new BigNumberInBase(0.01).toWei().toFixed()
    },
    srcInjectiveAddress: signer,
    dstInjectiveAddress: 'inj1...',
  });

  // Prepare + Sign + Broadcast the transaction using the Wallet Strategy
  await msgBroadcasterWithPk.broadcast({
      injectiveAddress: signer, 
      msgs: msg
  })
})()
```
