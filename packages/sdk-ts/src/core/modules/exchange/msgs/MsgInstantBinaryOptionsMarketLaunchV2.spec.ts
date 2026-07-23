import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import MsgInstantBinaryOptionsMarketLaunchV2 from './MsgInstantBinaryOptionsMarketLaunchV2.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgInstantBinaryOptionsMarketLaunchV2['params'] = {
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

const message = MsgInstantBinaryOptionsMarketLaunchV2.fromJSON(params)
const openNotionalCap: InjectiveExchangeV2MarketPb.OpenNotionalCap = {
  cap: {
    oneofKind: 'capped',
    capped: {
      value: '1000',
    },
  },
}

describe('MsgInstantBinaryOptionsMarketLaunchV2', () => {
  it('generates proper proto with human-readable decimals', () => {
    const proto = message.toProto()

    expect(proto.sender).toStrictEqual(params.proposer)
    expect(proto.minPriceTickSize).toStrictEqual(params.market.minPriceTickSize)
    expect(proto.minQuantityTickSize).toStrictEqual(
      params.market.minQuantityTickSize,
    )
    expect(proto.minNotional).toStrictEqual(params.market.minNotional)
    expect(proto.makerFeeRate).toStrictEqual(params.market.makerFeeRate)
    expect(proto.takerFeeRate).toStrictEqual(params.market.takerFeeRate)
  })

  it('supports openNotionalCap', () => {
    const msgWithOpenNotionalCap =
      MsgInstantBinaryOptionsMarketLaunchV2.fromJSON({
        ...params,
        market: {
          ...params.market,
          openNotionalCap,
        },
      })

    expect(msgWithOpenNotionalCap.toProto().openNotionalCap).toStrictEqual(
      openNotionalCap,
    )
    expect(
      (msgWithOpenNotionalCap.toWeb3Gw() as any).open_notional_cap,
    ).toStrictEqual({
      capped: {
        value: '1000',
      },
    })
    expect(
      (msgWithOpenNotionalCap.toEip712V2() as any).open_notional_cap,
    ).toStrictEqual({
      capped: {
        value: '1000.000000000000000000',
      },
    })
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    // not supported on chain (invalid Go type math.LegacyDec for maker_fee_rate)
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
