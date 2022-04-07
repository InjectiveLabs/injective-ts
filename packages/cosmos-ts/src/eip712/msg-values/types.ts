export const msgTypeToMsgValueMap = {
  MsgSend: {
    MsgValue: [
      { name: 'from_address', type: 'string' },
      { name: 'to_address', type: 'string' },
      { name: 'amount', type: 'TypeAmount[]' },
    ],
    TypeAmount: [
      { name: 'denom', type: 'string' },
      { name: 'amount', type: 'string' },
    ],
  },
} as Record<string, any>
