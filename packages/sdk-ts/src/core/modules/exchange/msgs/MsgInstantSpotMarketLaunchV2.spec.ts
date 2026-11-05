import { Network } from '@injectivelabs/networks'
import { toChainFormat } from '@injectivelabs/utils'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgInstantSpotMarketLaunchV2 from './MsgInstantSpotMarketLaunchV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const market = mockFactory.injUsdtSpotMarket

const params: MsgInstantSpotMarketLaunchV2['params'] = {
  proposer: mockFactory.injectiveAddress,
  market: {
    minNotional: '1',
    ticker: market.ticker,
    baseDenom: market.baseDenom,
    quoteDenom: market.quoteDenom,
    baseDecimals: market.baseToken.decimals,
    quoteDecimals: market.quoteToken.decimals,
    minPriceTickSize: market.minPriceTickSize,
    minQuantityTickSize: market.minQuantityTickSize,
  },
}

const protoType = '/injective.exchange.v2.MsgInstantSpotMarketLaunch'
const protoTypeShort = 'exchange/v2/MsgInstantSpotMarketLaunch'
const message = MsgInstantSpotMarketLaunchV2.fromJSON(params)

describe('MsgInstantSpotMarketLaunchV2', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto.sender).toStrictEqual(params.proposer)
    expect(proto.ticker).toStrictEqual(params.market.ticker)
    expect(proto.baseDenom).toStrictEqual(params.market.baseDenom)
    expect(proto.quoteDenom).toStrictEqual(params.market.quoteDenom)
    // params are human-readable, the proto stores LegacyDec (scaled by 1e18)
    expect(proto.minPriceTickSize).toStrictEqual(
      toChainFormat(params.market.minPriceTickSize).toFixed(),
    )
    expect(proto.minQuantityTickSize).toStrictEqual(
      toChainFormat(params.market.minQuantityTickSize).toFixed(),
    )
    expect(proto.minNotional).toStrictEqual('1000000000000000000')
  })

  it('converts human-readable decimals to LegacyDec wire values', () => {
    const proto = MsgInstantSpotMarketLaunchV2.fromJSON({
      ...params,
      market: {
        ...params.market,
        minPriceTickSize: '0.0000001',
        minQuantityTickSize: '10',
        minNotional: '0.5',
      },
    }).toProto()

    expect(proto.minPriceTickSize).toBe('100000000000')
    expect(proto.minQuantityTickSize).toBe('10000000000000000000')
    expect(proto.minNotional).toBe('500000000000000000')
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data['@type']).toStrictEqual(protoType)
    expect(data.sender).toStrictEqual(params.proposer)
    expect(data.ticker).toStrictEqual(params.market.ticker)
    expect(data.minPriceTickSize).toStrictEqual(
      toChainFormat(params.market.minPriceTickSize).toFixed(),
    )
    expect(data.minQuantityTickSize).toStrictEqual(
      toChainFormat(params.market.minQuantityTickSize).toFixed(),
    )
    expect(data.minNotional).toStrictEqual('1000000000000000000')
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino.type).toStrictEqual(protoTypeShort)
    expect(amino.value.sender).toStrictEqual(params.proposer)
    expect(amino.value.ticker).toStrictEqual(params.market.ticker)
    expect(amino.value.base_denom).toStrictEqual(params.market.baseDenom)
    expect(amino.value.quote_denom).toStrictEqual(params.market.quoteDenom)
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3['@type']).toStrictEqual(protoType)
    expect(web3.sender).toStrictEqual(params.proposer)
    expect(web3.ticker).toStrictEqual(params.market.ticker)
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      // TODO: switch to Network.Mainnet after the v1.21 mainnet upgrade
      network: Network.Testnet,
      messages: message,
    })

    it('EIP712 v1 throws, use EIP712 v2', () => {
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
  })
})
