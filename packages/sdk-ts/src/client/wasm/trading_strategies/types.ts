import {
  ExitConfig,
  ExitType,
  StrategyType,
  TrailingArithmetic,
} from '../../../core/modules/wasm/types'

export type QueryTradingStrategyContractSrategyResponse = {
  user: string
  subaccount_id: string
  info: {
    lower_bound: string
    upper_bound: string
    levels: number
    prices: string[]
  }
  stop_loss?: ExitConfig
  take_profit?: ExitConfig
  target_value_per_order: string
  exit_type: ExitType
  order_state: {
    buy_orders: number
    sell_orders: number
    omit_order: 'buy' | 'sell'
  }
  retry_count: number
  strategy_type: StrategyType | TrailingArithmetic
}

export type QueryTradingStrategyContractConfigResponse = {
  owner: string
  base_decimals: number
  quote_decimals: number
  market_id: string
  small_order_threshold: string
  maximum_order_value_deviation: string
  maximum_rebalance_retries: number
  default_slippage: string
  version: string
}
