import { it, expect, describe } from 'vitest'
import { OrderTypeMap } from '../types/light.js'
import MsgWithdraw from '../core/modules/exchange/msgs/MsgWithdraw.js'
import MsgCreateSpotLimitOrder from '../core/modules/exchange/msgs/MsgCreateSpotLimitOrder.js'
import MsgCreateSpotLimitOrderV2 from '../core/modules/exchange/msgs/MsgCreateSpotLimitOrderV2.js'
import {
  getGasPriceBasedOnMessage,
  getGasOptionsBasedOnMessage,
  getFixedGasLimitBasedOnMessage,
} from './msgs.js'

const message = (type: string, order?: Record<string, unknown>) =>
  ({ toDirectSign: () => ({ type, message: order ? { order } : {} }) }) as any

const spotOrderParams = {
  marketId: '0x' + '1'.repeat(64),
  subaccountId: '0x' + '2'.repeat(64),
  injectiveAddress: 'inj1test',
  orderType: OrderTypeMap.BUY_PO,
  feeRecipient: 'inj1test',
  price: '10',
  quantity: '1',
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

  it('falls back for non-exchange, governance deposit, batch, and mixed messages', () => {
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
      getFixedGasLimitBasedOnMessage([
        message('/injective.exchange.v2.MsgWithdraw'),
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
