import * as CosmwasmWasmV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/tx_pb'
import * as GoogleProtobufAnyPbPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb'
import * as CosmosGovV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1beta1/tx_pb'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2AuthzPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/authz_pb'
import * as InjectiveExchangeV2MarketPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/market_pb'
import * as InjectiveExchangeV2ProposalPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/proposal_pb'
import * as InjectiveTxfeesV1Beta1TxfeesPb from '@injectivelabs/core-proto-ts-v2/generated/injective/txfees/v1beta1/txfees_pb'
import { toAminoJson } from './toAminoJson.js'

/**
 * The expected JSON below was produced by the chain's own encoder
 * (cosmossdk.io/x/tx/signing/aminojson, Injective fork v0.50.15-inj.2) run over a
 * descriptor with the same field options as injective.exchange.v2.PerpetualMarketLaunchProposal.
 */
const goldenUncapped = {
  type: 'exchange/v2/PerpetualMarketLaunchProposal',
  value: {
    description: 'desc',
    initial_margin_ratio: '19231000000000000',
    maintenance_margin_ratio: '10000000000000000',
    maker_fee_rate: '-1000000000000000',
    min_notional: '0',
    min_price_tick_size: '1000000000000000',
    min_quantity_tick_size: '1000000000000000',
    open_notional_cap: {
      Cap: {
        type: 'exchange/v2/OpenNotionalCapUncapped',
        value: { uncapped: {} },
      },
    },
    oracle_base: 'BTC',
    oracle_quote: 'USDT',
    oracle_scale_factor: 6,
    oracle_type: 9,
    quote_denom: 'peggy0xdAC17F958D2ee523a2206206994597C13D831ec7',
    reduce_margin_ratio: '3000000000000000000',
    taker_fee_rate: '2000000000000000',
    ticker: 'BTC/USDT PERP',
    title: 'Launch BTC/USDT PERP',
  },
}

const goldenCapped = {
  type: 'exchange/v2/PerpetualMarketLaunchProposal',
  value: {
    ...goldenUncapped.value,
    admin_info: { admin: 'inj1abc', admin_permissions: 1 },
    cross_margin_eligible: true,
    open_notional_cap: {
      Cap: {
        type: 'exchange/v2/OpenNotionalCapCapped',
        value: { capped: { value: '1000000000000000000000' } },
      },
    },
    synthetic_trade_fee_rate: '1000000000000000',
  },
}

const base = {
  title: 'Launch BTC/USDT PERP',
  description: 'desc',
  ticker: 'BTC/USDT PERP',
  quoteDenom: 'peggy0xdAC17F958D2ee523a2206206994597C13D831ec7',
  oracleBase: 'BTC',
  oracleQuote: 'USDT',
  oracleScaleFactor: 6,
  oracleType: 9,
  initialMarginRatio: '19231000000000000',
  maintenanceMarginRatio: '10000000000000000',
  makerFeeRate: '-1000000000000000',
  takerFeeRate: '2000000000000000',
  minPriceTickSize: '1000000000000000',
  minQuantityTickSize: '1000000000000000',
  minNotional: '0',
  reduceMarginRatio: '3000000000000000000',
}

const Perp = InjectiveExchangeV2ProposalPb.PerpetualMarketLaunchProposal

describe('toAminoJson (matches the chain aminojson encoder)', () => {
  it('uncapped market: omits empty/false/unset fields, keeps non-empty Dec strings', () => {
    const msg = Perp.create({
      ...base,
      openNotionalCap: { cap: { oneofKind: 'uncapped', uncapped: {} } },
    })

    expect(toAminoJson(Perp, msg)).toStrictEqual(goldenUncapped)
  })

  it('capped market with admin, cross margin and synthetic fee', () => {
    const msg = Perp.create({
      ...base,
      openNotionalCap: {
        cap: {
          oneofKind: 'capped',
          capped: { value: '1000000000000000000000' },
        },
      },
      adminInfo: { admin: 'inj1abc', adminPermissions: 1 },
      crossMarginEligible: true,
      syntheticTradeFeeRate: '1000000000000000',
    })

    expect(toAminoJson(Perp, msg)).toStrictEqual(goldenCapped)
  })

  it('omits an absent message and emits a present message with an unset oneof as `Cap: null` (chain behaviour)', () => {
    const absent = InjectiveExchangeV2TxPb.MsgUpdateDerivativeMarket.create({
      admin: 'inj1abc',
      marketId: '0xmarket',
    })
    const unsetOneof = InjectiveExchangeV2TxPb.MsgUpdateDerivativeMarket.create(
      {
        admin: 'inj1abc',
        marketId: '0xmarket',
        newOpenNotionalCap:
          InjectiveExchangeV2MarketPb.OpenNotionalCap.create(),
      },
    )

    expect(
      toAminoJson(InjectiveExchangeV2TxPb.MsgUpdateDerivativeMarket, absent)
        .value,
    ).toStrictEqual({ admin: 'inj1abc', market_id: '0xmarket' })
    expect(
      toAminoJson(InjectiveExchangeV2TxPb.MsgUpdateDerivativeMarket, unsetOneof)
        .value,
    ).toStrictEqual({
      admin: 'inj1abc',
      market_id: '0xmarket',
      new_open_notional_cap: { Cap: null },
    })
  })

  it('encodes enums as numbers, 64-bit ints as strings and omits zero values', () => {
    const msg = InjectiveExchangeV2TxPb.MsgUpdateDerivativeMarket.create({
      admin: 'inj1abc',
      marketId: '0xmarket',
      newReferencePriceGateConfig: {
        referencePriceSource:
          InjectiveExchangeV2MarketPb.ReferencePriceSource.PYTH_EMA_LONG,
        referenceWindowSeconds: 60,
        maxOpenDeviationBps: 0,
      },
    })

    expect(
      toAminoJson(InjectiveExchangeV2TxPb.MsgUpdateDerivativeMarket, msg).value,
    ).toStrictEqual({
      admin: 'inj1abc',
      market_id: '0xmarket',
      new_reference_price_gate_config: {
        reference_price_source: 1,
        reference_window_seconds: 60,
      },
    })
  })

  it('wraps google.protobuf.Any content with its amino.name', () => {
    const content = Perp.create({
      ...base,
      openNotionalCap: { cap: { oneofKind: 'uncapped', uncapped: {} } },
    })
    const proposal = CosmosGovV1Beta1TxPb.MsgSubmitProposal.create({
      content: GoogleProtobufAnyPbPb.Any.create({
        typeUrl: '/injective.exchange.v2.PerpetualMarketLaunchProposal',
        value: Perp.toBinary(content),
      }),
      initialDeposit: [{ denom: 'inj', amount: '1' }],
      proposer: 'inj1abc',
    })

    expect(
      toAminoJson(CosmosGovV1Beta1TxPb.MsgSubmitProposal, proposal, {
        '/injective.exchange.v2.PerpetualMarketLaunchProposal': Perp,
      }),
    ).toStrictEqual({
      type: 'cosmos-sdk/MsgSubmitProposal',
      value: {
        content: goldenUncapped,
        initial_deposit: [{ denom: 'inj', amount: '1' }],
        proposer: 'inj1abc',
      },
    })
  })

  it('throws on an Any it cannot resolve instead of signing the wrong bytes', () => {
    const proposal = CosmosGovV1Beta1TxPb.MsgSubmitProposal.create({
      content: GoogleProtobufAnyPbPb.Any.create({
        typeUrl: '/unknown.Type',
        value: new Uint8Array(),
      }),
    })

    expect(() =>
      toAminoJson(CosmosGovV1Beta1TxPb.MsgSubmitProposal, proposal),
    ).toThrow('unknown Any type')
  })

  describe('amino options', () => {
    it('legacy_coins + dont_omitempty: an empty spend_limit is written as []', () => {
      const authz =
        InjectiveExchangeV2AuthzPb.GenericExchangeAuthorization.create({
          msg: '/injective.exchange.v2.MsgDeposit',
        })

      expect(
        toAminoJson(
          InjectiveExchangeV2AuthzPb.GenericExchangeAuthorization,
          authz,
        ).value,
      ).toStrictEqual({
        msg: '/injective.exchange.v2.MsgDeposit',
        spend_limit: [],
      })
    })

    it('cosmos.Int scalar + dont_omitempty: an empty coin amount is "0"', () => {
      const deposit = InjectiveExchangeV2TxPb.MsgDeposit.create({
        sender: 'inj1abc',
        subaccountId: '0xsub',
        amount: { denom: 'inj', amount: '' },
      })

      expect(
        toAminoJson(InjectiveExchangeV2TxPb.MsgDeposit, deposit).value.amount,
      ).toStrictEqual({ denom: 'inj', amount: '0' })
    })
  })

  describe('refuses amino options it does not implement (instead of signing wrong bytes)', () => {
    it('amino.encoding other than legacy_coins (inline_json on wasm msg)', () => {
      expect(() =>
        toAminoJson(
          CosmwasmWasmV1TxPb.MsgExecuteContract,
          CosmwasmWasmV1TxPb.MsgExecuteContract.create(),
        ),
      ).toThrow(/amino\.encoding=inline_json/)
    })

    it('cosmos.Dec scalar (txfees)', () => {
      expect(() =>
        toAminoJson(
          InjectiveTxfeesV1Beta1TxfeesPb.Params,
          InjectiveTxfeesV1Beta1TxfeesPb.Params.create(),
        ),
      ).toThrow(/cosmos_proto\.scalar=cosmos\.Dec/)
    })
  })
})
