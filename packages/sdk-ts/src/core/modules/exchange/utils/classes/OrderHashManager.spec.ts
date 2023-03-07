import { OrderType } from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/exchange'
import { Network } from '@injectivelabs/networks'
import { Address } from '../../../../accounts/Address'
import { OrderHashManager } from './OrderHashManager'

const address = Address.fromBech32('inj1cml96vmptgw99syqrrz8az79xer2pcgp0a885r')
const orderHashManager = new OrderHashManager({
  network: Network.TestnetK8s,
  address: address.bech32Address,
  subaccountIndex: 0,
})
const subaccountId = address.getSubaccountId()

const spotOrder = {
  orderInfo: {
    subaccountId: subaccountId,
    price: '1.523',
    quantity: '0.02',
    feeRecipient: address.bech32Address,
  },
  marketId:
    '0x6afc76766d011522634481b5987c405ce34357c504537eb5feabb3d32d34d15b',
  orderType: OrderType.BUY.toString(),
}
const derivativeOrder = {
  orderInfo: {
    subaccountId: subaccountId,
    price: '1.523',
    quantity: '0.02',
    feeRecipient: address.bech32Address,
  },
  margin: '1',
  marketId:
    '0x6afc76766d011522634481b5987c405ce34357c504537eb5feabb3d32d34d15b',
  orderType: OrderType.BUY.toString(),
}

describe('OrderHashManager', () => {
  it('generates proper hash', async () => {
    const spotOrderHashes = await orderHashManager.getSpotOrderHashes([
      spotOrder,
    ])
    const derivativeOrderHashes =
      await orderHashManager.getDerivativeOrderHashes([derivativeOrder])
    const {
      spotOrderHashes: spotOrderHashes2,
      derivativeOrderHashes: derivativeOrderHashes2,
    } = await orderHashManager.getOrderHashes({
      spotOrders: [spotOrder],
      derivativeOrders: [derivativeOrder],
    })

    expect(spotOrderHashes).toStrictEqual([
      '0xd9094b276416bb16a8c681c04872dc6fe9c3fdd3e69efc53c292d682f21cf048',
    ])
    expect(derivativeOrderHashes).toStrictEqual([
      '0x4e9260232fe5947c3afdeb6c28fc8ed72f29bd64e7cf9a33e5190c31de478791',
    ])
    expect(spotOrderHashes2).toStrictEqual([
      '0xd9094b276416bb16a8c681c04872dc6fe9c3fdd3e69efc53c292d682f21cf048',
    ])
    expect(derivativeOrderHashes2).toStrictEqual([
      '0x4e9260232fe5947c3afdeb6c28fc8ed72f29bd64e7cf9a33e5190c31de478791',
    ])
  })
})
