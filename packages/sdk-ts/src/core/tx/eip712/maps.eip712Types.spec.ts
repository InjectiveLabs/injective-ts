import { objectKeysToEip712Types } from './maps.js'

const typesOf = (
  object: Record<string, unknown>,
  messageType: string,
  name: string,
) =>
  Object.fromEntries(
    (
      objectKeysToEip712Types({ object, messageType }).get(name) as {
        name: string
        type: string
      }[]
    ).map((field) => [field.name, field.type]),
  )

// EIP712 v1 typing of the v1.21 fields (the parity tests that would cover them are skipped)
describe('objectKeysToEip712Types (chain v1.21 fields)', () => {
  it('types permissions owner_blacklist_query_max_gas as uint64', () => {
    expect(
      typesOf(
        {
          authority: 'inj1',
          params: {
            contract_hook_max_gas: '50000',
            owner_blacklist_query_max_gas: '200000',
          },
        },
        'permissions/MsgUpdateParams',
        'TypeParams',
      ),
    ).toStrictEqual({
      contract_hook_max_gas: 'uint64',
      owner_blacklist_query_max_gas: 'uint64',
    })
  })

  it('types the reference price gate config (int32 enum, uint32 window and bps)', () => {
    expect(
      typesOf(
        {
          admin: 'inj1',
          new_reference_price_gate_config: {
            reference_price_source: 1,
            reference_window_seconds: 60,
            max_open_deviation_bps: 25,
          },
        },
        'exchange/v2/MsgUpdateDerivativeMarket',
        'TypeNewReferencePriceGateConfig',
      ),
    ).toStrictEqual({
      reference_price_source: 'int32',
      reference_window_seconds: 'uint32',
      max_open_deviation_bps: 'uint32',
    })
  })

  it('types the decimals of the V2 instant spot market launch as uint32', () => {
    expect(
      typesOf(
        { sender: 'inj1', base_decimals: 18, quote_decimals: 6 },
        'exchange/v2/MsgInstantSpotMarketLaunch',
        'MsgValue',
      ),
    ).toMatchObject({ base_decimals: 'uint32', quote_decimals: 'uint32' })
  })
})
