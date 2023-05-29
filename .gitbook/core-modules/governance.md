# Governance

Injective is a community-run blockchain and users who have staked INJ are able to participate in governance as it relates to the blockchain. Proposals can be submitted to make revisions to Injective programs, tech upgrades, or any other Injective related changes that impact the entire Injective ecosystem.

For every proposal you create, we require you to deposit at least 1 INJ. This is to ensure that you are an active participant of the Injective community and you are eligible to make proposals and govern the protocol moving forward. For the proposal to pass to the voting stage, it must have 500 INJ deposited. You can deposit the 500 INJ yourself or collaborate with the community to deposit them collectively.

### Messages

Let's explore (and provide examples) the messages that the Governance module exports and we can use to interact with the Injective chain. For example, you can use these messages to propose new spot, perpetual, or futures markets.

#### MsgGovDeposit

This message can be used to deposit towards an existing proposal.

```ts
import {
  MsgGovDeposit
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { getEndpointsFromChainId } from "@injectivelabs/wallet-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { ChainId } from "@injectivelabs/ts-types";

const INJ_DENOM = 'inj'
const amount = new BigNumberInBase(1).toWei().toFixed()
const proposalId = 12345
const injectiveAddress = "inj...";
const privateKey = "0x...";

const message = MsgGovDeposit.fromJSON({
  amount: {
    denom: INJ_DENOM,
    amount
  },
  proposalId,
  depositor: injectiveAddress
})

/* broadcast transaction */
const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: message,
  injectiveAddress,
});
```

#### MsgVote

After the proposal is properly funded, voting can commence. You can vote "Yes", "No", "Abstain", or "No with Veto".

```ts
import {
  MsgVote,
  MsgBroadcasterWithPk
} from "@injectivelabs/sdk-ts";
import { getEndpointsFromChainId } from "@injectivelabs/wallet-ts";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { ChainId } from "@injectivelabs/ts-types";
import { VoteOption } from '@injectivelabs/sdk-ts';

const injectiveAddress = "inj...";
const privateKey = "0x...";
const proposalId = 12345
const vote =  VoteOption.VOTE_OPTION_YES

const message = MsgVote.fromJSON({
  vote,
  proposalId,
  voter: injectiveAddress
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: message,
  injectiveAddress,
});
```

#### MsgSubmitTextProposal

Propose any action on Injective. TextProposal defines a standard text proposal whose changes need to be manually updated in case of approval.

```ts
import {
  MsgSubmitTextProposal,
  MsgBroadcasterWithPk
} from "@injectivelabs/sdk-ts";
import { getEndpointsFromChainId } from "@injectivelabs/wallet-ts";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { ChainId } from "@injectivelabs/ts-types";
import { BigNumberInBase } from "@injectivelabs/utils";

const injectiveAddress = "inj...";
const privateKey = "0x...";
const INJ_DENOM = 'inj'
const amount = new BigNumberInBase(1).toWei().toFixed()

const message = MsgSubmitTextProposal.fromJSON({
  title: 'Title of Proposal',
  description: 'Description of Proposal',
  proposer: injectiveAddress,
  deposit: {
    denom: INJ_DENOM,
    amount
  }
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: message,
  injectiveAddress,
});
```

#### MsgSubmitProposalSpotMarketLaunch

This message allows you to propose a new spot market. Ensure that the ticker is accurate and provide the base asset denom followed by the quote asset denom. Base denom refers to the asset you would like to trade and quote denom refers to the asset by which your base asset is denominated. For instance, in the INJ/USDT market you would buy or sell INJ using USDT.

```ts
import {
  DenomClient,
  MsgBroadcasterWithPk,
  MsgSubmitProposalSpotMarketLaunch
} from "@injectivelabs/sdk-ts";
import { getEndpointsFromChainId } from "@injectivelabs/wallet-ts";
import { BigNumberInBase, BigNumberInWei } from "@injectivelabs/utils";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { ChainId } from "@injectivelabs/ts-types";

const injectiveAddress = "inj...";
const privateKey = "0x...";
const INJ_DENOM = 'inj'
const amount = new BigNumberInBase(1).toWei().toFixed()

const market = {
  baseDenom: 'inj', // for example
  quoteDenom: "peggy0x...",
  makerFeeRate: '0.001',
  takerFeeRate: '0.002',
  title: 'INJ/USDT Spot Market Launch',
  description: 'This proposal will launch the INJ/USDT Spot Market with maker and taker fees 0.001% and 0.002% respectively',
  ticker: 'INJ/USDT',
  minPriceTickSize: '0.001',
  minQuantityTickSize: '0.001'
}

const denomClient = new DenomClient(
  NETWORK.Testnet,
  { endpoints: getNetworkEndpoints(Network.Testnet) }
)

const baseDenom = await denomClient.getDenomToken(market.baseDenom)
const quoteDenom = await denomClient.getDenomToken(market.quoteDenom)
const marketWithDecimals: SpotMarketLaunchProposal = {
  ...market,
  baseTokenDecimals: baseDenom ? baseDenom.decimals : 18,
  quoteTokenDecimals: quoteDenom ? quoteDenom.decimals : 6
}

const marketWithTickSizes = {
  ...market,
  minPriceTickSize: new BigNumberInWei(
    marketWithDecimals.minPriceTickSize
  )
  .toBase(
    marketWithDecimals.baseTokenDecimals -
      marketWithDecimals.quoteTokenDecimals
  )
  .toFixed(),
  minQuantityTickSize: new BigNumberInBase(
    marketWithDecimals.minQuantityTickSize
  )
  .toWei(marketWithDecimals.baseTokenDecimals)
  .toFixed()
}

const message = MsgSubmitProposalSpotMarketLaunch.fromJSON({
  market: marketWithTickSizes,
  proposer: injectiveAddress,
  deposit: {
    denom: INJ_DENOM,
    amount
  }
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: message,
  injectiveAddress
});
```

#### MsgSubmitProposalPerpetualMarketLaunch

This message allows you to propose a new perpetual market. perpetual futures contracts, or perps, are derivative futures contracts that allow users to buy or sell the value of an underlying base asset without actually owning it. This is the message you can use to create a perp market for a specified token pair.

```ts
import {
  DenomClient,
  MsgBroadcasterWithPk,
  MsgSubmitProposalPerpetualMarketLaunch
} from "@injectivelabs/sdk-ts";
import { getEndpointsFromChainId } from "@injectivelabs/wallet-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { ChainId } from "@injectivelabs/ts-types";

const injectiveAddress = "inj...";
const privateKey = "0x...";
const INJ_DENOM = 'inj'
const amount = new BigNumberInBase(1).toWei().toFixed()

const market = {
  title: 'INJ/USDT Perpetual Market Launch',
  description: 'This proposal will launch the INJ/USDT Spot Market with maker and taker fees 0.001% and 0.002% respectively',
  ticker: 'INJ/USDT PERP',
  quoteDenom: 'peggy0x...',
  oracleBase: 'INJ',
  oracleQuote: 'USDT',
  oracleScaleFactor: 6,
  oracleType: 10, // BAND IBC
  initialMarginRatio: '0.05',
  maintenanceMarginRatio: '0.02',
  makerFeeRate: '0.01',
  takerFeeRate: '0.02',
  minPriceTickSize: '0.01',
  minQuantityTickSize: '0.01'
}

const denomClient = new DenomClient(
  NETWORK.Testnet,
  { endpoints: getNetworkEndpoints(Network.Testnet) }
)
 const quoteDenom = await denomClient.getDenomToken(market.quoteDenom)

const marketWithDecimals = {
    ...market,
    quoteTokenDecimals: quoteDenom ? quoteDenom.decimals : 6
  }

const marketWithTickSizes = {
  ...market,
  minPriceTickSize: new BigNumberInBase(
    marketWithDecimals.minPriceTickSize
  )
    .toWei(marketWithDecimals.quoteTokenDecimals)
    .toFixed()
}

const message = MsgSubmitProposalPerpetualMarketLaunch.fromJSON({
  market: marketWithTickSizes,
  proposer: injectiveAddress,
  deposit: {
    denom: INJ_DENOM,
    amount
  }
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: message,
  injectiveAddress
});
```

#### MsgSubmitProposalExpiryFuturesMarketLaunch

An expiry futures contract is an agreement between two counterparties to buy and sell a specific amount of an underlying base asset at a specific future price, which is set to expire at a specified date in the future. This is the message you can use to create a futures market for a specified token pair.

```ts
import {
  DenomClient,
  MsgBroadcasterWithPk,
  MsgSubmitProposalExpiryFuturesMarketLaunch
} from "@injectivelabs/sdk-ts";
import { getEndpointsFromChainId } from "@injectivelabs/wallet-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { ChainId } from "@injectivelabs/ts-types";

const injectiveAddress = "inj...";
const privateKey = "0x...";
const INJ_DENOM = 'inj'
const amount = new BigNumberInBase(1).toWei().toFixed()

const market = {
  title: 'INJ/USDT Futures Market Launch',
  description: 'This proposal will launch the INJ/USDT Spot Market with maker and taker fees 0.001% and 0.002% respectively',
  ticker: 'INJ/USDT 24-MAR-2023',
  quoteDenom: 'peggy0x...',
  oracleBase: 'INJ',
  oracleQuote: 'USDT',
  expiry: 1000000, // when the market will expire, in ms
  oracleScaleFactor: 6,
  oracleType: 10, // BAND IBC
  initialMarginRatio: '0.05',
  maintenanceMarginRatio: '0.02',
  makerFeeRate: '0.01',
  takerFeeRate: '0.02',
  minPriceTickSize: '0.01',
  minQuantityTickSize: '0.01'
}

const denomClient = new DenomClient(
  NETWORK.Testnet,
  { endpoints: getNetworkEndpoints(Network.Testnet) }
)
 const quoteDenom = await denomClient.getDenomToken(market.quoteDenom)

const marketWithDecimals = {
    ...market,
    quoteTokenDecimals: quoteDenom ? quoteDenom.decimals : 6
  }

const marketWithTickSizes = {
  ...market,
  minPriceTickSize: new BigNumberInBase(
    marketWithDecimals.minPriceTickSize
  )
    .toWei(marketWithDecimals.quoteTokenDecimals)
    .toFixed()
}

const message = MsgSubmitProposalExpiryFuturesMarketLaunch.fromJSON({
  market: marketWithTickSizes,
  proposer: injectiveAddress,
  deposit: {
    denom: INJ_DENOM,
    amount: deposit.toWei().toFixed()
  }
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: message,
  injectiveAddress
});
```

#### MsgSubmitProposalSpotMarketParamUpdate

This message can be used to update the params of a spot market.

```ts
import {
  MsgBroadcasterWithPk,
  MsgSubmitProposalSpotMarketParamUpdate
} from "@injectivelabs/sdk-ts";
import { getEndpointsFromChainId } from "@injectivelabs/wallet-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";
import { ChainId } from "@injectivelabs/ts-types";
import { MarketStatusMap } from '@injectivelabs/chain-api';

const injectiveAddress = "inj...";
const privateKey = "0x...";
const INJ_DENOM = 'inj'
const amount = new BigNumberInBase(1).toWei().toFixed()

const market = {
  title: 'INJ/USDT Spot Market Launch',
  description: 'This proposal will launch the INJ/USDT Spot Market with maker and taker fees 0.001% and 0.002% respectively',
  marketId: '0x...',
  makerFeeRate: '0.02',
  takerFeeRate: '0.03',
  relayerFeeShareRate: '0.4', // 40%, the percent of tsx fees that go to the relayers
  minPriceTickSize: '0.002',
  minQuantityTickSize: '0.002',
  status: MarketStatusMap.Active
}

const message = MsgSubmitProposalSpotMarketParamUpdate.fromJSON({
  market,
  proposer: injectiveAddress,
  deposit: {
    denom: INJ_DENOM,
    amount
  }
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  chainId: ChainId.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet),
}).broadcast({
  msgs: message,
  injectiveAddress
});
```
