export const eip712Types = new Map(
  Object.entries({
    MsgValue: [
      {
        name: 'sender',
        type: 'string',
      },
      {
        name: 'contract',
        type: 'string',
      },
      {
        name: 'msg',
        type: 'uint8',
      },
    ],
  }),
)
