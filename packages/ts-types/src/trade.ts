export enum TradeExecutionType {
  Market = 'market',
  LimitFill = 'limitFill',
  LimitMatchRestingOrder = 'limitMatchRestingOrder',
  LimitMatchNewOrder = 'limitMatchNewOrder',
}

export enum TradeExecutionSide {
  Maker = 'market',
  Taker = 'taker',
}

export enum TradeDirection {
  Buy = 'buy',
  Sell = 'sell',
  Long = 'long',
  Short = 'short',
}

export enum OrderState {
  Booked = 'booked',
  PartiallyFilled = 'partially_filled',
  Filled = 'filled',
  Canceled = 'canceled',
  Triggered = 'triggered'
}
