import MsgSetDenomMetadata from './MsgSetDenomMetadata.js'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgSetDenomMetadata['params'] = {
  sender: mockFactory.injectiveAddress,
  metadata: {
    symbol: 'TEST',
    display: 'factory/test',
    name: 'Test',
    decimals: 18,
    description: 'test description',
    uri: 'https://injective.com',
    uriHash: '',
    base: 'factory/test',
    denomUnits: [
      {
        denom: 'factory/test',
        exponent: 1,
        aliases: ['uinj'],
      },
    ],
  },
}

const protoType = '/injective.tokenfactory.v1beta1.MsgSetDenomMetadata'
const protoTypeAmino = 'injective/tokenfactory/set-denom-metadata'
const protoParams = {
  sender: params.sender,
  metadata: params.metadata,
}

const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgSetDenomMetadata.fromJSON(params)

describe('MsgSetDenomMetadata', () => {
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
      TypeMetadata: [
        { name: 'description', type: 'string' },
        { name: 'denom_units', type: 'TypeMetadataDenomUnits[]' },
        { name: 'base', type: 'string' },
        { name: 'display', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'symbol', type: 'string' },
        { name: 'uri', type: 'string' },
        { name: 'uri_hash', type: 'string' },
        { name: 'decimals', type: 'uint64' },
      ],
      TypeMetadataDenomUnits: [
        { name: 'denom', type: 'string' },
        { name: 'exponent', type: 'uint32' },
        { name: 'aliases', type: 'string[]' },
      ],
      MsgValue: [
        { name: 'sender', type: 'string' },
        { name: 'metadata', type: 'TypeMetadata' },
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
