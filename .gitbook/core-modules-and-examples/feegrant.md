# Fee Grant

The `feegrant` module allows accounts (granters) to grant fee allowances to other accounts (grantees). This allows the grantee to use the granter's funds to pay for transaction fees.

## Messages

### MsgGrantAllowance

A fee allowance grant is created using the `MsgGrantAllowance` message. If there is already a grant for the (granter, grantee) pair, then the new grant will overwrite the previous one.

```ts
import { MsgGrantAllowance, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { Network } from '@injectivelabs/networks'


const privateKeyOfGranter = '0x...'

const date = new Date('2023-10-02T00:00:00Z')
const expiration = date.getTime() / 1000
const granter = 'inj...'
const grantee = 'inj...'
const allowance = {
  spendLimit: [
    {
      denom: 'inj',
      amount: '10000',
    },
  ],
  expiration
}

const msg = MsgGrantAllowance.fromJSON({
  granter,
  grantee,
  allowance,
})

const txHash = await new MsgBroadcasterWithPk({
privateKey: privateKeyOfGranter,
network: Network.Testnet,
}).broadcast({
msgs: msg,
})

console.log(txHash)

```

### MsgRevokeAllowance
A grant can be removed using the MsgRevokeAllowance message. The grantee will no longer be able to use the granter's funds to pay for transaction fees.

```ts
import { MsgRevokeAllowance, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { Network } from '@injectivelabs/networks'

const privateKey= "0x..."
const granteeAddress = 'inj...'
const granterAddress = 'inj...'

const params = {
grantee: granteeAddress,
granter: granterAddress,
}

const msg = MsgRevokeAllowance.fromJSON(params);

const txHash = await new MsgBroadcasterWithPk({
privateKey,
network: Network.Testnet,
}).broadcast({
msgs: msg,
})

console.log(txHash)
```
