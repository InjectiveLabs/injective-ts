import snakecaseKeys from 'snakecase-keys'
import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'
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
// the proto stores LegacyDec, i.e. the human-readable params scaled by 1e18
const chainProtoParams = {
  ...protoParams,
  newMinPriceTickSize: '100000000000',
  newMinQuantityTickSize: '10000000000000000000',
  newMinNotional: '0',
  newInitialMarginRatio: '50000000000000000',
  newMaintenanceMarginRatio: '50000000000000000',
  newReduceMarginRatio: '50000000000000000',
}
const message = MsgUpdateDerivativeMarketV2.fromJSON(params)
const newOpenNotionalCap: InjectiveExchangeV2MarketPb.OpenNotionalCap = {
  cap: {
    oneofKind: 'capped',
    capped: {
      value: '1000',
    },
  },
}

describe('MsgUpdateDerivativeMarketV2', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual(chainProtoParams)
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...chainProtoParams,
    })
  })

  it('generates proper amino', () => {
    expect(message.toAmino()).toMatchInlineSnapshot(`
      {
        "type": "exchange/v2/MsgUpdateDerivativeMarket",
        "value": {
          "admin": "inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku",
          "market_id": "0x7cc8b10d7deb61e744ef83bdec2bbcf4a056867e89b062c6a453020ca82bd4e4",
          "new_initial_margin_ratio": "50000000000000000",
          "new_maintenance_margin_ratio": "50000000000000000",
          "new_min_notional": "0",
          "new_min_price_tick_size": "100000000000",
          "new_min_quantity_tick_size": "10000000000000000000",
          "new_reduce_margin_ratio": "50000000000000000",
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

  it('supports newOpenNotionalCap', () => {
    const msgWithOpenNotionalCap = MsgUpdateDerivativeMarketV2.fromJSON({
      ...params,
      newOpenNotionalCap,
    })

    // LegacyDec in the proto: 1000 scaled by 1e18
    expect(msgWithOpenNotionalCap.toProto().newOpenNotionalCap).toStrictEqual({
      cap: {
        oneofKind: 'capped',
        capped: { value: '1000000000000000000000' },
      },
    })
    expect(
      (msgWithOpenNotionalCap.toWeb3Gw() as any).new_open_notional_cap,
    ).toStrictEqual({
      capped: {
        value: '1000',
      },
    })
    expect(
      (msgWithOpenNotionalCap.toEip712V2() as any).new_open_notional_cap,
    ).toStrictEqual({
      capped: {
        value: '1000.000000000000000000',
      },
    })
  })

  it('amino wraps newOpenNotionalCap with the chain amino.oneof_name', () => {
    const capped = MsgUpdateDerivativeMarketV2.fromJSON({
      ...params,
      newOpenNotionalCap,
    })
    const uncapped = MsgUpdateDerivativeMarketV2.fromJSON({
      ...params,
      newOpenNotionalCap: { cap: { oneofKind: 'uncapped', uncapped: {} } },
    })

    expect((capped.toAmino().value as any).new_open_notional_cap).toStrictEqual(
      {
        Cap: {
          type: 'exchange/v2/OpenNotionalCapCapped',
          value: { capped: { value: '1000000000000000000000' } },
        },
      },
    )
    expect(
      (uncapped.toAmino().value as any).new_open_notional_cap,
    ).toStrictEqual({
      Cap: {
        type: 'exchange/v2/OpenNotionalCapUncapped',
        value: { uncapped: {} },
      },
    })
  })

  it('toEip712 (v1) throws, use EIP712 v2', () => {
    expect(() => message.toEip712()).toThrow('Please use EIP712_v2')
  })

  describe('newReferencePriceGateConfig', () => {
    const newReferencePriceGateConfig: InjectiveExchangeV2MarketPb.ReferencePriceGateConfig =
      {
        referencePriceSource:
          InjectiveExchangeV2MarketPb.ReferencePriceSource.PYTH_EMA_LONG,
        referenceWindowSeconds: 60,
        maxOpenDeviationBps: 0,
      }
    const withGate = MsgUpdateDerivativeMarketV2.fromJSON({
      ...params,
      newReferencePriceGateConfig,
    })

    it('is a no-op (omitted / null) when unset', () => {
      expect(message.toProto().newReferencePriceGateConfig).toBeUndefined()
      expect(message.toAmino().value).not.toHaveProperty(
        'new_reference_price_gate_config',
      )
      expect(
        (message.toEip712V2() as any).new_reference_price_gate_config,
      ).toBe(null)
    })

    it('is sent in proto and binary', () => {
      expect(withGate.toProto().newReferencePriceGateConfig).toStrictEqual(
        newReferencePriceGateConfig,
      )
      expect(withGate.toBinary()).not.toStrictEqual(message.toBinary())
    })

    it('amino omits zero fields and uses an int enum', () => {
      expect(
        (withGate.toAmino().value as any).new_reference_price_gate_config,
      ).toStrictEqual({
        reference_price_source: 1,
        reference_window_seconds: 60,
      })
    })

    it('proto-JSON (web3Gw / EIP712 V2) uses the full enum name and keeps zeros', () => {
      const expected = {
        reference_price_source: 'REFERENCE_PRICE_SOURCE_PYTH_EMA_LONG',
        reference_window_seconds: 60,
        max_open_deviation_bps: 0,
      }

      expect(
        (withGate.toWeb3Gw() as any).new_reference_price_gate_config,
      ).toStrictEqual(expected)
      expect(
        (withGate.toEip712V2() as any).new_reference_price_gate_config,
      ).toStrictEqual(expected)
    })
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      // TODO: switch to Network.Mainnet after the v1.21 mainnet upgrade
      network: Network.Testnet,
      messages: message,
    })

    // the chain's EIP712 v1 typed-data generator rejects math.LegacyDec fields
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
