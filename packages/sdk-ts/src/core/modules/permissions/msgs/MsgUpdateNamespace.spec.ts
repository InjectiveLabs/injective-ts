import snakecaseKeys from 'snakecase-keys'
import MsgUpdateNamespace from './MsgUpdateNamespace'
import { mockFactory } from '@injectivelabs/test-utils'

const params: MsgUpdateNamespace['params'] = {
  sender: mockFactory.injectiveAddress,
  namespaceDenom: 'namespace_denom',
  wasmHook: {
    newValue: 'wasmHookAddress',
  },
  mintsPaused: {
    newValue: true,
  },
  sendsPaused: {
    newValue: false,
  },
  burnsPaused: {
    newValue: true,
  }
}

const protoType = '/injective.permissions.v1beta1.MsgUpdateNamespace'
const protoTypeShort = 'permissions/MsgUpdateNamespace'
const protoParams = {
  sender: params.sender,
  namespaceDenom: params.namespaceDenom,
  wasmHook: {
    newValue: params.wasmHook.newValue,
  },
  mintsPaused: {
    newValue: params.mintsPaused.newValue,
  },
  sendsPaused: {
    newValue: params.sendsPaused.newValue,
  },
  burnsPaused: {
    newValue: params.burnsPaused.newValue,
  },
}

const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgUpdateNamespace.fromJSON(params)

describe('MsgUpdateNamespace', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual({
      ...protoParams
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
