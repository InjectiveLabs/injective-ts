import { it, expect, describe } from 'vitest'
import { OrderTypeMap } from '../types/light.js'
import MsgWithdraw from '../core/modules/exchange/msgs/MsgWithdraw.js'
import MsgCreateSpotLimitOrder from '../core/modules/exchange/msgs/MsgCreateSpotLimitOrder.js'
import MsgBatchCancelSpotOrders from '../core/modules/exchange/msgs/MsgBatchCancelSpotOrders.js'
import MsgCreateSpotLimitOrderV2 from '../core/modules/exchange/msgs/MsgCreateSpotLimitOrderV2.js'
import MsgBatchCancelSpotOrdersV2 from '../core/modules/exchange/msgs/MsgBatchCancelSpotOrdersV2.js'
import MsgBatchCancelDerivativeOrders from '../core/modules/exchange/msgs/MsgBatchCancelDerivativeOrders.js'
import MsgBatchCancelDerivativeOrdersV2 from '../core/modules/exchange/msgs/MsgBatchCancelDerivativeOrdersV2.js'
import MsgBatchCancelBinaryOptionsOrders from '../core/modules/exchange/msgs/MsgBatchCancelBinaryOptionsOrders.js'
import MsgBatchCancelBinaryOptionsOrdersV2 from '../core/modules/exchange/msgs/MsgBatchCancelBinaryOptionsOrdersV2.js'
import {
  getGasPriceBasedOnMessage,
  getGasOptionsBasedOnMessage,
  getFixedGasLimitBasedOnMessage,
} from './msgs.js'

const message = (type: string, order?: Record<string, unknown>) =>
  ({ toDirectSign: () => ({ type, message: order ? { order } : {} }) }) as any

const batchMessage = (type: string, data: unknown) =>
  ({ toDirectSign: () => ({ type, message: { data } }) }) as any

const spotOrderParams = {
  marketId: '0x' + '1'.repeat(64),
  subaccountId: '0x' + '2'.repeat(64),
  injectiveAddress: 'inj1test',
  orderType: OrderTypeMap.BUY_PO,
  feeRecipient: 'inj1test',
  price: '10',
  quantity: '1',
}

const batchCancelParams = {
  injectiveAddress: 'inj1test',
  orders: [
    {
      marketId: spotOrderParams.marketId,
      subaccountId: spotOrderParams.subaccountId,
    },
    {
      marketId: '0x' + '3'.repeat(64),
      subaccountId: '0x' + '4'.repeat(64),
    },
  ],
}

const types = [
  ['MsgCreateDerivativeLimitOrder', 330000, true],
  ['MsgCreateDerivativeMarketOrder', 310000, true],
  ['MsgCancelDerivativeOrder', 200000, false],
  ['MsgCreateSpotLimitOrder', 300000, true],
  ['MsgCreateSpotMarketOrder', 300000, true],
  ['MsgCancelSpotOrder', 185000, false],
  ['MsgCreateBinaryOptionsLimitOrder', 330000, true],
  ['MsgCreateBinaryOptionsMarketOrder', 310000, true],
  ['MsgCancelBinaryOptionsOrder', 200000, false],
  ['MsgDeposit', 330000, false],
  ['MsgWithdraw', 320000, false],
  ['MsgSubaccountTransfer', 220000, false],
  ['MsgExternalTransfer', 300000, false],
  ['MsgIncreasePositionMargin', 185000, false],
  ['MsgDecreasePositionMargin', 200000, false],
] as const

describe('getFixedGasLimitBasedOnMessage', () => {
  it.each(types)(
    'uses the documented gas for %s on both exchange versions',
    (type, gas, hasOrder) => {
      for (const version of ['v1beta1', 'v2']) {
        expect(
          getFixedGasLimitBasedOnMessage(
            message(
              `/injective.exchange.${version}.${type}`,
              hasOrder ? { orderType: 1 } : undefined,
            ),
          ),
        ).toBe(gas)
      }
    },
  )

  it.each([
    ['MsgCreateDerivativeLimitOrder', 370000],
    ['MsgCreateSpotLimitOrder', 330000],
    ['MsgCreateBinaryOptionsLimitOrder', 370000],
  ])('uses the post-only gas for %s', (type, gas) => {
    for (const version of ['v1beta1', 'v2']) {
      expect(
        getFixedGasLimitBasedOnMessage(
          message(`/injective.exchange.${version}.${type}`, { orderType: 7 }),
        ),
      ).toBe(gas)
    }
  })

  it('adds GTB gas and conservatively sums supported messages', () => {
    expect(
      getFixedGasLimitBasedOnMessage([
        message('/injective.exchange.v2.MsgCreateDerivativeLimitOrder', {
          orderType: 8,
          expirationBlock: 42n,
        }),
        message('/injective.exchange.v1beta1.MsgCancelSpotOrder'),
      ]),
    ).toBe(592000)
  })

  it('recognizes real v1 and v2 SDK message shapes', () => {
    expect(
      getFixedGasLimitBasedOnMessage(
        MsgWithdraw.fromJSON({
          subaccountId: spotOrderParams.subaccountId,
          injectiveAddress: spotOrderParams.injectiveAddress,
          amount: { amount: '1', denom: 'inj' },
        }),
      ),
    ).toBe(320000)
    expect(
      getFixedGasLimitBasedOnMessage(
        MsgCreateSpotLimitOrder.fromJSON(spotOrderParams),
      ),
    ).toBe(330000)
    expect(
      getFixedGasLimitBasedOnMessage(
        MsgCreateSpotLimitOrderV2.fromJSON({
          ...spotOrderParams,
          expirationBlock: '42',
        }),
      ),
    ).toBe(363000)
  })

  it.each([
    [MsgBatchCancelSpotOrders.fromJSON(batchCancelParams), 256000],
    [MsgBatchCancelSpotOrdersV2.fromJSON(batchCancelParams), 256000],
    [MsgBatchCancelDerivativeOrders.fromJSON(batchCancelParams), 266000],
    [MsgBatchCancelDerivativeOrdersV2.fromJSON(batchCancelParams), 266000],
    [MsgBatchCancelBinaryOptionsOrders.fromJSON(batchCancelParams), 366000],
    [MsgBatchCancelBinaryOptionsOrdersV2.fromJSON(batchCancelParams), 366000],
  ] as const)('calculates gas from real batch-cancel messages', (msg, gas) => {
    expect(getFixedGasLimitBasedOnMessage(msg)).toBe(gas)
  })

  it.each([
    ['MsgBatchCancelSpotOrders', 188000],
    ['MsgBatchCancelDerivativeOrders', 193000],
    ['MsgBatchCancelBinaryOptionsOrders', 243000],
  ])('calculates gas for one order in %s', (type, gas) => {
    expect(
      getFixedGasLimitBasedOnMessage(
        batchMessage(`/injective.exchange.v2.${type}`, [{}]),
      ),
    ).toBe(gas)
  })

  it('falls back for batches with multiple top-level messages', () => {
    const msgs = [
      MsgBatchCancelSpotOrdersV2.fromJSON(batchCancelParams),
      MsgBatchCancelDerivativeOrdersV2.fromJSON(batchCancelParams),
    ]

    expect(getFixedGasLimitBasedOnMessage(msgs)).toBeUndefined()
    expect(
      getGasOptionsBasedOnMessage({
        msgs,
        simulateTx: true,
        useFixedGas: true,
      }),
    ).toMatchObject({ estimateGas: true })
  })

  it('falls back for empty or malformed batch-cancel payloads', () => {
    const type = '/injective.exchange.v2.MsgBatchCancelSpotOrders'

    expect(
      getFixedGasLimitBasedOnMessage(batchMessage(type, [])),
    ).toBeUndefined()
    expect(
      getFixedGasLimitBasedOnMessage(batchMessage(type, {})),
    ).toBeUndefined()
    expect(getFixedGasLimitBasedOnMessage(message(type))).toBeUndefined()
  })

  it('falls back for non-exchange, governance deposit, batch updates, and mixed messages', () => {
    expect(getFixedGasLimitBasedOnMessage([])).toBeUndefined()
    expect(
      getFixedGasLimitBasedOnMessage(message('/cosmos.gov.v1.MsgDeposit')),
    ).toBeUndefined()
    expect(
      getFixedGasLimitBasedOnMessage(
        message('/injective.exchange.v2.MsgBatchUpdateOrders'),
      ),
    ).toBeUndefined()
    expect(
      getFixedGasLimitBasedOnMessage(
        message('/injective.exchange.v1beta1.MsgBatchUpdateOrders'),
      ),
    ).toBeUndefined()
    expect(
      getFixedGasLimitBasedOnMessage([
        batchMessage('/injective.exchange.v2.MsgBatchCancelSpotOrders', [{}]),
        message('/cosmos.bank.v1beta1.MsgSend'),
      ]),
    ).toBeUndefined()
  })

  it('falls back when an order message has an invalid proto shape', () => {
    expect(
      getFixedGasLimitBasedOnMessage(
        message('/injective.exchange.v2.MsgCreateSpotLimitOrder'),
      ),
    ).toBeUndefined()
  })

  it('uses fixed gas only when enabled', () => {
    const supported = message('/injective.exchange.v2.MsgWithdraw')
    const unsupported = message('/cosmos.bank.v1beta1.MsgSend')

    expect(
      getGasOptionsBasedOnMessage({ msgs: supported, simulateTx: true }),
    ).toMatchObject({ estimateGas: true })
    expect(
      getGasOptionsBasedOnMessage({
        msgs: supported,
        gas: 123456,
        simulateTx: true,
      }),
    ).toEqual({ gas: '123456', gasLimit: 123456, estimateGas: true })
    expect(
      getGasOptionsBasedOnMessage({
        msgs: supported,
        simulateTx: true,
        useFixedGas: true,
      }),
    ).toEqual({ gas: '320000', gasLimit: 320000, estimateGas: false })
    expect(
      getGasOptionsBasedOnMessage({
        msgs: {
          toDirectSign: () => {
            throw new Error('explicit gas must bypass message inspection')
          },
        } as any,
        gas: 123456,
        simulateTx: true,
        useFixedGas: true,
      }),
    ).toEqual({ gas: '123456', gasLimit: 123456, estimateGas: false })
    expect(
      getGasOptionsBasedOnMessage({
        msgs: unsupported,
        simulateTx: true,
        useFixedGas: true,
      }),
    ).toMatchObject({ estimateGas: true })
  })

  it('uses fixed gas for supported batches only when enabled', () => {
    const batch = MsgBatchCancelSpotOrdersV2.fromJSON(batchCancelParams)

    expect(
      getGasOptionsBasedOnMessage({ msgs: batch, simulateTx: true }),
    ).toMatchObject({ estimateGas: true })
    expect(
      getGasOptionsBasedOnMessage({
        msgs: batch,
        simulateTx: true,
        useFixedGas: true,
      }),
    ).toEqual({ gas: '256000', gasLimit: 256000, estimateGas: false })
  })

  it('preserves the legacy fallback for a falsy explicit gas value', () => {
    const supported = message('/injective.exchange.v2.MsgWithdraw')
    const legacyGasLimit = getGasPriceBasedOnMessage([supported])

    expect(
      getGasOptionsBasedOnMessage({
        msgs: supported,
        gas: 0,
        simulateTx: true,
      }),
    ).toEqual({
      gas: legacyGasLimit.toString(),
      gasLimit: legacyGasLimit,
      estimateGas: true,
    })
    expect(
      getGasOptionsBasedOnMessage({
        msgs: supported,
        gas: 0,
        simulateTx: true,
        useFixedGas: true,
      }),
    ).toEqual({ gas: '320000', gasLimit: 320000, estimateGas: false })
  })
})
