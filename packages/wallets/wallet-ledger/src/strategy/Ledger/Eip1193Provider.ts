import { Eip1193Provider } from '@injectivelabs/wallet-base'
import { DEFAULT_BASE_DERIVATION_PATH } from '@injectivelabs/wallet-base'
import LedgerHW from './hw/index.js'
import { Client, createClient, extractChain, http } from 'viem'
import * as viemChains from 'viem/chains'

export class LedgerEip1193Provider implements Eip1193Provider {
  private readonly ledger: LedgerHW
  private readonly derivationPath: string

  private client: Client

  constructor(
    ledger: LedgerHW,
    params: { derivationPath?: string; chainId?: string },
  ) {
    this.ledger = ledger
    this.derivationPath = params.derivationPath || DEFAULT_BASE_DERIVATION_PATH

    const chain = extractChain({
      id: parseInt(params.chainId || '1'),
      chains: Object.values(viemChains) as viemChains.Chain[],
    })

    this.client = createClient({
      transport: http(),
      chain,
    })
  }

  async setChainId(chainId: string) {
    this.client = createClient({
      transport: http(),
      chain: extractChain({
        id: parseInt(chainId.replace('0x', ''), 16),
        chains: Object.values(viemChains) as viemChains.Chain[],
      }),
    })
  }

  async getAddress() {
    const ledgerInstance = await this.ledger.getInstance()
    const { address } = await ledgerInstance.getAddress(this.derivationPath)

    return address
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

  async signTransaction(rawTxHex: string) {
    const ledgerInstance = await this.ledger.getInstance()
    const result = await ledgerInstance.signTransaction(
      this.derivationPath,
      rawTxHex,
    )

    const combined = `${result.r}${result.s}${parseInt(result.v).toString(16)}`

    return combined.startsWith('0x') ? combined : `0x${combined}`
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

  async request(args: { method: string; params: any[] }): Promise<any> {
    switch (args.method) {
      case 'eth_sign':
        return this.signMessage(args.params[0])
      case 'eth_signTransaction':
        return this.signTransaction(args.params[0])
      case 'eth_signTypedData':
        return this.signTypedData(args.params[0])
      case 'eth_chainId':
        return `0x${this.client.chain?.id?.toString(16)}`
      case 'wallet_switchEthereumChain':
        return this.setChainId(args.params[0]?.chainId || '0x1') // TODO: fallback to wallet strategy chainid

      default:
        return this.client.request({
          method: args.method as any,
          params: args.params as any,
        })
    }
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
