import snakecaseKeys from 'snakecase-keys'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectiveExchangeV2ProposalPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/proposal_pb'
import MsgUpdateDerivativeMarketV2 from './MsgUpdateDerivativeMarketV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgUpdateDerivativeMarketV2['params'] = {
  admin: mockFactory.injectiveAddress,
  marketId: mockFactory.injUsdtDerivativeMarket.marketId,
  newMinPriceTickSize: '0.0000001',
  newMinNotional: '0',
  newMinQuantityTickSize: '10',
  newInitialMarginRatio: '0.05',
  newMaintenanceMarginRatio: '0.05',
  newReduceMarginRatio: '0.05',
}

const protoType = '/injective.exchange.v2.MsgUpdateDerivativeMarket'
const protoTypeShort = 'exchange/MsgUpdateDerivativeMarket'
const protoParams = {
  admin: params.admin,
  marketId: params.marketId,
  newMinPriceTickSize: '0.0000001',
  newMinQuantityTickSize: '10',
  newMinNotional: '0',
  newTicker: '',
  newInitialMarginRatio: '0.05',
  newMaintenanceMarginRatio: '0.05',
  newReduceMarginRatio: '0.05',
  crossMarginEligibility:
    InjectiveExchangeV2ProposalPb.CrossMarginEligibility
      .CM_ELIGIBILITY_UNSPECIFIED,
}
const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgUpdateDerivativeMarketV2.fromJSON(params)

describe('MsgUpdateDerivativeMarketV2', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual({
      ...protoParams,
      newMinPriceTickSize: '100000000000',
      newMinQuantityTickSize: '10000000000000000000',
      newInitialMarginRatio: '50000000000000000',
      newMaintenanceMarginRatio: '50000000000000000',
      newReduceMarginRatio: '50000000000000000',
    })
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParams,
      newMinPriceTickSize: '100000000000',
      newMinQuantityTickSize: '10000000000000000000',
      newInitialMarginRatio: '50000000000000000',
      newMaintenanceMarginRatio: '50000000000000000',
      newReduceMarginRatio: '50000000000000000',
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeShort,
      value: protoParamsAmino,
    })
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    // TODO: invalid Go type math.LegacyDec for field injective.exchange.v1beta1.MsgUpdateSpotMarket.amount
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
