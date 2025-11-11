import * as CosmosGovV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/tx_pb.mjs'
import * as CosmosGovV1GovPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/gov_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgVote {
  export interface Params {
    proposalId: number
    metadata?: string
    vote: CosmosGovV1GovPb.VoteOption
    voter: string
  }

  export type Proto = CosmosGovV1TxPb.MsgVote
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

    const message = CosmosGovV1TxPb.MsgVote.create({
      proposalId: BigInt(params.proposalId),
      voter: params.voter,
      option: params.vote,
      metadata: params.metadata || '',
    })

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
      proposal_id: proto.proposalId.toString(),
      voter: proto.voter,
      option: proto.option,
      metadata: proto.metadata,
    }

    return {
      type: 'cosmos-sdk/v1/MsgVote',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.gov.v1.MsgVote',
      ...value,
    }
  }

  public toEip712V2() {
    const web3Gw = this.toWeb3Gw()

    // Convert enum number to string name
    const optionValue = web3Gw.option as number
    const optionName =
      CosmosGovV1GovPb.VoteOption[optionValue] || 'VOTE_OPTION_NO'

    // For EIP712 v2, we need full enum name
    // Check if optionName already has VOTE_OPTION_ prefix
    if (optionName && optionName.startsWith('VOTE_OPTION_')) {
      web3Gw.option = optionName
    } else {
      web3Gw.option = `VOTE_OPTION_${optionName}`
    }

    return web3Gw
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1.MsgVote',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosGovV1TxPb.MsgVote.toBinary(this.toProto())
  }
}
