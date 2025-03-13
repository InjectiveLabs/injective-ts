# Auction

The `auction` module is heart of the `buy-back-and-burn` on chain mechanism, where 60% of the weekly trading fees are collected and auctioned off to the highest INJ bidder where the submitted INJ of the highest bidder are burned in the process.

### MsgBid

This message is used to submit a bid on the [auction](https://hub.injective.network/auction/) held weekly to allow members to use INJ to bid for the basket of trading fees (60%) collected by Injective that week.

```ts
import {
  MsgBid,
  ChainGrpcAuctionApi,
  MsgBroadcasterWithPk,
} from '@injectivelabs/sdk-ts'
import { ChainId } from '@injectivelabs/ts-types'
import { INJ_DENOM, BigNumberInBase } from '@injectivelabs/utils'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpointsForNetwork = getNetworkEndpoints(Network.Mainnet)
const auctionApi = new ChainGrpcAuctionApi(endpointsForNetwork.grpc)

const injectiveAddress = 'inj1...'
/* format amount for bid, note that bid amount has to be higher than the current highest bid */
const amount = {
  denom: INJ_DENOM,
  amount: new BigNumberInBase(1).toWei(),
}

const latestAuctionModuleState = await auctionApi.fetchModuleState()
const latestRound = latestAuctionModuleState.auctionRound

/* create message in proto format */
const msg = MsgBid.fromJSON({
  amount,
  injectiveAddress,
  round: latestRound,
})

const privateKey = '0x...'

/* broadcast transaction */
const txHash = await new MsgBroadcasterWithPk({
  network: Network.Mainnet,
  privateKey,
}).broadcast({
  msgs: msg,
})

console.log(txHash)
```

### Burn Auction Deposit via MsgExternalTransfer

If you would like to grow the burn auction's pool size, you can directly send funds to the Auction subaccount.

Notes:

- You will need to send funds to the pool's subaccount `0x1111111111111111111111111111111111111111111111111111111111111111`.
- Be aware that any funds you send will be reflected in the next auction, not the current one.
- You cannot transfer from your default subaccountId since that balance is now associated with your Injective address in the bank module. Therefore, in order for `MsgExternalTransfer` to work, you will need to transfer from a non-default subaccountId.

How to find the subaccountId that you will be transferring from:

- you can query your existing subaccountIds via the [account portfolio api](../querying/querying-api/querying-indexer-portfolio.md).

How to use funds that are currently associated with your Injective Address in bank module:

- If you have existing non-default subaccounts, you'll want to do a[ MsgDeposit ](exchange.md#msgdeposit)to one of your existing non-default subaccountIds and use that subaccountId as the `srcSubaccountId` below.
- If you don't have existing non-default subaccounts, you can do a [MsgDeposit](exchange.md#msgdeposit) to a new default subaccountId, which would be done via importing `getSubaccountId` from `sdk-ts` and setting the `subaccountId` field in [MsgDeposit](exchange.md#msgdeposit) to `getSubaccountId(injectiveAddress, 1)`.

For more info, check out the [burn auction pool docs](https://docs.injective.network/developers/modules/injective/auction).

```ts
import {
  DenomClient,
  MsgExternalTransfer,
  MsgBroadcasterWithPk,
} from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'
import { Network } from '@injectivelabs/networks'

const denomClient = new DenomClient(Network.Mainnet)

const injectiveAddress = 'inj1...'
const srcSubaccountId = '0x...'
const POOL_SUBACCOUNT_ID = `0x1111111111111111111111111111111111111111111111111111111111111111`
const USDT_TOKEN_SYMBOL = 'USDT'
const tokenMeta = denomClient.getTokenMetaDataBySymbol(USDT_TOKEN_SYMBOL)
const tokenDenom = `peggy${tokenMeta.erc20.address}`

/* format amount to add to the burn auction pool */
const amount = {
  denom: tokenDenom,
  amount: new BigNumberInBase(1).toWei(tokenMeta.decimals).toFixed(),
}

/* create message in proto format */
const msg = MsgExternalTransfer.fromJSON({
  amount,
  srcSubaccountId,
  injectiveAddress,
  dstSubaccountId: POOL_SUBACCOUNT_ID,
})

const privateKey = '0x...'

/* broadcast transaction */
const txHash = await new MsgBroadcasterWithPk({
  network: Network.Mainnet,
  privateKey,
}).broadcast({
  msgs: msg,
})

console.log(txHash)
```
