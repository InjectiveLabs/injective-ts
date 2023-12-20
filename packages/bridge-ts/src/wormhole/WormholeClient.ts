import { Network } from '@injectivelabs/networks'
import { GeneralException } from '@injectivelabs/exceptions'
import {
  parseVaa,
  parseTransferPayload,
  tryHexToNativeString,
  ChainId,
} from '@injectivelabs/wormhole-sdk'
import { getSignedVAAFromRest, getSignedVAAWithRetryFromRest } from './vaa'

export class BaseWormholeClient {
  public network: Network

  public wormholeRpcUrl?: string

  public wormholeRestUrl?: string

  constructor({
    network,
    wormholeRestUrl,
    wormholeRpcUrl,
  }: {
    network: Network
    solanaHostUrl?: string
    wormholeRestUrl?: string
    wormholeRpcUrl?: string
  }) {
    this.network = network
    this.wormholeRestUrl = wormholeRestUrl
    this.wormholeRpcUrl = wormholeRpcUrl
  }

  parseSignedVAA(signedVAA: string /* base64 */) {
    return parseVaa(Buffer.from(signedVAA, 'base64'))
  }

  getTransferDetailsFromSignedVAA(signedVAA: string /* base64 */) {
    const parsedSignedVaa = this.parseSignedVAA(signedVAA)
    const parsedTransferPayload = parseTransferPayload(parsedSignedVaa.payload)

    const nativeOrigin = tryHexToNativeString(
      parsedTransferPayload.originAddress,
      parsedTransferPayload.originChain as ChainId,
    )

    return {
      ...parsedTransferPayload,
      originAddress: nativeOrigin,
      amount: parsedTransferPayload.amount.toString(),
    }
  }

  async getSignedVAARest(txHash: string) {
    const { wormholeRestUrl } = this

    if (!wormholeRestUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRestUrl`))
    }

    try {
      const response = (await getSignedVAAWithRetryFromRest(
        txHash,
        wormholeRestUrl,
      )) as string

      return response
    } catch (e) {
      throw new GeneralException(
        new Error(
          `Could not get the signed VAA. Is the transaction confirmed?`,
        ),
      )
    }
  }

  async getSignedVAARestNoRetry(txHash: string) {
    const { wormholeRestUrl } = this

    if (!wormholeRestUrl) {
      throw new GeneralException(new Error(`Please provide wormholeRestUrl`))
    }

    try {
      const response = (await getSignedVAAFromRest(
        txHash,
        wormholeRestUrl,
      )) as string

      return response
    } catch (e) {
      throw new GeneralException(
        new Error(
          `Could not get the signed VAA. Is the transaction confirmed?`,
        ),
      )
    }
  }
}
