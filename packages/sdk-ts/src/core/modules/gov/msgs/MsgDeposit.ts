import * as CosmosGovV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/tx_pb'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgDeposit {
  export interface Params {
    proposalId: number
    amount: {
      denom: string
      amount: string
    }
    depositor: string
  }

  export type Proto = CosmosGovV1TxPb.MsgDeposit
}

/**
 * @category Messages
 */
export default class MsgDeposit extends MsgBase<
  MsgDeposit.Params,
  MsgDeposit.Proto
> {
  static fromJSON(params: MsgDeposit.Params): MsgDeposit {
    return new MsgDeposit(params)
  }

  public toProto() {
    const { params } = this

    const deposit = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = CosmosGovV1TxPb.MsgDeposit.create({
      proposalId: BigInt(params.proposalId),
      depositor: params.depositor,
      amount: [deposit],
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.gov.v1beta1.MsgDeposit',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      proposal_id: proto.proposalId.toString(),
      depositor: proto.depositor,
      amount: proto.amount,
    }

    return {
      type: 'cosmos-sdk/MsgDeposit',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.gov.v1beta1.MsgDeposit',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.gov.v1beta1.MsgDeposit',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosGovV1TxPb.MsgDeposit.toBinary(this.toProto())
  }
}
