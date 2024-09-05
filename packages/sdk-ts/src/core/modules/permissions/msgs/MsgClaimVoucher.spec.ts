import snakecaseKeys from 'snakecase-keys'
import MsgClaimVoucher from './MsgClaimVoucher'
import { mockFactory } from '@injectivelabs/test-utils'

const params: MsgClaimVoucher['params'] = {
  sender: mockFactory.injectiveAddress,
  denom: 'inj',
}

const protoType = '/injective.permissions.v1beta1.MsgClaimVoucher'
const protoTypeShort = 'permissions/MsgClaimVoucher'
const protoParams = {
  sender: params.sender,
  denom: params.denom,
}

const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgClaimVoucher.fromJSON(params)

describe('MsgClaimVoucher', () => {
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
