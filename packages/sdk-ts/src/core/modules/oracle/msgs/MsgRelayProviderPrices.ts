import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectiveOracleV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/oracle/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgRelayProviderPrices {
  export interface Params {
    sender: string
    provider: string
    symbols: string[]
    prices: string[]
  }

  export type Proto = InjectiveOracleV1Beta1TxPb.MsgRelayProviderPrices
}

/**
 * @category Messages
 */
export default class MsgRelayProviderPrices extends MsgBase<
  MsgRelayProviderPrices.Params,
  MsgRelayProviderPrices.Proto
> {
  static fromJSON(
    params: MsgRelayProviderPrices.Params,
  ): MsgRelayProviderPrices {
    return new MsgRelayProviderPrices(params)
  }

  public toProto() {
    const { params } = this

    const message = InjectiveOracleV1Beta1TxPb.MsgRelayProviderPrices.create({
      sender: params.sender,
      provider: params.provider,
      symbols: params.symbols,
      prices: params.prices,
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.oracle.v1beta1.MsgRelayProviderPrices',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      provider: proto.provider,
      symbols: proto.symbols,
      prices: proto.prices,
    }

    return {
      type: 'oracle/MsgRelayProviderPrices',
      value: message,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712_v1 is not supported for MsgRelayProviderPrices. Please use EIP712_v2',
      ),
    )
  }

  public toEip712V2() {
    const web3gw = this.toWeb3Gw()
    const prices = web3gw.prices as any

    return {
      ...web3gw,
      prices: prices.map((price: any) => numberToCosmosSdkDecString(price)),
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.oracle.v1beta1.MsgRelayProviderPrices',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.oracle.v1beta1.MsgRelayProviderPrices',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveOracleV1Beta1TxPb.MsgRelayProviderPrices.toBinary(
      this.toProto(),
    )
  }
}
