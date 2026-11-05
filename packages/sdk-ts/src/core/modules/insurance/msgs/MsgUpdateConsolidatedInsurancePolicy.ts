import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { toAminoJson } from '../../../tx/amino/toAminoJson.js'

export declare namespace MsgUpdateConsolidatedInsurancePolicy {
  export interface Params {
    /** the module authority (governance), the only account allowed to sign this message */
    authority: string
    marketId: string
    /** chain-format integer string */
    maxDraw: string
  }

  export type Proto =
    InjectiveInsuranceV1Beta1TxPb.MsgUpdateConsolidatedInsurancePolicy
}

/**
 * Changes the draw cap of one market enrolled in a consolidated insurance pool.
 *
 * @category Messages
 */
export default class MsgUpdateConsolidatedInsurancePolicy extends MsgBase<
  MsgUpdateConsolidatedInsurancePolicy.Params,
  MsgUpdateConsolidatedInsurancePolicy.Proto
> {
  static fromJSON(
    params: MsgUpdateConsolidatedInsurancePolicy.Params,
  ): MsgUpdateConsolidatedInsurancePolicy {
    return new MsgUpdateConsolidatedInsurancePolicy(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveInsuranceV1Beta1TxPb.MsgUpdateConsolidatedInsurancePolicy.create(
      {
        authority: params.authority,
        marketId: params.marketId,
        maxDraw: params.maxDraw,
      },
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type':
        '/injective.insurance.v1beta1.MsgUpdateConsolidatedInsurancePolicy',
      ...proto,
    }
  }

  public toAmino() {
    return toAminoJson(
      InjectiveInsuranceV1Beta1TxPb.MsgUpdateConsolidatedInsurancePolicy,
      this.toProto(),
    )
  }

  public toAminoRaw() {
    const proto = this.toProto()

    return {
      type: 'insurance/MsgUpdateConsolidatedInsurancePolicy',
      value: {
        authority: proto.authority,
        market_id: proto.marketId,
        max_draw: proto.maxDraw,
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAminoRaw()

    return {
      '@type':
        '/injective.insurance.v1beta1.MsgUpdateConsolidatedInsurancePolicy',
      ...value,
    }
  }

  /** the chain cannot type `math.Int` fields for EIP712 v1 */
  public toEip712(): never {
    return this.eip712V1Unsupported('MsgUpdateConsolidatedInsurancePolicy')
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgUpdateConsolidatedInsurancePolicy',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveInsuranceV1Beta1TxPb.MsgUpdateConsolidatedInsurancePolicy.toBinary(
      this.toProto(),
    )
  }
}
