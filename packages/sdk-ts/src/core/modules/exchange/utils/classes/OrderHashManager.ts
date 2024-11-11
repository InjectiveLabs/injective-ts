import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { BigNumber } from '@injectivelabs/utils'
import { GeneralException } from '@injectivelabs/exceptions'
import { Address } from '../../../../accounts/Address.js'
import { ChainGrpcExchangeApi } from '../../../../../client/chain/grpc/ChainGrpcExchangeApi.js'
import { domainHash, messageHash } from '../../../../../utils/crypto.js'
import { numberToCosmosSdkDecString } from '../../../../../utils/numbers.js'
import keccak256 from 'keccak256'
import MsgCreateSpotLimitOrder from '../../msgs/MsgCreateSpotLimitOrder.js'
import MsgCreateDerivativeLimitOrder from '../../msgs/MsgCreateDerivativeLimitOrder.js'
import { InjectiveExchangeV1Beta1Exchange } from '@injectivelabs/core-proto-ts'

interface OrderInfo {
  subaccountId: string
  feeRecipient: string
  price: string
  quantity: string
}

interface SpotOrder {
  marketId: string
  orderInfo: OrderInfo
  orderType: number
  triggerPrice?: string
}

interface DerivativeOrder extends SpotOrder {
  margin: string
}

const spotOrderPrimaryType = 'SpotOrder'
const derivativeOrderPrimaryType = 'DerivativeOrder'
const EIP712DomainType = [
  {
    name: 'name',
    type: 'string',
  },
  {
    name: 'version',
    type: 'string',
  },
  {
    name: 'chainId',
    type: 'uint256',
  },
  {
    name: 'verifyingContract',
    type: 'address',
  },
  {
    name: 'salt',
    type: 'bytes32',
  },
]
const SpotOrderType = [
  {
    name: 'MarketId',
    type: 'string',
  },
  {
    name: 'OrderInfo',
    type: 'OrderInfo',
  },
  {
    name: 'Salt',
    type: 'string',
  },
  {
    name: 'OrderType',
    type: 'string',
  },
  {
    name: 'TriggerPrice',
    type: 'string',
  },
]
const DerivativeOrderType = [
  {
    name: 'MarketId',
    type: 'string',
  },
  {
    name: 'OrderInfo',
    type: 'OrderInfo',
  },
  {
    name: 'OrderType',
    type: 'string',
  },
  {
    name: 'Margin',
    type: 'string',
  },
  {
    name: 'TriggerPrice',
    type: 'string',
  },
  {
    name: 'Salt',
    type: 'string',
  },
]
const OrderInfoType = [
  {
    name: 'SubaccountId',
    type: 'string',
  },
  {
    name: 'FeeRecipient',
    type: 'string',
  },
  {
    name: 'Price',
    type: 'string',
  },
  {
    name: 'Quantity',
    type: 'string',
  },
]
const EIP712Domain = {
  name: 'Injective Protocol',
  version: '2.0.0',
  chainId: `0x${new BigNumber(888).toString(16)}`,
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
}

const EIP712Types = {
  EIP712Domain: EIP712DomainType,
  [spotOrderPrimaryType]: SpotOrderType,
  [derivativeOrderPrimaryType]: DerivativeOrderType,
  OrderInfo: OrderInfoType,
}

const orderTypeToChainOrderType = (orderType: number) => {
  switch (orderType) {
    case InjectiveExchangeV1Beta1Exchange.OrderType.BUY:
      return '\u0001'
    case InjectiveExchangeV1Beta1Exchange.OrderType.SELL:
      return '\u0002'
    case InjectiveExchangeV1Beta1Exchange.OrderType.STOP_BUY:
      return '\u0003'
    case InjectiveExchangeV1Beta1Exchange.OrderType.STOP_SELL:
      return '\u0004'
    case InjectiveExchangeV1Beta1Exchange.OrderType.TAKE_BUY:
      return '\u0005'
    case InjectiveExchangeV1Beta1Exchange.OrderType.TAKE_SELL:
      return '\u0006'
    case InjectiveExchangeV1Beta1Exchange.OrderType.BUY_PO:
      return '\u0007'
    case InjectiveExchangeV1Beta1Exchange.OrderType.SELL_PO:
      return '\u0008'
    case InjectiveExchangeV1Beta1Exchange.OrderType.BUY_ATOMIC:
      return '\u0009'
    case InjectiveExchangeV1Beta1Exchange.OrderType.SELL_ATOMIC:
      return '\u000A'
    default:
      return '\u0001'
  }
}

const getEip712ForSpotOrder = (spotOrder: SpotOrder, nonce: number) => {
  return {
    primaryType: spotOrderPrimaryType,
    types: EIP712Types,
    domain: EIP712Domain,
    message: {
      MarketId: spotOrder.marketId,
      OrderInfo: {
        SubaccountId: spotOrder.orderInfo.subaccountId,
        FeeRecipient: spotOrder.orderInfo.feeRecipient,
        Price: numberToCosmosSdkDecString(spotOrder.orderInfo.price),
        Quantity: numberToCosmosSdkDecString(spotOrder.orderInfo.quantity),
      },
      Salt: nonce.toString(),
      OrderType: orderTypeToChainOrderType(spotOrder.orderType),
      TriggerPrice: spotOrder.triggerPrice
        ? numberToCosmosSdkDecString(spotOrder.triggerPrice)
        : '0.000000000000000000',
    },
  }
}

const getEip712ForDerivativeOrder = (
  derivativeOrder: DerivativeOrder,
  nonce: number,
) => {
  return {
    primaryType: derivativeOrderPrimaryType,
    types: EIP712Types,
    domain: EIP712Domain,
    message: {
      MarketId: derivativeOrder.marketId,
      OrderInfo: {
        SubaccountId: derivativeOrder.orderInfo.subaccountId,
        FeeRecipient: derivativeOrder.orderInfo.feeRecipient,
        Price: numberToCosmosSdkDecString(derivativeOrder.orderInfo.price),
        Quantity: numberToCosmosSdkDecString(
          derivativeOrder.orderInfo.quantity,
        ),
      },
      Margin: numberToCosmosSdkDecString(derivativeOrder.margin),
      OrderType: orderTypeToChainOrderType(derivativeOrder.orderType),
      TriggerPrice: derivativeOrder.triggerPrice
        ? numberToCosmosSdkDecString(derivativeOrder.triggerPrice)
        : '0.000000000000000000',
      Salt: nonce.toString(),
    },
  }
}

export class OrderHashManager {
  public subaccountIndex: number

  public address: string

  public network: Network

  public nonce: number = 0

  constructor({
    network,
    address,
    subaccountIndex = 0 /* default trading account */,
  }: {
    network: Network
    address: string
    subaccountIndex?: number
  }) {
    this.network = network
    this.address = address
    this.subaccountIndex = subaccountIndex
  }

  public incrementNonce() {
    this.nonce += 1
  }

  public setNonce(nonce: number) {
    this.nonce = nonce
  }

  /**
   * Keep in mind that the order params have to be transformed
   * in proper format that's supported on the chain
   */
  async getOrderHashes({
    spotOrders = [],
    derivativeOrders = [],
  }: {
    spotOrders: SpotOrder[]
    derivativeOrders: DerivativeOrder[]
  }): Promise<{ derivativeOrderHashes: string[]; spotOrderHashes: string[] }> {
    if (spotOrders.length === 0 && derivativeOrders.length === 0) {
      throw new GeneralException(
        new Error('Please provide spot or derivative orders'),
      )
    }

    await this.initSubaccountNonce()

    const spotOrderHashes = spotOrders.map((order) => {
      return this.incrementNonceAndReturn(
        this.hashTypedData(getEip712ForSpotOrder(order, this.nonce)),
      )
    })
    const derivativeOrderHashes = derivativeOrders.map((order) => {
      return this.incrementNonceAndReturn(
        this.hashTypedData(getEip712ForDerivativeOrder(order, this.nonce)),
      )
    })

    return {
      spotOrderHashes,
      derivativeOrderHashes,
    }
  }

  /**
   * Keep in mind that the order params have to be transformed
   * in proper format that's supported on the chain
   */
  async getDerivativeOrderHashes(orders: DerivativeOrder[]): Promise<string[]> {
    if (orders.length === 0) {
      throw new GeneralException(new Error('Please provide orders'))
    }

    await this.initSubaccountNonce()

    return orders.map((order) => {
      return this.incrementNonceAndReturn(
        this.hashTypedData(getEip712ForDerivativeOrder(order, this.nonce)),
      )
    })
  }

  /**
   * Keep in mind that the order params have to be transformed
   * in proper format that's supported on the chain
   */
  async getSpotOrderHashes(orders: SpotOrder[]): Promise<string[]> {
    if (orders.length === 0) {
      throw new GeneralException(new Error('Please provide orders'))
    }

    await this.initSubaccountNonce()

    return orders.map((order) => {
      return this.incrementNonceAndReturn(
        this.hashTypedData(getEip712ForSpotOrder(order, this.nonce)),
      )
    })
  }

  async getSpotOrderHashFromMsg(msg: MsgCreateSpotLimitOrder): Promise<string> {
    await this.initSubaccountNonce()

    const proto = msg.toAmino()
    const order = proto.value.order

    if (!order) {
      throw new GeneralException(
        new Error('The MsgCreateSpotLimitOrder is not complete'),
      )
    }

    const orderInfo = order.order_info

    if (!orderInfo) {
      throw new GeneralException(
        new Error('The MsgCreateSpotLimitOrder is not complete'),
      )
    }

    return this.incrementNonceAndReturn(
      this.hashTypedData(
        getEip712ForSpotOrder(
          {
            marketId: order.market_id,
            orderInfo: {
              subaccountId: orderInfo.subaccount_id,
              feeRecipient: orderInfo.fee_recipient,
              price: orderInfo.price,
              quantity: orderInfo.quantity,
            },
            orderType: order.order_type,
            triggerPrice: order.trigger_price,
          },
          this.nonce,
        ),
      ),
    )
  }

  async getDerivativeOrderHashFromMsg(
    msg: MsgCreateDerivativeLimitOrder,
  ): Promise<string> {
    await this.initSubaccountNonce()

    const proto = msg.toAmino()
    const order = proto.value.order

    if (!order) {
      throw new GeneralException(
        new Error('The MsgCreateDerivativeLimitOrder is not complete'),
      )
    }

    const orderInfo = order.order_info

    if (!orderInfo) {
      throw new GeneralException(
        new Error('The MsgCreateDerivativeLimitOrder is not complete'),
      )
    }

    return this.incrementNonceAndReturn(
      this.hashTypedData(
        getEip712ForDerivativeOrder(
          {
            marketId: order.market_id,
            orderInfo: {
              subaccountId: orderInfo.subaccount_id,
              feeRecipient: orderInfo.fee_recipient,
              price: orderInfo.price,
              quantity: orderInfo.quantity,
            },
            margin: order.margin,
            orderType: order.order_type,
            triggerPrice: order.trigger_price,
          },
          this.nonce,
        ),
      ),
    )
  }

  private async initSubaccountNonce() {
    if (this.nonce) {
      return this.incrementNonce()
    }

    const { network, subaccountIndex, address } = this

    const endpoints = getNetworkEndpoints(network)
    const chainGrpcExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)
    const subaccountId =
      Address.fromBech32(address).getSubaccountId(subaccountIndex)

    const { nonce } = await chainGrpcExchangeApi.fetchSubaccountTradeNonce(
      subaccountId,
    )

    this.nonce = nonce + 1
  }

  private hashTypedData(eip712: any) {
    const bytesToHash = Buffer.concat([
      Buffer.from('19', 'hex'),
      Buffer.from('01', 'hex'),
      domainHash(eip712),
      messageHash(eip712),
    ])

    try {
      return `0x${Buffer.from(keccak256(bytesToHash)).toString('hex')}`
    } catch (e) {
      return ''
    }
  }

  private incrementNonceAndReturn<T>(result: T): T {
    this.incrementNonce()

    return result
  }
}
