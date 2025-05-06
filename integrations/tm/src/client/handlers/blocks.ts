import { NewBlockEvent } from '../../types.js'
import { logger } from '../../logger.js'

export async function handleNewBlock(data: NewBlockEvent['value']) {
  const height = parseInt(data.block.header.height)

  logger.info(`🧱 Indexed block #${height}`)

  // Add indexing logic...
}
