# Staking

The module enables Cosmos SDK-based blockchain to support an advanced Proof-of-Stake (PoS) system. In this system, holders of the native staking token of the chain can become validators and can delegate tokens to validators, ultimately determining the effective validator set for the system.

### Messages

Let's explore (and provide examples) the Messages that the Staking module exports and we can use to interact with the Injective chain.

#### MsgBeginRedelegate

This Message is used to Redelegate staked INJ from one validator to another.

```ts
import {
  MsgBeginRedelegate,
  MsgBroadcasterWithPk
} from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const amount = new BigNumberInBase(5);
const denom = "inj";
const destinationValidatorAddress = "inj1...";
const sourceValidatorAddress = "inj1...";

const msg = MsgBeginRedelegate.fromJSON({
  injectiveAddress,
  dstValidatorAddress: destinationValidatorAddress,
  srcValidatorAddress: sourceValidatorAddress,
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

#### MsgDelegate

This Message is used to Delegate INJ to a validator.

```ts
import { MsgDelegate, MsgBroadcasterWithPk } from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const amount = new BigNumberInBase(5);
const validatorAddress = "inj1...";

const msg = MsgDelegate.fromJSON({
  injectiveAddress,
  validatorAddress,
  amount: {
    denom: INJ_DENOM,
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

#### MsgDelegate

This Message is used to Delegate INJ to a validator.

```ts
import { MsgUndelegate, MsgBroadcasterWithPk } from "@injectivelabs/sdk-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { Network, getNetworkEndpoints } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const privateKey = "0x...";
const amount = new BigNumberInBase(5);
const validatorAddress = "inj1...";

const msg = MsgUndelegate.fromJSON({
  injectiveAddress,
  validatorAddress,
  amount: {
    denom: INJ_DENOM,
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
