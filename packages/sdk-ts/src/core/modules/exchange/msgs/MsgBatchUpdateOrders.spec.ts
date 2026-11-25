import { toChainFormat } from '@injectivelabs/utils'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgBatchUpdateOrders from './MsgBatchUpdateOrders.js'
import { getEip712TypedData } from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const marketId = mockFactory.injUsdtSpotMarket.marketId
const subaccountId = mockFactory.subaccountId

const base = {
  injectiveAddress: mockFactory.injectiveAddress,
  subaccountId,
}

type Field = { name: string; type: string }

const typedV1 = (message: MsgBatchUpdateOrders) => {
  const { eip712Args } = prepareEip712({ messages: message })
  const typedData = getEip712TypedData(eip712Args)
  const types = typedData.types as Record<string, Field[]>

  return {
    value: message.toEip712().value as Record<string, any>,
    msgValue: types.MsgValue,
    types,
  }
}

describe('MsgBatchUpdateOrders', () => {
  it('signs a cancel-by-hash with order_mask and no empty cid', () => {
    const message = MsgBatchUpdateOrders.fromJSON({
      ...base,
      spotOrdersToCancel: [
        {
          marketId,
          subaccountId,
          orderHash: mockFactory.orderHash,
        },
      ],
    })
    const { value, msgValue, types } = typedV1(message)

    expect(value.spot_orders_to_cancel).toEqual([
      {
        market_id: marketId,
        subaccount_id: subaccountId,
        order_hash: mockFactory.orderHash,
      },
    ])
    expect(value).not.toHaveProperty('subaccount_id')
    expect(msgValue.map((field) => field.name)).toEqual([
      'sender',
      'spot_orders_to_cancel',
    ])
    expect(types.TypeSpotOrdersToCancel).toEqual([
      { name: 'market_id', type: 'string' },
      { name: 'subaccount_id', type: 'string' },
      { name: 'order_hash', type: 'string' },
      { name: 'order_mask', type: 'int32' },
    ])
  })

  it('omits order_hash when cancelling by cid', () => {
    const message = MsgBatchUpdateOrders.fromJSON({
      ...base,
      spotOrdersToCancel: [
        {
          marketId,
          subaccountId,
          cid: 'order-1',
        },
      ],
    })
    const { value, types } = typedV1(message)

    expect(value.spot_orders_to_cancel).toEqual([
      {
        market_id: marketId,
        subaccount_id: subaccountId,
        cid: 'order-1',
      },
    ])
    expect(types.TypeSpotOrdersToCancel.map((field) => field.name)).toEqual([
      'market_id',
      'subaccount_id',
      'order_mask',
      'cid',
    ])
  })

  it('keeps subaccount_id when a cancel-all is set', () => {
    const message = MsgBatchUpdateOrders.fromJSON({
      ...base,
      spotMarketIdsToCancelAll: [marketId],
    })
    const { value, msgValue } = typedV1(message)

    expect(value.subaccount_id).toBe(subaccountId)
    expect(msgValue.map((field) => field.name)).toContain('subaccount_id')
  })

  it('scales created orders and uses the chain field order', () => {
    const message = MsgBatchUpdateOrders.fromJSON({
      ...base,
      spotOrdersToCreate: [
        {
          orderType: 1,
          marketId,
          feeRecipient: mockFactory.injectiveAddress2,
          price: '1.5',
          quantity: '2',
          cid: 'cid-1',
        },
      ],
    })
    const { value, types } = typedV1(message)
    const order = value.spot_orders_to_create[0]

    expect(Object.keys(order)).toEqual([
      'market_id',
      'order_info',
      'order_type',
      'trigger_price',
    ])
    expect(order.order_info.price).toBe('1500000000000000000')
    expect(order.order_info.quantity).toBe(toChainFormat('2').toFixed())
    expect(order.trigger_price).toBe(toChainFormat(0).toFixed())
    expect(types.TypeSpotOrdersToCreate.map((field) => field.name)).toEqual([
      'market_id',
      'order_info',
      'order_type',
      'trigger_price',
    ])
  })

  describe('EIP712 v1 matches Web3Gw', () => {
    const cases: Array<[string, MsgBatchUpdateOrders]> = [
      [
        'cancel-by-hash',
        MsgBatchUpdateOrders.fromJSON({
          ...base,
          spotOrdersToCancel: [
            {
              marketId,
              subaccountId,
              orderHash: mockFactory.orderHash,
            },
          ],
        }),
      ],
      [
        'cancel-by-cid',
        MsgBatchUpdateOrders.fromJSON({
          ...base,
          spotOrdersToCancel: [
            {
              marketId,
              subaccountId,
              cid: 'order-1',
            },
          ],
        }),
      ],
      [
        'cancel-all',
        MsgBatchUpdateOrders.fromJSON({
          ...base,
          spotMarketIdsToCancelAll: [marketId],
        }),
      ],
      [
        'create',
        MsgBatchUpdateOrders.fromJSON({
          ...base,
          spotOrdersToCreate: [
            {
              orderType: 1,
              marketId,
              feeRecipient: mockFactory.injectiveAddress2,
              price: '1.5',
              quantity: '2',
              cid: 'cid-1',
            },
          ],
        }),
      ],
    ]

    it.each(cases)('%s', async (_name, message) => {
      const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
        messages: message,
      })
      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V1,
      })

      expect(getEip712TypedData(eip712Args)).toStrictEqual(
        JSON.parse(txResponse.data),
      )
    })
  })
})
