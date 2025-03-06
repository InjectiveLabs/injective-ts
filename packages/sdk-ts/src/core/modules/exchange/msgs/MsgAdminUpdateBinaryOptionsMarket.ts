import {
  InjectiveExchangeV1Beta1Tx,
  InjectiveExchangeV1Beta1Exchange,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys from 'snakecase-keys'
import { GrpcMarketStatus } from '../../../../client/chain/types/index.js'
import {
  amountToCosmosSdkDecAmount,
  numberToCosmosSdkDecString,
} from '../../../../utils/numbers.js'

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

const createMessage = (params: MsgAdminUpdateBinaryOptionsMarket.Params) => {
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
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      settlementPrice: amountToCosmosSdkDecAmount(
        initialParams.settlementPrice,
      ).toFixed(),
    } as MsgAdminUpdateBinaryOptionsMarket.Params

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgAdminUpdateBinaryOptionsMarket',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this
    const message = {
      ...snakecaseKeys(createMessage(params)),
    }

    return {
      type: 'exchange/MsgAdminUpdateBinaryOptionsMarket',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgAdminUpdateBinaryOptionsMarket',
      ...value,
    }
  }

  public toEip712() {
    const amino = this.toAmino()
    const { type, value } = amino

    const messageAdjusted = {
      ...value,
      settlement_price: amountToCosmosSdkDecAmount(
        value.settlement_price,
      ).toFixed(),
    }

    return {
      type,
      value: messageAdjusted,
    }
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()

    const messageAdjusted = {
      ...web3gw,
      settlement_price: numberToCosmosSdkDecString(params.settlementPrice),
      status: InjectiveExchangeV1Beta1Exchange.marketStatusToJSON(
        params.status,
      ),
    }

    return messageAdjusted
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
