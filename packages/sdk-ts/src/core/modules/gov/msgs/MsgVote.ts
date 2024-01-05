import { CosmosGovV1Tx, CosmosGovV1Gov } from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgVote {
  export interface Params {
    proposalId: number
    metadata: string
    vote: CosmosGovV1Gov.VoteOption
    voter: string
  }

  export type Proto = CosmosGovV1Tx.MsgVote
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

    const message = CosmosGovV1Tx.MsgVote.create()
    message.option = params.vote
    message.proposalId = params.proposalId.toString()
    message.metadata = params.metadata
    message.voter = params.voter
    message.metadata = params.proposalId.toString()

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1.MsgVote',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/v1/MsgVote',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.gov.v1.MsgVote',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1.MsgVote',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosGovV1Tx.MsgVote.encode(this.toProto()).finish()
  }
}
