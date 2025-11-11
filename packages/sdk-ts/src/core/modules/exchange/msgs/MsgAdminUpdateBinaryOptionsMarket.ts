import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb.mjs'
import * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'
import type { GrpcMarketStatus } from '../../../../client/chain/types/index.js'

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
    InjectiveExchangeV1Beta1TxPb.MsgAdminUpdateBinaryOptionsMarket
}

const createMessage = (params: MsgAdminUpdateBinaryOptionsMarket.Params) => {
  const message =
    InjectiveExchangeV1Beta1TxPb.MsgAdminUpdateBinaryOptionsMarket.create({
      sender: params.sender,
      marketId: params.marketId,
      settlementPrice: params.settlementPrice,
      expirationTimestamp: BigInt(params.expirationTimestamp),
      settlementTimestamp: BigInt(params.settlementTimestamp),
      status: params.status,
    })

  return message
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
      settlementPrice: toChainFormat(initialParams.settlementPrice).toFixed(),
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
      sender: params.sender,
      market_id: params.marketId,
      settlement_price: params.settlementPrice,
      expiration_timestamp: params.expirationTimestamp,
      settlement_timestamp: params.settlementTimestamp,
      status: params.status,
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
      settlement_price: toChainFormat(value.settlement_price).toFixed(),
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
      status: InjectiveExchangeV1Beta1ExchangePb.MarketStatus[params.status],
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
    return InjectiveExchangeV1Beta1TxPb.MsgAdminUpdateBinaryOptionsMarket.toBinary(
      this.toProto(),
    )
  }
}
