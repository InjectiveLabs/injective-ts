import { EthereumChainId } from '@injectivelabs/ts-types'
import { Network } from '@injectivelabs/networks'
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
}

/**
 * Preparing and broadcasting
 * Ethereum transactions
 */
export class Web3Broadcaster {
  private walletStrategy: BaseWalletStrategy

  private ethereumChainId: EthereumChainId

  constructor({
    walletStrategy,
    ethereumChainId,
  }: {
    walletStrategy: BaseWalletStrategy
    ethereumChainId: EthereumChainId
    network: Network
  }) {
    this.walletStrategy = walletStrategy
    this.ethereumChainId = ethereumChainId
  }

  async sendTransaction(args: SendTransactionOptions) {
    const { walletStrategy, ethereumChainId } = this

    try {
      const txHash = await walletStrategy.sendEthereumTransaction(args.tx, {
        ethereumChainId,
        address: args.address,
      })

      await walletStrategy.getEthereumTransactionReceipt(txHash)

      return txHash
    } catch (e: unknown) {
      throw new Web3Exception(new Error((e as any).message))
    }
  }
}
