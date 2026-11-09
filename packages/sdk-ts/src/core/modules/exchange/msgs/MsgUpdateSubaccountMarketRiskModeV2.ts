import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/exchange_pb'
import { MsgBase } from '../../MsgBase.js'
import { toTypeUrl } from '../../typeUrl.js'
import { toAminoJson } from '../../../tx/amino/toAminoJson.js'
import type { TypedDataField } from '../../../tx/eip712/types.js'

export declare namespace MsgUpdateSubaccountMarketRiskModeV2 {
  export interface Params {
    sender: string
    subaccountId: string
    marketId: string
    /** ISOLATED / CROSS pin the mode for this market, UNSPECIFIED unpins back to the profile default */
    mode: InjectiveExchangeV2ExchangePb.RiskMode
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgUpdateSubaccountMarketRiskMode
}

/**
 * Pins (or unpins) the margin mode of one derivative market for a subaccount.
 *
 * @category Messages
 */
export default class MsgUpdateSubaccountMarketRiskModeV2 extends MsgBase<
  MsgUpdateSubaccountMarketRiskModeV2.Params,
  MsgUpdateSubaccountMarketRiskModeV2.Proto
> {
  static fromJSON(
    params: MsgUpdateSubaccountMarketRiskModeV2.Params,
  ): MsgUpdateSubaccountMarketRiskModeV2 {
    return new MsgUpdateSubaccountMarketRiskModeV2(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveExchangeV2TxPb.MsgUpdateSubaccountMarketRiskMode.create({
      sender: params.sender,
      subaccountId: params.subaccountId,
      marketId: params.marketId,
      mode: params.mode,
    })
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': toTypeUrl(
        InjectiveExchangeV2TxPb.MsgUpdateSubaccountMarketRiskMode,
      ),
      ...proto,
    }
  }

  public toAmino() {
    return toAminoJson(
      InjectiveExchangeV2TxPb.MsgUpdateSubaccountMarketRiskMode,
      this.toProto(),
    )
  }

  public toAminoRaw() {
    const proto = this.toProto()

    return {
      type: 'exchange/v2/MsgUpdateSubaccountMarketRiskMode',
      value: {
        sender: proto.sender,
        subaccount_id: proto.subaccountId,
        market_id: proto.marketId,
        mode: proto.mode,
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAminoRaw()

    return {
      '@type': toTypeUrl(
        InjectiveExchangeV2TxPb.MsgUpdateSubaccountMarketRiskMode,
      ),
      ...value,
    }
  }

  public toEip712V2() {
    const web3gw = this.toWeb3Gw()

    return {
      ...web3gw,
      mode: `RISK_MODE_${InjectiveExchangeV2ExchangePb.RiskMode[this.params.mode]}`,
    }
  }

  public toEip712Types(): Map<string, TypedDataField[]> {
    return new Map<string, TypedDataField[]>().set('MsgValue', [
      { name: 'sender', type: 'string' },
      { name: 'subaccount_id', type: 'string' },
      { name: 'market_id', type: 'string' },
      { name: 'mode', type: 'int32' },
    ])
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: toTypeUrl(
        InjectiveExchangeV2TxPb.MsgUpdateSubaccountMarketRiskMode,
      ),
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgUpdateSubaccountMarketRiskMode.toBinary(
      this.toProto(),
    )
  }
}
