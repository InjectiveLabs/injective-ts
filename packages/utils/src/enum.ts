export const StatusType = {
  Idle: 'idle',
  Loading: 'loading',
  Completed: 'completed',
  Error: 'error',
  Confirmed: 'confirmed',
} as const

export type StatusType = typeof StatusType[keyof typeof StatusType]
