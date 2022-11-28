export const getCw20SendArgs = ({
  contractAddress,
  amount,
  msg = {},
}: {
  contractAddress: string
  amount: string
  msg?: object
}) => {
  return {
    send: {
      contract: contractAddress,
      amount: amount,
      msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
    },
  }
}
