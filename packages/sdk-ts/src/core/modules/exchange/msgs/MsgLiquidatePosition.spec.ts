import MsgLiquidatePosition from './MsgLiquidatePosition.js'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'

const market = mockFactory.injUsdtSpotMarket

const params: MsgLiquidatePosition['params'] = {
  subaccountId: mockFactory.subaccountId,
  injectiveAddress: mockFactory.injectiveAddress,
  marketId: market.marketId,

  // todo: currently, we have to pass all optional fields to generate the correct EIP712_v1
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

const message = MsgLiquidatePosition.fromJSON(params)

describe('MsgLiquidatePosition', () => {
  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
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
  })
})
