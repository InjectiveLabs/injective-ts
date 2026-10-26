import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgBatchUpdateOrders from './MsgBatchUpdateOrders.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'

const spotOrderToCancel = {
  marketId: mockFactory.injUsdtSpotMarket.marketId,
  subaccountId: mockFactory.subaccountId,
  orderHash: mockFactory.orderHash,
}

const params: MsgBatchUpdateOrders['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  subaccountId: mockFactory.subaccountId,
  spotOrdersToCancel: [spotOrderToCancel],
}

const message = MsgBatchUpdateOrders.fromJSON(params)

const emptyListKeys = [
  'spot_market_ids_to_cancel_all',
  'derivative_market_ids_to_cancel_all',
  'binary_options_market_ids_to_cancel_all',
  'derivative_orders_to_cancel',
  'binary_options_orders_to_cancel',
  'spot_orders_to_create',
  'derivative_orders_to_create',
  'binary_options_orders_to_create',
] as const

describe('MsgBatchUpdateOrders', () => {
  it('omits empty lists from EIP712 v1 typed data', () => {
    const amino = message.toAmino()
    const aminoValue = amino.value as Record<string, any>
    const cancel = {
      market_id: spotOrderToCancel.marketId,
      subaccount_id: spotOrderToCancel.subaccountId,
      order_hash: spotOrderToCancel.orderHash,
      cid: '',
    }

    expect(amino.type).toBe('exchange/MsgBatchUpdateOrders')
    expect(aminoValue.subaccount_id).toBe('')
    expect(aminoValue.spot_orders_to_cancel).toEqual([cancel])

    for (const key of emptyListKeys) {
      expect(aminoValue[key]).toEqual([])
    }

    const eip712 = message.toEip712()
    const eip712Value = eip712.value as Record<string, any>

    expect(eip712).toEqual({
      type: 'exchange/MsgBatchUpdateOrders',
      value: {
        sender: mockFactory.injectiveAddress,
        subaccount_id: '',
        spot_orders_to_cancel: [cancel],
      },
    })

    for (const key of emptyListKeys) {
      expect(eip712Value).not.toHaveProperty(key)
    }

    const { eip712Args } = prepareEip712({ messages: message })
    const typedData = getEip712TypedData(eip712Args)

    expect(typedData.message.msgs[0]).toEqual(eip712)
    expect(typedData.types).toMatchObject({
      MsgValue: [
        { name: 'sender', type: 'string' },
        { name: 'subaccount_id', type: 'string' },
        { name: 'spot_orders_to_cancel', type: 'TypeSpotOrdersToCancel[]' },
      ],
      TypeSpotOrdersToCancel: [
        { name: 'market_id', type: 'string' },
        { name: 'subaccount_id', type: 'string' },
        { name: 'order_hash', type: 'string' },
      ],
    })

    const cancelTypes = (
      typedData.types as Record<string, { name: string; type: string }[]>
    ).TypeSpotOrdersToCancel

    expect(cancelTypes.map((field) => field.name)).not.toContain('cid')
    expect(cancelTypes.map((field) => field.name)).not.toContain(
      'expiration_block',
    )

    const v2Msgs = JSON.parse(getEip712TypedDataV2(eip712Args).message.msgs)

    expect(v2Msgs).toEqual([message.toWeb3Gw()])
    expect(v2Msgs[0].subaccount_id).toBe('')

    for (const key of emptyListKeys) {
      expect(v2Msgs[0][key]).toEqual([])
    }
  })
})
