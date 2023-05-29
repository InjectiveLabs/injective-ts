# Insurance

This module provides insurance funds for derivative markets in the exchange module of the Injective Chain to use in order to support higher leverage trading. On a high level, insurance funds for each derivative market are funded by a permissionless group of underwriters who each own a proportional claim (represented through insurance fund share tokens) over the underlying assets in the insurance fund.

### Messages

Let's explore (and provide examples) the Messages that the Insurance module exports and we can use to interact with the Injective chain.

#### MsgCreateInsuranceFund

This Message is used to create an Insurance Fund

```ts
import {
  MsgCreateInsuranceFund,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const amount = new BigNumberInBase(5);
const fund = {
  ticker: "BTC/USDT",
  quoteDenom: "peggy0x...",
  oracleBase: "BTC",
  oracleQuote: "USDT",
  oracleType: 10, // BANDIBC
};

const msg = MsgCreateInsuranceFund.fromJSON({
  fund,
  injectiveAddress,
  deposit: {
    denom: fund.quoteDenom,
    amount: amount.toWei(6 /* 6 because USDT has 6 decimals */).toFixed(),
  },
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: msg,
  injectiveAddress,
});

console.log(txHash);
```

#### MsgRequestRedemption

This Message is used to request redemption.

```ts
import {
  MsgRequestRedemption,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const amount = new BigNumberInBase(5);
const denom = "share1"; // the insurance fund denom (share{id})
const marketId = "0x....";

const msg = MsgRequestRedemption.fromJSON({
  marketId,
  injectiveAddress,
  amount: {
    denom,
    amount: amount.toWei().toFixed(),
  },
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: msg,
  injectiveAddress,
});

console.log(txHash);
```

#### MsgUnderwrite

This Message is used to underwrite to an insurance fund.

```ts
import { MsgUnderwrite, MsgBroadcasterWithPk } from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const amount = new BigNumberInBase(5);
const denom = "peggy0x...";
const marketId = "0x...";

const msg = MsgUnderwrite.fromJSON({
  marketId,
  injectiveAddress,
  amount: {
    denom,
    amount: amount.toWei(6 /* 6 because USDT has 6 decimals */).toFixed(),
  },
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: msg,
  injectiveAddress,
});

console.log(txHash);
```
