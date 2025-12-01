import * as InjectiveErc20V1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/erc20/v1beta1/tx_pb'
import * as InjectiveErc20V1Beta1Erc20Pb from '@injectivelabs/core-proto-ts-v2/generated/injective/erc20/v1beta1/erc20_pb'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgCreateTokenPair {
  export interface Params {
    injectiveAddress: string
    tokenPair: {
      denom: string
      erc20Address: string
    }
  }

  export type Proto = InjectiveErc20V1Beta1TxPb.MsgCreateTokenPair
}

/**
 * @category Messages
 */
export default class MsgCreateTokenPair extends MsgBase<
  MsgCreateTokenPair.Params,
  MsgCreateTokenPair.Proto
> {
  static fromJSON(params: MsgCreateTokenPair.Params): MsgCreateTokenPair {
    return new MsgCreateTokenPair(params)
  }

  public toProto() {
    const { params } = this

    const tokenPair = InjectiveErc20V1Beta1Erc20Pb.TokenPair.create({
      bankDenom: params.tokenPair.denom,
      erc20Address: params.tokenPair.erc20Address,
    })

    const message = InjectiveErc20V1Beta1TxPb.MsgCreateTokenPair.create({
      sender: params.injectiveAddress,
      tokenPair: tokenPair,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.erc20.v1beta1.MsgCreateTokenPair',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      token_pair: proto.tokenPair,
    }

    return {
      type: 'erc20/MsgCreateTokenPair',
      value: message,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.erc20.v1beta1.MsgCreateTokenPair',
      message: proto,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.erc20.v1beta1.MsgCreateTokenPair',
      ...value,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveErc20V1Beta1TxPb.MsgCreateTokenPair.toBinary(this.toProto())
  }
}
