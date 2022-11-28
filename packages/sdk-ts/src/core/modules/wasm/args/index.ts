export const getCw20SendArgs = ({
  contractAddress,
  amount,
  msg = {},
}: {
  contractAddress: string /** The contract address which receives the CW20 */
  amount: string
  msg?: object
}) => {
  return {
    action: 'send',
    msg: {
      contract: contractAddress,
      amount: amount,
      msg: Buffer.from(JSON.stringify(msg)).toString('base64'),
    },
  }
}
