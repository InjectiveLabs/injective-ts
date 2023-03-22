import { OrderType } from '@injectivelabs/chain-api/injective/exchange/v1beta1/exchange_pb'
import { Network } from '@injectivelabs/networks'
import { Address } from '../../../../accounts/Address'
import { OrderHashManager } from './OrderHashManager'

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
    price: '1.524',
    quantity: '0.01',
    feeRecipient: address.bech32Address,
  },
  marketId:
    '0x0611780ba69656949525013d947713300f56c37b6175e02f26bffa495c3208fe',
  orderType: OrderType.BUY,
}

const derivativeOrder = {
  orderInfo: {
    subaccountId: subaccountId,
    price: '10500',
    quantity: '0.01',
    feeRecipient: address.bech32Address,
  },
  margin: '105',
  marketId:
    '0x6afc76766d011522634481b5987c405ce34357c504537eb5feabb3d32d34d15b',
  orderType: OrderType.BUY,
}

describe('OrderHashManager', () => {
  test('generates proper hash', async () => {
    orderHashManager.setNonce(78)

    const spotOrderHashes = await orderHashManager.getSpotOrderHashes([
      spotOrder,
    ])
    const derivativeOrderHashes =
      await orderHashManager.getDerivativeOrderHashes([derivativeOrder])

    expect(spotOrderHashes).toStrictEqual([
      '0xd9bf0dcb2b135aa27c46b52031029676894e41993cc076508ca826a38e887db4',
    ])
    expect(derivativeOrderHashes).toStrictEqual([
      '0xb4f264cbf4df1aa27a1686d812f771d6d3b2ffdc3504eca8f7b16e99d8e7fb1a',
    ])
  })
})
