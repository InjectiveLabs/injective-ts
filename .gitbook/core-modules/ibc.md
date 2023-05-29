# IBC

#### MsgTransfer

This message is used to send coins from the sender's Bank module on Injective to the receiver's Bank module on another Cosmos chain through IBC, which is Cosmos's Inter-Blockchain Communication Protocol. Note that Injective only supports mainnet transfers across IBC for most networks.

Application to application communication in IBC is conducted over channels, which route between an application module on one chain, and the corresponding application module on another one. More info on IBC channels can be found at https://tutorials.cosmos.network/academy/3-ibc/3-channels.html. A list of canonical channel Ids for mainnet transfers to and from Injective can be found [here](https://github.com/InjectiveLabs/injective-ts/blob/master/packages/token-metadata/src/ibc/canonicalChannelsToChainMap.ts). Also noteworthy is that the application module on each chain has a portId to designate the type of module on each end. For example, `transfer` is the portId designating the transfer of ICS-20 tokens between bank modules.

In this example, we will transfer ATOM from Injective to CosmosHub

```ts
import {
  ChainGrpcBankApi,
  ChainRestTendermintApi,
  makeTimeoutTimestampInNs,
  MsgBroadcasterWithPk,
  MsgTransfer,
} from "@injectivelabs/sdk-ts";
import {
  cosmosNativeDenomsFromChainId,
  TokenService,
  UiBankTransformer,
} from "@injectivelabs/sdk-ui-ts";
import { getEndpointsFromChainId } from "@injectivelabs/wallet-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId, CosmosChainId } from "@injectivelabs/ts-types";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { IbcToken, Token } from "@injectivelabs/token-metadata";

const tokenService = new TokenService({
  chainId: ChainId.Mainnet,
  network: Network.Mainnet,
});

const destinationChainId = CosmosChainId["Cosmoshub"];
const injectiveChainId = CosmosChainId["Injective"];

const endpointsForNetwork = getNetworkEndpoints(Network.Mainnet);
const bankService = new ChainGrpcBankApi(endpointsForNetwork.grpc);

// fetch ibc assets in bank module and format to token
const { supply } = await bankService.fetchTotalSupply();
const uiSupply = UiBankTransformer.supplyToUiSupply(supply);
const ibcSupplyWithToken = (await tokenService.getIbcSupplyWithToken(
  uiSupply.ibcBankSupply
)) as IbcToken[];

/* get metadata for canonical denoms available for transfer between chains */
const cosmosHubBaseDenom = "uatom";
const tokenMeta = cosmosNativeDenomsFromChainId[destinationChainId];
const atomToken = (
  Array.isArray(tokenMeta)
    ? tokenMeta.find((token) => token.denom === cosmosHubBaseDenom)
    : tokenMeta
) as Token;

/* find the ibd denom hash for the canonical denom */
const injectiveToCosmosHubChannelId = "channel-1";
const atomDenomFromSupply = ibcSupplyWithToken.find(
  ({ channelId, baseDenom }) =>
    channelId === injectiveToCosmosHubChannelId && baseDenom === atomToken.denom
) as IbcToken;
const canonicalDenomHash = atomDenomFromSupply.denom;

/* format amount for transfer */
const amount = {
  denom: canonicalDenomHash,
  amount: new BigNumberInBase(0.001)
    .toWei(atomDenomFromSupply.decimals)
    .toString(),
};

const injectiveAddress = "inj...";
const destinationAddress = "cosmos...";
const port = "transfer";
const timeoutTimestamp = makeTimeoutTimestampInNs();

/* get the latestBlock from the origin chain */
const endpointsForChainId = getEndpointsFromChainId(injectiveChainId);
const tendermintRestApi = new ChainRestTendermintApi(endpointsForChainId.rest);

/* Block details from the origin chain */
const latestBlock = await tendermintRestApi.fetchLatestBlock();
const latestHeight = latestBlock.header.height;
const timeoutHeight = new BigNumberInBase(latestHeight).plus(
  30 // default block timeout height
);

/* create message in proto format */
const msg = MsgTransfer.fromJSON({
  port,
  memo: `IBC transfer from ${injectiveChainId} to ${destinationChainId}`,
  sender: injectiveAddress,
  receiver: destinationAddress,
  channelId: injectiveToCosmosHubChannelId,
  timeout: timeoutTimestamp,
  height: {
    revisionHeight: timeoutHeight.toNumber(),
    revisionNumber: parseInt(latestBlock.header.version.block, 10),
  },
  amount
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
