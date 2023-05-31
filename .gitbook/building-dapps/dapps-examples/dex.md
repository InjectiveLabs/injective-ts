# DEX

Within these short series we are going to showcase how easy it is to build a DEX on top of Injective. There is an open-sourced [DEX](https://github.com/InjectiveLabs/injective-dex) which everyone can reference and use to build on top of Injective. For those who want to start from scratch, this is the right place to start.

The series will include:

* Setting up the API clients and environment,
* Connecting to the Chain and the Indexer API,
* Connect to a user wallet and get their address,
* Fetching Spot and Derivative markets and their orderbooks,
* Placing market orders on both spot and a derivative market,
* View all positions for an Injective address.

### Setup

First, configure your desired UI framework. You can find more details on the configuration here.

To get started with the dex, we need to setup the API clients and the environment. To build our DEX we are going to query data from both the Injective Chain and the Indexer API. In this example, we are going to use the existing **testnet** environment.

Let's first setup some of the classes we need to query the data.

```ts
// filename: Services.ts
import {
  ChainGrpcBankApi,
  IndexerGrpcSpotApi,
  IndexerGrpcDerivativesApi,
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

// Getting the pre-defined endpoints for the Testnet environment
// (using TestnetK8s here because we want to use the Kubernetes infra)
export const NETWORK = Network.TestnetK8s
export const ENDPOINTS = getNetworkEndpoints(NETWORK)

export const chainBankApi = new ChainGrpcBankApi(ENDPOINTS.grpc)
export const indexerSpotApi = new IndexerGrpcSpotApi(ENDPOINTS.indexer)
export const indexerDerivativesApi = new IndexerGrpcDerivativesApi(ENDPOINTS.indexer)

export const indexerSpotStream = new IndexerGrpcDerivativeStream(ENDPOINTS.indexer)
export const indexerDerivativeStream = new IndexerGrpcDerivativeStream(ENDPOINTS.indexer)
```

Then, we also need to setup a wallet connection to allow the user to connect to our DEX and start signing transactions. To make this happen we are going to use our `@injectivelabs/wallet-ts` package which allows users to connect with a various of different wallet providers and use them to sign transactions on Injective.

```ts
// filename: Wallet.ts
import { WalletStrategy, Wallet } from '@injectivelabs/wallet-ts'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'

const chainId = ChainId.Testnet // The Injective Chain chainId
const ethereumChainId = EthereumChainId.Goerli // The Ethereum Chain ID

export const alchemyRpcEndpoint = `https://eth-goerli.alchemyapi.io/v2/${process.env.APP_ALCHEMY_GOERLI_KEY}`

export const walletStrategy = new WalletStrategy({
  chainId: CHAIN_ID,
  ethereumOptions: {
    rpcUrl: alchemyRpcEndpoint,
    ethereumChainId: ETHEREUM_CHAIN_ID,
  },
})
```

If we don't want to use Ethereum native wallets, just omit the `ethereumOptions` within the `WalletStrategy` constructor.

Finally, to do the whole transaction flow (prepare + sign + broadcast) on Injective we are going to use the MsgBroadcaster class.

```ts
// filename: MsgBroadcaster.ts
import { MsgBroadcaster } from '@injectivelabs/wallet-ts'
import { walletStrategy } from './Wallet.ts'
import { NETWORK } from './Services.ts'

export const msgBroadcaster = new MsgBroadcaster({
  walletStrategy,
  network: NETWORK,
})
```

### Connect to the user's wallet

Since we are using the `WalletStrategy` to handle the connection with the user's wallet, we can use its methods to handle some use cases like getting the user's addresses, sign/broadcast a transaction, etc. To find out more about the wallet strategy, you can explore the documentation interface and the method the `WalletStrategy` offers.

Note: We can switch between the "active" wallet within the `WalletStrategy` using the `setWallet` method.

```ts
// filename: WalletConnection.ts
import { WalletException, UnspecifiedErrorCode, ErrorType } from '@injectivelabs/exceptions'
import { Wallet } from '@injectivelabs/wallet-ts'
import { walletStrategy } from './Wallet.ts'

export const getAddresses = async (wallet: Wallet): Promise<string[]> => {
  walletStrategy.setWallet(wallet)

  const addresses = await walletStrategy.getAddresses()

  if (addresses.length === 0) {
    throw new WalletException(
      new Error('There are no addresses linked in this wallet.'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError
      }
    )
  }

  if (!addresses.every((address) => !!address)) {
    throw new WalletException(
      new Error('There are no addresses linked in this wallet.'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError
      }
    )
  }

  // If we are using Ethereum native wallets the 'addresses' are the hex addresses
  // If we are using Cosmos native wallets the 'addresses' are bech32 injective addresses,
  return addresses
}
```

### Querying

After the initial setup is done, let's see how to query (and stream) markets from the IndexerAPI, as well as user's balances from the chain directly.

```ts
// filename: Query.ts
import  { getDefaultSubaccountId, OrderbookWithSequence } from '@injectivelabs/sdk-ts'
import { 
  chainBankApi,
  indexerSpotApi,
  indexerSpotStream,
  indexerDerivativesApi
  indexerDerivativesStream,
} from './Services.ts'

export const fetchDerivativeMarkets = async () => {
  return await indexerDerivativesApi.fetchMarkets()
}

export const fetchPositions = async (injectiveAddress: string) => {
  const subaccountId = getDefaultSubaccountId(injectiveAddress)

  return await indexerDerivativesApi.fetchPositions({ subaccountId })
}

export const fetchSpotMarkets = async () => {
  return await indexerSpotsApi.fetchMarkets()
}

export const fetchBankBalances = async (injectiveAddress: string) => {
  return await chainBankApi.fetchBalances(injectiveAddress)
}

export const streamDerivativeMarketOrderbook = async (
  marketId: string, 
  ) => {
  const streamOrderbookUpdates = indexerDerivativesStream.streamDerivativeOrderbookUpdate.bind(indexerDerivativesStream)
  const callback = (orderbookUpdate) => {
    console.log(orderbookUpdate)
  }

  streamOrderbookUpdates({
    marketIds,
    callback
  })
}

export const streamSpotMarketOrderbook = async (
  marketId: string, 
  ) => {
  const streamOrderbookUpdates = indexerSpotsStream.streamSpotOrderbookUpdate.bind(indexerSpotsStream)
  const callback = (orderbookUpdate) => {
    console.log(orderbookUpdate)
  }

  streamOrderbookUpdates({
    marketIds,
    callback
  })
}
```

Once we have these functions we can call them anywhere in our application (usually the centralized state management services like Pinia in Nuxt, or Context providers in React, etc).

### Transactions

Finally, let's make some transactions. For this example, we are going to:

1. Send assets from one address to another,
2. Make a spot limit order,
3. Make a derivative market order.

```ts
// filename: Transactions.ts
import { BigNumberInWei } from '@injectivelabs/utils'
import { 
  MsgSend, 
  MsgCreateSpotLimitOrder,
  spotPriceToChainPriceToFixed, 
  MsgCreateDerivativeMarketOrder,
  spotQuantityToChainQuantityToFixed 
} from '@injectivelabs/sdk-ts'

// used to send assets from one address to another
export const makeMsgSend = ({
  sender: string,
  recipient: string,
  amount: string, // human readable amount
  denom: string
}) => {
  const amount = {
    denom,
    amount: new BigNumberInBase(amount).toWei(/** denom's decimals */)
  }

  return MsgSend.fromJSON({
    amount,
    srcInjectiveAddress: sender,
    dstInjectiveAddress: recipient,
  })
}

// used to create a spot limit order
export const makeMsgCreateSpotLimitOrder = ({
  price, // human readable number
  quantity, // human readable number
  orderType, // OrderType enum
  injectiveAddress,
}) => {
  const subaccountId = getDefaultSubaccountId(injectiveAddress)
  const market = {
    marketId: '0x...',
    baseDecimals: 18,
    quoteDecimals: 6,
    minPriceTickSize: '', /* fetched from the chain */
    minQuantityTickSize: '', /* fetched from the chain */
    priceTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
    quantityTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
  }

  return MsgCreateSpotLimitOrder.fromJSON({
    subaccountId,
    injectiveAddress,
    orderType: orderType,
    price: spotPriceToChainPriceToFixed({
      value: price,
      tensMultiplier: market.priceTensMultiplier,
      baseDecimals: market.baseDecimals,
      quoteDecimals: market.quoteDecimals
    }),
    quantity: spotQuantityToChainQuantityToFixed({
      value: quantity,
      tensMultiplier: market.quantityTensMultiplier,
      baseDecimals: market.baseDecimals
    }),
    marketId: market.marketId,
    feeRecipient: injectiveAddress,
  })
}

// used to create a derivative market order
export const makeMsgCreateDerivativeMarketOrder = ({
  price, // human readable number
  margin, // human readable number
  quantity, // human readable number
  orderType, // OrderType enum
  injectiveAddress,
}) => {
  const subaccountId = getDefaultSubaccountId(injectiveAddress)
  const market = {
    marketId: '0x...',
    baseDecimals: 18,
    quoteDecimals: 6,
    minPriceTickSize: '', /* fetched from the chain */
    minQuantityTickSize: '', /* fetched from the chain */
    priceTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
    quantityTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
  }

  return MsgCreateDerivativeMarketOrder.fromJSON(
    orderType: orderPrice,
    triggerPrice: '0',
    injectiveAddress,
    price: derivativePriceToChainPriceToFixed({
      value: order.price,
      tensMultiplier: market.priceTensMultiplier,
      quoteDecimals: market.quoteDecimals
    }),
    quantity: derivativeQuantityToChainQuantityToFixed({ 
      value: order.quantity,
      tensMultiplier: market.quantityTensMultiplier,
    }),
    margin: derivativeMarginToChainMarginToFixed({
      value: order.margin,
      quoteDecimals: market.quoteDecimals,
      tensMultiplier: priceTensMultiplier,
    }),
    marketId: market.marketId,
    feeRecipient: feeRecipient,
    subaccountId: subaccountI
  })

}
```

After we have the Messages, you can use the `msgBroadcaster` client to broadcast these transactions:

```ts
const response = await msgBroadcaster({
  msgs: /** the message here */,
  injectiveAddress: signersInjectiveAddress,
})

console.log(response)
```

### Final Thoughts

What's left for you is to build a nice UI around the business logic explained above :)
