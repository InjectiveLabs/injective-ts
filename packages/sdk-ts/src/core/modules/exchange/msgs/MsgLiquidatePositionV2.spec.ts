import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgLiquidatePositionV2 from './MsgLiquidatePositionV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const market = mockFactory.injUsdtDerivativeMarket

const params: MsgLiquidatePositionV2['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  subaccountId: mockFactory.subaccountId,
  marketId: market.marketId,

  order: {
    subaccountId: mockFactory.subaccountId,
    feeRecipient: mockFactory.injectiveAddress,
    price: '1765000',
    quantity: '100',
    marketId: market.marketId,
    orderType: 1 /** buy */,
    margin: '88250000',
    cid: 'test-cid',
  },
}

const protoType = '/injective.exchange.v2.MsgLiquidatePosition'

const protoOrder = {
  marketId: market.marketId,
  orderInfo: {
    subaccountId: params.order!.subaccountId,
    feeRecipient: params.order!.feeRecipient,
    price: '1765000000000000000000000',
    quantity: '100000000000000000000',
    cid: params.order!.cid,
  },
  orderType: params.order!.orderType,
  margin: '88250000000000000000000000',
  triggerPrice: '0',
  expirationBlock: BigInt(0),
}
const formattedProtoParams = {
  sender: params.injectiveAddress,
  subaccountId: params.subaccountId,
  marketId: market.marketId,
  order: protoOrder,
}
const protoParamsAmino = {
  sender: params.injectiveAddress,
  subaccount_id: params.subaccountId,
  market_id: market.marketId,
  order: {
    market_id: market.marketId,
    order_info: {
      subaccount_id: params.order!.subaccountId,
      fee_recipient: params.order!.feeRecipient,
      price: params.order!.price,
      quantity: params.order!.quantity,
      cid: params.order!.cid,
    },
    order_type: params.order!.orderType,
    margin: params.order!.margin,
    trigger_price: '0',
    expiration_block: '0',
  },
}

const message = MsgLiquidatePositionV2.fromJSON(params)

describe('MsgLiquidatePositionV2', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual(formattedProtoParams)
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...formattedProtoParams,
    })
  })

  it('generates proper amino', () => {
    expect(message.toAmino()).toMatchInlineSnapshot(`
      {
        "type": "exchange/v2/MsgLiquidatePosition",
        "value": {
          "market_id": "0x7cc8b10d7deb61e744ef83bdec2bbcf4a056867e89b062c6a453020ca82bd4e4",
          "order": {
            "margin": "88250000000000000000000000",
            "market_id": "0x7cc8b10d7deb61e744ef83bdec2bbcf4a056867e89b062c6a453020ca82bd4e4",
            "order_info": {
              "cid": "test-cid",
              "fee_recipient": "inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku",
              "price": "1765000000000000000000000",
              "quantity": "100000000000000000000",
              "subaccount_id": "0xaf79152ac5df276d9a8e1e2e22822f9713474902000000000000000000000000",
            },
            "order_type": 1,
            "trigger_price": "0",
          },
          "sender": "inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku",
          "subaccount_id": "0xaf79152ac5df276d9a8e1e2e22822f9713474902000000000000000000000000",
        },
      }
    `)
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
  })

  it('EIP712 v1 values and type equal the amino-json of the proto', () => {
    const eip712 = message.toEip712()
    const amino = message.toAmino()

    expect(eip712.type).toBe(amino.type)
    expect(eip712.value).toStrictEqual(amino.value)
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      // TODO: switch to Network.Mainnet after the v1.21 mainnet upgrade
      network: Network.Testnet,
      messages: message,
    })

    it('EIP712 v1 rejects an omitted expiration_block', () => {
      expect(() => getEip712TypedData(eip712Args)).toThrow(
        'Please use EIP712_v2',
      )
    })

    it('EIP712 v2', async () => {
      const eip712TypedData = getEip712TypedDataV2(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V2,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })

    it('EIP712 v1 matches the gateway for an empty cid and a good-till-block order', async () => {
      const variant = MsgLiquidatePositionV2.fromJSON({
        ...params,
        order: {
          ...(params.order as NonNullable<typeof params.order>),
          cid: '',
          expirationBlock: '123456789',
        },
      })
      const { eip712Args: variantArgs, prepareEip712Request: variantRequest } =
        prepareEip712({ network: Network.Testnet, messages: variant })
      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...variantRequest,
        eip712Version: EIP712Version.V1,
      })

      expect(getEip712TypedData(variantArgs)).toStrictEqual(
        JSON.parse(txResponse.data),
      )
    })
  })
})
