import { MsgSubmitProposal as BaseMsgSubmitProposal } from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { Any } from '@injectivelabs/core-proto-ts/google/protobuf/any'
import { TextProposal } from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/gov'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

export declare namespace MsgSubmitTextProposal {
  export interface Params {
    title: string
    description: string
    proposer: string
    deposit: {
      amount: string
      denom: string
    }
  }

  export type Proto = BaseMsgSubmitProposal

  export type Object = Omit<BaseMsgSubmitProposal, 'content'> & {
    content: {
      type_url: string
      value: any
    }
  }
}

/**
 * @category Messages
 */
export default class MsgSubmitTextProposal extends MsgBase<
  MsgSubmitTextProposal.Params,
  MsgSubmitTextProposal.Proto,
  MsgSubmitTextProposal.Object
> {
  static fromJSON(params: MsgSubmitTextProposal.Params): MsgSubmitTextProposal {
    return new MsgSubmitTextProposal(params)
  }

  public toProto() {
    const { params } = this

    const depositParams = Coin.create()
    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const content = this.getContent()
    const proposalType = '/cosmos.gov.v1beta1.TextProposal'

    const contentAny = Any.create()
    contentAny.value = TextProposal.encode(content).finish()
    contentAny.typeUrl = proposalType

    const message = BaseMsgSubmitProposal.create()
    message.content = contentAny
    message.proposer = params.proposer
    message.initialDeposit = [depositParams]

    return BaseMsgSubmitProposal.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const content = this.getContent()
    const proposalType = 'cosmos-sdk/TextProposal'

    const message = {
      content,
      proposer: params.proposer,
    }

    const messageWithProposalType = snakecaseKeys({
      ...message,
      content: {
        value: message.content,
        type: proposalType,
      },
    })

    return {
      type: 'cosmos-sdk/MsgSubmitProposal',
      value:
        messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitTextProposal.Object>,
    }
  }

  public toWeb3() {
    const { params } = this
    const content = this.getContent()
    const proposalType = '/cosmos.gov.v1beta1.TextProposal'

    const message = {
      content,
      proposer: params.proposer,
    }

    const messageWithProposalType = {
      ...message,
      content: {
        ...message.content,
        '@type': proposalType,
      },
    }

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...(messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitTextProposal.Object>),
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1beta1.MsgSubmitProposal',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgSubmitProposal.encode(this.toProto()).finish()
  }

  private getContent() {
    const { params } = this

    const content = TextProposal.create()
    content.title = params.title
    content.description = params.description

    return TextProposal.fromPartial(content)
  }
}
