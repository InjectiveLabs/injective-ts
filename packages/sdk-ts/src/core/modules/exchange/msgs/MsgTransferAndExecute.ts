import {
  FundsDirection,
  MsgTransferAndExecute as BaseMsgTransferAndExecute,
} from '@injectivelabs/core-proto-ts/injective/exchange/v1beta1/tx'
import { Coin } from '@injectivelabs/core-proto-ts/cosmos/base/v1beta1/coin'
import { MsgBase } from '../../MsgBase'
import { Msgs } from '../../msgs'
import { Any } from '@injectivelabs/core-proto-ts/google/protobuf/any'

export declare namespace MsgTransferAndExecute {
  export interface Params {
    msg: Msgs
    injectiveAddress: string
    fundsDirection: FundsDirection
    funds: {
      amount: string
      denom: string
    }
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgTransferAndExecute'
    message: BaseMsgTransferAndExecute
  }

  export interface Data extends BaseMsgTransferAndExecute {
    '@type': '/injective.exchange.v1beta1.MsgTransferAndExecute'
  }

  export interface Amino extends BaseMsgTransferAndExecute {
    type: 'exchange/MsgTransferAndExecute'
  }

  export interface Web3 extends BaseMsgTransferAndExecute {
    '@type': '/injective.exchange.v1beta1.MsgTransferAndExecute'
  }

  export type Proto = BaseMsgTransferAndExecute
}

/**
 * @category Messages
 */
export default class MsgTransferAndExecute extends MsgBase<
  MsgTransferAndExecute.Params,
  MsgTransferAndExecute.Data,
  MsgTransferAndExecute.Proto,
  MsgTransferAndExecute.Amino,
  MsgTransferAndExecute.DirectSign
> {
  static fromJSON(params: MsgTransferAndExecute.Params): MsgTransferAndExecute {
    return new MsgTransferAndExecute(params)
  }

  public toProto(): MsgTransferAndExecute.Proto {
    const { params } = this

    const fundsCoin = Coin.create()
    fundsCoin.amount = params.funds.amount
    fundsCoin.denom = params.funds.denom

    const messageAny = Any.create()
    messageAny.value = params.msg.toBinary()
    messageAny.typeUrl = params.msg.toDirectSign().type

    const message = BaseMsgTransferAndExecute.create()
    message.sender = params.injectiveAddress
    message.fundsDirection = params.fundsDirection
    message.funds = [fundsCoin]
    message.msg = messageAny

    return BaseMsgTransferAndExecute.fromPartial(message)
  }

  public toData(): MsgTransferAndExecute.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgTransferAndExecute',
      ...proto,
    }
  }

  public toAmino(): MsgTransferAndExecute.Amino {
    const { params } = this
    const proto = this.toProto()

    const message = {
      funds: proto.funds,
      signer: params.injectiveAddress,
      fundsDirection: params.fundsDirection,
    }

    const messageWithType = {
      ...message,
      msg: params.msg.toAmino(),
    }

    return {
      type: 'exchange/MsgTransferAndExecute',
      ...messageWithType,
    } as unknown as MsgTransferAndExecute.Amino
  }

  public toWeb3(): MsgTransferAndExecute.Web3 {
    const { params } = this
    const proto = this.toProto()

    const message = {
      funds: proto.funds,
      signer: params.injectiveAddress,
      fundsDirection: params.fundsDirection,
    }

    const messageWithType = {
      ...message,
      msg: params.msg.toWeb3(),
    }

    return {
      '@type': '/injective.exchange.v1beta1.MsgTransferAndExecute',
      ...messageWithType,
    } as unknown as MsgTransferAndExecute.Web3
  }

  public toDirectSign(): MsgTransferAndExecute.DirectSign {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgTransferAndExecute',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return BaseMsgTransferAndExecute.encode(this.toProto()).finish()
  }
}
