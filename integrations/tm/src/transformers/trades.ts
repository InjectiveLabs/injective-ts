import {
  TradeExecutionType,
  TradeExecutionSide,
  TradeDirection,
} from '@injectivelabs/ts-types'
import { decodeBase64 } from '../helpers'
import type { ChainEvent } from '../types/block'
import type { TypedSpotTrade, TypedDerivativeTrade } from '../types/trades'
import { getInjectiveAddress } from '@injectivelabs/sdk-ts'
import { findAttribute } from './utils'
import { TransformerBlockDetails } from '../types/transformers'

// TODO: the tradeIndex doesn't match up with indexer's here
function getTradeId(blockHeight: number, tradeIndex: number, logIndex: number) {
  return `${blockHeight}_${tradeIndex}_${logIndex}`
}

export const spotTradeFromChainEventTransformer = (
  tradeEvent: ChainEvent,
  { blockHeight, blockTimeStamp, txIndex }: TransformerBlockDetails,
): TypedSpotTrade[] => {
  const trades = JSON.parse(
    tradeEvent.attributes.find((attr) => attr.key === 'trades')?.value || '[]',
  )

  const isBuy = findAttribute(tradeEvent, 'is_buy') === 'true'
  const marketId = findAttribute(tradeEvent, 'market_id')
  const executionType = findAttribute(tradeEvent, 'executionType')

  return trades.map((trade: any, index: number) => ({
    price: trade.price,
    quantity: trade.quantity,
    timestamp: blockTimeStamp,
    orderHash: decodeBase64(trade.order_hash),
    subaccountId: decodeBase64(trade.subaccount_id),
    marketId,
    cid: trade.cid,
    //? Pretty sure that tradeId is the indexer's own id.
    tradeId: getTradeId(blockHeight, txIndex, index),
    executedAt: blockTimeStamp,
    tradeExecutionType:
      TradeExecutionType[executionType as keyof typeof TradeExecutionType],
    //TODO: Have to find the logic to properly get this
    executionSide: isBuy ? TradeExecutionSide.Maker : TradeExecutionSide.Taker,
    tradeDirection: isBuy ? TradeDirection.Buy : TradeDirection.Sell,
    fee: trade.fee,
    feeRecipient: getInjectiveAddress(
      decodeBase64(trade.fee_recipient_address),
    ),
    rawChainEvent: tradeEvent,
  }))
}

export const derivativeTradeFromChainEventTransformer = (
  tradeEvent: ChainEvent,
  { blockHeight, blockTimeStamp, txIndex }: TransformerBlockDetails,
): TypedDerivativeTrade[] => {
  const trades = JSON.parse(
    tradeEvent.attributes.find((attr) => attr.key === 'trades')?.value || '[]',
  )

  const isBuy = findAttribute(tradeEvent, 'is_buy') === 'true'
  const marketId = findAttribute(tradeEvent, 'market_id')

  const executionType = findAttribute(tradeEvent, 'executionType')
  const isLiquidation = findAttribute(tradeEvent, 'is_liquidation') === 'true'

  return trades.map((trade: any, index: number) => ({
    executedAt: blockTimeStamp,
    marketId,
    orderHash: decodeBase64(trade.order_hash),
    subaccountId: decodeBase64(trade.subaccount_id),
    feeRecipient: getInjectiveAddress(
      decodeBase64(trade.fee_recipient_address),
    ),
    tradeId: getTradeId(blockHeight, txIndex, index),
    cid: trade.cid,
    tradeExecutionType:
      TradeExecutionType[executionType as keyof typeof TradeExecutionType],
    //TODO: Have to find the logic to properly get this
    executionSide: isBuy ? TradeExecutionSide.Maker : TradeExecutionSide.Taker,
    tradeDirection: trade?.position_delta?.is_long
      ? TradeDirection.Long
      : TradeDirection.Short,
    fee: trade.fee,
    isLiquidation,
    executionPrice: trade.position_delta?.execution_price || '0',
    executionQuantity: trade.position_delta?.execution_quantity || '0',
    executionMargin: trade.position_delta?.execution_margin || '0',
    payout: trade.payout || '0',
    pnl: trade.pnl || '0',
    rawChainEvent: tradeEvent,
  }))
}
