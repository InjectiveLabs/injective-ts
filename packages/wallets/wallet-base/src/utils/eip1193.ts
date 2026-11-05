import { hashTypedData } from 'viem'
import {
  getEvmChainConfig,
  getViemPublicClient,
  getViemWalletClient,
  toViemTransactionRequest,
} from './viem.js'
import type { Hash, BlockTag, LocalAccount } from 'viem'
import type { Eip1193Provider } from '../types/index.js'

type RpcUrls = Partial<Record<number, string>>

const signTypedDataMethods = new Set([
  'eth_signTypedData',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
])

const signMessageMethods = new Set([
  'eth_sign',
  'personal_sign',
  'eth_signMessage',
])

const sendTransactionMethods = new Set([
  'eth_sendTransaction',
  'wallet_sendTransaction',
])

const parseChainId = (chainId: number | string) => {
  if (typeof chainId === 'number') {
    return chainId
  }

  if (chainId.startsWith('0x')) {
    return parseInt(chainId.replace('0x', ''), 16)
  }

  return parseInt(chainId, 10)
}

const isEthAddress = (value: unknown) =>
  typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value)

const getTypedDataParam = (method: string, params?: any[]) => {
  if (!params?.length) {
    throw new Error('params is required')
  }

  const typedData = isEthAddress(params[0]) ? params[1] : params[0]

  if (
    typedData == null ||
    (typeof typedData === 'string' && typedData.length === 0) ||
    (typeof typedData !== 'string' && typeof typedData !== 'object')
  ) {
    throw new Error(`Missing typed data parameter for ${method}`)
  }

  const parsedTypedData = (() => {
    if (typeof typedData !== 'string') {
      return typedData
    }

    try {
      return JSON.parse(typedData)
    } catch {
      throw new Error(`Invalid typed data parameter for ${method}`)
    }
  })()

  if (
    !parsedTypedData ||
    typeof parsedTypedData !== 'object' ||
    Array.isArray(parsedTypedData) ||
    !parsedTypedData.domain ||
    !parsedTypedData.types ||
    typeof parsedTypedData.primaryType !== 'string' ||
    !('message' in parsedTypedData)
  ) {
    throw new Error(`Invalid typed data parameter for ${method}`)
  }

  return parsedTypedData
}

const getMessageParam = (method: string, params?: any[]) => {
  if (!params?.length) {
    throw new Error('params is required')
  }

  let message = params[0]

  if (method === 'eth_sign') {
    message = params[1]
  }

  if (method === 'personal_sign' && isEthAddress(params[0])) {
    message = params[1]
  }

  if (
    !(message instanceof Uint8Array) &&
    (typeof message !== 'string' || message.length === 0) &&
    !(message && typeof message === 'object' && 'message' in message)
  ) {
    throw new Error(`Missing message parameter for ${method}`)
  }

  return message
}

const getSignableMessage = (message: any) => {
  if (message && typeof message === 'object' && 'message' in message) {
    return message
  }

  if (
    message instanceof Uint8Array ||
    (typeof message === 'string' && message.startsWith('0x'))
  ) {
    return { message: { raw: message } }
  }

  return { message }
}

/** An EIP-1193 provider that signs with a viem account and talks to our RPCs */
export const getEip1193ProviderForAccount = async (
  account: LocalAccount,
  chainId: number | string,
  params: {
    rpcUrl?: string
    rpcUrls?: RpcUrls
  } = {},
): Promise<Eip1193Provider> => {
  const provider = new CustomEip1193Provider({
    chainId: parseChainId(chainId),
    sign: account.sign?.bind(account),
    signTypedData: account.signTypedData.bind(account),
    signMessage: account.signMessage.bind(account),
    signTransaction: account.signTransaction.bind(account),
    rpcUrl: params.rpcUrl,
    rpcUrls: params.rpcUrls,
    account,
    address: account.address,
  })

  return provider
}

class CustomEip1193Provider implements Eip1193Provider {
  chainId: number
  sign: ((...args: any[]) => Promise<any>) | undefined
  signTypedData: (...args: any[]) => Promise<any>
  signMessage: (...args: any[]) => Promise<any>
  signTransaction: (...args: any[]) => Promise<any>
  private readonly rpcUrl?: string
  private readonly rpcUrls?: RpcUrls
  account: LocalAccount
  address: string

  constructor(args: {
    chainId?: number
    sign: ((...args: any[]) => Promise<any>) | undefined
    signTypedData: (...args: any[]) => Promise<any>
    signMessage: (...args: any[]) => Promise<any>
    signTransaction: (...args: any[]) => Promise<any>
    rpcUrl?: string
    rpcUrls?: RpcUrls
    account: LocalAccount
    address: string
  }) {
    this.chainId = args.chainId ?? 1
    this.sign = args.sign
    this.signTypedData = args.signTypedData
    this.signMessage = args.signMessage
    this.account = args.account
    this.address = args.address
    this.rpcUrl = args.rpcUrl
    this.rpcUrls = args.rpcUrls
    this.signTransaction = args.signTransaction
  }

  private getRpcUrl() {
    return this.rpcUrls?.[this.chainId] || this.rpcUrl
  }

  // Signs only for the provider's chain, which wallet_switchEthereumChain sets
  private toTransactionRequest(transaction: unknown) {
    return toViemTransactionRequest(transaction, this.address, this.chainId)
  }

  async requestAccounts() {
    return [this.address]
  }

  getClient() {
    return getViemWalletClient({
      chainId: this.chainId,
      account: this.account as any,
      rpcUrl: this.getRpcUrl(),
    })
  }

  getChain() {
    return getEvmChainConfig(this.chainId)
  }

  // No events are emitted: libraries that subscribe on setup keep working
  on(_event: string, _listener: (...args: any[]) => void) {}

  removeListener(..._args: any[]) {}

  async request(args: { method: string; params?: any[] }) {
    if (
      args.method === 'eth_requestAccounts' ||
      args.method === 'eth_accounts'
    ) {
      return this.requestAccounts()
    }

    if (signTypedDataMethods.has(args.method)) {
      // Sign the raw EIP-712 hash when the account can: Turnkey and Privy can reject
      // typed data with Injective's domain. Both paths produce the same signature.
      const typedData = getTypedDataParam(args.method, args.params)

      if (this.sign) {
        const typedDataHash = hashTypedData({
          domain: {
            ...typedData.domain,
            chainId:
              typedData.domain.chainId != null
                ? parseChainId(typedData.domain.chainId)
                : undefined,
          },
          types: typedData.types,
          primaryType: typedData.primaryType,
          message: typedData.message,
        })

        return this.sign({ hash: typedDataHash })
      }

      return this.signTypedData(typedData)
    }

    if (signMessageMethods.has(args.method)) {
      const message = getMessageParam(args.method, args.params)

      return this.signMessage(getSignableMessage(message))
    }

    if (args.method === 'eth_signTransaction') {
      if (!args.params) {
        throw new Error('params is required')
      }

      return this.signTransaction({
        chainId: this.chainId,
        ...this.toTransactionRequest(args.params[0]),
      })
    }

    if (args.method === 'eth_chainId') {
      return `0x${this.chainId.toString(16)}`
    }

    if (args.method === 'wallet_switchEthereumChain') {
      if (!args.params) {
        throw new Error('params is required')
      }

      this.chainId = parseChainId(args.params[0].chainId)

      return true
    }

    if (sendTransactionMethods.has(args.method)) {
      if (!args.params) {
        throw new Error('params is required')
      }

      const accountClient = getViemWalletClient({
        chainId: this.chainId,
        account: this.account as any,
        rpcUrl: this.getRpcUrl(),
      })

      const client = this.getClient()

      const preparedTransaction = await accountClient.prepareTransactionRequest(
        this.toTransactionRequest(args.params[0]) as any,
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

      const client = getViemPublicClient(this.chainId, this.getRpcUrl())

      const [address = this.address as Hash, blockTag = 'pending'] =
        args.params as [Hash?, BlockTag?]
      const count = await client.getTransactionCount({ address, blockTag })

      return `0x${count.toString(16)}`
    }

    return this.getClient().request({
      method: args.method as any,
      params: args.params as any,
    })
  }
}
