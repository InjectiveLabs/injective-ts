import {
  FundsDirectionMap,
  MsgTransferAndExecute as BaseMsgTransferAndExecute,
} from '@injectivelabs/chain-api/injective/exchange/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase'
import { Msgs } from '../../msgs'
import { Any } from 'google-protobuf/google/protobuf/any_pb'
import snakecaseKeys from 'snakecase-keys'

export declare namespace MsgTransferAndExecute {
  export interface Params {
    msg: Msgs
    injectiveAddress: string
    fundsDirection: FundsDirectionMap[keyof FundsDirectionMap]
    funds: {
      amount: string
      denom: string
    }
  }

  export interface DirectSign {
    type: '/injective.exchange.v1beta1.MsgTransferAndExecute'
    message: BaseMsgTransferAndExecute
  }

  export interface Data extends BaseMsgTransferAndExecute.AsObject {
    '@type': '/injective.exchange.v1beta1.MsgTransferAndExecute'
  }

  export interface Amino extends BaseMsgTransferAndExecute.AsObject {
    type: 'exchange/MsgTransferAndExecute'
  }

  export interface Web3 extends BaseMsgTransferAndExecute.AsObject {
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

    const fundsCoin = new Coin()
    fundsCoin.setAmount(params.funds.amount)
    fundsCoin.setDenom(params.funds.denom)

    const messageAny = new Any()
    messageAny.setValue(params.msg.toProto().serializeBinary())
    messageAny.setTypeUrl(params.msg.toDirectSign().type)

    const message = new BaseMsgTransferAndExecute()
    message.setSender(params.injectiveAddress)
    message.setFundsDirection(params.fundsDirection)
    message.setFundsList([fundsCoin])
    message.setMsg(messageAny)

    return message
  }

  public toData(): MsgTransferAndExecute.Data {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgTransferAndExecute',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgTransferAndExecute.Amino {
    const { params } = this
    const proto = this.toProto()

    const message = {
      funds: proto
        .getFundsList()
        .map((amount) => snakecaseKeys(amount.toObject())),
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
      funds: proto
        .getFundsList()
        .map((amount) => snakecaseKeys(amount.toObject())),
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
}
