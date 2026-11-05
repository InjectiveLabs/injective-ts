import * as CosmosGovV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/tx_pb'
import * as GoogleProtobufAnyPbPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase.js'
import { graftEip712Types } from '../../../tx/eip712/maps.js'
import type { Msgs } from '../../../../core/modules/msgs.js'
import type { TypedDataField } from '../../../tx/eip712/types.js'

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
      messages: params.messages.map((msg): GoogleProtobufAnyPbPb.Any => {
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

  /** the first message's schema stands for all of them, as arrays are typed by their first entry */
  public toEip712Types(): Map<string, TypedDataField[]> {
    const [first] = this.params.messages
    const types = super.toEip712Types()

    return first
      ? graftEip712Types(types, 'TypeMessagesValue', first.toEip712Types())
      : types
  }

  public toAmino() {
    const { params } = this
    const proto = this.toProto()

    const messageWithProposalType: any = {
      messages: params.messages.map((msg) => msg.toAmino()),
      initial_deposit: proto.initialDeposit,
      proposer: proto.proposer,
      metadata: proto.metadata,
      title: proto.title,
      summary: proto.summary,
      expedited: proto.expedited,
    }

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

  /** each inner message formats its own EIP712 v2 values (e.g. LegacyDec decimals) */
  public toEip712V2(): Record<string, any> {
    return {
      ...this.toWeb3Gw(),
      messages: this.params.messages.map((msg) => msg.toEip712V2()),
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1.MsgSubmitProposal' as const,
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosGovV1TxPb.MsgSubmitProposal.toBinary(this.toProto())
  }
}
