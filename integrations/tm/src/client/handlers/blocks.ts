import { derivativeTradeFromChainEventTransformer } from '../../transformers/trades'
import { TypedDerivativeTrade } from '../../types/trades'
import { TypedSpotTrade } from '../../types/trades'
import { spotTradeFromChainEventTransformer } from '../../transformers/trades'
import { logger } from '../../logger'
import { NewBlockEvent } from '../../types/types'
import { TransformerBlockDetails } from '../../types/transformers'

let lastBlockHeight = 0

export async function handleNewBlock(blockEvent: NewBlockEvent['value']) {
  const thisBlockHeightNumber = Number(blockEvent.block.header.height)

  if (lastBlockHeight && lastBlockHeight + 1 !== thisBlockHeightNumber) {
    logger.warn(
      `blockHeight sequence mismatch: lastBlockHeight: ${lastBlockHeight} thisBlockHeight: ${thisBlockHeightNumber}`,
    )
  }

  lastBlockHeight = thisBlockHeightNumber

  const blockTimeStamp = new Date(blockEvent.block.header.time).getTime()
  //? Shows how far off the block time is from the current time, this has ranged from 500ms to 2000ms on average so far
  const blockTimeDrift = new Date().getTime() - blockTimeStamp

  logger.info(`blockTimeDrift: ${blockTimeDrift}ms`)
  logger.info(`blockHeight: ${blockEvent.block.header.height}`)

  const transformerBlockDetails: TransformerBlockDetails = {
    blockHeight: Number(blockEvent.block.header.height),
    blockTimeStamp,
    txIndex: 0,
  }

  const start = performance.now()
  const { spotTrades, derivativeTrades, allTrades } =
    blockEvent.result_finalize_block.events.reduce<{
      spotTrades: TypedSpotTrade[]
      derivativeTrades: TypedDerivativeTrade[]
      allTrades: (TypedSpotTrade | TypedDerivativeTrade)[]
    }>(
      (existingTrades, tradeEvent) => {
        if (tradeEvent.type.includes('EventBatchSpotExecution')) {
          const spotTrade = spotTradeFromChainEventTransformer(
            tradeEvent,
            transformerBlockDetails,
          )
          existingTrades.spotTrades.push(...spotTrade)
          existingTrades.allTrades.push(...spotTrade)
        }

        if (tradeEvent.type.includes('EventBatchDerivativeExecution')) {
          const derivativeTrade = derivativeTradeFromChainEventTransformer(
            tradeEvent,
            transformerBlockDetails,
          )
          existingTrades.derivativeTrades.push(...derivativeTrade)
          existingTrades.allTrades.push(...derivativeTrade)
        }

        return existingTrades
      },
      {
        spotTrades: [],
        derivativeTrades: [],
        allTrades: [],
      },
    )
  const end = performance.now()
  logger.info(
    `allTrades: ${allTrades.length} | block processing time: ${end - start}ms`,
  )

  if (spotTrades.length > 0) {
    logger.info(`spotTrades: ${spotTrades.length}`)
    logger.infoFile('spotTrades', spotTrades)
  }

  if (derivativeTrades.length > 0) {
    logger.info(`derivativeTrades: ${derivativeTrades.length}`)
    logger.infoFile('derivativeTrades', derivativeTrades)
  }
}
