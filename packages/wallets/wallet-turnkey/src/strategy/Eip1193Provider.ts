import {
  getEvmChainConfig,
  getViemPublicClient,
  getViemWalletClient,
} from '@injectivelabs/wallet-base'
import type { Hash, LocalAccount } from 'viem'
import type { Eip1193Provider } from '@injectivelabs/wallet-base'

export const getEip1193ProviderForTurnkey = async (
  account: LocalAccount,
  chainId: string,
): Promise<Eip1193Provider> => {
  const provider = new CustomEip1193Provider({
    chainId: parseInt(chainId, 16),
    signTypedData: account.signTypedData.bind(account),
    signMessage: account.signMessage.bind(account),
    signTransaction: account.signTransaction.bind(account),
    account,
    address: account.address,
  })

  return provider
}

class CustomEip1193Provider implements Eip1193Provider {
  chainId: number
  signTypedData: (...args: any[]) => Promise<any>
  signMessage: (...args: any[]) => Promise<any>
  signTransaction: (...args: any[]) => Promise<any>
  account: LocalAccount
  address: string

  constructor(args: {
    chainId?: number
    signTypedData: (...args: any[]) => Promise<any>
    signMessage: (...args: any[]) => Promise<any>
    signTransaction: (...args: any[]) => Promise<any>
    account: LocalAccount
    address: string
  }) {
    this.chainId = args.chainId ?? 1
    this.signTypedData = args.signTypedData
    this.signMessage = args.signMessage
    this.account = args.account
    this.address = args.address
    this.signTransaction = args.signTransaction
  }

  async requestAccounts() {
    return [this.address]
  }

  getClient() {
    return getViemWalletClient({
      chainId: this.chainId,
      account: this.account as any,
    })
  }

  getChain() {
    return getEvmChainConfig(this.chainId)
  }

  on(_event: string, _listener: (...args: any[]) => void) {
    throw new Error('Not implemented')
  }

  removeListener(..._args: any[]) {
    throw new Error('Not implemented!')
  }

  async request(args: { method: string; params?: any[] }) {
    if (args.method === 'eth_requestAccounts') {
      return this.requestAccounts()
    }

    if (args.method === 'eth_signTypedData') {
      if (!args.params) {
        throw new Error('params is required')
      }

      return this.signTypedData(args.params[0])
    }

    if (args.method === 'eth_signMessage') {
      if (!args.params) {
        throw new Error('params is required')
      }

      return this.signMessage(args.params[0])
    }

    if (args.method === 'eth_chainId') {
      return this.chainId
    }

    if (args.method === 'wallet_switchEthereumChain') {
      if (!args.params) {
        throw new Error('params is required')
      }

      const chainId = String(args.params[0].chainId).replace('0x', '')

      this.chainId = parseInt(chainId, 16)

      return true
    }

    if (args.method === 'eth_sendTransaction') {
      if (!args.params) {
        throw new Error('params is required')
      }

      const accountClient = getViemWalletClient({
        chainId: this.chainId,
        account: this.account as any,
      })

      const client = this.getClient()

      const parseHexValue = (value: string | number | bigint) => {
        if (typeof value === 'string') {
          const hexValue = value.startsWith('0x') ? value : `0x${value}`

          return BigInt(hexValue)
        }

        return BigInt(value)
      }

      const txData = args.params[0] as any
      const processedTransaction = { ...txData }

      const hexFields = [
        'value',
        'gas',
        'gasLimit',
        'gasPrice',
        'maxFeePerGas',
        'maxPriorityFeePerGas',
      ]

      for (const field of hexFields) {
        if (processedTransaction[field] !== undefined) {
          processedTransaction[field] = parseHexValue(
            processedTransaction[field],
          )
        }
      }

      const preparedTransaction = await accountClient.prepareTransactionRequest(
        processedTransaction,
      )

      const signedTransaction = await this.signTransaction(preparedTransaction)

      const tx = await client.sendRawTransaction({
        serializedTransaction: signedTransaction,
      })

      return tx
    }

    if (args.method === 'eth_getTransactionCount') {
      if (!args.params) {
        throw new Error('params is required')
      }

      const client = getViemPublicClient(this.chainId)

      const count = await client.getTransactionCount({
        address: this.address as Hash,
        blockTag: 'pending',
      })

      return `0x${count.toString(16)}`
    }

    return this.getClient().request({
      method: args.method as any,
      params: args.params as any,
    })
  }
}
