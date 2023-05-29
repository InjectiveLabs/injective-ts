# Peggy

The `peggy` module is heart of the injective <> ethereum bridge, where deposited funds will be locked on the ethereum [peggy contract](https://etherscan.io/address/0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3#code) and minted on the Injective chain. Similarly withdrawal funds will be burned on the injective chain and unlocked on the ethereum peggy contract.

### MsgSendToEth

This message is used to withdraw funds from the Injective Chain via the [peggy contract](https://etherscan.io/address/0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3#code), in the process funds will be burned on the injective chain and distributed to the ethereum address from the peggy contract.

Note that a $10 USD bridge fee will be charged for this transaction to cover for the ethereum gas fee on top of the standard INJ transaction fee.

```ts
import {
  DenomClient,
  MsgSendToEth,
  MsgBroadcasterWithPk,
} from "@injectivelabs/sdk-ts";
import { TokenPrice, TokenService } from "@injectivelabs/sdk-ui-ts";
import { BigNumberInBase } from "@injectivelabs/utils";
import { ChainId } from "@injectivelabs/ts-types";
import { getNetworkEndpoints, Network } from "@injectivelabs/networks";

const tokenPrice = new TokenPrice(COINGECKO_OPTIONS);
const tokenService = new TokenService({
  chainId: ChainId.Mainnet,
  network: Network.Mainnet,
});

const ETH_BRIDGE_FEE_IN_USD = 10;
const endpointsForNetwork = getNetworkEndpoints(Network.Mainnet);
const denomClient = new DenomClient(Network.Mainnet, {
  endpoints: endpointsForNetwork,
});

const tokenSymbol = "INJ";
const tokenMeta = denomClient.getTokenMetaDataBySymbol(tokenSymbol);

const amount = 1;
const injectiveAddress = "inj1...";
const destinationAddress = "0x..."; // ethereum address
const tokenDenom = `peggy${tokenMeta.erc20.address}`;

if (!tokenDenom) {
  return;
}

const tokenUsdPrice = tokenService.fetchUsdTokenPrice(tokenDenom.coinGeckoId);
const amountToFixed = new BigNumberInBase(amount)
  .toWei(tokenDenom.decimals)
  .toFixed();
const bridgeFeeInToken = new BigNumberInBase(ETH_BRIDGE_FEE_IN_USD)
  .dividedBy(tokenUsdPrice)
  .toFixed();

const msg = MsgSendToEth.fromJSON({
  injectiveAddress,
  address: destinationAddress,
  amount: {
    denom: tokenDenom,
    amount: amountToFixed,
  },
  bridgeFee: {
    denom: tokenDenom,
    amount: bridgeFeeInToken,
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
```
