import snakecaseKeys from 'snakecase-keys'
import {
  CosmosGovV1Tx,
  GoogleProtobufAny,
  CosmosBaseV1Beta1Coin,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase'
import { Msgs } from '../../../../core/modules/msgs'

export declare namespace MsgSubmitGenericProposal {
  export interface Params {
    title: string
    summary: string
    expedited?: boolean
    proposer: string
    metadata?: string
    messages: Msgs[]
    deposit: {
      amount: string
      denom: string
    }
  }

  export type Proto = CosmosGovV1Tx.MsgSubmitProposal
}

/**
 * @category Messages
 */
export default class MsgSubmitGenericProposal extends MsgBase<
  MsgSubmitGenericProposal.Params,
  MsgSubmitGenericProposal.Proto
> {
  static fromJSON(
    params: MsgSubmitGenericProposal.Params,
  ): MsgSubmitGenericProposal {
    return new MsgSubmitGenericProposal(params)
  }

  public toProto() {
    const { params } = this

    const depositParams = CosmosBaseV1Beta1Coin.Coin.create()

    depositParams.denom = params.deposit.denom
    depositParams.amount = params.deposit.amount

    const message = CosmosGovV1Tx.MsgSubmitProposal.create()

    message.messages = params.messages.map((msg) => {
      const contentAny = GoogleProtobufAny.Any.create()

      contentAny.typeUrl = msg.toDirectSign().type
      contentAny.value = msg.toBinary()

      return contentAny
    })
    message.initialDeposit = [depositParams]
    message.proposer = params.proposer
    message.metadata = params.metadata || ''
    message.title = params.title
    message.summary = params.summary
    message.expedited = params.expedited || false

    return CosmosGovV1Tx.MsgSubmitProposal.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1.MsgSubmitProposal',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this

    const messageWithProposalType: any = snakecaseKeys({
      messages: params.messages.map((msg) => msg.toAmino()),
      initialDeposit: [
        {
          denom: params.deposit.denom,
          amount: params.deposit.amount,
        },
      ],
      proposer: params.proposer,
      metadata: params.metadata || '',
      title: params.title,
      summary: params.summary,
      expedited: params.expedited || false,
    })

    return {
      type: 'cosmos-sdk/MsgSubmitProposal',
      value: messageWithProposalType,
    }
  }

  public toWeb3() {
    const { params } = this

    const messageWithProposalType: any = {
      messages: params.messages.map((msg) => msg.toWeb3()),
      initialDeposit: [
        {
          denom: params.deposit.denom,
          amount: params.deposit.amount,
        },
      ],
      proposer: params.proposer,
      metadata: params.metadata || '',
      title: params.title,
      summary: params.summary,
      expedited: params.expedited || false,
    }

    return {
      '@type': '/cosmos.gov.v1.MsgSubmitProposal',
      ...messageWithProposalType,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1.MsgSubmitProposal',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosGovV1Tx.MsgSubmitProposal.encode(this.toProto()).finish()
  }
}
