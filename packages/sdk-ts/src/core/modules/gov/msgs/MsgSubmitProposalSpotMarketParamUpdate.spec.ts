import MsgSubmitProposalSpotMarketParamUpdate from './MsgSubmitProposalSpotMarketParamUpdate.js'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'
import { GrpcMarketStatusMap } from './../../../../client/index.js'

const params: MsgSubmitProposalSpotMarketParamUpdate['params'] = {
  market: {
    marketId: '0x',
    title: 'INJ/USDT',
    description: 'Launch of INJ/USDT spot market',
    ticker: 'INJ/USDT',
    status: GrpcMarketStatusMap.Active,
    minPriceTickSize: '0.000000000000001',
    minQuantityTickSize: '1000000000000000',
    makerFeeRate: '-0.00005',
    minNotional: '1000000',
    takerFeeRate: '0.0005',
    relayerFeeShareRate: '0.0005',
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

const message = MsgSubmitProposalSpotMarketParamUpdate.fromJSON(params)

describe('MsgSubmitProposalSpotMarketParamUpdate', () => {
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
