import MsgSubmitProposalExpiryFuturesMarketLaunch from './MsgSubmitProposalExpiryFuturesMarketLaunch.js'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { getEip712TypedData, getEip712TypedDataV2 } from '../../../tx/index.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'

const params: MsgSubmitProposalExpiryFuturesMarketLaunch['params'] = {
  market: {
    title: 'INJ/USDT PERP',
    description: 'Launch of INJ/USDT PERP perpetual market',
    ticker: 'INJ/USDT PERP',
    oracleBase:
      '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    oracleQuote:
      '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b',
    oracleType: 9,
    oracleScaleFactor: 6,
    initialMarginRatio: '0.019231',
    maintenanceMarginRatio: '0.01',
    quoteDenom: 'peggy0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    makerFeeRate: '-0.00005',
    takerFeeRate: '0.0005',
    minPriceTickSize: '1000000',
    minQuantityTickSize: '0.0001',
    minNotional: '1000000',
    expiry: -1,
    adminInfo: {
      admin: mockFactory.injectiveAddress,
      adminPermissions: 0,
    },
  },
  proposer: mockFactory.injectiveAddress,
  deposit: {
    amount: '1000000000000000000',
    denom: 'inj',
  },
}

const message = MsgSubmitProposalExpiryFuturesMarketLaunch.fromJSON(params)

describe('MsgSubmitProposalExpiryFuturesMarketLaunch', () => {
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
