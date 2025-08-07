export type StatusType =
  | 'idle'
  | 'loading'
  | 'completed'
  | 'error'
  | 'confirmed'

export const StatusType = {
  Idle: 'idle',
  Loading: 'loading',
  Completed: 'completed',
  Error: 'error',
  Confirmed: 'confirmed',
} as const
