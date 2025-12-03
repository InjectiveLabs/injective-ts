import snakecaseKeys from 'snakecase-keys'
import * as GoogleProtobufAnyPbPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb'
import * as CosmosGovV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1beta1/tx_pb'
import * as CosmosGovV1Beta1GovPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1beta1/gov_pb'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase.js'
import type { SnakeCaseKeys } from 'snakecase-keys'

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

  export type Proto = CosmosGovV1Beta1TxPb.MsgSubmitProposal

  export type Object = Omit<
    CosmosGovV1Beta1TxPb.MsgSubmitProposal,
    'content'
  > & {
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
  MsgSubmitTextProposal.Proto
> {
  static fromJSON(params: MsgSubmitTextProposal.Params): MsgSubmitTextProposal {
    return new MsgSubmitTextProposal(params)
  }

  public toProto() {
    const { params } = this

    const depositParams = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.deposit.denom,
      amount: params.deposit.amount,
    })

    const content = this.getContent()
    const proposalType = '/cosmos.gov.v1beta1.TextProposal'

    const contentAny = GoogleProtobufAnyPbPb.Any.create({
      typeUrl: proposalType,
      value: CosmosGovV1Beta1GovPb.TextProposal.toBinary(content),
    })

    const message = CosmosGovV1Beta1TxPb.MsgSubmitProposal.create({
      content: contentAny,
      initialDeposit: [depositParams],
      proposer: params.proposer,
    })

    return message
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
      initial_deposit: [
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

  public toWeb3Gw() {
    const { params } = this

    const messageWithProposalType = {
      content: {
        '@type': '/cosmos.gov.v1beta1.TextProposal',
        ...this.getContent(),
      },
      initial_deposit: [
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
    return CosmosGovV1Beta1TxPb.MsgSubmitProposal.toBinary(this.toProto())
  }

  private getContent() {
    const { params } = this

    const content = CosmosGovV1Beta1GovPb.TextProposal.create({
      title: params.title,
      description: params.description,
    })

    return content
  }
}
