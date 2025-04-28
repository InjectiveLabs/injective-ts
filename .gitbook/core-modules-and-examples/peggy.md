# Peggy

The `peggy` module is the heart of the injective <> ethereum bridge, where deposited funds will be locked on the ethereum [peggy contract](https://etherscan.io/address/0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3#code) and minted on the Injective chain. Similarly withdrawal funds will be burned on the injective chain and unlocked on the ethereum peggy contract.

### MsgSendToEth

This message is used to withdraw funds from the Injective Chain via the [peggy contract](https://etherscan.io/address/0xF955C57f9EA9Dc8781965FEaE0b6A2acE2BAD6f3#code), in the process funds will be burned on the injective chain and distributed to the ethereum address from the peggy contract.

Note that a $10 USD bridge fee will be charged for this transaction to cover for the ethereum gas fee on top of the standard INJ transaction fee.

```ts
import { TokenPrice, MsgSendToEth, TokenStaticFactory, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'
import { ChainId } from '@injectivelabs/ts-types'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
// refer to https://docs.ts.injective.network/readme/assets/injective-list
import { tokens } from '../data/tokens.json'

export const tokenStaticFactory = new TokenStaticFactory(tokens as TokenStatic[])

const tokenPriceMap = new TokenPrice(Network.Mainnet)
const tokenService = new TokenService({
  chainId: ChainId.Mainnet,
  network: Network.Mainnet,
})

const ETH_BRIDGE_FEE_IN_USD = 10
const endpointsForNetwork = getNetworkEndpoints(Network.Mainnet)

const tokenSymbol = 'INJ'
const tokenMeta = tokenStaticFactory.toToken(tokenSymbol)

const amount = 1
const injectiveAddress = 'inj1...'
const destinationAddress = '0x...' // ethereum address
const tokenDenom = `peggy${tokenMeta.erc20.address}`

if (!tokenMeta) {
  return
}

const tokenUsdPrice = tokenPriceMap[tokenMeta.coinGeckoId]
const amountToFixed = new BigNumberInBase(amount).toWei(tokenMeta.decimals).toFixed()
const bridgeFeeInToken = new BigNumberInBase(ETH_BRIDGE_FEE_IN_USD).dividedBy(tokenUsdPrice).toFixed()

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
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Mainnet,
}).broadcast({
  msgs: msg,
})
```
