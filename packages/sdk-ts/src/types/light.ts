export const TradeExecutionType = {
  Market: 'market',
  LimitFill: 'limitFill',
  LimitMatchRestingOrder: 'limitMatchRestingOrder',
  LimitMatchNewOrder: 'limitMatchNewOrder',
} as const

export type TradeExecutionType =
  (typeof TradeExecutionType)[keyof typeof TradeExecutionType]

export const TradeExecutionSide = {
  Maker: 'maker',
  Taker: 'taker',
} as const

export type TradeExecutionSide =
  (typeof TradeExecutionSide)[keyof typeof TradeExecutionSide]

export const TradeDirection = {
  Buy: 'buy',
  Sell: 'sell',
  Long: 'long',
  Short: 'short',
} as const

export type TradeDirection =
  (typeof TradeDirection)[keyof typeof TradeDirection]

export const OrderState = {
  Unfilled: 'unfilled',
  Booked: 'booked',
  PartialFilled: 'partial_filled',
  PartiallyFilled: 'partially_filled',
  Filled: 'filled',
  Canceled: 'canceled',
  Triggered: 'triggered',
} as const

export type OrderState = (typeof OrderState)[keyof typeof OrderState]

export const OrderSide = {
  Unspecified: 'unspecified',
  Buy: 'buy',
  Sell: 'sell',
  StopBuy: 'stop_buy',
  StopSell: 'stop_sell',
  TakeBuy: 'take_buy',
  TakeSell: 'take_sell',
  BuyPO: 'buy_po',
  SellPO: 'sell_po',
  BuyAtomic: 'buy_atomic',
  SellAtomic: 'sell_atomic',
  Unrecognized: 'unrecognized',
} as const

export type OrderSide = (typeof OrderSide)[keyof typeof OrderSide]

export const GrpcOrderTypeMap = {
  0: 'UNSPECIFIED',
  1: 'BUY',
  2: 'SELL',
  3: 'STOP_BUY',
  4: 'STOP_SELL',
  5: 'TAKE_BUY',
  6: 'TAKE_SELL',
  7: 'BUY_PO',
  8: 'SELL_PO',
  9: 'BUY_ATOMIC',
  10: 'SELL_ATOMIC',
  UNSPECIFIED: 0,
  BUY: 1,
  SELL: 2,
  STOP_BUY: 3,
  STOP_SELL: 4,
  TAKE_BUY: 5,
  TAKE_SELL: 6,
  BUY_PO: 7,
  SELL_PO: 8,
  BUY_ATOMIC: 9,
  SELL_ATOMIC: 10,
} as const

export type GrpcOrderType = Exclude<
  (typeof GrpcOrderTypeMap)[keyof typeof GrpcOrderTypeMap],
  string
>

export const OrderTypeMap = GrpcOrderTypeMap

export type OrderType = GrpcOrderType

export const GrpcMarketStatusMap = {
  0: 'Unspecified',
  1: 'Active',
  2: 'Paused',
  3: 'Demolished',
  4: 'Expired',
  Unspecified: 0,
  Active: 1,
  Paused: 2,
  Demolished: 3,
  Expired: 4,
} as const

export type GrpcMarketStatus = Exclude<
  (typeof GrpcMarketStatusMap)[keyof typeof GrpcMarketStatusMap],
  string
>

export const MarketStatusMap = GrpcMarketStatusMap

export type MarketStatus = GrpcMarketStatus

export const OracleTypeMap = {
  0: 'Unspecified',
  1: 'Band',
  2: 'PriceFeed',
  3: 'Coinbase',
  4: 'Chainlink',
  5: 'Razor',
  6: 'Dia',
  7: 'API3',
  8: 'Uma',
  9: 'Pyth',
  10: 'BandIBC',
  11: 'Provider',
  12: 'Stork',
  13: 'ChainlinkDataStreams',
  14: 'PythPro',
  15: 'SedaFast',
  Unspecified: 0,
  Band: 1,
  PriceFeed: 2,
  Coinbase: 3,
  Chainlink: 4,
  Razor: 5,
  Dia: 6,
  API3: 7,
  Uma: 8,
  Pyth: 9,
  BandIBC: 10,
  Provider: 11,
  Stork: 12,
  ChainlinkDataStreams: 13,
  PythPro: 14,
  SedaFast: 15,
} as const

export type OracleType = Exclude<
  (typeof OracleTypeMap)[keyof typeof OracleTypeMap],
  string
>

export const MarketType = {
  Spot: 'spot',
  Derivative: 'derivative',
} as const

export type MarketType = (typeof MarketType)[keyof typeof MarketType]

export const GridStrategyType = {
  Geometric: 'geometric',
  Arithmetic: 'arithmetic',
  Perpetual: 'perpetual',
} as const

export type GridStrategyType =
  (typeof GridStrategyType)[keyof typeof GridStrategyType]

export const TokenType = {
  Ibc: 'ibc',
  Cw20: 'cw20',
  Spl: 'spl',
  Erc20: 'erc20',
  Lp: 'lp',
  Evm: 'evm',
  Native: 'native',
  Symbol: 'symbol',
  TokenFactory: 'tokenFactory',
  InsuranceFund: 'insuranceFund',
  Unknown: 'unknown',
} as const

export type TokenType = (typeof TokenType)[keyof typeof TokenType]

export const TokenVerification = {
  Verified: 'verified',
  Submitted: 'submitted',
  Internal: 'internal',
  External: 'external',
  Unverified: 'unverified',
} as const

export type TokenVerification =
  (typeof TokenVerification)[keyof typeof TokenVerification]

export const GrpcStatusCode = {
  OK: 0,
  CANCELLED: 1,
  UNKNOWN: 2,
  INVALID_ARGUMENT: 3,
  DEADLINE_EXCEEDED: 4,
  NOT_FOUND: 5,
  ALREADY_EXISTS: 6,
  PERMISSION_DENIED: 7,
  RESOURCE_EXHAUSTED: 8,
  FAILED_PRECONDITION: 9,
  ABORTED: 10,
  OUT_OF_RANGE: 11,
  UNIMPLEMENTED: 12,
  INTERNAL: 13,
  UNAVAILABLE: 14,
  DATA_LOSS: 15,
  UNAUTHENTICATED: 16,
} as const

export type GrpcStatusCode =
  (typeof GrpcStatusCode)[keyof typeof GrpcStatusCode]

export const StreamOperation = {
  Insert: 'insert',
  Delete: 'delete',
  Replace: 'replace',
  Update: 'update',
  Invalidate: 'invalidate',
} as const

export type StreamOperation =
  (typeof StreamOperation)[keyof typeof StreamOperation]

export const StreamDisconnectReason = {
  UserStopped: 'user-stopped',
  StreamError: 'stream-error',
  NetworkError: 'network-error',
  Timeout: 'timeout',
  AuthenticationError: 'authentication-error',
  InvalidRequest: 'invalid-request',
  RateLimited: 'rate-limited',
  MaxRetries: 'max-retries',
  StreamEnded: 'stream-ended',
} as const

export type StreamDisconnectReason =
  (typeof StreamDisconnectReason)[keyof typeof StreamDisconnectReason]

export const StreamEvent = {
  Data: 'data',
  Connect: 'connect',
  Disconnect: 'disconnect',
  Retry: 'retry',
  StateChange: 'state:change',
  Error: 'error',
  Warn: 'warn',
} as const

export type StreamEvent = (typeof StreamEvent)[keyof typeof StreamEvent]
