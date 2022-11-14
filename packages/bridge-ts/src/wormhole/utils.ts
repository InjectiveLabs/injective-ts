import { binaryToBase64 } from '@injectivelabs/sdk-ts'
import { SolanaTransferMsgArgs, EthereumTransferMsgArgs } from './types'

export const createTransferContractMsgExec = (
  args: SolanaTransferMsgArgs | EthereumTransferMsgArgs,
  info: Record<string, any>,
) => {
  const nonce = Math.round(Math.random() * 100000)

  return {
    nonce,
    asset: {
      amount: args.amount,
      info,
    },
    recipient_chain: args.recipientChainId,
    recipient: binaryToBase64(args.recipient),
    fee: args.relayerFee || '0',
    ...(args.payload && { payload: binaryToBase64(args.payload) }),
  }
}
