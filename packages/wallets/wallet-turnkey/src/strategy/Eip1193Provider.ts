import { Eip1193Provider } from '@injectivelabs/wallet-base'
import {
  extractChain,
  LocalAccount,
  createWalletClient,
  http,
  createPublicClient,
} from 'viem'
import * as viemChains from 'viem/chains'

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
    return createWalletClient({
      chain: this.getChain(),
      transport: http(),
    })
  }

  getChain() {
    const chain = extractChain({
      id: this.chainId,
      chains: Object.values(viemChains) as viemChains.Chain[],
    })

    return chain
  }

  on(event: string, listener: (...args: any[]) => void) {
    console.log('Not implemented', event, listener)
  }

  removeListener(...args: any[]) {
    console.log('Not implemented', args)
  }

  async request(args: { method: string; params?: any[] }) {
    console.log('request', args)
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

      const accountClient = createWalletClient({
        account: this.account as LocalAccount,
        chain: this.getChain(),
        transport: http(),
      })

      const client = this.getClient()

      const preparedTransaction = await accountClient.prepareTransactionRequest(
        args.params[0],
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

      const client = createPublicClient({
        chain: this.getChain(),
        transport: http(),
      })

      const count = await client.getTransactionCount({
        address: this.address as `0x${string}`,
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
