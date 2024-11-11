import { BigNumberInBase } from '@injectivelabs/utils'
import MsgCreateInsuranceFund from './MsgCreateInsuranceFund.js'
import { mockFactory } from '@injectivelabs/test-utils'
import snakecaseKeys from 'snakecase-keys'

const market = mockFactory.injUsdtDerivativeMarket

const params: MsgCreateInsuranceFund['params'] = {
  fund: {
    ticker: market.ticker,
    quoteDenom: market.quoteDenom,
    oracleBase: market.oracleBase,
    oracleQuote: market.oracleQuote,
    oracleType: 2,
  },
  deposit: {
    amount: new BigNumberInBase(1).toFixed(),
    denom: 'inj',
  },
  injectiveAddress: mockFactory.injectiveAddress,
}

const protoType = '/injective.insurance.v1beta1.MsgCreateInsuranceFund'
const protoTypeShort = 'insurance/MsgCreateInsuranceFund'
const protoParams = {
  ...params.fund,
  initialDeposit: params.deposit,
  sender: params.injectiveAddress,
  expiry: '-1',
}
const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgCreateInsuranceFund.fromJSON(params)

describe('MsgCreateInsuranceFund', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual({
      ...protoParams,
    })
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParams,
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeShort,
      value: protoParamsAmino,
    })
  })

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      TypeInitialDeposit: [
        { name: 'denom', type: 'string' },
        { name: 'amount', type: 'string' },
      ],
      MsgValue: [
        { name: 'sender', type: 'string' },
        { name: 'ticker', type: 'string' },
        { name: 'quote_denom', type: 'string' },
        { name: 'oracle_base', type: 'string' },
        { name: 'oracle_quote', type: 'string' },
        { name: 'oracle_type', type: 'int32' },
        { name: 'expiry', type: 'int64' },
        { name: 'initial_deposit', type: 'TypeInitialDeposit' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeShort,
      value: snakecaseKeys({
        ...protoParamsAmino,
        expiry: '-1',
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
