import { NewTxEvent } from '../../types.js'
import { logger } from '../../logger.js'

export async function handleNewTx(data: NewTxEvent['value']) {
  const height = parseInt(data.TxResult.height)

  logger.info(`📨 Indexed Tx at height ${height}`)

  // Add indexing logic...
}
