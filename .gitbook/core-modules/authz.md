# AuthZ

The `authz` module is an implementation of a Cosmos SDK module, per ADR 30, that allows granting arbitrary privileges from one account (the granter) to another account (the grantee).

### Messages

#### MsgGrant

An authorization grant is created using the MsgGrant message. If there is already a grant for the (granter, grantee, Authorization) triple, then the new grant will overwrite the previous one. To update or extend an existing grant, a new grant with the same (granter, grantee, Authorization) triple should be created.

List of useful message types:

```
"/injective.exchange.v1beta1.MsgCreateSpotLimitOrder",
"/injective.exchange.v1beta1.MsgCreateSpotMarketOrder",
"/injective.exchange.v1beta1.MsgCancelSpotOrder",
"/injective.exchange.v1beta1.MsgBatchUpdateOrders",
"/injective.exchange.v1beta1.MsgBatchCancelSpotOrders",
"/injective.exchange.v1beta1.MsgDeposit",
"/injective.exchange.v1beta1.MsgWithdraw",
"/injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder",
"/injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder",
"/injective.exchange.v1beta1.MsgCancelDerivativeOrder",
"/injective.exchange.v1beta1.MsgBatchUpdateOrders",
"/injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders",
"/injective.exchange.v1beta1.MsgDeposit",
"/injective.exchange.v1beta1.MsgWithdraw",
```

Per [cosmos sdk docs](https://docs.cosmos.network/main/modules/authz), "Authorizations must be granted for a particular Msg service method one by one", so the following code snipped must be repeated for each message type that you would like for the `grantee` to have authorization on behalf of a `granter`.

```ts
import { MsgGrant, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKeyOfGranter = '0x...'
const grantee = 'inj...'
const granter = 'inj...'
const messageType = '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder' /* example message type */

const msg = MsgGrant.fromJSON({
   messageType,
    grantee,
    granter
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey: privateKeyOfGranter,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress: granter,
})

console.log(txHash)
```

#### MsgExec

When a grantee wants to execute a transaction on behalf of a granter, they must send MsgExec. In this example, we'll do a MsgSend to transfer assets from the granter's account address to another account address.

```ts
import { MsgExec, MsgSend, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKeyOfGrantee = '0x...'
const grantee = 'inj...'
const granter = 'inj...'

const msgs = MsgSend.fromJSON({
    amount: {
        denom: 'inj',
        amount: new BigNumberInBase(0.01).toWei().toFixed()
    },
    srcInjectiveAddress: granter,
    dstInjectiveAddress: 'inj1...',
  });

const msg = MsgExec.fromJSON({
    msgs,
    grantee,
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey: privateKeyOfGrantee,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress: grantee,
})

console.log(txHash)
```

#### MsgRevoke

A grant can be removed with the MsgRevoke message.

```ts
import { MsgRevoke, MsgBroadcasterWithPk, getEthereumAddress } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKeyOfGranter = '0x...'
const grantee = 'inj...'
const granter = 'inj...'
const messageType = '/injective.exchange.v1beta1.MsgCreateSpotLimitOrder' /* example message type */

const msg = MsgRevoke.fromJSON({
   messageType,
    grantee,
    granter
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey: privateKeyOfGranter,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress: granter,
})

console.log(txHash)
```
