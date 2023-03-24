import { Network } from '@injectivelabs/networks'
import { Address } from '../../../../accounts/Address'
import { OrderHashManager } from './OrderHashManager'
import { InjectiveExchangeV1Beta1Exchange } from '@injectivelabs/core-proto-ts'
import {
  derivativeMarginToChainMargin,
  derivativePriceToChainPrice,
  spotPriceToChainPrice,
  spotQuantityToChainQuantity,
  derivativeQuantityToChainQuantity,
} from '@injectivelabs/sdk-ts'
import { BigNumberInBase } from '@injectivelabs/utils'

const address = Address.fromBech32('inj1hkhdaj2a2clmq5jq6mspsggqs32vynpk228q3r')
const orderHashManager = new OrderHashManager({
  network: Network.TestnetK8s,
  address: address.bech32Address,
  subaccountIndex: 0,
})
const subaccountId = address.getSubaccountId(1)

const spotOrder = {
  orderInfo: {
    subaccountId:
      '0x2968698c6b9ed6d44b667a0b1f312a3b5d94ded7000000000000000000000000',
    price: spotPriceToChainPrice({
      value: '1.524',
      baseDecimals: 18,
      quoteDecimals: 6,
    }).toFixed(),
    quantity: spotQuantityToChainQuantity({
      value: '0.01',
      baseDecimals: 18,
    }).toFixed(),
    feeRecipient: address.bech32Address,
  },
  marketId:
    '0x6afc76766d011522634481b5987c405ce34357c504537eb5feabb3d32d34d15b',
  orderType: InjectiveExchangeV1Beta1Exchange.OrderType.BUY,
}

const derivativeOrder = {
  orderInfo: {
    subaccountId: subaccountId,
    price: derivativePriceToChainPrice({
      value: '27000',
      quoteDecimals: 6,
    }).toFixed(),
    quantity: derivativeQuantityToChainQuantity({ value: '0.0001' }).toFixed(),
    feeRecipient: address.bech32Address,
  },
  margin: derivativeMarginToChainMargin({
    value: new BigNumberInBase(27000).times(0.0001).div(1),
    quoteDecimals: 6,
  }).toFixed(),
  marketId:
    '0x6afc76766d011522634481b5987c405ce34357c504537eb5feabb3d32d34d15b',
  orderType: InjectiveExchangeV1Beta1Exchange.OrderType.BUY,
}

describe('OrderHashManager', () => {
  it('generates proper hash', async () => {
    orderHashManager.setNonce(78)

    const spotOrderHashes = await orderHashManager.getSpotOrderHashes([
      spotOrder,
    ])
    const derivativeOrderHashes =
      await orderHashManager.getDerivativeOrderHashes([derivativeOrder])

    expect(spotOrderHashes).toStrictEqual([
      '0x04941ef76e09c8b84affb6c1887eafe8f3a44258ccb575eddc3d28f5213cb874',
    ])
    expect(derivativeOrderHashes).toStrictEqual([
      '0x2451ae7e630322f00c365f2b354fa597d479d804da1fafd82ecbc54cd7964781',
    ])
  })
})
