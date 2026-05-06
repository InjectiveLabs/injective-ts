import { toChainFormat } from '@injectivelabs/utils'
import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

export declare namespace MsgAdminUpdateBinaryOptionsMarketV2 {
  export interface Params {
    sender: string
    marketId: string
    settlementPrice: string
    expirationTimestamp: string
    settlementTimestamp: string
    status: InjectiveExchangeV2MarketPb.MarketStatus
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgAdminUpdateBinaryOptionsMarket
}

const createMessage = (params: MsgAdminUpdateBinaryOptionsMarketV2.Params) => {
  const message =
    InjectiveExchangeV2TxPb.MsgAdminUpdateBinaryOptionsMarket.create({
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
export default class MsgAdminUpdateBinaryOptionsMarketV2 extends MsgBase<
  MsgAdminUpdateBinaryOptionsMarketV2.Params,
  MsgAdminUpdateBinaryOptionsMarketV2.Proto
> {
  static fromJSON(
    params: MsgAdminUpdateBinaryOptionsMarketV2.Params,
  ): MsgAdminUpdateBinaryOptionsMarketV2 {
    return new MsgAdminUpdateBinaryOptionsMarketV2(params)
  }

  public toProto() {
    const { params: initialParams } = this

    const params = {
      ...initialParams,
      settlementPrice: toChainFormat(initialParams.settlementPrice).toFixed(),
    } as MsgAdminUpdateBinaryOptionsMarketV2.Params

    return createMessage(params)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgAdminUpdateBinaryOptionsMarket',
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
      '@type': '/injective.exchange.v2.MsgAdminUpdateBinaryOptionsMarket',
      ...value,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712 v1 is not supported for MsgAdminUpdateBinaryOptionsMarket, use toEip712V2 instead.',
      ),
    )
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw()

    const messageAdjusted = {
      ...web3gw,
      settlement_price: numberToCosmosSdkDecString(params.settlementPrice),
      status: InjectiveExchangeV2MarketPb.MarketStatus[params.status],
    }

    return messageAdjusted
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgAdminUpdateBinaryOptionsMarket',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgAdminUpdateBinaryOptionsMarket.toBinary(
      this.toProto(),
    )
  }
}
