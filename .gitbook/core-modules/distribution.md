# Distribution

The `distribution` module is extended from the cosmos sdk [distribution module](https://github.com/InjectiveLabs/cosmos-sdk/tree/master/x/distribution), where delegator can withdraw their staking rewards from the validator.

Distribution -> MsgWithdrawValidatorCommission

### MsgWithdrawDelegatorReward

This message is used to withdraw all available delegator staking rewards from the validator.

```ts
import {
  MsgBroadcasterWithPk,
  MsgWithdrawDelegatorReward,
} from "@injectivelabs/sdk-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const endpointsForNetwork = getNetworkEndpoints(Network.Mainnet);

const injectiveAddress = "inj1...";
const validatorAddress = "inj1...";

/* create message in proto format */
const msg = MsgWithdrawDelegatorReward.fromJSON({
  validatorAddress,
  delegatorAddress: injectiveAddress,
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

### MsgWithdrawValidatorCommission

This message is used to by the validator to withdraw the commission earned.

```ts
import {
  MsgBroadcasterWithPk,
  MsgWithdrawValidatorCommission,
} from "@injectivelabs/sdk-ts";
import { ChainId } from "@injectivelabs/ts-types";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const endpointsForNetwork = getNetworkEndpoints(Network.Mainnet);

const injectiveAddress = "inj1...";
const validatorAddress = "inj1...";

/* create message in proto format */
const msg = MsgWithdrawValidatorCommission.fromJSON({
  validatorAddress,
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
