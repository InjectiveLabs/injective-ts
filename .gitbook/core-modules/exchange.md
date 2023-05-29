# Exchange

The `exchange` module is the heart of the Injective Chain which enables fully decentralized spot and derivative exchange. It is the sine qua non module of the chain and integrates tightly with the `auction`, `insurance`, `oracle`, and `peggy` modules.

The exchange protocol enables traders to create and trade on arbitrary spot and derivative markets. The entire process of orderbook management, trade execution, order matching and settlement occurs on chain through the logic codified by the exchange module.

### Messages

Let's explore (and provide examples) the Messages that the Exchange module exports and we can use to interact with the Injective chain.

#### MsgDeposit

This Message is used to send coins from the Bank module to a wallet's subaccount

```ts
import { MsgDeposit, MsgBroadcasterWithPk, getEthereumAddress } from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'

const amount = {
  denom: 'inj',
  amount: new BigNumberInBase(1).toWei()
}

const ethereumAddress = getEthereumAddress(injectiveAddress)
const subaccountIndex = 0
const suffix = '0'.repeat(23) + subaccountIndex
const subaccountId = ethereumAddress + suffix

const msg = MsgDeposit.fromJSON({
  amount,
  subaccountId,
  injectiveAddress,
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress,
})

console.log(txHash)
```

#### MsgWithdraw

This Message is used to send coins from the wallet's subaccount back to the users Bank funds

```ts
import { MsgWithdraw, MsgBroadcasterWithPk, getEthereumAddress } from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'

const amount = {
  denom: 'inj',
  amount: new BigNumberInBase(1).toWei()
}

const ethereumAddress = getEthereumAddress(injectiveAddress)
const subaccountIndex = 0
const suffix = '0'.repeat(23) + subaccountIndex
const subaccountId = ethereumAddress + suffix

const msg = MsgWithdraw.fromJSON({
  amount,
  subaccountId,
  injectiveAddress,
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress,
})

console.log(txHash)
```

#### MsgCreateSpotLimitOrder

This Message is used to create a spot limit order

```ts
import {
  MsgCreateSpotLimitOrder,
  MsgBroadcasterWithPk,
  getEthereumAddress,
  getDerivativeMarketTensMultiplier
} from '@injectivelabs/sdk-ts'
import { BigNumberInBase, spotPriceToChainPriceToFixed, spotQuantityToChainQuantityToFixed } from '@injectivelabs/utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'
const feeRecipient = 'inj1...'
const market = {
  marketId: '0x...',
  baseDecimals: 18,
  quoteDecimals: 6,
  minPriceTickSize: '', /* fetched from the chain */
  minQuantityTickSize: '', /* fetched from the chain */
  priceTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
  quantityTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
}

const order = {
  price: 1,
  quantity: 1
}

const ethereumAddress = getEthereumAddress(injectiveAddress)
const subaccountIndex = 0
const suffix = '0'.repeat(23) + subaccountIndex
const subaccountId = ethereumAddress + suffix

const msg = MsgCreateSpotLimitOrder.fromJSON({
  subaccountId,
  injectiveAddress,
  orderType: 1, /* Buy */
  price: spotPriceToChainPriceToFixed({
    value: order.price,
    tensMultiplier: market.priceTensMultiplier,
    baseDecimals: market.baseDecimals,
    quoteDecimals: market.quoteDecimals
  }),
  quantity: spotQuantityToChainQuantityToFixed({
    value: order.quantity,
    tensMultiplier: market.quantityTensMultiplier,
    baseDecimals: market.baseDecimals
  }),
  marketId: market.marketId,
  feeRecipient: feeRecipient,
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress,
})

console.log(txHash)
```

#### MsgCreateSpotMarketOrder

This Message is used to create a spot market order

```ts
import {
  MsgCreateSpotMarketOrder,
  MsgBroadcasterWithPk,
  getEthereumAddress,
  getDerivativeMarketTensMultiplier
} from '@injectivelabs/sdk-ts'
import { BigNumberInBase, spotPriceToChainPriceToFixed, spotQuantityToChainQuantityToFixed } from '@injectivelabs/utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'
const feeRecipient = 'inj1...'
const market = {
  marketId: '0x...',
  baseDecimals: 18,
  quoteDecimals: 6,
  minPriceTickSize: '', /* fetched from the chain */
  minQuantityTickSize: '', /* fetched from the chain */
  priceTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
  quantityTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
}
const order = {
  price: 10,
  quantity: 1
}

const ethereumAddress = getEthereumAddress(injectiveAddress)
const subaccountIndex = 0
const suffix = '0'.repeat(23) + subaccountIndex
const subaccountId = ethereumAddress + suffix

const msg = MsgCreateSpotMarketOrder.fromJSON({
  subaccountId,
  injectiveAddress,
  orderType: 1, /* Buy */
  price: spotPriceToChainPriceToFixed({
    value: order.price,
    tensMultiplier: market.priceTensMultiplier,
    baseDecimals: market.baseDecimals,
    quoteDecimals: market.quoteDecimals
  }),
  quantity: spotQuantityToChainQuantityToFixed({
    value: order.quantity,
    tensMultiplier: market.quantityTensMultiplier,
    baseDecimals: market.baseDecimals
  }),
  marketId: market.marketId,
  feeRecipient: feeRecipient,
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress,
})

console.log(txHash)
```

#### MsgCreateDerivativeLimitOrder

This Message is used to create a derivative limit order

```ts
import {
  MsgCreateDerivativeLimitOrder,
  MsgBroadcasterWithPk,
  getEthereumAddress,
  getDerivativeMarketTensMultiplier
} from '@injectivelabs/sdk-ts'
import {
  BigNumberInBase,
  derivativePriceToChainPriceToFixed,
  derivativeQuantityToChainQuantityToFixed,
  derivativeMarginToChainMarginToFixed
} from '@injectivelabs/utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'
const feeRecipient = 'inj1...'
const market = {
  marketId: '0x...',
  baseDecimals: 18,
  quoteDecimals: 6,
  minPriceTickSize: '', /* fetched from the chain */
  minQuantityTickSize: '', /* fetched from the chain */
  priceTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
  quantityTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
}
const order = {
  price: 10,
  quantity: 1,
  margin: 10
}

const ethereumAddress = getEthereumAddress(injectiveAddress)
const subaccountIndex = 0
const suffix = '0'.repeat(23) + subaccountIndex
const subaccountId = ethereumAddress + suffix

const msg = MsgCreateDerivativeLimitOrder.fromJSON(
  orderType: 1 /* Buy */,
  triggerPrice: '0',
  injectiveAddress,
  price: derivativePriceToChainPriceToFixed({
    value: order.price,
    quoteDecimals: market.quoteDecimals
  }),
  quantity: derivativeQuantityToChainQuantityToFixed({ value: order.quantity }),
  margin: derivativeMarginToChainMarginToFixed({
    value: order.margin,
    quoteDecimals: market.quoteDecimals
  }),
  marketId: market.marketId,
  feeRecipient: feeRecipient,
  subaccountId: subaccountI
})

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress,
})

console.log(txHash)
```

#### MsgCreateDerivativeMarketOrder

This Message is used to create a derivative market order

```ts
import {
  MsgCreateDerivativeMarketOrder,
  MsgBroadcasterWithPk,
  getEthereumAddress,
  getDerivativeMarketTensMultiplier
} from '@injectivelabs/sdk-ts'
import {
  BigNumberInBase,
  derivativePriceToChainPriceToFixed,
  derivativeQuantityToChainQuantityToFixed,
  derivativeMarginToChainMarginToFixed
} from '@injectivelabs/utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'
const feeRecipient = 'inj1...'
const market = {
  marketId: '0x...',
  baseDecimals: 18,
  quoteDecimals: 6,
  minPriceTickSize: '', /* fetched from the chain */
  minQuantityTickSize: '', /* fetched from the chain */
  priceTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
  quantityTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
}
const order = {
  price: 10,
  quantity: 1,
  margin: 10
}

const ethereumAddress = getEthereumAddress(injectiveAddress)
const subaccountIndex = 0
const suffix = '0'.repeat(23) + subaccountIndex
const subaccountId = ethereumAddress + suffix

const msg = MsgCreateDerivativeMarketOrder.fromJSON(
  orderType: 1 /* Buy */,
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

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress,
})

console.log(txHash)
```

#### MsgBatchUpdateOrders

This Message is used to batch update orders on the chain

```ts
import {
  MsgBatchUpdateOrders,
  MsgBroadcasterWithPk,
  getEthereumAddress,
  getDerivativeMarketTensMultiplier
} from '@injectivelabs/sdk-ts'
import {
  BigNumberInBase,
  derivativePriceToChainPriceToFixed,
  derivativeQuantityToChainQuantityToFixed,
  derivativeMarginToChainMarginToFixed
} from '@injectivelabs/utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'
const feeRecipient = 'inj1...'
const derivativeMarket = {
  marketId: '0x...',
  baseDecimals: 18,
  quoteDecimals: 6,
  minPriceTickSize: '', /* fetched from the chain */
  minQuantityTickSize: '', /* fetched from the chain */
  priceTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
  quantityTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
}
const derivativeOrder = {
  price: 10,
  quantity: 1,
  margin: 10
}
const spotMarket = {
  marketId: '0x...',
  baseDecimals: 18,
  quoteDecimals: 6,
  minPriceTickSize: '', /* fetched from the chain */
  minQuantityTickSize: '', /* fetched from the chain */
  priceTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
  quantityTensMultiplier: '', /** can be fetched from getDerivativeMarketTensMultiplier */
}
const spotOrder = {
  price: 10,
  quantity: 1,
  margin: 10
}

const ethereumAddress = getEthereumAddress(injectiveAddress)
const subaccountIndex = 0
const suffix = '0'.repeat(23) + subaccountIndex
const subaccountId = ethereumAddress + suffix

const msg = MsgBatchUpdateOrders.fromJSON({
  injectiveAddress,
  subaccountId: subaccountId,
  derivativeOrdersToCreate: [
    {
      orderType: derivativeOrder.orderType as GrpcOrderType,
      price: derivativePriceToChainPriceToFixed({
        value: derivativeOrder.price,
        quoteDecimals: 6 /* USDT has 6 decimals */,
      }),
      quantity: derivativeQuantityToChainQuantityToFixed({
        value: derivativeOrder.quantity,
      }),
      margin: derivativeMarginToChainMarginToFixed({
        value: margin,
        quoteDecimals: 6 /* USDT has 6 decimals */,
      }),
      marketId: derivativeMarket.marketId,
      feeRecipient: injectiveAddress,
    },
  ],
  spotOrdersToCreate: [
    {
      orderType: spotOrder.orderType as GrpcOrderType,
      price: spotPriceToChainPriceToFixed({
        value: spotOrder.price,
        baseDecimals: 18 /* INJ has 18 decimals */,
        quoteDecimals: 6 /* USDT has 6 decimals */,
      }),
      quantity: spotQuantityToChainQuantityToFixed({
        value: spotOrder.quantity,
        baseDecimals: 18 /* INJ has 18 decimals */,
      }),
      marketId: spotMarket.marketId,
      feeRecipient: injectiveAddress,
    },
  ],
});

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress,
})

console.log(txHash)
```

#### MsgBatchCancelSpotOrders

This Message is used to batch cancel spot orders on the chain

```ts
import { MsgBatchCancelSpotOrders, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'
const orders = [
  {
  marketId: '0x...',
  subaccountId: '0x...',
  orderHash: '0x...'
  },
  {
  marketId: '0x...',
  subaccountId: '0x...',
  orderHash: '0x...'
  }
]

const messages = orders.map((order) =>
  MsgBatchCancelSpotOrders.fromJSON({
    injectiveAddress,
    orders: [
      {
        marketId: order.marketId,
        subaccountId: order.subaccountId,
        orderHash: order.orderHash
      }
    ]
  })
)

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: messages,
  injectiveAddress,
})

console.log(txHash)
```

This Message is used to batch cancel spot orders on the chain

#### MsgBatchCancelDerivativeOrders

```ts
import { MsgBatchCancelDerivativeOrders, MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj1...'
const orders = [
  {
  marketId: '0x...',
  subaccountId: '0x...',
  orderHash: '0x...'
  },
  {
  marketId: '0x...',
  subaccountId: '0x...',
  orderHash: '0x...'
  }
]

const messages = orders.map((order) =>
  MsgBatchCancelDerivativeOrders.fromJSON({
    injectiveAddress,
    orders: [
      {
        marketId: order.marketId,
        subaccountId: order.subaccountId,
        orderHash: order.orderHash
      }
    ]
  })
)

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: messages,
  injectiveAddress,
})

console.log(txHash)
```

#### MsgRewardsOptOut

This Message is used to opt out of the Trade & Earn program.

```ts
import {
  MsgRewardsOptOut,
  MsgBroadcasterWithPk,
} from '@injectivelabs/sdk-ts'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'

const privateKey = '0x...'
const injectiveAddress = 'inj...'

const msg = MsgRewardsOptOut.fromJSON(
 { sender: injectiveAddress })

const txHash = await new MsgBroadcasterWithPk({
  privateKey,
  network: Network.Testnet,
  endpoints: getNetworkEndpoints(Network.Testnet)
}).broadcast({
  msgs: msg,
  injectiveAddress,
})

console.log(txHash)
```
