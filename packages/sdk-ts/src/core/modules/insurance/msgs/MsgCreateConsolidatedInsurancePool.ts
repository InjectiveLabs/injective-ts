import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { toAminoJson } from '../../../tx/amino/toAminoJson.js'

export declare namespace MsgCreateConsolidatedInsurancePool {
  export interface Params {
    /** the module authority (governance), the only account allowed to sign this message */
    authority: string
    depositDenom: string
    /** 1-18 */
    quoteDecimals: number
    /** chain-format integer string */
    maxDrawPerMarket: string
    redemptionNoticePeriodSeconds: number | string
  }

  export type Proto =
    InjectiveInsuranceV1Beta1TxPb.MsgCreateConsolidatedInsurancePool
}

/**
 * @category Messages
 */
export default class MsgCreateConsolidatedInsurancePool extends MsgBase<
  MsgCreateConsolidatedInsurancePool.Params,
  MsgCreateConsolidatedInsurancePool.Proto
> {
  static fromJSON(
    params: MsgCreateConsolidatedInsurancePool.Params,
  ): MsgCreateConsolidatedInsurancePool {
    return new MsgCreateConsolidatedInsurancePool(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveInsuranceV1Beta1TxPb.MsgCreateConsolidatedInsurancePool.create(
      {
        authority: params.authority,
        depositDenom: params.depositDenom,
        quoteDecimals: params.quoteDecimals,
        maxDrawPerMarket: params.maxDrawPerMarket,
        redemptionNoticePeriodSeconds: BigInt(
          params.redemptionNoticePeriodSeconds,
        ),
      },
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type':
        '/injective.insurance.v1beta1.MsgCreateConsolidatedInsurancePool',
      ...proto,
    }
  }

  public toAmino() {
    return toAminoJson(
      InjectiveInsuranceV1Beta1TxPb.MsgCreateConsolidatedInsurancePool,
      this.toProto(),
    )
  }

  public toAminoRaw() {
    const proto = this.toProto()

    return {
      type: 'insurance/MsgCreateConsolidatedInsurancePool',
      value: {
        authority: proto.authority,
        deposit_denom: proto.depositDenom,
        quote_decimals: proto.quoteDecimals,
        max_draw_per_market: proto.maxDrawPerMarket,
        redemption_notice_period_seconds:
          proto.redemptionNoticePeriodSeconds.toString(),
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAminoRaw()

    return {
      '@type':
        '/injective.insurance.v1beta1.MsgCreateConsolidatedInsurancePool',
      ...value,
    }
  }

  /** the chain cannot type `math.Int` fields for EIP712 v1 */
  public toEip712(): never {
    return this.eip712V1Unsupported('MsgCreateConsolidatedInsurancePool')
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgCreateConsolidatedInsurancePool',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveInsuranceV1Beta1TxPb.MsgCreateConsolidatedInsurancePool.toBinary(
      this.toProto(),
    )
  }
}
