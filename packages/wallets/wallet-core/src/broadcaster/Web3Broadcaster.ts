import { Network } from '@injectivelabs/networks'
import { EvmChainId } from '@injectivelabs/ts-types'
import { Web3Exception } from '@injectivelabs/exceptions'
import BaseWalletStrategy from '../strategy/BaseWalletStrategy.js'

interface SendTransactionOptions {
  tx: {
    from: string
    to: string
    gas: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string | null
    data: any
  }
  address: string
  evmChainId?: EvmChainId
}

/**
 * Preparing and broadcasting
 * Ethereum transactions
 */
export class Web3Broadcaster {
  private walletStrategy: BaseWalletStrategy

  private evmChainId: EvmChainId

  constructor({
    walletStrategy,
    evmChainId,
  }: {
    walletStrategy: BaseWalletStrategy
    evmChainId: EvmChainId
    network: Network
  }) {
    this.evmChainId = evmChainId
    this.walletStrategy = walletStrategy
  }

  async sendTransaction(args: SendTransactionOptions) {
    const { evmChainId, walletStrategy } = this

    try {
      const chainId = args.evmChainId || evmChainId

      const txHash = await walletStrategy.sendEvmTransaction(args.tx, {
        evmChainId: chainId,
        address: args.address,
      })

      await walletStrategy.getEvmTransactionReceipt(txHash, chainId)

      return txHash
    } catch (e: unknown) {
      throw new Web3Exception(new Error((e as any).message))
    }
  }
}
