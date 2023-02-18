import MsgVote from './MsgVote'
import { mockFactory } from '@injectivelabs/test-utils'
import snakecaseKeys from 'snakecase-keys'

const params: MsgVote['params'] = {
  proposalId: 1,
  voter: mockFactory.injectiveAddress,
  vote: 3,
}

const protoType = '/cosmos.gov.v1beta1.MsgVote'
const protoTypeAmino = 'cosmos-sdk/MsgVote'
const protoParams = {
  proposalId: params.proposalId,
  voter: params.voter,
  option: params.vote,
}
const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgVote.fromJSON(params)

describe('MsgVote', () => {
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
        { name: 'proposal_id', type: 'uint64' },
        { name: 'voter', type: 'string' },
        { name: 'option', type: 'int32' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeAmino,
      value: snakecaseKeys({
        ...protoParamsAmino,
        proposal_id: params.proposalId.toString(),
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
