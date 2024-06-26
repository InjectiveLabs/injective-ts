import { InjectiveExchangeV1Beta1Tx } from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'
import { GrpcMarketStatus } from '../../../../client/chain/types'

export declare namespace MsgAdminUpdateBinaryOptionsMarket {
  export interface Params {
    sender: string
    marketId: string
    settlementPrice: string
    expirationTimestamp: string
    settlementTimestamp: string
    status: GrpcMarketStatus
  }

  export type Proto =
    InjectiveExchangeV1Beta1Tx.MsgAdminUpdateBinaryOptionsMarket
}

/**
 * @category Messages
 */
export default class MsgAdminUpdateBinaryOptionsMarket extends MsgBase<
  MsgAdminUpdateBinaryOptionsMarket.Params,
  MsgAdminUpdateBinaryOptionsMarket.Proto
> {
  static fromJSON(
    params: MsgAdminUpdateBinaryOptionsMarket.Params,
  ): MsgAdminUpdateBinaryOptionsMarket {
    return new MsgAdminUpdateBinaryOptionsMarket(params)
  }

  public toProto() {
    const { params } = this

    const message =
      InjectiveExchangeV1Beta1Tx.MsgAdminUpdateBinaryOptionsMarket.create()

    message.sender = params.sender
    message.marketId = params.marketId
    message.settlementPrice = params.settlementPrice
    message.expirationTimestamp = params.expirationTimestamp
    message.settlementTimestamp = params.settlementTimestamp
    message.status = params.status

    return InjectiveExchangeV1Beta1Tx.MsgAdminUpdateBinaryOptionsMarket.fromPartial(
      message,
    )
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgAdminUpdateBinaryOptionsMarket',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'exchange/MsgAdminUpdateBinaryOptionsMarket',
      value: message,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgAdminUpdateBinaryOptionsMarket',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgAdminUpdateBinaryOptionsMarket',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1Tx.MsgAdminUpdateBinaryOptionsMarket.encode(
      this.toProto(),
    ).finish()
  }
}
