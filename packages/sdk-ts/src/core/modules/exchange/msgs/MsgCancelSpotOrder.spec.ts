import MsgCancelSpotOrder from './MsgCancelSpotOrder'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { IndexerGrpcWeb3GwApi } from '../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import snakecaseKeys from 'snakecase-keys'
import { getEip712TypedData, getEip712TypedDataV2 } from '../../../tx/index.js'

const params: MsgCancelSpotOrder['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  marketId: mockFactory.injUsdtSpotMarket.marketId,
  orderHash: mockFactory.orderHash,
  subaccountId: mockFactory.subaccountId,
  cid: 'order-123',
}

const protoType = '/injective.exchange.v1beta1.MsgCancelSpotOrder'
const protoTypeShort = 'exchange/MsgCancelSpotOrder'
const protoParams = {
  sender: params.injectiveAddress,
  marketId: params.marketId,
  orderHash: params.orderHash,
  subaccountId: params.subaccountId,
  cid: params.cid,
}
const protoParamsAmino = snakecaseKeys(protoParams)

const message = MsgCancelSpotOrder.fromJSON(params)

describe('MsgCancelSpotOrder', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual(protoParams)
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParams,
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeShort,
      value: protoParamsAmino,
    })
  })

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      MsgValue: [
        { name: 'sender', type: 'string' },
        { name: 'market_id', type: 'string' },
        { name: 'subaccount_id', type: 'string' },
        { name: 'order_hash', type: 'string' },
        { name: 'cid', type: 'string' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: protoTypeShort,
      value: protoParamsAmino,
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      sequence: 0,
      accountNumber: 3,
      messages: message,
    })

    // TODO
    it.skip('EIP712 v1', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: 'v1',
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })

    it('EIP712 v2', async () => {
      const eip712TypedData = getEip712TypedDataV2(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({ ...prepareEip712Request, eip712Version: 'v2' })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })
  })
})
