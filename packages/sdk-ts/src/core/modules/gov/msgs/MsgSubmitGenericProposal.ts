import snakecaseKeys from 'snakecase-keys'
import * as CosmosGovV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/tx_pb.mjs'
import * as GoogleProtobufAnyPbPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import type { Msgs } from '../../../../core/modules/msgs.js'

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

  export type Proto = CosmosGovV1TxPb.MsgSubmitProposal
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

    const depositParams = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.deposit.denom,
      amount: params.deposit.amount,
    })

    const message = CosmosGovV1TxPb.MsgSubmitProposal.create({
      messages: params.messages.map((msg) => {
        const contentAny = GoogleProtobufAnyPbPb.Any.create({
          typeUrl: msg.toDirectSign().type,
          value: msg.toBinary(),
        })

        return contentAny
      }),
      initialDeposit: [depositParams],
      proposer: params.proposer,
      metadata: params.metadata || '',
      title: params.title,
      summary: params.summary,
      expedited: params.expedited || false,
    })

    return message
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
    return CosmosGovV1TxPb.MsgSubmitProposal.toBinary(this.toProto())
  }
}
