import { binaryToBase64 } from '@injectivelabs/sdk-ts'
import { Connection } from '@solana/web3.js'
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

export const getSolanaTransactionInfo = async (
  transactionId: string,
  connection: Connection,
) => {
  const POLL_INTERVAL = 1000
  const timeout = 300000

  for (let i = 0; i <= timeout / POLL_INTERVAL; i += 1) {
    try {
      const txResponse = await connection.getTransaction(transactionId)

      if (txResponse) {
        return txResponse
      }
    } catch (error: any) {
      //
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
  }

  return null
}
