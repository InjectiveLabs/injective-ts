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

  export interface Amino extends BaseMsgVote.AsObject {
    type: 'cosmos-sdk/MsgVote'
  }

  export interface Web3 extends BaseMsgVote.AsObject {
    '@type': '/cosmos.authz.v1beta1.MsgVote'
  }

  export type Proto = BaseMsgVote
}

/**
 * @category Messages
 */
export default class MsgVote extends MsgBase<
  MsgVote.Params,
  MsgVote.Data,
  MsgVote.Proto,
  MsgVote.Amino,
  MsgVote.DirectSign
> {
  static fromJSON(params: MsgVote.Params): MsgVote {
    return new MsgVote(params)
  }

  public toProto(): MsgVote.Proto {
    const { params } = this

    const message = new BaseMsgVote()
    message.setOption(params.vote)
    message.setProposalId(params.proposalId)
    message.setVoter(params.voter)

    return message
  }

  public toData(): MsgVote.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgVote',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgVote.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgVote',
      ...proto.toObject(),
    }
  }

  public toWeb3(): MsgVote.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.gov.v1beta1.MsgVote',
      ...rest,
    } as unknown as MsgVote.Web3
  }

  public toDirectSign(): MsgVote.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1beta1.MsgVote',
      message: proto,
    }
  }
}
