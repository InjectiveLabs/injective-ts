import { getNetworkEndpoints, Network } from '@injectivelabs/networks'
import { BigNumber } from '@injectivelabs/utils'
import { GeneralException } from '@injectivelabs/exceptions'
import { Address } from '../../../../accounts/Address'
import { ChainGrpcExchangeApi } from '../../../../../client/chain/grpc/ChainGrpcExchangeApi'
import { domainHash, messageHash } from '../../../../../utils/crypto'
import keccak256 from 'keccak256'

interface OrderInfo {
  subaccountId: string
  feeRecipient: string
  price: string
  quantity: string
}

interface SpotOrder {
  marketId: string
  orderInfo: OrderInfo
  salt: string
  orderType: string
  triggerPrice: string
}

interface DerivativeOrder extends SpotOrder {
  margin: string
}

const spotOrderPrimaryType = 'SpotOrder'
const derivativeOrderPrimaryType = 'DerivativeOrder'
const EIP712DomainType = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'string' },
  { name: 'salt', type: 'string' },
]
const SpotOrderType = [
  { name: 'MarketId', type: 'string' },
  { name: 'OrderInfo', type: 'OrderInfo' },
  { name: 'Salt', type: 'string' },
  { name: 'OrderType', type: 'string' },
  { name: 'TriggerPrice', type: 'string' },
]
const DerivativeOrderType = [
  { name: 'MarketDd', type: 'string' },
  { name: 'OrderInfo', type: 'OrderInfo' },
  { name: 'OrderType', type: 'string' },
  { name: 'Margin', type: 'string' },
  { name: 'TriggerPrice', type: 'string' },
  { name: 'Salt', type: 'string' },
]
const OrderInfoType = [
  {
    name: 'SubaccountId',
    type: 'string',
  },
  { name: 'FeeRecipient', type: 'string' },
  { name: 'Price', type: 'string' },
  { name: 'Quantity', type: 'string' },
]
const EIP712Domain = {
  name: 'Injective Protocol',
  version: '2.0.0',
  chainId: '888',
  salt: '0x0000000000000000000000000000000000000000000000000000000000000000',
  verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
}

const EIP712Types = {
  EIP712Domain: EIP712DomainType,
  [spotOrderPrimaryType]: SpotOrderType,
  [derivativeOrderPrimaryType]: DerivativeOrderType,
  OrderInfo: OrderInfoType,
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
        Price: spotOrder.orderInfo.price,
        Quantity: spotOrder.orderInfo.quantity,
      },
      Salt: nonce.toString(),
      OrderType: '0x' + new BigNumber(spotOrder.orderType).toString(16),
      TriggerPrice: spotOrder.triggerPrice || '',
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
        Price: derivativeOrder.orderInfo.price,
        Quantity: derivativeOrder.orderInfo.quantity,
      },
      Margin: derivativeOrder.margin,
      OrderType: '0x' + new BigNumber(derivativeOrder.orderType).toString(16),
      TriggerPrice: derivativeOrder.triggerPrice || '',
      Salt: nonce.toString(),
    },
  }
}

export class OrderHashManager {
  public subaccountIndex: number

  public address: string

  public network: Network

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

    const { nonce } = await this.getSubaccountNonce()

    const spotOrderHashes = spotOrders.map((order) => {
      return this.hashTypedData(getEip712ForSpotOrder(order, nonce))
    })
    const derivativeOrderHashes = derivativeOrders.map((order) => {
      return this.hashTypedData(getEip712ForDerivativeOrder(order, nonce))
    })

    return {
      spotOrderHashes,
      derivativeOrderHashes,
    }
  }

  async getDerivativeOrderHashes(orders: DerivativeOrder[]): Promise<string[]> {
    if (orders.length === 0) {
      throw new GeneralException(new Error('Please provide orders'))
    }

    const { nonce } = await this.getSubaccountNonce()

    return orders.map((order) => {
      return this.hashTypedData(getEip712ForDerivativeOrder(order, nonce))
    })
  }

  async getSpotOrderHashes(orders: SpotOrder[]): Promise<string[]> {
    if (orders.length === 0) {
      throw new GeneralException(new Error('Please provide orders'))
    }

    const { nonce } = await this.getSubaccountNonce()

    return orders.map((order) => {
      return this.hashTypedData(getEip712ForSpotOrder(order, nonce))
    })
  }

  private getSubaccountNonce() {
    const { network, subaccountIndex, address } = this

    const endpoints = getNetworkEndpoints(network)
    const chainGrpcExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)
    const subaccountId =
      Address.fromBech32(address).getSubaccountId(subaccountIndex)

    return chainGrpcExchangeApi.fetchSubaccountTradeNonce(subaccountId)
  }

  private hashTypedData(eip712: any) {
    const bytesToHash = Buffer.concat([
      Buffer.from('19', 'hex'),
      Buffer.from('01', 'hex'),
      domainHash(eip712),
      messageHash(eip712),
    ])

    return '0x' + Buffer.from(keccak256(bytesToHash)).toString('hex')
  }
}
