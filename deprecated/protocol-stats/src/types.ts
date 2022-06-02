/* eslint-disable camelcase */
export interface SubaccountDepositsResponse {
  deposits: Record<string, { available_balance: string; total_balance: string }>
}

export interface AccountsResponse {
  accounts: {
    '@type': string
    code_hash: string
    base_account: {
      address: string
      account_number: string
      sequence: string
      pub_key: {
        '@type': string
        key: string
      }
    }
  }[]
  pagination: {
    nextKey?: string
    total: string
  }
}

export interface SupplyResponse {
  supply: { denom: string; amount: string }[]
}

export interface PoolResponse {
  pool: {
    not_bonded_tokens: string | number
    bonded_tokens: string | number
  }
}

export interface ValidatorsResponse {
  validators: {
    operator_address: string
    consensus_pubkey: {
      '@type': string
      key: string
    }
    jailed: boolean
    status: string
    tokens: string
    delegator_shares: string
    description: {
      moniker: string
      identity: string
      website: string
      security_contact: string
      details: string
    }
    unbonding_height: string
    unbonding_time: string
    commission: {
      commission_rates: {
        rate: string
        max_rate: string
        max_change_rate: string
      }
      update_time: string
    }
    min_self_delegation: string
  }[]
  pagination: {
    nextKey?: string
    total: string
  }
}

export interface ValidatorDelegationsResponse {
  delegation_responses: {
    delegation: {
      delegator_address: string
      validator_address: string
      shares: string
    }
    balance: {
      denom: string
      amount: string
    }
  }[]
  pagination: {
    nextKey?: string
    total: string
  }
}

export interface DerivativeMarketsResponse {
  markets: {
    market: {
      ticker: string
      oracle_base: string
      oracle_quote: string
      oracle_type: string
      oracle_scale_factor: string
      quote_denom: string
      market_id: string
      initial_margin_ratio: string
      maintenance_margin_ratio: string
      maker_fee_rate: string
      taker_fee_rate: string
      relayer_fee_share_rate: string
      isPerpetual: boolean
      status: string
      min_price_tick_size: string
      min_quantity_tick_size: string
      mark_price: string
      perpetual_info: {
        market_info: {
          market_id: string
          hourly_funding_rate_cap: string
          hourly_interest_rate: string
          next_funding_timestamp: string
          funding_interval: string
        }
        funding_info: {
          cumulative_funding: string
          cumulative_price: string
          last_timestamp: string
        }
      }
    }
  }[]
}

export interface DerivativeMarketPositionsResponse {
  state: {
    subaccount_id: string
    market_id: string
    position: {
      isLong: boolean
      quantity: string
      entry_price: string
      margin: string
      cumulative_funding_entry: string
    }
  }[]
}

export interface DenomTraceResponse {
  denom_trace: {
    path: string
    base_denom: string
  }
}

export interface DenomTracesResponse {
  denom_traces: [
    {
      path: string
      base_denom: string
    },
  ]
  pagination: {
    nextKey: string
    total: string
  }
}

export interface Token {
  denom: string
  amount: string
  icon: string
  symbol: string
  name: string
  decimals: number
  address: string
  coinGeckoId: string
}

export interface TokenWithUsdPrice extends Token {
  priceInUsd: number
}
