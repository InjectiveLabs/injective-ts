import { Network } from '@injectivelabs/networks'
import { EvmWormholeClient, Provider } from '../clients/EvmWormholeClient'
import { TransferMsgArgs, WormholeClient, WormholeSource } from '..'
import { GeneralException } from '@injectivelabs/exceptions'
import { ethers } from 'ethers'
import { BaseWormholeClient } from '../WormholeClient'
import { ChainId } from '@injectivelabs/wormhole-sdk'

export class EvmWormholeClientStrategy
  extends BaseWormholeClient
  implements
    WormholeClient<
      ethers.ContractReceipt & { txHash: string },
      ethers.providers.TransactionReceipt
    >
{
  public wormholeSource: WormholeSource = WormholeSource.Ethereum

  public strategies: { [key in WormholeSource]?: EvmWormholeClient }

  constructor(args: {
    network: Network
    wormholeRpcUrl?: string
    wormholeRestUrl?: string
    provider: Provider
    wormholeSource?: WormholeSource
  }) {
    super(args)

    this.wormholeSource = args.wormholeSource || WormholeSource.Ethereum
    this.strategies = {
      [WormholeSource.Ethereum]: new EvmWormholeClient({
        ...args,
        wormholeSource: WormholeSource.Ethereum,
      }),
      [WormholeSource.Polygon]: new EvmWormholeClient({
        ...args,
        wormholeSource: WormholeSource.Polygon,
      }),
      [WormholeSource.Arbitrum]: new EvmWormholeClient({
        ...args,
        wormholeSource: WormholeSource.Arbitrum,
      }),
    }
  }

  setWormholeSource(wormholeSource: WormholeSource) {
    this.wormholeSource = wormholeSource
  }

  get strategy(): EvmWormholeClient {
    const { wormholeSource, strategies } = this

    if (!wormholeSource || !strategies[wormholeSource]) {
      throw new GeneralException(
        new Error(`The strategy for ${wormholeSource} not found.`),
      )
    }

    return strategies[wormholeSource] as EvmWormholeClient
  }

  async getAddress() {
    return this.strategy.getAddress()
  }

  async getBalance(address: string, tokenAddress?: string) {
    return this.strategy.getBalance(address, tokenAddress)
  }

  async transfer(args: TransferMsgArgs) {
    return this.strategy.transfer(args)
  }

  async getTxResponse(txHash: string) {
    return this.strategy.getTxResponse(txHash)
  }

  async getSignedVAA(txResponse: ethers.ContractReceipt) {
    return this.strategy.getSignedVAA(txResponse)
  }

  async getSignedVAANoRetry(txResponse: ethers.ContractReceipt) {
    return this.strategy.getSignedVAANoRetry(txResponse)
  }

  async getSignedVAARest(txHash: string) {
    return this.strategy.getSignedVAARest(txHash)
  }

  async getSignedVAANoRetryRest(txHash: string) {
    return this.strategy.getSignedVAARestNoRetry(txHash)
  }

  async getIsTransferCompleted(signedVAA: string /* in base 64 */) {
    return this.strategy.getIsTransferCompleted(signedVAA)
  }

  async getIsTransferCompletedRetry(signedVAA: string /* in base 64 */) {
    return this.strategy.getIsTransferCompletedRetry(signedVAA)
  }

  async redeem(args: {
    signedVAA: string /* in base 64 */
    recipient?: string
  }): Promise<ethers.ContractReceipt> {
    return this.strategy.redeem(args)
  }

  async redeemNative(args: {
    signedVAA: string /* in base 64 */
    recipient?: string
  }): Promise<ethers.ContractReceipt> {
    return this.strategy.redeemNative(args)
  }

  parseSignedVAA(signedVAA: string /* base64 */) {
    return this.strategy.parseSignedVAA(signedVAA)
  }

  async getForeignAsset(originChain: ChainId, originAddress: string) {
    return await this.strategy.getForeignAsset(originChain, originAddress)
  }
}
