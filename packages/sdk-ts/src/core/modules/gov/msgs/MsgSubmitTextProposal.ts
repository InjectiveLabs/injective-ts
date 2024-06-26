import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  GoogleProtobufAny,
  CosmosGovV1Beta1Tx,
  CosmosGovV1Beta1Gov,
  CosmosBaseV1Beta1Coin,
} from '@injectivelabs/core-proto-ts'
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

  export type Proto = CosmosGovV1Beta1Tx.MsgSubmitProposal

  export type Object = Omit<CosmosGovV1Beta1Tx.MsgSubmitProposal, 'content'> & {
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

    const depositParams = CosmosBaseV1Beta1Coin.Coin.create()

    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const content = this.getContent()
    const proposalType = '/cosmos.gov.v1beta1.TextProposal'

    const contentAny = GoogleProtobufAny.Any.create()

    contentAny.typeUrl = proposalType
    contentAny.value = CosmosGovV1Beta1Gov.TextProposal.encode(content).finish()

    const message = CosmosGovV1Beta1Tx.MsgSubmitProposal.create()

    message.content = contentAny
    message.initialDeposit = [depositParams]
    message.proposer = params.proposer

    return CosmosGovV1Beta1Tx.MsgSubmitProposal.fromPartial(message)
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

    const messageWithProposalType = snakecaseKeys({
      content: {
        type: 'cosmos-sdk/TextProposal',
        value: this.getContent(),
      },
      initialDeposit: [
        {
          denom: params.deposit.denom,
          amount: params.deposit.amount,
        },
      ],
      proposer: params.proposer,
    })

    return {
      type: 'cosmos-sdk/MsgSubmitProposal',
      value:
        messageWithProposalType as unknown as SnakeCaseKeys<MsgSubmitTextProposal.Object>,
    }
  }

  public toWeb3() {
    const { params } = this

    const messageWithProposalType = {
      content: {
        '@type': '/cosmos.gov.v1beta1.TextProposal',
        ...this.getContent(),
      },
      initialDeposit: [
        {
          denom: params.deposit.denom,
          amount: params.deposit.amount,
        },
      ],
      proposer: params.proposer,
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
    return CosmosGovV1Beta1Tx.MsgSubmitProposal.encode(this.toProto()).finish()
  }

  private getContent() {
    const { params } = this

    const content = CosmosGovV1Beta1Gov.TextProposal.create()

    content.title = params.title
    content.description = params.description

    return CosmosGovV1Beta1Gov.TextProposal.fromPartial(content)
  }
}
