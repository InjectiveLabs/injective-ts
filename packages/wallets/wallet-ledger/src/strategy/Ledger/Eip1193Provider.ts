import { Eip1193Provider } from '@injectivelabs/wallet-base'

import LedgerHW from './hw/index.js'
import {
  createPublicClient,
  createWalletClient,
  extractChain,
  http,
  serializeTransaction,
} from 'viem'
import * as viemChains from 'viem/chains'
import { loadLedgerServiceType } from '../lib.js'

export class LedgerEip1193Provider implements Eip1193Provider {
  private readonly ledger: LedgerHW
  private readonly derivationPath: string

  private address?: string
  private chainId: number

  constructor(
    ledger: LedgerHW,
    params: { derivationPath?: string; chainId?: string },
  ) {
    this.ledger = ledger
    this.derivationPath = "m/44'/60'/0'/0/0"

    this.chainId = parseInt(params.chainId || '1')
  }

  async getClient() {
    const chain = extractChain({
      id: this.chainId,
      chains: Object.values(viemChains) as viemChains.Chain[],
    })

    return createWalletClient({
      transport: http(),
      chain,
      account: (await this.getAddress()) as `0x${string}`,
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

    const combined = `${result.r}${result.s}${result.v.toString(16)}`

    return combined.startsWith('0x') ? combined : `0x${combined}`
  }

  async signTransaction(txData: any) {
    const ledgerInstance = await this.ledger.getInstance()

    const serializedTransaction = serializeTransaction(txData)

    const ledgerService = await loadLedgerServiceType()

    const resolution = await ledgerService.resolveTransaction(
      serializedTransaction.substring(2),
      {},
      {},
    )

    const signature = await ledgerInstance.signTransaction(
      this.derivationPath,
      serializedTransaction.substring(2),
      resolution,
    )

    const signedTransaction = serializeTransaction(txData, {
      r: signature.r as `0x${string}`,
      s: signature.s as `0x${string}`,
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

    const combined = `${result.r}${result.s}${result.v.toString(16)}`

    return combined.startsWith('0x') ? combined : `0x${combined}`
  }

  getChain() {
    return extractChain({
      id: this.chainId,
      chains: Object.values(viemChains) as viemChains.Chain[],
    })
  }

  async request(args: { method: string; params: any[] }): Promise<any> {
    if (args.method === 'eth_requestAccounts') {
      const address = await this.getAddress()

      return [address]
    }

    if (args.method === 'eth_sign') {
      if (!args.params[0]) throw new Error('Missing parameter for eth_sign')
      return this.signMessage(args.params[0])
    }

    if (args.method === 'eth_signTransaction') {
      if (!args.params[0])
        throw new Error('Missing parameter for eth_signTransaction')
      return this.signTransaction(args.params[0])
    }

    if (args.method === 'eth_signTypedData') {
      if (!args.params[0])
        throw new Error('Missing parameter for eth_signTypedData')
      return this.signTypedData(args.params[0])
    }

    if (args.method === 'eth_chainId') {
      return `0x${this.chainId.toString(16)}`
    }

    if (args.method === 'wallet_switchEthereumChain') {
      return this.setChainId(args.params[0]?.chainId || '0x1') // TODO: fallback to wallet strategy chainid
    }

    if (args.method === 'eth_estimateGas') {
      const client = createPublicClient({
        chain: this.getChain(),
        transport: http(),
      })

      const data = {
        to: args.params[0].to,
        value: args.params[0].value,
        data: args.params[0].data,
        account: (await this.getAddress()) as `0x${string}`,
      }

      const estimate = await client.estimateGas(data)

      return `0x${estimate.toString(16)}`
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
        address: (await this.getAddress()) as `0x${string}`,
        blockTag: 'pending',
      })

      return `0x${count.toString(16)}`
    }

    if (args.method === 'eth_sendTransaction') {
      const address = await this.getAddress()

      const walletClient = createWalletClient({
        transport: http(),
        chain: this.getChain(),
        account: address as `0x${string}`,
      })

      const preparedTransaction = await walletClient.prepareTransactionRequest({
        ...args.params[0],
      })

      const signedTransaction = await this.signTransaction(preparedTransaction)

      const tx = await walletClient.sendRawTransaction({
        serializedTransaction: signedTransaction as `0x${string}`,
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
