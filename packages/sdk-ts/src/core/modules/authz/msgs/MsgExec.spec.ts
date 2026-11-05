import { toChainFormat } from '@injectivelabs/utils'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgExec from './MsgExec.js'
import MsgSend from '../../bank/msgs/MsgSend.js'
import { getEip712TypedData } from '../../../tx/eip712/eip712.js'
import { MsgIncreasePositionMarginV2 } from '../../exchange/index.js'
import MsgSetConsolidatedInsurancePoolPause from '../../insurance/msgs/MsgSetConsolidatedInsurancePoolPause.js'

const { injectiveAddress, injectiveAddress2 } = mockFactory

const params = {
  grantee: injectiveAddress,
  msgs: [
    MsgSend.fromJSON({
      dstInjectiveAddress: injectiveAddress,
      srcInjectiveAddress: injectiveAddress2,
      amount: {
        amount: toChainFormat(1).toFixed(),
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

  describe('with a child that EIP712 v1 cannot sign', () => {
    const margin = MsgIncreasePositionMarginV2.fromJSON({
      marketId: mockFactory.derivativeMarketId,
      injectiveAddress,
      srcSubaccountId: mockFactory.subaccountId,
      dstSubaccountId: mockFactory.subaccountId,
      amount: '100',
    })
    const exec = MsgExec.fromJSON({ grantee: injectiveAddress, msgs: [margin] })

    it('amino embeds the amino of the child (Ledger Cosmos authz)', () => {
      expect(exec.toAmino().value.msgs).toStrictEqual([margin.toAmino()])
    })

    it('EIP712 v1 serializes the child like any other (only a root message is restricted)', () => {
      expect(exec.toEip712().value.msgs).toStrictEqual([margin.toAmino()])
      expect(() => margin.assertEip712V1Supported()).toThrow(
        'EIP712_v1 is not supported',
      )
    })
  })

  it('EIP712 v1 declares the fields a child omits, so signing them is rejected', () => {
    const exec = MsgExec.fromJSON({
      grantee: injectiveAddress,
      msgs: [
        MsgSetConsolidatedInsurancePoolPause.fromJSON({
          authority: injectiveAddress,
          depositDenom: 'usdt',
          paused: false,
        }),
      ],
    })

    expect(JSON.stringify([...exec.toEip712Types()])).toContain('"paused"')

    const { eip712Args } = prepareEip712({ messages: exec })

    expect(() => getEip712TypedData(eip712Args)).toThrow('paused')
  })
})
