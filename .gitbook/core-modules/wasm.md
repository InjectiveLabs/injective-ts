# Wasm

The `wasm` module is heart of interacting with the wasm smart contracts deployed on the injective chain, here you can find a list of [smart contracts](https://explorer.injective.network/contracts/) that are deployed on the Injective chain.

### MsgExecuteContract (Transfer)

This message is used to execute contract function, below we will use the [CW20 spec](https://github.com/CosmWasm/cw-plus/blob/main/packages/cw20/README.md) transfer message as an example.

```ts
import {
  MsgExecuteContract,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const recipientAddress = "inj2...";
const contractAddress = "cw...";

const msg = MsgExecuteContract.fromJSON({
  contractAddress,
  sender: injectiveAddress,
  exec: {
    action: "transfer",
    msg: {
      recipient: recipientAddress,
      amount: 100000,
    },
  },
});

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

### MsgExecuteContract (funds example)

In some scenario, depending on the smart contract's function we have to transfer tokens to the smart contract, following cosmwasm convention we use the funds field to transfer tokens to the smart contract from the user's bank module.

Below is an example of how we can send the MsgExecuteContract using an `test` contract function.

```ts
import {
  MsgExecuteContract,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { INJ_DENOM } from "@injectivelabs/sdk-ui-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const contractAddress = "cw...";

const msg = MsgExecuteContract.fromJSON({
  contractAddress,
  sender: injectiveAddress,
  exec: {
    action: "test",
    funds: [
      {
        denom: INJ_DENOM,
        amount: new BigNumberInBase(1).toWei().toFixed(),
      },
    ],
  },
});

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

### MsgExecuteContractCompact

There are some compatibility issue parsing the funds array in the previous example with EIP712, hence we introduced MsgExecuteContractCompact which converts the funds into a string

An array of funds:

```ts
const funds = [
  {
    denom: denom1,
    amount: new BigNumberInBase(1).toWei().toFixed(),
  },
  {
    denom: denom2,
    amount: new BigNumberInBase(1).toWei().toFixed(),
  },
];
```

will be presented as a string like this:

```ts
const funds = "100000000000000000 denom1, 100000000000000000 denom2";
```

Below is an example of how we can send the MsgExecuteContractCompact using an `test` contract function.

```ts
import {
  MsgBroadcasterWithPk,
  MsgExecuteContractCompact,
} from "@injectivelabs/sdk-ts";
import { INJ_DENOM } from "@injectivelabs/sdk-ui-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const injectiveAddress = "inj1...";
const contractAddress = "cw...";

const msg = MsgExecuteContractCompact.fromJSON({
  contractAddress,
  sender: injectiveAddress,
  exec: {
    action: "test",
    funds: [
      {
        denom: INJ_DENOM,
        amount: new BigNumberInBase(1).toWei().toFixed(),
      },
    ],
  },
});

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
