import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { toAminoJson } from '../../../tx/amino/toAminoJson.js'

export declare namespace MsgSetConsolidatedInsurancePoolPause {
  export interface Params {
    /** the module authority (governance), the only account allowed to sign this message */
    authority: string
    depositDenom: string
    paused: boolean
  }

  export type Proto =
    InjectiveInsuranceV1Beta1TxPb.MsgSetConsolidatedInsurancePoolPause
}

/**
 * Pauses or resumes insurance payouts of a consolidated pool (not a trading halt).
 *
 * @category Messages
 */
export default class MsgSetConsolidatedInsurancePoolPause extends MsgBase<
  MsgSetConsolidatedInsurancePoolPause.Params,
  MsgSetConsolidatedInsurancePoolPause.Proto
> {
  static fromJSON(
    params: MsgSetConsolidatedInsurancePoolPause.Params,
  ): MsgSetConsolidatedInsurancePoolPause {
    return new MsgSetConsolidatedInsurancePoolPause(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveInsuranceV1Beta1TxPb.MsgSetConsolidatedInsurancePoolPause.create(
      {
        authority: params.authority,
        depositDenom: params.depositDenom,
        paused: params.paused,
      },
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type':
        '/injective.insurance.v1beta1.MsgSetConsolidatedInsurancePoolPause',
      ...proto,
    }
  }

  public toAmino() {
    return toAminoJson(
      InjectiveInsuranceV1Beta1TxPb.MsgSetConsolidatedInsurancePoolPause,
      this.toProto(),
    )
  }

  public toAminoRaw() {
    const proto = this.toProto()

    return {
      type: 'insurance/MsgSetConsolidatedInsurancePoolPause',
      value: {
        authority: proto.authority,
        deposit_denom: proto.depositDenom,
        paused: proto.paused,
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAminoRaw()

    return {
      '@type':
        '/injective.insurance.v1beta1.MsgSetConsolidatedInsurancePoolPause',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgSetConsolidatedInsurancePoolPause',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveInsuranceV1Beta1TxPb.MsgSetConsolidatedInsurancePoolPause.toBinary(
      this.toProto(),
    )
  }
}
