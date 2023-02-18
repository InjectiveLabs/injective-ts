import { MsgVote as BaseMsgVote } from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/tx'
import { VoteOption } from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/gov'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgVote {
  export interface Params {
    proposalId: number
    vote: VoteOption
    voter: string
  }

  export type Proto = BaseMsgVote
}

/**
 * @category Messages
 */
export default class MsgVote extends MsgBase<MsgVote.Params, MsgVote.Proto> {
  static fromJSON(params: MsgVote.Params): MsgVote {
    return new MsgVote(params)
  }

  public toProto() {
    const { params } = this

    const message = BaseMsgVote.create()
    message.option = params.vote
    message.proposalId = params.proposalId.toString()
    message.voter = params.voter

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgVote',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
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

  public toBinary(): Uint8Array {
    return BaseMsgVote.encode(this.toProto()).finish()
  }
}
