import MsgExec from './MsgExec'
import { mockFactory } from '@injectivelabs/test-utils'
import { BigNumberInBase } from '@injectivelabs/utils'
import MsgSend from '../../bank/msgs/MsgSend.js'

const { injectiveAddress, injectiveAddress2 } = mockFactory

const params = {
  grantee: injectiveAddress,
  msgs: [
    MsgSend.fromJSON({
      dstInjectiveAddress: injectiveAddress,
      srcInjectiveAddress: injectiveAddress2,
      amount: {
        amount: new BigNumberInBase(1).toFixed(),
        denom: 'inj',
      },
    }),
  ],
}

const protoType = '/cosmos.authz.v1beta1.MsgExec'

const protoParams = {
  grantee: params.grantee,
  msgs: [
    {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: params.msgs[0].toBinary(),
    },
  ],
}

const message = MsgExec.fromJSON(params)

describe('MsgExec', () => {
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
})
