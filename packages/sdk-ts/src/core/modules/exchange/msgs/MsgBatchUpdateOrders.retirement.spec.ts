import { toChainFormat } from '@injectivelabs/utils'
import * as ExchangeV2Tx from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as ExchangeV1Tx from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb'
import MsgBatchUpdateOrders from './MsgBatchUpdateOrders.js'
import MsgBatchUpdateOrdersV2 from './MsgBatchUpdateOrdersV2.js'

const retiredFields = [
  'binaryOptionsOrdersToCancel',
  'binaryOptionsMarketIdsToCancelAll',
  'binaryOptionsOrdersToCreate',
  'binaryOptionsMarketOrdersToCreate',
]

const order = {
  marketId: '0x' + '1'.repeat(64),
  feeRecipient: 'inj1test',
  orderType: 6,
  price: '10',
  quantity: '2',
  margin: '5',
  triggerPrice: '12',
  expirationBlock: '42',
}

const params = {
  injectiveAddress: 'inj1test',
  subaccountId: '0x' + '2'.repeat(64),
  spotMarketIdsToCancelAll: [order.marketId],
  derivativeOrdersToCreate: [order],
}

it('preserves v2 market-order batches', () => {
  const message = MsgBatchUpdateOrdersV2.fromJSON({
    ...params,
    spotMarketOrdersToCreate: [order],
    derivativeMarketOrdersToCreate: [order],
  })

  const proto = message.toProto()
  expect(proto.spotMarketOrdersToCreate[0].expirationBlock).toBe(42n)
  expect(proto.derivativeMarketOrdersToCreate[0].margin).toBe(
    toChainFormat(order.margin).toFixed(),
  )
  expect(message.toEip712V2()).toMatchObject({
    spot_market_orders_to_create: [
      expect.objectContaining({ expiration_block: '42' }),
    ],
    derivative_market_orders_to_create: [
      expect.objectContaining({ expiration_block: '42' }),
    ],
    binary_options_market_orders_to_create: [],
  })
})

describe.each([
  ['v1beta1', MsgBatchUpdateOrders, ExchangeV1Tx.MsgBatchUpdateOrders],
  ['v2', MsgBatchUpdateOrdersV2, ExchangeV2Tx.MsgBatchUpdateOrders],
] as const)('%s batches after v1.21 retirement', (version, Batch, Proto) => {
  it.each(retiredFields)(
    'rejects nonempty legacy %s in mixed batches',
    (key) => {
      const message = Batch.fromJSON({ ...params, [key]: [order] })

      for (const serialize of [
        () => message.toProto(),
        () => message.toAmino(),
        () => message.toWeb3Gw(),
        () => message.toDirectSign(),
        () => message.toBinary(),
        () => message.toEip712V2(),
      ]) {
        expect(serialize).toThrow('Binary options operations have been removed')
      }
    },
  )

  it.each(['inherited', 'non-enumerable'])(
    'rejects %s retired fields instead of silently dropping them',
    (storage) => {
      for (const key of retiredFields) {
        const legacyParams =
          storage === 'inherited'
            ? Object.assign(Object.create({ [key]: [order] }), params)
            : Object.defineProperty({ ...params }, key, { value: [order] })
        const message = Batch.fromJSON(legacyParams)

        expect(() => message.toProto()).toThrow(
          'Binary options operations have been removed',
        )
        expect(() => message.toAmino()).toThrow(
          'Binary options operations have been removed',
        )
      }
    },
  )

  it('only inspects the retired fields', () => {
    const extendedParams = {
      ...params,
      binaryOptionsMetadata: ['unrelated application data'],
      get unrelated() {
        throw new Error('Unrelated getter must not be read')
      },
    }

    expect(Batch.fromJSON(extendedParams).toBinary()).toEqual(
      Batch.fromJSON(params).toBinary(),
    )
  })

  it('keeps spot cancellations and conditional derivative orders', () => {
    const message = Batch.fromJSON(params)
    const proto = message.toProto()
    const derivative = proto.derivativeOrdersToCreate[0]

    expect(proto.subaccountId).toBe(params.subaccountId)
    expect(proto.spotMarketIdsToCancelAll).toEqual([order.marketId])
    expect(derivative.orderType).toBe(order.orderType)
    expect(derivative.triggerPrice).toBe(
      toChainFormat(order.triggerPrice).toFixed(),
    )
    expect(derivative.orderInfo?.quantity).toBe(
      toChainFormat(order.quantity).toFixed(),
    )
    expect(Proto.fromBinary(message.toBinary())).toEqual(proto)
    expect(message.toAmino().value).toMatchObject({
      binary_options_orders_to_cancel: [],
      binary_options_market_ids_to_cancel_all: [],
      binary_options_orders_to_create: [],
    })

    if (version === 'v2') {
      expect(derivative).toHaveProperty('expirationBlock', 42n)
      expect(message.toEip712V2()).toMatchObject({
        binary_options_orders_to_cancel: [],
        binary_options_market_ids_to_cancel_all: [],
        binary_options_orders_to_create: [],
        binary_options_market_orders_to_create: [],
        derivative_orders_to_create: [
          expect.objectContaining({
            order_type: 'TAKE_SELL',
            expiration_block: '42',
          }),
        ],
      })
      expect(
        message.toEip712Types().get('TypeDerivativeOrdersToCreate'),
      ).toContainEqual({
        name: 'expiration_block',
        type: 'int64',
      })
    }
  })

  it('accepts empty legacy fields without changing the signed batch', () => {
    const legacyParams = {
      ...params,
      ...Object.fromEntries(retiredFields.map((key) => [key, []])),
    }

    expect(Batch.fromJSON(legacyParams).toBinary()).toEqual(
      Batch.fromJSON(params).toBinary(),
    )
  })

  it('still decodes historical binary-options batches', () => {
    const historical = ExchangeV1Tx.MsgBatchUpdateOrders.create({
      sender: params.injectiveAddress,
      binaryOptionsMarketIdsToCancelAll: [order.marketId],
    })

    expect(
      Proto.fromBinary(ExchangeV1Tx.MsgBatchUpdateOrders.toBinary(historical)),
    ).toMatchObject(historical)
  })
})
