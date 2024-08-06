import snakecaseKeys from 'snakecase-keys'
import MsgDeleteNamespace from './MsgDeleteNamespace'
import { mockFactory } from '@injectivelabs/test-utils'

const params: MsgDeleteNamespace['params'] = {
  sender: mockFactory.injectiveAddress,
  namespaceDenom: 'namespace_denom',
}

const protoType = '/injective.permissions.v1beta1.MsgDeleteNamespace';
const protoTypeShort = 'permissions/MsgDeleteNamespace';
const protoParams = {
  sender: params.sender,
  namespaceDenom: params.namespaceDenom,
}

const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgDeleteNamespace.fromJSON(params)

describe('MsgDeleteNamespace', () => {
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

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
  })
})
