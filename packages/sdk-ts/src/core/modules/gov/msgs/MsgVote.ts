import { MsgVote as BaseMsgVote } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/tx_pb'
import { VoteOptionMap } from '@injectivelabs/chain-api/cosmos/gov/v1beta1/gov_pb'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgVote {
  export interface Params {
    proposalId: number
    vote: VoteOptionMap[keyof VoteOptionMap]
    voter: string
  }

  export type Proto = BaseMsgVote

  export type Object = BaseMsgVote.AsObject
}

/**
 * @category Messages
 */
export default class MsgVote extends MsgBase<
  MsgVote.Params,
  MsgVote.Proto,
  MsgVote.Object
> {
  static fromJSON(params: MsgVote.Params): MsgVote {
    return new MsgVote(params)
  }

  public toProto() {
    const { params } = this

    const message = new BaseMsgVote()
    message.setOption(params.vote)
    message.setProposalId(params.proposalId)
    message.setVoter(params.voter)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgVote',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'cosmos-sdk/MsgVote',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.gov.v1beta1.MsgVote',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1beta1.MsgVote',
      message: proto,
    }
  }
}
