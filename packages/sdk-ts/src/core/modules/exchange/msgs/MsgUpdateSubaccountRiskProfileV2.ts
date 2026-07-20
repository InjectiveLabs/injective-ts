import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/exchange_pb'
import { MsgBase } from '../../MsgBase.js'
import type { TypedDataField } from '../../../tx/eip712/types.js'

export declare namespace MsgUpdateSubaccountRiskProfileV2 {
  export interface Params {
    sender: string
    subaccountId: string
    riskProfile: InjectiveExchangeV2ExchangePb.SubaccountRiskProfile
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgUpdateSubaccountRiskProfile
}

const riskProfileToWeb3Gw = (
  riskProfile?: InjectiveExchangeV2ExchangePb.SubaccountRiskProfile,
  useEnumNames = false,
) => {
  if (!riskProfile) {
    return undefined
  }

  return {
    mode: useEnumNames
      ? `RISK_MODE_${InjectiveExchangeV2ExchangePb.RiskMode[riskProfile.mode]}`
      : riskProfile.mode,
    reservation_policy: useEnumNames
      ? `RESERVATION_POLICY_${
          InjectiveExchangeV2ExchangePb.ReservationPolicy[
            riskProfile.reservationPolicy
          ]
        }`
      : riskProfile.reservationPolicy,
    credit_line_id: riskProfile.creditLineId,
  }
}

/**
 * @category Messages
 */
export default class MsgUpdateSubaccountRiskProfileV2 extends MsgBase<
  MsgUpdateSubaccountRiskProfileV2.Params,
  MsgUpdateSubaccountRiskProfileV2.Proto
> {
  static fromJSON(
    params: MsgUpdateSubaccountRiskProfileV2.Params,
  ): MsgUpdateSubaccountRiskProfileV2 {
    return new MsgUpdateSubaccountRiskProfileV2(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveExchangeV2TxPb.MsgUpdateSubaccountRiskProfile.create({
      sender: params.sender,
      subaccountId: params.subaccountId,
      riskProfile: params.riskProfile,
    })
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgUpdateSubaccountRiskProfile',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()

    return {
      type: 'exchange/MsgUpdateSubaccountRiskProfile',
      value: {
        sender: proto.sender,
        subaccount_id: proto.subaccountId,
        risk_profile: riskProfileToWeb3Gw(proto.riskProfile),
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAmino()

    return {
      '@type': '/injective.exchange.v2.MsgUpdateSubaccountRiskProfile',
      ...value,
    }
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()

    return {
      ...web3gw,
      risk_profile: riskProfileToWeb3Gw(params.riskProfile, true),
    }
  }

  public toEip712() {
    const amino = this.toAmino()
    const { value, type } = amino
    const riskProfile = (value as any).risk_profile

    return {
      type,
      value: {
        ...value,
        risk_profile: {
          mode: riskProfile.mode,
          reservation_policy: riskProfile.reservation_policy,
          credit_line_id: riskProfile.credit_line_id,
        },
      },
    }
  }

  public toEip712Types(): Map<string, TypedDataField[]> {
    const map = new Map<string, TypedDataField[]>()

    map.set('TypeRiskProfile', [
      { name: 'mode', type: 'int32' },
      { name: 'reservation_policy', type: 'int32' },
      { name: 'credit_line_id', type: 'string' },
    ])

    map.set('MsgValue', [
      { name: 'sender', type: 'string' },
      { name: 'subaccount_id', type: 'string' },
      { name: 'risk_profile', type: 'TypeRiskProfile' },
    ])

    return map
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgUpdateSubaccountRiskProfile',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgUpdateSubaccountRiskProfile.toBinary(
      this.toProto(),
    )
  }
}
