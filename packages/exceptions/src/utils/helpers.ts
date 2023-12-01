export const isCommonLockedError = (error: string) => {
  const commonMessages = [
    'Ledger device: Incorrect length',
    'Ledger device: INS_NOT_SUPPORTED',
    'Ledger device: CLA_NOT_SUPPORTED',
    'CLA_NOT_SUPPORTED',
    'CLA',
    'Locked',
    'Failed to open the device',
    'Failed to open the device',
    'Ledger Device is busy',
    'UNKNOWN_ERROR',
  ]

  return (
    commonMessages.some((m) => m.includes(error)) ||
    commonMessages
      .map((m) => m.toLowerCase())
      .some((m) => m.includes(error.toLowerCase()))
  )
}
