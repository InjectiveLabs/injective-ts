# MsgBroadcaster

The `MsgBroadcast`er abstraction class is a way to broadcast transactions on Injective with ease. With it, you can pass a Message that you want to be packed in a transaction and the signer's address and the transaction will be prepared, signed, and broadcasted.

An example of usage can be found on our [Helix demo repo](https://github.com/InjectiveLabs/injective-helix-demo). As for the messages that you can pass to the `broadcast` methods, you can find examples in the [Core Modules](../core-modules-and-examples/core-modules.md) section of the docs.

### MsgBroadcaster + Wallet Strategy

This MsgBroadcaster is used alongside the Wallet Strategy class for building decentralized applications.&#x20;

To instantiate (and use) the `MsgBroadcaster` class, you can use the following code snippet

```ts
import { ChainId, EthereumChainId } from "@injectivelabs/ts-types"
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { MsgBroadcaster } from '@injectivelabs/wallet-core'
import { MsgSend } from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'
import { WalletStrategy } from '@injectivelabs/wallet-strategy'

export const alchemyRpcEndpoint = ""
export const walletStrategy = new WalletStrategy({
  chainId: ChainId.Mainnet,
  ethereumOptions: {
    ethereumChainId: EthereumChainId.Mainnet,
    rpcUrl: alchemyRpcEndpoint
  },
  strategies: {}
})

export const msgBroadcaster = new MsgBroadcaster({
  walletStrategy,
  simulateTx: true,
  network: Network.Mainnet,
  endpoints: getNetworkEndpoints(Network.Mainnet),
  gasBufferCoefficient: 1.1,
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

#### Constructor/Broadcast Options

We allow to override some of the options passed to the constructor of `MsgBroadcaster` as well as when broadcasting the transaction. Here is the interface and the meaning of each field

````typescript
import { Msgs } from '@injectivelabs/sdk-ts'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { Network, NetworkEndpoints } from '@injectivelabs/networks'
import type { WalletStrategy } from '../strategies'

export interface MsgBroadcasterOptions {
  network: Network /** network configuration (chainId, fees, etc) - Network.MainnetSentry for mainnet or  Network.TestnetSentry for testnet */
  endpoints?: NetworkEndpoints /** optional - overriding the endpoints taken from the `network` param **/
  feePayerPubKey?: string /** optional - if you are using the fee delegation service, you can set the fee payer so you don't do an extra query to the Web3Gateway */
  simulateTx?: boolean /** simulate the transaction before broadcasting + get gas fees needed for the transaction */
  txTimeout?: number /** optional - blocks to wait for tx to be included in a block **/
  walletStrategy: WalletStrategy
  gasBufferCoefficient?: number /** optional - as gas buffer to add to the simulated/hardcoded gas to ensure the transaction is included in a block */
}

export interface MsgBroadcasterTxOptions {
  memo?: string /** MEMO added to the transaction **/
  injectiveAddress: string /** the signer of the transaction **/
  msgs: Msgs | Msgs[] /** the messages to pack into a transaction **/

  /*
  *** overriding the hardcoded gas/simulation -
  *** depending on the simulateTx parameter in
  *** the MsgBroadcaster constructor
  */
  gas?: {
    gasPrice?: string
    gas?: number /** gas limit */
    feePayer?: string
    granter?: string
  }
}

```
````

{% hint style="info" %}
To override the `endpoints` and use your infrastructure (which is something we recommend), please read more on the [Networks](../getting-started/application-concepts/networks.md) page on the endpoints you need to provide and how to set them up.&#x20;
{% endhint %}

### MsgBroadcaster with Private Key

This MsgBroadcaster is used with a private key (mostly used for CLI environments). Constructor/broadcast options are quite similar as for the `MsgBroadcaster`.

```ts
import { MsgSend, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
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
