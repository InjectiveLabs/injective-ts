"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSide = exports.OrderState = exports.TradeDirection = exports.TradeExecutionSide = exports.TradeExecutionType = void 0;
var TradeExecutionType;
(function (TradeExecutionType) {
    TradeExecutionType["Market"] = "market";
    TradeExecutionType["LimitFill"] = "limitFill";
    TradeExecutionType["LimitMatchRestingOrder"] = "limitMatchRestingOrder";
    TradeExecutionType["LimitMatchNewOrder"] = "limitMatchNewOrder";
})(TradeExecutionType = exports.TradeExecutionType || (exports.TradeExecutionType = {}));
var TradeExecutionSide;
(function (TradeExecutionSide) {
    TradeExecutionSide["Maker"] = "maker";
    TradeExecutionSide["Taker"] = "taker";
})(TradeExecutionSide = exports.TradeExecutionSide || (exports.TradeExecutionSide = {}));
var TradeDirection;
(function (TradeDirection) {
    TradeDirection["Buy"] = "buy";
    TradeDirection["Sell"] = "sell";
    TradeDirection["Long"] = "long";
    TradeDirection["Short"] = "short";
})(TradeDirection = exports.TradeDirection || (exports.TradeDirection = {}));
var OrderState;
(function (OrderState) {
    OrderState["Unfilled"] = "unfilled";
    OrderState["Booked"] = "booked";
    OrderState["PartialFilled"] = "partial_filled";
    OrderState["PartiallyFilled"] = "partially_filled";
    OrderState["Filled"] = "filled";
    OrderState["Canceled"] = "canceled";
    OrderState["Triggered"] = "triggered";
})(OrderState = exports.OrderState || (exports.OrderState = {}));
var OrderSide;
(function (OrderSide) {
    OrderSide["Unspecified"] = "unspecified";
    OrderSide["Buy"] = "buy";
    OrderSide["Sell"] = "sell";
    OrderSide["StopBuy"] = "stop_buy";
    OrderSide["StopSell"] = "stop_sell";
    OrderSide["TakeBuy"] = "take_buy";
    OrderSide["TakeSell"] = "take_sell";
    OrderSide["BuyPO"] = "buy_po";
    OrderSide["SellPO"] = "sell_po";
    OrderSide["BuyAtomic"] = "buy_atomic";
    OrderSide["SellAtomic"] = "sell_atomic";
    OrderSide["Unrecognized"] = "unrecognized";
})(OrderSide = exports.OrderSide || (exports.OrderSide = {}));
//# sourceMappingURL=trade.js.map