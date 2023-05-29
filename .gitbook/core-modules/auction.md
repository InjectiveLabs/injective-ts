# Auction

The `auction` module is heart of the `buy-back-and-burn` on chain mechanism, where 60% of the weekly trading fees are colleted and auctioned off to the highest INJ bidder where the submitted INJ of the highest bidder are burned in the process.

#### MsgBid

This message is used to submit a bid on the [auction](https://hub.injective.network/auction/) held weekly to allow members to use INJ to bid for the basket of trading fees (60%) collected by Injective that week.

```ts
import {
  MsgBid,
  ChainGrpcAuctionApi,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { BigNumberInBase } from "@injectivelabs/utils";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { INJ_DENOM, UiAuctionTransformer } from "@injectivelabs/sdk-ui-ts";

const endpointsForNetwork = getNetworkEndpoints(Network.Mainnet);
const auctionApi = new ChainGrpcAuctionApi(endpointsForNetwork.grpc);

const injectiveAddress = "inj1...";
/* format amount for bid, note that bid amount has to be higher than the current highest bid */
const amount = {
  denom: INJ,
  amount: new BigNumberInBase(1).toWei(),
};

const latestAuctionModuleState = await auctionApi.fetchModuleState();
const uiLatestAuctionModuleState =
  UiAuctionTransformer.grpcAuctionModuleStateToModuleState(
    latestAuctionModuleState
  );
const latestRound = uiLatestAuctionModuleState.auctionRound;

/* create message in proto format */
const msg = MsgBid.fromJSON({
  amount,
  injectiveAddress,
  round: latestRound,
});

const privateKey = "0x...";

/* broadcast transaction */
const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Mainnet,
  endpoints: endpointsForNetwork,
}).broadcast({
  msgs: msg,
  injectiveAddress,
});

console.log(txHash);
```
