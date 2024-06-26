import {
  CosmosBaseV1Beta1Coin,
  CosmosGovV1Tx,
} from '@injectivelabs/core-proto-ts'
import snakeCaseKeys from 'snakecase-keys'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgDeposit {
  export interface Params {
    proposalId: number
    amount: {
      denom: string
      amount: string
    }
    depositor: string
  }

  export type Proto = CosmosGovV1Tx.MsgDeposit
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

    const deposit = CosmosBaseV1Beta1Coin.Coin.create()

    deposit.denom = params.amount.denom
    deposit.amount = params.amount.amount

    const message = CosmosGovV1Tx.MsgDeposit.create()

    message.proposalId = params.proposalId.toString()
    message.depositor = params.depositor
    message.amount = [deposit]

    return CosmosGovV1Tx.MsgDeposit.fromPartial(message)
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
      ...snakeCaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgDeposit',
      value: message,
    }
  }

  public toWeb3() {
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
    return CosmosGovV1Tx.MsgDeposit.encode(this.toProto()).finish()
  }
}
