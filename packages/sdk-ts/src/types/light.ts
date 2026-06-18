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
