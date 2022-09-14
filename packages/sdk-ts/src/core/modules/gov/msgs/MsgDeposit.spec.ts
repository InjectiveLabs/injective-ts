import { MsgDeposit as BaseMsgDeposit } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/tx_pb'
import { BigNumberInBase } from '@injectivelabs/utils'
import MsgDeposit from './MsgDeposit'
import { mockFactory } from '@tests/mocks'
import snakecaseKeys from 'snakecase-keys'

const params: MsgDeposit['params'] = {
  proposalId: 1,
  depositor: mockFactory.injectiveAddress,
  amount: {
    amount: new BigNumberInBase(1).toFixed(),
    denom: 'inj',
  },
}

const protoType = '/cosmos.gov.v1beta1.MsgDeposit'
const protoTypeAmino = 'cosmos-sdk/MsgDeposit'
const protoParamsBefore = {
  proposalId: params.proposalId,
  depositor: params.depositor,
  amountList: [params.amount],
}

const protoParamsAfter = {
  proposal_id: params.proposalId,
  depositor: params.depositor,
  amount: [params.amount],
}

const message = MsgDeposit.fromJSON(params)

describe.only('MsgDeposit', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto instanceof BaseMsgDeposit).toBe(true)
    expect(proto.toObject()).toStrictEqual(protoParamsBefore)
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParamsBefore,
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeAmino,
      ...protoParamsAfter,
    })
  })

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      TypeAmount: [
        { name: 'denom', type: 'string' },
        { name: 'amount', type: 'string' },
      ],
      MsgValue: [
        { name: 'proposal_id', type: 'uint64' },
        { name: 'depositor', type: 'string' },
        { name: 'amount', type: 'TypeAmount[]' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeAmino,
      value: snakecaseKeys({
        ...protoParamsAfter,
        proposal_id: params.proposalId.toString(),
      }),
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAfter,
    })
  })
})
