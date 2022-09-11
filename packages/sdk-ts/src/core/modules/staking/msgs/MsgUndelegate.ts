import { MsgUndelegate as BaseMsgUndelegate } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { MsgBase } from '../../MsgBase'

export declare namespace MsgUndelegate {
  export interface Params {
    amount: {
      denom: string
      amount: string
    }
    validatorAddress: string
    injectiveAddress: string
  }
  export interface DirectSign {
    type: '/cosmos.staking.v1beta1.MsgUndelegate'
    message: BaseMsgUndelegate
  }

  export interface Data extends BaseMsgUndelegate.AsObject {
    '@type': '/cosmos.staking.v1beta1.MsgUndelegate'
  }

  export interface Amino extends BaseMsgUndelegate.AsObject {
    type: 'cosmos-sdk/MsgUndelegate'
  }

  export interface Web3 extends BaseMsgUndelegate.AsObject {
    '@type': '/cosmos.authz.v1beta1.MsgUndelegate'
  }

  export type Proto = BaseMsgUndelegate
}

/**
 * @category Messages
 */
export default class MsgUndelegate extends MsgBase<
  MsgUndelegate.Params,
  MsgUndelegate.Data,
  MsgUndelegate.Proto,
  MsgUndelegate.Amino,
  MsgUndelegate.DirectSign
> {
  static fromJSON(params: MsgUndelegate.Params): MsgUndelegate {
    return new MsgUndelegate(params)
  }

  public toProto(): MsgUndelegate.Proto {
    const { params } = this

    const coinAmount = new Coin()
    coinAmount.setDenom(params.amount.denom)
    coinAmount.setAmount(params.amount.amount)

    const message = new BaseMsgUndelegate()
    message.setAmount(coinAmount)
    message.setDelegatorAddress(params.injectiveAddress)
    message.setValidatorAddress(params.validatorAddress)

    return message
  }

  public toData(): MsgUndelegate.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgUndelegate.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgUndelegate',
      ...proto.toObject(),
    }
  }

  public toWeb3(): MsgUndelegate.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgUndelegate',
      ...rest,
    } as unknown as MsgUndelegate.Web3
  }

  public toDirectSign(): MsgUndelegate.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgUndelegate',
      message: proto,
    }
  }
}
