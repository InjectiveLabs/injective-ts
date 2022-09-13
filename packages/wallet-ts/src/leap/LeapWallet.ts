import type { Keplr as Leap } from '@keplr-wallet/types'
import type { OfflineDirectSigner } from '@cosmjs/proto-signing'
import { BroadcastMode } from '@cosmjs/launchpad'
import type { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
} from '@injectivelabs/ts-types'
import { TxRestClient } from '@injectivelabs/tx-ts'
import { leapSupportedChainIds } from './utils'
import { getEndpointsFromChainId } from '../cosmos'

export class LeapWallet {
  private chainId: CosmosChainId | TestnetCosmosChainId | ChainId

  private window: Window & { leap?: Leap }

  constructor(chainId: CosmosChainId | TestnetCosmosChainId | ChainId) {
    this.chainId = chainId
    this.window = window as Window & { leap: Leap }
  }

  async getLeapWallet() {
    const { window, chainId } = this

    if (!window) {
      throw new Error('Please install Leap extension')
    }

    if (!window.leap) {
      throw new Error('Please install Leap extension')
    }

    try {
      await window.leap.enable(chainId)

      return window.leap as Leap
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async getAccounts() {
    const { window, chainId } = this

    if (!window) {
      throw new Error('Please install Leap extension')
    }

    if (!window.leap) {
      throw new Error('Please install Leap extension')
    }

    if (!window.leap.getOfflineSigner) {
      throw new Error('Please install Leap extension')
    }

    try {
      return window.leap.getOfflineSigner(chainId).getAccounts()
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async getKey(): Promise<{
    name: string
    algo: string
    pubKey: Uint8Array
    address: Uint8Array
    bech32Address: string
  }> {
    const leap = await this.getLeapWallet()

    try {
      return leap.getKey(this.chainId)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async getOfflineSigner(): Promise<OfflineDirectSigner> {
    const { chainId } = this
    const leap = await this.getLeapWallet()

    try {
      return leap.getOfflineSigner(chainId) as unknown as OfflineDirectSigner
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  /**
   * This method is used to broadcast a transaction to the network.
   * Since it uses the `Sync` mode, it will not wait for the transaction to be included in a block,
   * so we have to make sure the transaction is included in a block after its broadcasted
   *
   * @param txRaw - raw transaction to broadcast
   * @returns tx hash
   */
  async broadcastTx(txRaw: TxRaw): Promise<string> {
    const { chainId } = this
    const leap = await this.getLeapWallet()
    const txHashBuff = await leap.sendTx(
      chainId,
      txRaw.serializeBinary(),
      BroadcastMode.Sync,
    )

    if (!txHashBuff) {
      throw new Error('Transaction failed to be broadcasted')
    }

    return Buffer.from(txHashBuff).toString('hex')
  }

  /**
   * This method is used to broadcast a transaction to the network.
   * Since it uses the `Block` mode, and it will wait for the transaction to be included in a block,
   *
   * @param txRaw - raw transaction to broadcast
   * @returns tx hash
   */
  async broadcastTxBlock(txRaw: TxRaw): Promise<string> {
    const { chainId } = this
    const leap = await this.getLeapWallet()
    const result = await leap.sendTx(
      chainId,
      txRaw.serializeBinary(),
      BroadcastMode.Block,
    )

    if (!result) {
      throw new Error('Transaction failed to be broadcasted')
    }

    return Buffer.from(result).toString('hex')
  }

  async waitTxBroadcasted(txHash: string): Promise<string> {
    const endpoints = await this.getChainEndpoints()
    const txClient = new TxRestClient(endpoints.rest)
    const result = await txClient.waitTxBroadcast(txHash)

    return result.txhash
  }

  async getChainEndpoints(): Promise<{ rpc: string; rest: string }> {
    const { chainId } = this

    try {
      return getEndpointsFromChainId(chainId)
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  static checkChainIdSupport = (chainId: string) =>
    leapSupportedChainIds.includes(chainId)
}
