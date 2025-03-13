import MsgInstantBinaryOptionsMarketLaunch from './MsgInstantBinaryOptionsMarketLaunch.js'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'

const params: MsgInstantBinaryOptionsMarketLaunch['params'] = {
  proposer: mockFactory.injectiveAddress,
  market: {
    ticker: 'INJ/USDT',
    admin: mockFactory.injectiveAddress,
    oracleSymbol: 'INJ/USDT',
    oracleProvider: 'provider',
    oracleScaleFactor: 6,
    quoteDenom: 'peggy0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    minPriceTickSize: '0.000000000000001',
    minQuantityTickSize: '1000000000000000',
    makerFeeRate: '-0.00005',
    takerFeeRate: '0.0005',
    minNotional: '1000000',
    oracleType: 7,
    expirationTimestamp: 1713177600,
    settlementTimestamp: 1713177600,
  },
}

const message = MsgInstantBinaryOptionsMarketLaunch.fromJSON(params)

describe('MsgInstantBinaryOptionsMarketLaunch', () => {
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
