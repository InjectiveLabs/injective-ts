import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { toTypeUrl } from '../../typeUrl.js'
import { toAminoJson } from '../../../tx/amino/toAminoJson.js'

export declare namespace MsgSetOutflowGuardBlockedV2 {
  export interface Params {
    /** the governance authority or an exchange admin, the only accounts allowed to sign this message */
    sender: string
    /** true sets the outflow guard's manual block, false clears it */
    blocked: boolean
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgSetOutflowGuardBlocked
}

/**
 * Sets or clears the exchange outflow guard's manual block (chain v1.21+).
 * Clearing it does not lift a block imposed by the 24h net outflow cap.
 *
 * @category Messages
 */
export default class MsgSetOutflowGuardBlockedV2 extends MsgBase<
  MsgSetOutflowGuardBlockedV2.Params,
  MsgSetOutflowGuardBlockedV2.Proto
> {
  static fromJSON(
    params: MsgSetOutflowGuardBlockedV2.Params,
  ): MsgSetOutflowGuardBlockedV2 {
    return new MsgSetOutflowGuardBlockedV2(params)
  }

  public toProto() {
    const { params } = this

    return InjectiveExchangeV2TxPb.MsgSetOutflowGuardBlocked.create({
      sender: params.sender,
      blocked: params.blocked,
    })
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': toTypeUrl(InjectiveExchangeV2TxPb.MsgSetOutflowGuardBlocked),
      ...proto,
    }
  }

  public toAmino() {
    return toAminoJson(
      InjectiveExchangeV2TxPb.MsgSetOutflowGuardBlocked,
      this.toProto(),
    )
  }

  public toAminoRaw() {
    const proto = this.toProto()

    return {
      type: 'exchange/v2/MsgSetOutflowGuardBlocked',
      value: {
        sender: proto.sender,
        blocked: proto.blocked,
      },
    }
  }

  public toWeb3Gw() {
    const { value } = this.toAminoRaw()

    return {
      '@type': toTypeUrl(InjectiveExchangeV2TxPb.MsgSetOutflowGuardBlocked),
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: toTypeUrl(InjectiveExchangeV2TxPb.MsgSetOutflowGuardBlocked),
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgSetOutflowGuardBlocked.toBinary(
      this.toProto(),
    )
  }
}
