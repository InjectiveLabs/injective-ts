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

    expect(eip712.type).toBe('exchange/MsgBatchUpdateOrders')
    expect(eip712Value.sender).toBe(mockFactory.injectiveAddress)
    expect(eip712Value.spot_orders_to_cancel).toEqual([cancel])
    expect(eip712Value).not.toHaveProperty('subaccount_id')

    for (const key of emptyListKeys) {
      expect(eip712Value[key]).toEqual([])
    }

    const { eip712Args } = prepareEip712({ messages: message })
    const typedData = getEip712TypedData(eip712Args)

    expect(typedData.message.msgs[0]).toEqual(eip712)
    expect(
      (typedData.types as Record<string, { name: string; type: string }[]>)
        .MsgValue,
    ).toEqual([
      { name: 'sender', type: 'string' },
      { name: 'spot_orders_to_cancel', type: 'TypeSpotOrdersToCancel[]' },
    ])
    expect(typedData.types).toMatchObject({
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

  it('keeps subaccount_id when a cancel-all is set', () => {
    const cancelAll = MsgBatchUpdateOrders.fromJSON({
      ...params,
      spotMarketIdsToCancelAll: [mockFactory.injUsdtSpotMarket.marketId],
    })
    const eip712 = cancelAll.toEip712()
    const value = eip712.value as Record<string, any>
    const { eip712Args } = prepareEip712({ messages: cancelAll })
    const typedData = getEip712TypedData(eip712Args)
    const msgValue = (
      typedData.types as Record<string, { name: string; type: string }[]>
    ).MsgValue

    expect(value.subaccount_id).toBe(mockFactory.subaccountId)
    expect(msgValue.map((field) => field.name)).toContain('subaccount_id')
    expect(JSON.parse(getEip712TypedDataV2(eip712Args).message.msgs)).toEqual([
      cancelAll.toWeb3Gw(),
    ])
  })
})
