/**
 * Legacy stream operation types
 * Used by indexer stream transformers
 */

export const StreamOperation = {
  Insert: 'insert',
  Delete: 'delete',
  Replace: 'replace',
  Update: 'update',
  Invalidate: 'invalidate',
} as const

export type StreamOperation =
  (typeof StreamOperation)[keyof typeof StreamOperation]
