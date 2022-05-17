import { MsgVote as BaseMsgVote } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/tx_pb'
import { VoteOptionMap } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgVote {
  export interface Params {
    proposalId: number
    vote: VoteOptionMap[keyof VoteOptionMap]
    voter: string
  }

  export interface DirectSign {
    type: '/cosmos.gov.v1beta1.MsgVote'
    message: BaseMsgVote
  }

  export interface Data extends BaseMsgVote.AsObject {
    '@type': '/cosmos.gov.v1beta1.MsgVote'
  }

  export interface Web3 extends BaseMsgVote.AsObject {
    '@type': '/cosmos.gov.v1beta1.MsgVote'
  }

  export type Proto = BaseMsgVote
}

export default class MsgVote extends MsgBase<
  MsgVote.Params,
  MsgVote.Data,
  MsgVote.Proto,
  MsgVote.Web3,
  MsgVote.DirectSign
> {
  static fromJSON(params: MsgVote.Params): MsgVote {
    return new MsgVote(params)
  }

  toProto(): MsgVote.Proto {
    const { params } = this

    const message = new BaseMsgVote()
    message.setOption(params.vote)
    message.setProposalId(params.proposalId)
    message.setVoter(params.voter)

    return message
  }

  toData(): MsgVote.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgVote',
      ...proto.toObject(),
    }
  }

  toWeb3(): MsgVote.Web3 {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgVote',
      ...proto.toObject(),
    }
  }

  toDirectSign(): MsgVote.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1beta1.MsgVote',
      message: proto,
    }
  }
}
