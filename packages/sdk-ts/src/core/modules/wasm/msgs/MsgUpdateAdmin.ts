import { MsgUpdateAdmin as BaseMsgUpdateAdmin } from '@injectivelabs/core-proto-ts/cosmwasm/wasm/v1/tx'
import { MsgBase } from '../../MsgBase'
import snakeCaseKeys from 'snakecase-keys'

export declare namespace MsgUpdateAdmin {
  export interface Params {
    sender: string
    newAdmin: string
    contract: string
  }

  export interface DirectSign {
    type: '/cosmwasm.wasm.v1.MsgUpdateAdmin'
    message: BaseMsgUpdateAdmin
  }

  export interface Data extends BaseMsgUpdateAdmin {
    '@type': '/cosmwasm.wasm.v1.MsgUpdateAdmin'
  }

  export interface Amino extends BaseMsgUpdateAdmin {
    type: 'wasm/MsgUpdateAdmin'
  }

  export interface Web3 extends BaseMsgUpdateAdmin {
    '@type': '/cosmwasm.wasm.v1.MsgUpdateAdmin'
  }

  export type Proto = BaseMsgUpdateAdmin
}

/**
 * @category Messages
 */
export default class MsgUpdateAdmin extends MsgBase<
  MsgUpdateAdmin.Params,
  MsgUpdateAdmin.Data,
  MsgUpdateAdmin.Proto,
  MsgUpdateAdmin.Amino,
  MsgUpdateAdmin.DirectSign
> {
  static fromJSON(params: MsgUpdateAdmin.Params): MsgUpdateAdmin {
    return new MsgUpdateAdmin(params)
  }

  public toProto(): MsgUpdateAdmin.Proto {
    const { params } = this

    const message = BaseMsgUpdateAdmin.create()

    message.sender = params.sender
    message.newAdmin = params.newAdmin
    message.contract = params.contract

    return BaseMsgUpdateAdmin.fromPartial(message)
  }

  public toData(): MsgUpdateAdmin.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmwasm.wasm.v1.MsgUpdateAdmin',
      ...proto,
    }
  }

  public toAmino(): MsgUpdateAdmin.Amino {
    const proto = this.toProto()
    const message = {
      ...snakeCaseKeys(proto),
    }

    const messageWithProperKeys = snakeCaseKeys(message)

    return {
      type: 'wasm/MsgUpdateAdmin',
      ...messageWithProperKeys,
    } as unknown as MsgUpdateAdmin.Amino
  }

  public toWeb3(): MsgUpdateAdmin.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmwasm.wasm.v1.MsgUpdateAdmin',
      ...rest,
    } as unknown as MsgUpdateAdmin.Web3
  }

  public toDirectSign(): MsgUpdateAdmin.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmwasm.wasm.v1.MsgUpdateAdmin',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgUpdateAdmin.encode(this.toProto()).finish()
  }
}
