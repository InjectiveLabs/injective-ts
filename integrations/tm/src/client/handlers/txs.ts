import { NewTxEvent } from '../../types/types'
import { logger } from '../../logger'

export async function handleNewTx(data: NewTxEvent['value']) {
  const _height = parseInt(data.TxResult.height)
  // logger.info(`📨 Indexed Tx at height ${height}`)

  // Add indexing logic...
}
