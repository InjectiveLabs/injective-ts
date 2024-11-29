import MsgInstantSpotMarketLaunch from './MsgInstantSpotMarketLaunch.js'
import { mockFactory } from '@injectivelabs/test-utils'
import snakecaseKeys from 'snakecase-keys'

const market = mockFactory.injUsdtSpotMarket

const params: MsgInstantSpotMarketLaunch['params'] = {
  proposer: mockFactory.injectiveAddress,
  market: {
    sender: mockFactory.injectiveAddress,
    ticker: market.ticker,
    baseDenom: market.baseDenom,
    quoteDenom: market.quoteDenom,
    minPriceTickSize: market.minPriceTickSize,
    minNotional: '1',
    minQuantityTickSize: market.minQuantityTickSize,
  },
}

const protoType = '/injective.exchange.v1beta1.MsgInstantSpotMarketLaunch'
const protoTypeAmino = 'exchange/MsgInstantSpotMarketLaunch'
const protoParams = {
  ...params.market,
}
const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgInstantSpotMarketLaunch.fromJSON(params)

// TODO
describe.skip('MsgInstantSpotMarketLaunch', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual({
      ...protoParams,
      minNotional: '1000000000000000000',
      minPriceTickSize: '1000',
      minQuantityTickSize: '1000000000000000000000000000000000',
    })
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParams,
      minNotional: '1000000000000000000',
      minPriceTickSize: '1000',
      minQuantityTickSize: '1000000000000000000000000000000000',
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeAmino,
      value: protoParamsAmino,
    })
  })

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      MsgValue: [
        { name: 'sender', type: 'string' },
        { name: 'ticker', type: 'string' },
        { name: 'base_denom', type: 'string' },
        { name: 'quote_denom', type: 'string' },
        { name: 'min_price_tick_size', type: 'string' },
        { name: 'min_quantity_tick_size', type: 'string' },
        { name: 'min_notional', type: 'string' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeAmino,
      value: snakecaseKeys({
        ...protoParamsAmino,
        min_price_tick_size: '0.000000000000001000',
        min_quantity_tick_size: '1000000000000000.000000000000000000',
      }),
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
  })
})
