import snakecaseKeys from 'snakecase-keys'
import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgCreateDerivativeLimitOrderV2 from './MsgCreateDerivativeLimitOrderV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgCreateDerivativeLimitOrderV2['params'] = {
  feeRecipient: mockFactory.injectiveAddress2,
  injectiveAddress: mockFactory.injectiveAddress,
  margin: '75000000',
  marketId: mockFactory.injUsdtDerivativeMarket.marketId,
  orderType: 1,
  price: '1500000',
  quantity: '100',
  subaccountId: mockFactory.subaccountId,
  cid: 'test-cid',
  triggerPrice: '0',
}

const protoType = '/injective.exchange.v2.MsgCreateDerivativeLimitOrder'
const protoParams = {
  sender: params.injectiveAddress,
  order: {
    marketId: params.marketId,
    orderInfo: {
      feeRecipient: params.feeRecipient,
      price: params.price,
      quantity: params.quantity,
      subaccountId: params.subaccountId,
      cid: params.cid,
    },
    orderType: params.orderType,
    margin: params.margin,
    triggerPrice: params.triggerPrice,
  },
}
const formattedProtoParams = {
  ...protoParams,
  order: {
    ...protoParams.order,
    margin: '75000000000000000000000000',
    orderInfo: {
      ...protoParams.order.orderInfo,
      price: '1500000000000000000000000',
      quantity: '100000000000000000000',
    },
    expirationBlock: BigInt(0),
  },
}
const protoParamsAmino = {
  ...snakecaseKeys(protoParams),
  order: {
    ...snakecaseKeys(protoParams).order,
    expiration_block: '0',
  },
}
const message = MsgCreateDerivativeLimitOrderV2.fromJSON(params)

describe('MsgCreateDerivativeLimitOrderV2', () => {
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
        "type": "exchange/v2/MsgCreateDerivativeLimitOrder",
        "value": {
          "order": {
            "margin": "75000000000000000000000000",
            "market_id": "0x7cc8b10d7deb61e744ef83bdec2bbcf4a056867e89b062c6a453020ca82bd4e4",
            "order_info": {
              "cid": "test-cid",
              "fee_recipient": "inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku",
              "price": "1500000000000000000000000",
              "quantity": "100000000000000000000",
              "subaccount_id": "0xaf79152ac5df276d9a8e1e2e22822f9713474902000000000000000000000000",
            },
            "order_type": 1,
            "trigger_price": "0",
          },
          "sender": "inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku",
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

  it('round-trips expirationBlock through proto and amino', () => {
    const msgWithExpiry = MsgCreateDerivativeLimitOrderV2.fromJSON({
      ...params,
      expirationBlock: '100',
    })

    const proto = msgWithExpiry.toProto()
    expect(proto.order!.expirationBlock).toStrictEqual(BigInt(100))

    const amino = msgWithExpiry.toAmino()
    expect(amino.value.order.expiration_block).toStrictEqual('100')
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

    it('EIP712 v1', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V1,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
      expect(message.toAmino()).toStrictEqual(
        JSON.parse(txResponse.data).message.msgs[0],
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

    // the chain omits an empty cid from the v1 typed data and keeps expiration_block of a
    // good-till-block order, in both the types and the values
    it('EIP712 v1 matches the gateway for an empty cid and a good-till-block order', async () => {
      const variant = MsgCreateDerivativeLimitOrderV2.fromJSON({
        ...params,
        cid: '',
        expirationBlock: '123456789',
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
