// import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { getEip712TypedData, getEip712TypedDataV2 } from '../../../tx/index.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import MsgSubmitProposalPerpetualMarketLaunchV2 from './MsgSubmitProposalPerpetualMarketLaunchV2.js'

const market = mockFactory.injUsdtDerivativeMarket

const params: MsgSubmitProposalPerpetualMarketLaunchV2['params'] = {
  market: {
    title: 'INJ/USDT PERP',
    description: 'Launch of INJ/USDT PERP perpetual market',
    ticker: market.ticker,
    oracleBase:
      '0xe62df6c8b4a85fe1a67db44dc12de5db330f7ac66b72dc658afedf0f4a415b43',
    oracleQuote:
      '0x2b89b9dc8fdf9f34709a5b106b472f0f39bb6ca9ce04b0fd7f2e971688e2e53b',
    oracleType: 9,
    oracleScaleFactor: 6,
    initialMarginRatio: '0.019231',
    maintenanceMarginRatio: '0.01',
    quoteDenom: market.quoteDenom,
    makerFeeRate: '-0.00005',
    takerFeeRate: '0.0005',
    minPriceTickSize: '0.001',
    minQuantityTickSize: '0.0001',
    minNotional: '1000000',
    adminInfo: {
      admin: mockFactory.injectiveAddress,
      adminPermissions: 1,
    },
    reduceMarginRatio: '0.01',
    crossMarginEligible: false,
  },
  proposer: mockFactory.injectiveAddress,
  deposit: {
    amount: '1000000000000000000',
    denom: 'inj',
  },
}

const message = MsgSubmitProposalPerpetualMarketLaunchV2.fromJSON(params)

describe('MsgSubmitProposalPerpetualMarketLaunchV2', () => {
  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
      // network: Network.TestnetSentry,
    })

    // EIP712 v1 is not supported for this message type - the chain returns:
    // "field uncapped within a oneof must have the amino.oneof_type_name option set"
    it.skip('EIP712 v1', async () => {
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
