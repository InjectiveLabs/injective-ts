import snakecaseKeys from 'snakecase-keys'
import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb'
import * as InjectiveExchangeV1Beta1ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb'
import { MsgBase } from '../../MsgBase.js'
import type { SnakeCaseKeys } from 'snakecase-keys'

interface SpotOrderToCreate {
  orderType: InjectiveExchangeV1Beta1ExchangePb.OrderType
  triggerPrice?: string
  marketId: string
  feeRecipient: string
  price: string
  quantity: string
  cid?: string
}

interface DerivativeOrderToCreate {
  orderType: InjectiveExchangeV1Beta1ExchangePb.OrderType
  triggerPrice?: string
  feeRecipient: string
  marketId: string
  price: string
  margin: string
  quantity: string
  cid?: string
}

interface BinaryOptionOrderToCreate {
  orderType: InjectiveExchangeV1Beta1ExchangePb.OrderType
  triggerPrice?: string
  feeRecipient: string
  marketId: string
  price: string
  margin: string
  quantity: string
  cid?: string
}

export declare namespace MsgBatchUpdateOrders {
  export interface Params {
    subaccountId: string
    spotMarketIdsToCancelAll?: string[]
    derivativeMarketIdsToCancelAll?: string[]
    binaryOptionsMarketIdsToCancelAll?: string[]
    spotOrdersToCancel?: {
      marketId: string
      subaccountId: string
      orderHash?: string
      cid?: string
    }[]
    derivativeOrdersToCancel?: {
      marketId: string
      subaccountId: string
      orderHash?: string
      cid?: string
    }[]
    binaryOptionsOrdersToCancel?: {
      marketId: string
      subaccountId: string
      orderHash?: string
      cid?: string
    }[]
    spotOrdersToCreate?: SpotOrderToCreate[]
    derivativeOrdersToCreate?: DerivativeOrderToCreate[]
    binaryOptionsOrdersToCreate?: BinaryOptionOrderToCreate[]
    injectiveAddress: string
  }

  export type Proto = InjectiveExchangeV1Beta1TxPb.MsgBatchUpdateOrders
}

const createSpotOrder = (
  args: SpotOrderToCreate & { subaccountId: string },
) => {
  const orderInfo = InjectiveExchangeV1Beta1ExchangePb.OrderInfo.create({
    subaccountId: args.subaccountId,
    feeRecipient: args.feeRecipient,
    price: args.price,
    quantity: args.quantity,
    cid: args.cid,
  })

  const order = InjectiveExchangeV1Beta1ExchangePb.SpotOrder.create({
    marketId: args.marketId,
    orderType: args.orderType,
    orderInfo: orderInfo,
    triggerPrice: args.triggerPrice,
  })

  return order
}

const createDerivativeOrder = (
  args: DerivativeOrderToCreate & { subaccountId: string },
) => {
  const orderInfo = InjectiveExchangeV1Beta1ExchangePb.OrderInfo.create({
    subaccountId: args.subaccountId,
    feeRecipient: args.feeRecipient,
    price: args.price,
    quantity: args.quantity,
    cid: args.cid,
  })

  const order = InjectiveExchangeV1Beta1ExchangePb.DerivativeOrder.create({
    marketId: args.marketId,
    orderType: args.orderType,
    orderInfo: orderInfo,
    margin: args.margin,
    triggerPrice: args.triggerPrice,
  })

  return order
}

const createBinaryOptionOrder = (
  args: BinaryOptionOrderToCreate & { subaccountId: string },
) => {
  const orderInfo = InjectiveExchangeV1Beta1ExchangePb.OrderInfo.create({
    subaccountId: args.subaccountId,
    feeRecipient: args.feeRecipient,
    price: args.price,
    quantity: args.quantity,
    cid: args.cid,
  })

  const order = InjectiveExchangeV1Beta1ExchangePb.DerivativeOrder.create({
    marketId: args.marketId,
    orderType: args.orderType,
    orderInfo: orderInfo,
    margin: args.margin,
    triggerPrice: args.triggerPrice,
  })

  return order
}

const createMsgAndCancelOrders = (params: MsgBatchUpdateOrders.Params) => {
  const message = InjectiveExchangeV1Beta1TxPb.MsgBatchUpdateOrders.create({
    sender: params.injectiveAddress,
    subaccountId: params.subaccountId,
  })

  if (params.spotMarketIdsToCancelAll) {
    message.spotMarketIdsToCancelAll = params.spotMarketIdsToCancelAll
  }

  if (params.derivativeMarketIdsToCancelAll) {
    message.derivativeMarketIdsToCancelAll =
      params.derivativeMarketIdsToCancelAll
  }

  if (params.binaryOptionsMarketIdsToCancelAll) {
    message.binaryOptionsMarketIdsToCancelAll =
      params.binaryOptionsMarketIdsToCancelAll
  }

  if (params.spotOrdersToCancel) {
    message.spotOrdersToCancel = params.spotOrdersToCancel.map(
      ({ marketId, subaccountId, orderHash, cid }) => {
        return InjectiveExchangeV1Beta1TxPb.OrderData.create({
          marketId,
          subaccountId,
          orderHash,
          cid,
        })
      },
    )
  }

  if (params.derivativeOrdersToCancel) {
    message.derivativeOrdersToCancel = params.derivativeOrdersToCancel.map(
      ({ marketId, subaccountId, orderHash, cid }) => {
        return InjectiveExchangeV1Beta1TxPb.OrderData.create({
          marketId,
          subaccountId,
          orderHash,
          cid,
        })
      },
    )
  }

  if (params.binaryOptionsOrdersToCancel) {
    message.binaryOptionsOrdersToCancel =
      params.binaryOptionsOrdersToCancel.map(
        ({ marketId, subaccountId, orderHash, cid }) => {
          return InjectiveExchangeV1Beta1TxPb.OrderData.create({
            marketId,
            subaccountId,
            orderHash,
            cid,
          })
        },
      )
  }

  return message
}

/**
 * @category Messages
 */
export default class MsgBatchUpdateOrders extends MsgBase<
  MsgBatchUpdateOrders.Params,
  MsgBatchUpdateOrders.Proto
> {
  static fromJSON(params: MsgBatchUpdateOrders.Params): MsgBatchUpdateOrders {
    return new MsgBatchUpdateOrders(params)
  }

  public toProto() {
    const { params } = this

    const message = createMsgAndCancelOrders(params)

    if (params.spotOrdersToCreate) {
      message.spotOrdersToCreate = params.spotOrdersToCreate.map((args) => {
        const paramsFromArgs = {
          ...args,
          price: toChainFormat(args.price).toFixed(),
          triggerPrice: toChainFormat(args.triggerPrice || 0).toFixed(),
          quantity: toChainFormat(args.quantity).toFixed(),
        }

        return createSpotOrder({
          ...args,
          ...paramsFromArgs,
          subaccountId: params.subaccountId,
        })
      })
    }

    if (params.derivativeOrdersToCreate) {
      message.derivativeOrdersToCreate = params.derivativeOrdersToCreate.map(
        (args) => {
          const paramsFromArgs = {
            ...args,
            price: toChainFormat(args.price).toFixed(),
            margin: toChainFormat(args.margin).toFixed(),
            triggerPrice: toChainFormat(args.triggerPrice || 0).toFixed(),
            quantity: toChainFormat(args.quantity).toFixed(),
          }

          return createDerivativeOrder({
            ...args,
            ...paramsFromArgs,
            subaccountId: params.subaccountId,
          })
        },
      )
    }

    if (params.binaryOptionsOrdersToCreate) {
      message.binaryOptionsOrdersToCreate =
        params.binaryOptionsOrdersToCreate.map((args) => {
          const paramsFromArgs = {
            ...args,
            price: toChainFormat(args.price).toFixed(),
            margin: toChainFormat(args.margin).toFixed(),
            triggerPrice: toChainFormat(args.triggerPrice || 0).toFixed(),
            quantity: toChainFormat(args.quantity).toFixed(),
          }

          return createBinaryOptionOrder({
            ...args,
            ...paramsFromArgs,
            subaccountId: params.subaccountId,
          })
        })
    }

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this

    const message = createMsgAndCancelOrders(params)

    if (params.spotOrdersToCreate) {
      message.spotOrdersToCreate = params.spotOrdersToCreate.map((args) => {
        const paramsFromArgs = {
          ...args,
          price: args.price,
          triggerPrice: args.triggerPrice || '0',
          quantity: args.quantity,
        }

        return createSpotOrder({
          ...args,
          ...paramsFromArgs,
          subaccountId: params.subaccountId,
        })
      })
    }

    if (params.derivativeOrdersToCreate) {
      message.derivativeOrdersToCreate = params.derivativeOrdersToCreate.map(
        (args) => {
          const paramsFromArgs = {
            ...args,
            price: args.price,
            margin: args.margin,
            triggerPrice: args.triggerPrice || '0',
            quantity: args.quantity,
          }

          return createDerivativeOrder({
            ...args,
            ...paramsFromArgs,
            subaccountId: params.subaccountId,
          })
        },
      )
    }

    if (params.binaryOptionsOrdersToCreate) {
      message.binaryOptionsOrdersToCreate =
        params.binaryOptionsOrdersToCreate.map((args) => {
          const paramsFromArgs = {
            ...args,
            price: args.price,
            margin: args.margin,
            triggerPrice: args.triggerPrice || '0',
            quantity: args.quantity,
          }

          return createBinaryOptionOrder({
            ...args,
            ...paramsFromArgs,
            subaccountId: params.subaccountId,
          })
        })
    }

    const msg = {
      ...snakecaseKeys(message),
    }

    return {
      type: 'exchange/MsgBatchUpdateOrders',
      value:
        msg as unknown as SnakeCaseKeys<InjectiveExchangeV1Beta1TxPb.MsgBatchUpdateOrders>,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v1beta1.MsgBatchUpdateOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV1Beta1TxPb.MsgBatchUpdateOrders.toBinary(
      this.toProto(),
    )
  }
}
