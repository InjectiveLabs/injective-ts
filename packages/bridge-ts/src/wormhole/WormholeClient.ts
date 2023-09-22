import { Network } from '@injectivelabs/networks'
import {
  parseVaa,
  parseTransferPayload,
  tryHexToNativeString,
  ChainId,
} from '@injectivelabs/wormhole-sdk'

export class BaseWormholeClient {
  public network: Network

  public wormholeRpcUrl?: string

  constructor({
    network,
    wormholeRpcUrl,
  }: {
    network: Network
    solanaHostUrl?: string
    wormholeRpcUrl?: string
  }) {
    this.network = network
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
}
