import snakecaseKeys from 'snakecase-keys'
import {
  CosmosGovV1Tx,
  GoogleProtobufAny,
  CosmosBaseV1Beta1Coin,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import { Msgs } from '../../../../core/modules/msgs.js'

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
    const proto = this.toProto()

    const messageWithProposalType: any = snakecaseKeys({
      ...proto,
      messages: params.messages.map((msg) => msg.toAmino()),
    })

    return {
      type: 'cosmos-sdk/v1/MsgSubmitProposal',
      value: messageWithProposalType,
    }
  }

  public toWeb3Gw() {
    const { params } = this
    const amino = this.toAmino()

    const messageWithProposalType: any = {
      ...amino.value,
      messages: params.messages.map((msg) => msg.toWeb3Gw()),
    }

    return {
      '@type': '/cosmos.gov.v1.MsgSubmitProposal',
      ...messageWithProposalType,
    }
  }

  public toEip712() {
    const { type, value } = this.toAmino()

    const messageAdjusted = { ...value }

    if (!messageAdjusted.expedited) {
      delete messageAdjusted.expedited
    }

    return {
      type,
      value: messageAdjusted,
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
