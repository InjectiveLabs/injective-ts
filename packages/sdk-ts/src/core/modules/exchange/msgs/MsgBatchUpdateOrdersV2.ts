import { toChainFormat } from '@injectivelabs/utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2OrderPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/order_pb'
import { MsgBase } from '../../MsgBase.js'
import { objectKeysToEip712Types } from '../../../tx/eip712/maps.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

interface SpotOrderToCreate {
  orderType: InjectiveExchangeV2OrderPb.OrderType
  triggerPrice?: string
  marketId: string
  feeRecipient: string
  price: string
  quantity: string
  cid?: string
  expirationBlock?: string
}

interface DerivativeOrderToCreate {
  orderType: InjectiveExchangeV2OrderPb.OrderType
  triggerPrice?: string
  feeRecipient: string
  marketId: string
  price: string
  margin: string
  quantity: string
  cid?: string
  expirationBlock?: string
}

interface BinaryOptionOrderToCreate {
  orderType: InjectiveExchangeV2OrderPb.OrderType
  triggerPrice?: string
  feeRecipient: string
  marketId: string
  price: string
  margin: string
  quantity: string
  cid?: string
  expirationBlock?: string
}

export declare namespace MsgBatchUpdateOrdersV2 {
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
    spotMarketOrdersToCreate?: SpotOrderToCreate[]
    derivativeMarketOrdersToCreate?: DerivativeOrderToCreate[]
    binaryOptionsMarketOrdersToCreate?: BinaryOptionOrderToCreate[]
    injectiveAddress: string
  }

  export type Proto = InjectiveExchangeV2TxPb.MsgBatchUpdateOrders
}

const createSpotOrder = (
  args: SpotOrderToCreate & { subaccountId: string },
) => {
  const orderInfo = InjectiveExchangeV2OrderPb.OrderInfo.create({
    subaccountId: args.subaccountId,
    feeRecipient: args.feeRecipient,
    price: args.price,
    quantity: args.quantity,
    cid: args.cid,
  })

  const order = InjectiveExchangeV2OrderPb.SpotOrder.create({
    marketId: args.marketId,
    orderType: args.orderType,
    orderInfo: orderInfo,
    triggerPrice: args.triggerPrice,
    expirationBlock: args.expirationBlock
      ? BigInt(args.expirationBlock)
      : BigInt(0),
  })

  return order
}

const createDerivativeOrder = (
  args: DerivativeOrderToCreate & { subaccountId: string },
) => {
  const orderInfo = InjectiveExchangeV2OrderPb.OrderInfo.create({
    subaccountId: args.subaccountId,
    feeRecipient: args.feeRecipient,
    price: args.price,
    quantity: args.quantity,
    cid: args.cid,
  })

  const order = InjectiveExchangeV2OrderPb.DerivativeOrder.create({
    marketId: args.marketId,
    orderType: args.orderType,
    orderInfo: orderInfo,
    margin: args.margin,
    triggerPrice: args.triggerPrice,
    expirationBlock: args.expirationBlock
      ? BigInt(args.expirationBlock)
      : BigInt(0),
  })

  return order
}

const createBinaryOptionOrder = (
  args: BinaryOptionOrderToCreate & { subaccountId: string },
) => {
  const orderInfo = InjectiveExchangeV2OrderPb.OrderInfo.create({
    subaccountId: args.subaccountId,
    feeRecipient: args.feeRecipient,
    price: args.price,
    quantity: args.quantity,
    cid: args.cid,
  })

  // Binary options reuse the DerivativeOrder proto type on-chain
  const order = InjectiveExchangeV2OrderPb.DerivativeOrder.create({
    marketId: args.marketId,
    orderType: args.orderType,
    orderInfo: orderInfo,
    margin: args.margin,
    triggerPrice: args.triggerPrice,
    expirationBlock: args.expirationBlock
      ? BigInt(args.expirationBlock)
      : BigInt(0),
  })

  return order
}

type OrderFormatFn = (value: string) => string
type OptionalOrderFormatFn = (value: string | undefined) => string

const buildSpotOrders = (
  orders: SpotOrderToCreate[],
  subaccountId: string,
  fmt: OrderFormatFn,
  fmtOpt: OptionalOrderFormatFn,
) =>
  orders.map((args) =>
    createSpotOrder({
      ...args,
      price: fmt(args.price),
      triggerPrice: fmtOpt(args.triggerPrice),
      quantity: fmt(args.quantity),
      subaccountId,
    }),
  )

const buildDerivativeOrders = (
  orders: DerivativeOrderToCreate[],
  subaccountId: string,
  fmt: OrderFormatFn,
  fmtOpt: OptionalOrderFormatFn,
) =>
  orders.map((args) =>
    createDerivativeOrder({
      ...args,
      price: fmt(args.price),
      margin: fmt(args.margin),
      triggerPrice: fmtOpt(args.triggerPrice),
      quantity: fmt(args.quantity),
      subaccountId,
    }),
  )

const buildBinaryOptionOrders = (
  orders: BinaryOptionOrderToCreate[],
  subaccountId: string,
  fmt: OrderFormatFn,
  fmtOpt: OptionalOrderFormatFn,
) =>
  orders.map((args) =>
    createBinaryOptionOrder({
      ...args,
      price: fmt(args.price),
      margin: fmt(args.margin),
      triggerPrice: fmtOpt(args.triggerPrice),
      quantity: fmt(args.quantity),
      subaccountId,
    }),
  )

const createMsgAndCancelOrders = (params: MsgBatchUpdateOrdersV2.Params) => {
  const hasCancelAll =
    (params.spotMarketIdsToCancelAll &&
      params.spotMarketIdsToCancelAll.length > 0) ||
    (params.derivativeMarketIdsToCancelAll &&
      params.derivativeMarketIdsToCancelAll.length > 0) ||
    (params.binaryOptionsMarketIdsToCancelAll &&
      params.binaryOptionsMarketIdsToCancelAll.length > 0)

  const message = InjectiveExchangeV2TxPb.MsgBatchUpdateOrders.create({
    sender: params.injectiveAddress,
    ...(hasCancelAll && { subaccountId: params.subaccountId }),
  })

  if (
    params.spotMarketIdsToCancelAll &&
    params.spotMarketIdsToCancelAll.length > 0
  ) {
    message.spotMarketIdsToCancelAll = params.spotMarketIdsToCancelAll
  }

  if (
    params.derivativeMarketIdsToCancelAll &&
    params.derivativeMarketIdsToCancelAll.length > 0
  ) {
    message.derivativeMarketIdsToCancelAll =
      params.derivativeMarketIdsToCancelAll
  }

  if (
    params.binaryOptionsMarketIdsToCancelAll &&
    params.binaryOptionsMarketIdsToCancelAll.length > 0
  ) {
    message.binaryOptionsMarketIdsToCancelAll =
      params.binaryOptionsMarketIdsToCancelAll
  }

  if (params.spotOrdersToCancel) {
    message.spotOrdersToCancel = params.spotOrdersToCancel.map(
      ({ marketId, subaccountId, orderHash, cid }) => {
        return InjectiveExchangeV2TxPb.OrderData.create({
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
        return InjectiveExchangeV2TxPb.OrderData.create({
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
          return InjectiveExchangeV2TxPb.OrderData.create({
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
export default class MsgBatchUpdateOrdersV2 extends MsgBase<
  MsgBatchUpdateOrdersV2.Params,
  MsgBatchUpdateOrdersV2.Proto
> {
  static fromJSON(
    params: MsgBatchUpdateOrdersV2.Params,
  ): MsgBatchUpdateOrdersV2 {
    return new MsgBatchUpdateOrdersV2(params)
  }

  public toProto() {
    const { params } = this
    const message = createMsgAndCancelOrders(params)

    const fmt: OrderFormatFn = (v) => toChainFormat(v).toFixed()
    const fmtOpt: OptionalOrderFormatFn = (v) => toChainFormat(v || 0).toFixed()

    if (params.spotOrdersToCreate)
      message.spotOrdersToCreate = buildSpotOrders(
        params.spotOrdersToCreate,
        params.subaccountId,
        fmt,
        fmtOpt,
      )
    if (params.derivativeOrdersToCreate)
      message.derivativeOrdersToCreate = buildDerivativeOrders(
        params.derivativeOrdersToCreate,
        params.subaccountId,
        fmt,
        fmtOpt,
      )
    if (params.binaryOptionsOrdersToCreate)
      message.binaryOptionsOrdersToCreate = buildBinaryOptionOrders(
        params.binaryOptionsOrdersToCreate,
        params.subaccountId,
        fmt,
        fmtOpt,
      )
    if (params.spotMarketOrdersToCreate)
      message.spotMarketOrdersToCreate = buildSpotOrders(
        params.spotMarketOrdersToCreate,
        params.subaccountId,
        fmt,
        fmtOpt,
      )
    if (params.derivativeMarketOrdersToCreate)
      message.derivativeMarketOrdersToCreate = buildDerivativeOrders(
        params.derivativeMarketOrdersToCreate,
        params.subaccountId,
        fmt,
        fmtOpt,
      )
    if (params.binaryOptionsMarketOrdersToCreate)
      message.binaryOptionsMarketOrdersToCreate = buildBinaryOptionOrders(
        params.binaryOptionsMarketOrdersToCreate,
        params.subaccountId,
        fmt,
        fmtOpt,
      )

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.exchange.v2.MsgBatchUpdateOrders',
      ...proto,
    }
  }

  public toAmino() {
    const { params } = this

    const message = createMsgAndCancelOrders(params)

    const fmt: OrderFormatFn = (v) => v
    const fmtOpt: OptionalOrderFormatFn = (v) => v || '0'

    if (params.spotOrdersToCreate)
      message.spotOrdersToCreate = buildSpotOrders(
        params.spotOrdersToCreate,
        params.subaccountId,
        fmt,
        fmtOpt,
      )
    if (params.derivativeOrdersToCreate)
      message.derivativeOrdersToCreate = buildDerivativeOrders(
        params.derivativeOrdersToCreate,
        params.subaccountId,
        fmt,
        fmtOpt,
      )
    if (params.binaryOptionsOrdersToCreate)
      message.binaryOptionsOrdersToCreate = buildBinaryOptionOrders(
        params.binaryOptionsOrdersToCreate,
        params.subaccountId,
        fmt,
        fmtOpt,
      )
    if (params.spotMarketOrdersToCreate)
      message.spotMarketOrdersToCreate = buildSpotOrders(
        params.spotMarketOrdersToCreate,
        params.subaccountId,
        fmt,
        fmtOpt,
      )
    if (params.derivativeMarketOrdersToCreate)
      message.derivativeMarketOrdersToCreate = buildDerivativeOrders(
        params.derivativeMarketOrdersToCreate,
        params.subaccountId,
        fmt,
        fmtOpt,
      )
    if (params.binaryOptionsMarketOrdersToCreate)
      message.binaryOptionsMarketOrdersToCreate = buildBinaryOptionOrders(
        params.binaryOptionsMarketOrdersToCreate,
        params.subaccountId,
        fmt,
        fmtOpt,
      )

    const orderInfoToSnakeCase = (orderInfo: any) => ({
      subaccount_id: orderInfo.subaccountId,
      fee_recipient: orderInfo.feeRecipient,
      price: orderInfo.price,
      quantity: orderInfo.quantity,
      cid: orderInfo.cid,
    })

    const spotOrderToSnakeCase = (order: any) => ({
      market_id: order.marketId,
      order_type: order.orderType,
      order_info: orderInfoToSnakeCase(order.orderInfo),
      trigger_price: order.triggerPrice,
      expiration_block: String(order.expirationBlock),
    })

    const derivativeOrderToSnakeCase = (order: any) => ({
      market_id: order.marketId,
      order_type: order.orderType,
      order_info: orderInfoToSnakeCase(order.orderInfo),
      margin: order.margin,
      trigger_price: order.triggerPrice,
      expiration_block: String(order.expirationBlock),
    })

    const orderDataToSnakeCase = (orderData: any) => ({
      market_id: orderData.marketId,
      subaccount_id: orderData.subaccountId,
      order_hash: orderData.orderHash,
      cid: orderData.cid,
    })

    const msg = {
      sender: message.sender,
      subaccount_id: message.subaccountId,
      spot_market_ids_to_cancel_all: message.spotMarketIdsToCancelAll,
      derivative_market_ids_to_cancel_all:
        message.derivativeMarketIdsToCancelAll,
      spot_orders_to_cancel:
        message.spotOrdersToCancel.map(orderDataToSnakeCase),
      derivative_orders_to_cancel:
        message.derivativeOrdersToCancel.map(orderDataToSnakeCase),
      spot_orders_to_create:
        message.spotOrdersToCreate.map(spotOrderToSnakeCase),
      derivative_orders_to_create: message.derivativeOrdersToCreate.map(
        derivativeOrderToSnakeCase,
      ),
      binary_options_orders_to_cancel:
        message.binaryOptionsOrdersToCancel.map(orderDataToSnakeCase),
      binary_options_market_ids_to_cancel_all:
        message.binaryOptionsMarketIdsToCancelAll,
      binary_options_orders_to_create: message.binaryOptionsOrdersToCreate.map(
        derivativeOrderToSnakeCase,
      ),
      spot_market_orders_to_create:
        message.spotMarketOrdersToCreate.map(spotOrderToSnakeCase),
      derivative_market_orders_to_create:
        message.derivativeMarketOrdersToCreate.map(derivativeOrderToSnakeCase),
      binary_options_market_orders_to_create:
        message.binaryOptionsMarketOrdersToCreate.map(
          derivativeOrderToSnakeCase,
        ),
    }

    return {
      type: 'exchange/MsgBatchUpdateOrders',
      value: msg as any,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.exchange.v2.MsgBatchUpdateOrders',
      ...value,
    }
  }

  public toEip712() {
    const { params } = this
    const amino = this.toAmino()
    const { value, type } = amino

    const spotOrderToEip712 = (order: any, args: SpotOrderToCreate) => ({
      market_id: order.market_id,
      order_info: {
        subaccount_id: order.order_info.subaccount_id,
        fee_recipient: order.order_info.fee_recipient,
        price: toChainFormat(args.price).toFixed(),
        quantity: toChainFormat(args.quantity).toFixed(),
        cid: order.order_info.cid,
      },
      order_type: order.order_type,
      trigger_price: toChainFormat(args.triggerPrice || '0').toFixed(),
    })

    const derivativeOrderToEip712 = (
      order: any,
      args: DerivativeOrderToCreate | BinaryOptionOrderToCreate,
    ) => ({
      market_id: order.market_id,
      order_info: {
        subaccount_id: order.order_info.subaccount_id,
        fee_recipient: order.order_info.fee_recipient,
        price: toChainFormat(args.price).toFixed(),
        quantity: toChainFormat(args.quantity).toFixed(),
        cid: order.order_info.cid,
      },
      order_type: order.order_type,
      margin: toChainFormat((args as DerivativeOrderToCreate).margin).toFixed(),
      trigger_price: toChainFormat(args.triggerPrice || '0').toFixed(),
    })

    const msgValue = value as any
    const hasCancelAll =
      (params.spotMarketIdsToCancelAll &&
        params.spotMarketIdsToCancelAll.length > 0) ||
      (params.derivativeMarketIdsToCancelAll &&
        params.derivativeMarketIdsToCancelAll.length > 0) ||
      (params.binaryOptionsMarketIdsToCancelAll &&
        params.binaryOptionsMarketIdsToCancelAll.length > 0)

    const result: Record<string, any> = {
      sender: msgValue.sender,
    }

    if (hasCancelAll) {
      result.subaccount_id = msgValue.subaccount_id
    }

    if (msgValue.spot_market_ids_to_cancel_all?.length > 0) {
      result.spot_market_ids_to_cancel_all =
        msgValue.spot_market_ids_to_cancel_all
    }

    if (msgValue.derivative_market_ids_to_cancel_all?.length > 0) {
      result.derivative_market_ids_to_cancel_all =
        msgValue.derivative_market_ids_to_cancel_all
    }

    if (msgValue.spot_orders_to_cancel?.length > 0) {
      result.spot_orders_to_cancel = msgValue.spot_orders_to_cancel
    }

    if (msgValue.derivative_orders_to_cancel?.length > 0) {
      result.derivative_orders_to_cancel = msgValue.derivative_orders_to_cancel
    }

    if (params.spotOrdersToCreate && params.spotOrdersToCreate.length > 0) {
      result.spot_orders_to_create = params.spotOrdersToCreate.map((args, i) =>
        spotOrderToEip712(msgValue.spot_orders_to_create[i], args),
      )
    }

    if (
      params.derivativeOrdersToCreate &&
      params.derivativeOrdersToCreate.length > 0
    ) {
      result.derivative_orders_to_create = params.derivativeOrdersToCreate.map(
        (args, i) =>
          derivativeOrderToEip712(
            msgValue.derivative_orders_to_create[i],
            args,
          ),
      )
    }

    if (msgValue.binary_options_orders_to_cancel?.length > 0) {
      result.binary_options_orders_to_cancel =
        msgValue.binary_options_orders_to_cancel
    }

    if (msgValue.binary_options_market_ids_to_cancel_all?.length > 0) {
      result.binary_options_market_ids_to_cancel_all =
        msgValue.binary_options_market_ids_to_cancel_all
    }

    if (
      params.binaryOptionsOrdersToCreate &&
      params.binaryOptionsOrdersToCreate.length > 0
    ) {
      result.binary_options_orders_to_create =
        params.binaryOptionsOrdersToCreate.map((args, i) =>
          derivativeOrderToEip712(
            msgValue.binary_options_orders_to_create[i],
            args,
          ),
        )
    }

    if (
      params.spotMarketOrdersToCreate &&
      params.spotMarketOrdersToCreate.length > 0
    ) {
      result.spot_market_orders_to_create = params.spotMarketOrdersToCreate.map(
        (args, i) =>
          spotOrderToEip712(msgValue.spot_market_orders_to_create[i], args),
      )
    }

    if (
      params.derivativeMarketOrdersToCreate &&
      params.derivativeMarketOrdersToCreate.length > 0
    ) {
      result.derivative_market_orders_to_create =
        params.derivativeMarketOrdersToCreate.map((args, i) =>
          derivativeOrderToEip712(
            msgValue.derivative_market_orders_to_create[i],
            args,
          ),
        )
    }

    if (
      params.binaryOptionsMarketOrdersToCreate &&
      params.binaryOptionsMarketOrdersToCreate.length > 0
    ) {
      result.binary_options_market_orders_to_create =
        params.binaryOptionsMarketOrdersToCreate.map((args, i) =>
          derivativeOrderToEip712(
            msgValue.binary_options_market_orders_to_create[i],
            args,
          ),
        )
    }

    return {
      type,
      value: result,
    }
  }

  public toEip712Types() {
    const eip712 = this.toEip712()

    const result = objectKeysToEip712Types({
      object: eip712.value as Record<string, any>,
      messageType: eip712.type,
    })

    // The chain always includes expiration_block in order type schemas
    // even when the message value omits zero-valued fields.
    const expirationBlockField = { name: 'expiration_block', type: 'int64' }
    const orderTypeKeys = [
      'TypeSpotOrdersToCreate',
      'TypeDerivativeOrdersToCreate',
      'TypeBinaryOptionsOrdersToCreate',
      'TypeSpotMarketOrdersToCreate',
      'TypeDerivativeMarketOrdersToCreate',
      'TypeBinaryOptionsMarketOrdersToCreate',
    ]
    for (const key of orderTypeKeys) {
      if (result.has(key)) {
        const fields = result.get(key)!
        if (!fields.some((f) => f.name === 'expiration_block')) {
          result.set(key, [...fields, expirationBlockField])
        }
      }
    }

    return result
  }

  public toEip712V2() {
    const { params } = this
    const web3gw = this.toWeb3Gw() as any

    const formatSpotOrderEip712 = (order: any, args: SpotOrderToCreate) => ({
      market_id: order.market_id,
      order_info: {
        subaccount_id: order.order_info.subaccount_id,
        fee_recipient: order.order_info.fee_recipient,
        price: numberToCosmosSdkDecString(args.price),
        quantity: numberToCosmosSdkDecString(args.quantity),
        cid: order.order_info.cid,
      },
      order_type: InjectiveExchangeV2OrderPb.OrderType[args.orderType],
      trigger_price: numberToCosmosSdkDecString(args.triggerPrice || '0'),
      expiration_block: args.expirationBlock || '0',
    })

    const formatDerivativeOrderEip712 = (
      order: any,
      args: DerivativeOrderToCreate | BinaryOptionOrderToCreate,
    ) => ({
      market_id: order.market_id,
      order_info: {
        subaccount_id: order.order_info.subaccount_id,
        fee_recipient: order.order_info.fee_recipient,
        price: numberToCosmosSdkDecString(args.price),
        quantity: numberToCosmosSdkDecString(args.quantity),
        cid: order.order_info.cid,
      },
      order_type: InjectiveExchangeV2OrderPb.OrderType[args.orderType],
      margin: numberToCosmosSdkDecString(
        (args as DerivativeOrderToCreate).margin,
      ),
      trigger_price: numberToCosmosSdkDecString(args.triggerPrice || '0'),
      expiration_block: args.expirationBlock || '0',
    })

    return {
      '@type': '/injective.exchange.v2.MsgBatchUpdateOrders',
      sender: web3gw.sender,
      subaccount_id: web3gw.subaccount_id,
      spot_market_ids_to_cancel_all: web3gw.spot_market_ids_to_cancel_all ?? [],
      derivative_market_ids_to_cancel_all:
        web3gw.derivative_market_ids_to_cancel_all ?? [],
      spot_orders_to_cancel: web3gw.spot_orders_to_cancel ?? [],
      derivative_orders_to_cancel: web3gw.derivative_orders_to_cancel ?? [],
      spot_orders_to_create:
        params.spotOrdersToCreate && params.spotOrdersToCreate.length > 0
          ? params.spotOrdersToCreate.map((args, i) =>
              formatSpotOrderEip712(web3gw.spot_orders_to_create[i], args),
            )
          : [],
      derivative_orders_to_create:
        params.derivativeOrdersToCreate &&
        params.derivativeOrdersToCreate.length > 0
          ? params.derivativeOrdersToCreate.map((args, i) =>
              formatDerivativeOrderEip712(
                web3gw.derivative_orders_to_create[i],
                args,
              ),
            )
          : [],
      binary_options_orders_to_cancel:
        web3gw.binary_options_orders_to_cancel ?? [],
      binary_options_market_ids_to_cancel_all:
        web3gw.binary_options_market_ids_to_cancel_all ?? [],
      binary_options_orders_to_create:
        params.binaryOptionsOrdersToCreate &&
        params.binaryOptionsOrdersToCreate.length > 0
          ? params.binaryOptionsOrdersToCreate.map((args, i) =>
              formatDerivativeOrderEip712(
                web3gw.binary_options_orders_to_create[i],
                args,
              ),
            )
          : [],
      spot_market_orders_to_create:
        params.spotMarketOrdersToCreate &&
        params.spotMarketOrdersToCreate.length > 0
          ? params.spotMarketOrdersToCreate.map((args, i) =>
              formatSpotOrderEip712(
                web3gw.spot_market_orders_to_create[i],
                args,
              ),
            )
          : [],
      derivative_market_orders_to_create:
        params.derivativeMarketOrdersToCreate &&
        params.derivativeMarketOrdersToCreate.length > 0
          ? params.derivativeMarketOrdersToCreate.map((args, i) =>
              formatDerivativeOrderEip712(
                web3gw.derivative_market_orders_to_create[i],
                args,
              ),
            )
          : [],
      binary_options_market_orders_to_create:
        params.binaryOptionsMarketOrdersToCreate &&
        params.binaryOptionsMarketOrdersToCreate.length > 0
          ? params.binaryOptionsMarketOrdersToCreate.map((args, i) =>
              formatDerivativeOrderEip712(
                web3gw.binary_options_market_orders_to_create[i],
                args,
              ),
            )
          : [],
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.exchange.v2.MsgBatchUpdateOrders',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveExchangeV2TxPb.MsgBatchUpdateOrders.toBinary(this.toProto())
  }
}
