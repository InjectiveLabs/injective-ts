import MsgCreateDenom from './MsgCreateDenom'
import { mockFactory } from '@injectivelabs/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgCreateDenom['params'] = {
  name: 'Injective',
  sender: mockFactory.injectiveAddress,
  subdenom: mockFactory.injectiveAddress,
  symbol: 'INJ',
}

const protoType = '/injective.tokenfactory.v1beta1.MsgCreateDenom'
const protoTypeAmino = 'injective/tokenfactory/create-denom'
const protoParams = {
  name: params.name,
  sender: params.sender,
  subdenom: params.subdenom,
  symbol: params.symbol,
}

const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgCreateDenom.fromJSON(params)

describe('MsgCreateDenom', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual(protoParams)
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
      type: protoTypeAmino,
      value: protoParamsAmino,
    })
  })

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      MsgValue: [
        { name: 'sender', type: 'string' },
        { name: 'subdenom', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'symbol', type: 'string' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeAmino,
      value: protoParamsAmino,
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
