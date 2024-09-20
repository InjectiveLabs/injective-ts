import {
  Connection,
  Transaction,
  TransactionResponse,
  TransactionExpiredTimeoutError,
  TransactionExpiredBlockheightExceededError,
  ComputeBudgetProgram,
} from '@solana/web3.js'
import { GeneralException } from '@injectivelabs/exceptions'
import { BaseMessageSignerWalletAdapter } from '@solana/wallet-adapter-base'
import { UnsignedTransaction } from '@wormhole-foundation/sdk'

export const getSolanaTransactionInfo = async (
  transactionId: string,
  connection: Connection,
) => {
  const POLL_INTERVAL = 5000
  const timeout = 60000

  for (let i = 0; i <= timeout / POLL_INTERVAL; i += 1) {
    try {
      const txResponse = await connection.getTransaction(transactionId)

      if (txResponse) {
        return txResponse
      }
    } catch (error: any) {}

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
  }

  return null
}

export const signSendAndConfirmTransaction = async ({
  transaction,
  provider,
  solanaHostUrl,
}: {
  transaction: Transaction
  provider: BaseMessageSignerWalletAdapter<'Phantom'>
  solanaHostUrl: string
}) => {
  const connection = new Connection(solanaHostUrl, 'confirmed')

  try {
    const signed = await provider.signTransaction(transaction)
    const transactionId = await connection.sendRawTransaction(
      signed.serialize(),
    )

    const result = await connection.confirmTransaction(transactionId)

    if (result.value.err) {
      throw new TransactionExpiredBlockheightExceededError(
        result.value.err.toString(),
      )
    }

    const txResponse = await getSolanaTransactionInfo(transactionId, connection)

    if (!txResponse) {
      throw new GeneralException(
        new Error('An error occurred while fetching the transaction info'),
      )
    }

    return { txHash: transactionId, ...txResponse } as TransactionResponse & {
      txHash: string
    }
  } catch (e) {
    if (e instanceof TransactionExpiredBlockheightExceededError) {
      throw new GeneralException(
        new Error(
          'Transaction was not included in a block before expiration. Please retry.',
        ),
      )
    }

    if (e instanceof TransactionExpiredTimeoutError) {
      throw new GeneralException(
        new Error(
          'Transaction was not included in a block before expiration. Please retry.',
        ),
      )
    }

    throw e
  }
}

export const signSendAndConfirmTransactionUnsigned = async ({
  transaction,
  provider,
  solanaHostUrl,
}: {
  transaction: UnsignedTransaction
  provider: BaseMessageSignerWalletAdapter<'Phantom'>
  solanaHostUrl: string
}) => {
  const connection = new Connection(solanaHostUrl, 'confirmed')

  transaction.transaction.transaction.add(
    ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: BigInt(100_000),
    }),
  )

  transaction.transaction.transaction.add(
    ComputeBudgetProgram.setComputeUnitLimit({
      units: Number(500_000),
    }),
  )

  if (!transaction.transaction.transaction.recentBlockhash) {
    const blockhash = await (
      await connection.getLatestBlockhash('finalized')
    ).blockhash
    const signers = transaction.transaction.signers ?? []

    if (signers.length > 0) {
      transaction.transaction.transaction.recentBlockhash = blockhash
      transaction.transaction.transaction.partialSign(...signers)
    }
  }

  try {
    const transactionId = await provider.sendTransaction(
      transaction.transaction.transaction,
      connection,
    )

    const result = await connection.confirmTransaction(transactionId)

    if (result.value.err) {
      throw new TransactionExpiredBlockheightExceededError(
        result.value.err.toString(),
      )
    }

    const txResponse = await getSolanaTransactionInfo(transactionId, connection)

    if (!txResponse) {
      throw new GeneralException(
        new Error('An error occurred while fetching the transaction info'),
      )
    }

    return { txHash: transactionId, ...txResponse } as TransactionResponse & {
      txHash: string
    }
  } catch (e) {
    if (e instanceof TransactionExpiredBlockheightExceededError) {
      throw new GeneralException(
        new Error(
          'Transaction was not included in a block before expiration. Please retry.',
        ),
      )
    }

    if (e instanceof TransactionExpiredTimeoutError) {
      throw new GeneralException(
        new Error(
          'Transaction was not included in a block before expiration. Please retry.',
        ),
      )
    }

    throw e
  }
}
