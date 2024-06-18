import { HttpClient } from '@injectivelabs/utils'
import { GeneralException } from '@injectivelabs/exceptions'

export const getSignedVAAFromRest = async (
  txHash: string,
  endpoint: string,
) => {
  try {
    const response = (await new HttpClient(endpoint).get('vaas', {
      txHash,
      parsedPayload: true,
    })) as {
      data: {
        data: [
          {
            vaa: string
          },
        ]
      }
    }

    const vaa = response.data?.data[0]?.vaa

    if (!vaa) {
      throw new GeneralException(new Error("Vaa can't be found"))
    }

    return response.data?.data[0]?.vaa
  } catch (e: any) {
    if (e instanceof GeneralException) {
      throw e
    }

    throw new GeneralException(new Error("Vaa can't be found"))
  }
}

export const getSignedVAAWithRetryFromRest = async (
  txHash: string,
  endpoint: string,
) => {
  const TOTAL_RETRIES = 50
  const DELAY_BETWEEN_CALLS = 5000

  const retryHttpCall = async (attempt = 1): Promise<any> => {
    try {
      return await getSignedVAAFromRest(txHash, endpoint)
    } catch (e: any) {
      if (attempt >= TOTAL_RETRIES) {
        throw e
      }

      return new Promise((resolve) =>
        setTimeout(
          () => resolve(retryHttpCall(attempt + 1)),
          DELAY_BETWEEN_CALLS * attempt,
        ),
      )
    }
  }

  return retryHttpCall()
}
