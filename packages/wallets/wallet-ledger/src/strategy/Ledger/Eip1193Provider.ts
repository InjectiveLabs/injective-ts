import { toHex, serializeTransaction } from 'viem'
import {
  getEvmChainConfig,
  getViemPublicClient,
  getViemWalletClient,
} from '@injectivelabs/wallet-base'
import type { Hash, WalletClient } from 'viem'
import type { EvmChainId } from '@injectivelabs/ts-types'
import type {
  Eip1193Provider,
  WalletStrategyEvmOptions,
} from '@injectivelabs/wallet-base'
import type LedgerHW from './hw/index.js'

const signTypedDataMethods = new Set([
  'eth_signTypedData',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4',
])

const signMessageMethods = new Set(['eth_sign', 'personal_sign'])

const isEthAddress = (value: unknown) =>
  typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value)

const getTypedDataParam = (method: string, params: any[]) => {
  const typedData = isEthAddress(params[0]) ? params[1] : params[0]

  if (
    typedData == null ||
    (typeof typedData === 'string' && typedData.length === 0)
  ) {
    throw new Error(`Missing typed data parameter for ${method}`)
  }

  return typeof typedData === 'string' ? typedData : JSON.stringify(typedData)
}

const getMessageParam = (method: string, params: any[]) => {
  let message = params[0]

  if (method === 'eth_sign' || isEthAddress(params[0])) {
    message = params[1]
  }

  if (
    !(message instanceof Uint8Array) &&
    (typeof message !== 'string' || message.length === 0)
  ) {
    throw new Error(`Missing message parameter for ${method}`)
  }

  return message
}

const getMessageHex = (message: any) => {
  if (message instanceof Uint8Array) {
    return toHex(message).replace(/^0x/, '')
  }

  if (typeof message === 'string' && message.startsWith('0x')) {
    return message.replace(/^0x/, '')
  }

  return toHex(String(message)).replace(/^0x/, '')
}

export class LedgerEip1193Provider implements Eip1193Provider {
  private readonly ledger: LedgerHW
  private readonly derivationPath: string
  private readonly rpcUrl?: string
  private readonly rpcUrls?: WalletStrategyEvmOptions['rpcUrls']

  private address?: string
  private chainId: number

  constructor(
    ledger: LedgerHW,
    params: {
      rpcUrl?: string
      chainId?: string
      derivationPath?: string
      rpcUrls?: WalletStrategyEvmOptions['rpcUrls']
    },
  ) {
    this.ledger = ledger
    this.derivationPath = params.derivationPath || "m/44'/60'/0'/0/0"
    this.rpcUrl = params.rpcUrl
    this.rpcUrls = params.rpcUrls

    this.chainId = parseInt(params.chainId || '1')
  }

  private getRpcUrl() {
    return this.rpcUrls?.[this.chainId as EvmChainId] || this.rpcUrl
  }

  async getClient(): Promise<WalletClient> {
    return getViemWalletClient({
      chainId: this.chainId,
      rpcUrl: this.getRpcUrl(),
      account: (await this.getAddress()) as Hash,
    })
  }

  async setChainId(chainId: string) {
    this.chainId = parseInt(chainId.replace('0x', ''), 16)
  }

  async getAddress() {
    if (!this.address) {
      const ledger = await this.ledger.getInstance()
      const { address } = await ledger.getAddress(this.derivationPath)
      this.address = address
    }

    return this.address
  }

  async signTypedData(data: string) {
    const ledgerInstance = await this.ledger.getInstance()

    const result = await ledgerInstance.signEIP712Message(
      this.derivationPath,
      JSON.parse(data),
    )

    const v = result.v.toString(16).padStart(2, '0')
    const combined = `${result.r}${result.s}${v}`

    return combined.startsWith('0x') ? combined : `0x${combined}`
  }

  async signTransaction(txData: any) {
    const ledgerInstance = await this.ledger.getInstance()

    const serializedTransaction = serializeTransaction(txData)

    // Sign the transaction with clear signing enabled
    const signature = await ledgerInstance.clearSignTransaction(
      this.derivationPath,
      serializedTransaction.substring(2),
      {
        erc20: true,
        externalPlugins: true,
        nft: true,
      },
    )

    const signedTransaction = serializeTransaction(txData, {
      r: signature.r as Hash,
      s: signature.s as Hash,
      v: BigInt(signature.v),
    })

    return signedTransaction
  }

  async signMessage(messageHex: string) {
    const ledgerInstance = await this.ledger.getInstance()
    const result = await ledgerInstance.signPersonalMessage(
      this.derivationPath,
      messageHex,
    )

    const v = result.v.toString(16).padStart(2, '0')
    const combined = `${result.r}${result.s}${v}`

    return combined.startsWith('0x') ? combined : `0x${combined}`
  }

  getChain() {
    return getEvmChainConfig(this.chainId)
  }

  async request(args: { method: string; params: any[] }): Promise<any> {
    if (
      args.method === 'eth_requestAccounts' ||
      args.method === 'eth_accounts'
    ) {
      const address = await this.getAddress()

      return [address]
    }

    if (signMessageMethods.has(args.method)) {
      if (!args.params[0]) {
        throw new Error(`Missing parameter for ${args.method}`)
      }

      return this.signMessage(
        getMessageHex(getMessageParam(args.method, args.params)),
      )
    }

    if (args.method === 'eth_signTransaction') {
      if (!args.params[0]) {
        throw new Error('Missing parameter for eth_signTransaction')
      }

      return this.signTransaction(args.params[0])
    }

    if (signTypedDataMethods.has(args.method)) {
      if (!args.params[0]) {
        throw new Error(`Missing parameter for ${args.method}`)
      }

      return this.signTypedData(getTypedDataParam(args.method, args.params))
    }

    if (args.method === 'eth_chainId') {
      return `0x${this.chainId.toString(16)}`
    }

    if (args.method === 'wallet_switchEthereumChain') {
      return this.setChainId(args.params[0]?.chainId || '0x1') // TODO: fallback to wallet strategy chainid
    }

    if (args.method === 'eth_estimateGas') {
      const client = getViemPublicClient(this.chainId, this.getRpcUrl())

      const data = {
        to: args.params[0].to,
        value: args.params[0].value,
        data: args.params[0].data,
        account: (await this.getAddress()) as Hash,
      }

      const estimate = await client.estimateGas(data)

      return `0x${estimate.toString(16)}`
    }

    if (args.method === 'eth_getTransactionCount') {
      if (!args.params) {
        throw new Error('params is required')
      }

      const client = getViemPublicClient(this.chainId, this.getRpcUrl())

      const count = await client.getTransactionCount({
        address: (await this.getAddress()) as Hash,
        blockTag: 'pending',
      })

      return `0x${count.toString(16)}`
    }

    if (args.method === 'eth_sendTransaction') {
      const address = await this.getAddress()

      const walletClient = getViemWalletClient({
        chainId: this.chainId,
        account: address as Hash,
        rpcUrl: this.getRpcUrl(),
      })

      const preparedTransaction = await walletClient.prepareTransactionRequest({
        ...args.params[0],
      })

      const signedTransaction = await this.signTransaction(preparedTransaction)

      const tx = await walletClient.sendRawTransaction({
        serializedTransaction: signedTransaction as Hash,
      })

      return tx
    }

    const client = await this.getClient()

    return client.request({
      method: args.method as any,
      params: args.params as any,
    })
  }

  on(_event: string, _listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.')
  }

  once(_event: string, _listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.')
  }

  removeListener(_event: string, _listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.')
  }

  off(_event: string, _listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.')
  }
}
