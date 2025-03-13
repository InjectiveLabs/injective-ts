import { Network } from '@injectivelabs/networks'
import { Address } from '../../../../accounts/Address.js'
import { OrderHashManager } from './OrderHashManager.js'
import { InjectiveExchangeV1Beta1Exchange } from '@injectivelabs/core-proto-ts'
import {
  derivativeMarginToChainMargin,
  derivativePriceToChainPrice,
  spotPriceToChainPrice,
  spotQuantityToChainQuantity,
  derivativeQuantityToChainQuantity,
} from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'
import MsgCreateDerivativeLimitOrder from '../../../exchange/msgs/MsgCreateDerivativeLimitOrder.js'
import MsgCreateSpotLimitOrder from '../../../exchange/msgs/MsgCreateSpotLimitOrder.js'

const address = Address.fromBech32('inj1hkhdaj2a2clmq5jq6mspsggqs32vynpk228q3r')
const orderHashManager = new OrderHashManager({
  network: Network.TestnetK8s,
  address: address.bech32Address,
  subaccountIndex: 0,
})
const marketId =
  '0x6afc76766d011522634481b5987c405ce34357c504537eb5feabb3d32d34d15b'
const subaccountId = address.getSubaccountId(1)
const spotInfo = {
  price: 1.524,
  quantity: 0.01,
  baseDecimals: 18,
  quoteDecimals: 6,
}
const derivativeInfo = {
  price: 27000,
  leverage: 1,
  quantity: 0.0001,
  quoteDecimals: 6,
}

const spotOrder = {
  orderInfo: {
    subaccountId: subaccountId,
    price: spotPriceToChainPrice({
      value: spotInfo.price,
      baseDecimals: spotInfo.baseDecimals,
      quoteDecimals: spotInfo.quoteDecimals,
    }).toFixed(),
    quantity: spotQuantityToChainQuantity({
      value: spotInfo.quantity,
      baseDecimals: spotInfo.baseDecimals,
    }).toFixed(),
    feeRecipient: address.bech32Address,
  },
  marketId: marketId,
  orderType: InjectiveExchangeV1Beta1Exchange.OrderType.BUY,
}

const spotMsg = MsgCreateSpotLimitOrder.fromJSON({
  subaccountId: subaccountId,
  injectiveAddress: address.bech32Address,
  marketId: marketId,
  feeRecipient: address.bech32Address,
  price: spotPriceToChainPrice({
    value: spotInfo.price,
    baseDecimals: spotInfo.baseDecimals,
    quoteDecimals: spotInfo.quoteDecimals,
  }).toFixed(),
  quantity: spotQuantityToChainQuantity({
    value: spotInfo.quantity,
    baseDecimals: spotInfo.baseDecimals,
  }).toFixed(),
  orderType: InjectiveExchangeV1Beta1Exchange.OrderType.BUY,
})

const derivativeOrder = {
  orderInfo: {
    subaccountId: subaccountId,
    price: derivativePriceToChainPrice({
      value: derivativeInfo.price,
      quoteDecimals: derivativeInfo.quoteDecimals,
    }).toFixed(),
    quantity: derivativeQuantityToChainQuantity({
      value: derivativeInfo.quantity,
    }).toFixed(),
    feeRecipient: address.bech32Address,
  },
  margin: derivativeMarginToChainMargin({
    value: new BigNumberInBase(derivativeInfo.price)
      .times(derivativeInfo.quantity)
      .div(derivativeInfo.leverage),
    quoteDecimals: derivativeInfo.quoteDecimals,
  }).toFixed(),
  marketId: marketId,
  orderType: InjectiveExchangeV1Beta1Exchange.OrderType.BUY,
}

const derivativeMsg = MsgCreateDerivativeLimitOrder.fromJSON({
  subaccountId: subaccountId,
  injectiveAddress: address.bech32Address,
  orderType: InjectiveExchangeV1Beta1Exchange.OrderType.BUY,
  price: derivativePriceToChainPrice({
    value: derivativeInfo.price,
    quoteDecimals: derivativeInfo.quoteDecimals,
  }).toFixed(),
  triggerPrice: '0',
  quantity: derivativeQuantityToChainQuantity({
    value: derivativeInfo.quantity,
  }).toFixed(),
  margin: derivativeMarginToChainMargin({
    value: new BigNumberInBase(derivativeInfo.price)
      .times(derivativeInfo.quantity)
      .div(derivativeInfo.leverage),
    quoteDecimals: derivativeInfo.quoteDecimals,
  }).toFixed(),
  marketId: marketId,
  feeRecipient: address.bech32Address,
})

describe.skip('OrderHashManager', () => {
  it('generates proper hash', async () => {
    orderHashManager.setNonce(78)

    const spotOrderHashes = await orderHashManager.getSpotOrderHashes([
      spotOrder,
    ])
    const derivativeOrderHashes =
      await orderHashManager.getDerivativeOrderHashes([derivativeOrder])

    expect(spotOrderHashes).toStrictEqual([
      '0xc699cf0dc2f735bd3918dbe539f701ae8e65f9e2466f8c07219c70cdcc3946f3',
    ])
    expect(derivativeOrderHashes).toStrictEqual([
      '0x2451ae7e630322f00c365f2b354fa597d479d804da1fafd82ecbc54cd7964781',
    ])
  })

  it('generates proper hash from msg', async () => {
    orderHashManager.setNonce(78)

    const spotOrderHashes = await orderHashManager.getSpotOrderHashFromMsg(
      spotMsg,
    )
    const derivativeOrderHashes =
      await orderHashManager.getDerivativeOrderHashFromMsg(derivativeMsg)

    expect(spotOrderHashes).toStrictEqual(
      '0xc699cf0dc2f735bd3918dbe539f701ae8e65f9e2466f8c07219c70cdcc3946f3',
    )
    expect(derivativeOrderHashes).toStrictEqual(
      '0x2451ae7e630322f00c365f2b354fa597d479d804da1fafd82ecbc54cd7964781',
    )
  })
})
