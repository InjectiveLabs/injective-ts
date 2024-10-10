export declare enum TradeExecutionType {
    Market = "market",
    LimitFill = "limitFill",
    LimitMatchRestingOrder = "limitMatchRestingOrder",
    LimitMatchNewOrder = "limitMatchNewOrder"
}
export declare enum TradeExecutionSide {
    Maker = "maker",
    Taker = "taker"
}
export declare enum TradeDirection {
    Buy = "buy",
    Sell = "sell",
    Long = "long",
    Short = "short"
}
export declare enum OrderState {
    Unfilled = "unfilled",
    Booked = "booked",
    PartialFilled = "partial_filled",
    PartiallyFilled = "partially_filled",
    Filled = "filled",
    Canceled = "canceled",
    Triggered = "triggered"
}
export declare enum OrderSide {
    Unspecified = "unspecified",
    Buy = "buy",
    Sell = "sell",
    StopBuy = "stop_buy",
    StopSell = "stop_sell",
    TakeBuy = "take_buy",
    TakeSell = "take_sell",
    BuyPO = "buy_po",
    SellPO = "sell_po",
    BuyAtomic = "buy_atomic",
    SellAtomic = "sell_atomic",
    Unrecognized = "unrecognized"
}
//# sourceMappingURL=trade.d.ts.map