import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { toAminoJson } from '../../../tx/amino/toAminoJson.js'

export declare namespace MsgRequestConsolidatedRedemption {
  export interface Params {
    injectiveAddress: string
    poolDenom: string
    /** the pool shares to escrow for automatic redemption */
    amount: {
      denom: string
      amount: string
    }
  }

  export type Proto =
    InjectiveInsuranceV1Beta1TxPb.MsgRequestConsolidatedRedemption
}

/**
 * @category Messages
 */
export default class MsgRequestConsolidatedRedemption extends MsgBase<
  MsgRequestConsolidatedRedemption.Params,
  MsgRequestConsolidatedRedemption.Proto
> {
  static fromJSON(
    params: MsgRequestConsolidatedRedemption.Params,
  ): MsgRequestConsolidatedRedemption {
    return new MsgRequestConsolidatedRedemption(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveInsuranceV1Beta1TxPb.MsgRequestConsolidatedRedemption.create(
      {
        sender: params.injectiveAddress,
        poolDenom: params.poolDenom,
        shares: CosmosBaseV1Beta1CoinPb.Coin.create({
          denom: params.amount.denom,
          amount: params.amount.amount,
        }),
      },
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.insurance.v1beta1.MsgRequestConsolidatedRedemption',
      ...proto,
    }
  }

  public toAmino() {
    return toAminoJson(
      InjectiveInsuranceV1Beta1TxPb.MsgRequestConsolidatedRedemption,
      this.toProto(),
    )
  }

  public toAminoRaw() {
    const proto = this.toProto()

    return {
      type: 'insurance/MsgRequestConsolidatedRedemption',
      value: {
        sender: proto.sender,
        pool_denom: proto.poolDenom,
        shares: proto.shares,
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAminoRaw()

    return {
      '@type': '/injective.insurance.v1beta1.MsgRequestConsolidatedRedemption',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.insurance.v1beta1.MsgRequestConsolidatedRedemption',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveInsuranceV1Beta1TxPb.MsgRequestConsolidatedRedemption.toBinary(
      this.toProto(),
    )
  }
}
