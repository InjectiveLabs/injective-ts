import { MsgSubmitProposal as BaseMsgSubmitProposal } from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { Any } from '@injectivelabs/core-proto-ts/google/protobuf/any'
import { TextProposal } from '@injectivelabs/core-proto-ts/cosmos/gov/v1beta1/gov'
import { MsgBase } from '../../MsgBase'

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

  export interface DirectSign {
    type: '/cosmos.gov.v1beta1.MsgSubmitProposal'
    message: BaseMsgSubmitProposal
  }

  export interface Data extends BaseMsgSubmitProposal {
    '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal'
  }

  export interface Amino extends BaseMsgSubmitProposal {
    type: 'cosmos-sdk/MsgSubmitProposal'
  }

  export interface Web3 extends BaseMsgSubmitProposal {
    '@type': '/cosmos.authz.v1beta1.MsgSubmitProposal'
  }

  export type Proto = BaseMsgSubmitProposal
}

/**
 * @category Messages
 */
export default class MsgSubmitTextProposal extends MsgBase<
  MsgSubmitTextProposal.Params,
  MsgSubmitTextProposal.Data,
  MsgSubmitTextProposal.Proto,
  MsgSubmitTextProposal.Amino,
  MsgSubmitTextProposal.DirectSign
> {
  static fromJSON(params: MsgSubmitTextProposal.Params): MsgSubmitTextProposal {
    return new MsgSubmitTextProposal(params)
  }

  public toProto(): MsgSubmitTextProposal.Proto {
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

  public toData(): MsgSubmitTextProposal.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgSubmitProposal',
      ...proto,
    }
  }

  public toAmino(): MsgSubmitTextProposal.Amino {
    const { params } = this
    const content = this.getContent()
    const proposalType = 'cosmos-sdk/TextProposal'

    const message = {
      content,
      proposer: params.proposer,
    }

    const messageWithProposalType = {
      ...message,
      content: {
        ...message.content,
        type: proposalType,
      },
    }

    return {
      type: 'cosmos-sdk/MsgSubmitProposal',
      ...messageWithProposalType,
    } as unknown as MsgSubmitTextProposal.Amino
  }

  public toWeb3(): MsgSubmitTextProposal.Web3 {
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
      ...messageWithProposalType,
    } as unknown as MsgSubmitTextProposal.Web3
  }

  public toDirectSign(): MsgSubmitTextProposal.DirectSign {
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
