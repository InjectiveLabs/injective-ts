import { toHex, serializeTransaction } from 'viem'
import {
  getEvmChainConfig,
  getViemPublicClient,
  getViemWalletClient,
} from '@injectivelabs/wallet-base'
import { loadTrezorConnect } from './lib.js'
import { transformTypedData } from '../utils.js'
import type { Hash } from 'viem'
import type { Eip1193Provider } from '@injectivelabs/wallet-base'
import type { BaseTrezorTransport } from './hw/index.js'

type EthereumTransactionEIP1559 = {
  to: string
  value: string
  gasLimit: string
  gasPrice?: typeof undefined
  nonce: string
  data?: string
  chainId: number
  maxFeePerGas: string
  maxPriorityFeePerGas: string
}

export class TrezorEip1193Provider implements Eip1193Provider {
  private readonly trezor: BaseTrezorTransport
  private readonly derivationPath: string

  private address?: string
  private chainId: number

  constructor(
    trezor: BaseTrezorTransport,
    params: { derivationPath?: string; chainId?: string },
  ) {
    this.trezor = trezor
    this.derivationPath = params.derivationPath || "m/44'/60'/0'/0/0"
    this.chainId = parseInt(params.chainId || '1')
  }

  async getClient() {
    return getViemWalletClient({
      chainId: this.chainId,
      account: (await this.getAddress()) as Hash,
    })
  }

  async setChainId(chainId: string) {
    this.chainId = parseInt(chainId.replace('0x', ''), 16)
  }

  async getAddress() {
    if (!this.address) {
      const TrezorConnect = await loadTrezorConnect()
      await this.trezor.connect()

      const response = await TrezorConnect.ethereumGetAddress({
        path: this.derivationPath,
        showOnTrezor: false,
      })

      if (!response.success) {
        throw new Error(
          (response.payload && response.payload.error) ||
            'Failed to get address from Trezor',
        )
      }

      this.address = response.payload.address
    }

    return this.address
  }

  async signTypedData(data: string) {
    const TrezorConnect = await loadTrezorConnect()
    await this.trezor.connect()

    const object = JSON.parse(data)
    const compatibleObject = {
      ...object,
      domain: {
        ...object.domain,
        chainId: object.domain.chainId,
        salt: '0',
      },
    }
    const dataWithHashes = transformTypedData(compatibleObject)
    const {
      types: { EIP712Domain = [], ...otherTypes } = {},
      message = {},
      domain = {},
      primaryType,
      domain_separator_hash,
      message_hash,
    } = dataWithHashes

    const response = await TrezorConnect.ethereumSignTypedData({
      path: this.derivationPath,
      data: {
        types: { EIP712Domain, ...otherTypes },
        message,
        domain,
        primaryType,
      },
      message_hash,
      domain_separator_hash,
      metamask_v4_compat: true,
    })

    if (
      'code' in response.payload &&
      response.payload.code === 'Failure_ActionCancelled'
    ) {
      throw new Error('Request rejected')
    }

    if (!response.success) {
      throw new Error(
        (response.payload && response.payload.error) || 'Unknown error',
      )
    }

    return response.payload.signature
  }

  async signTransaction(txData: any) {
    const TrezorConnect = await loadTrezorConnect()
    await this.trezor.connect()

    const parseHexValue = (value: string | number | bigint) => {
      if (typeof value === 'string') {
        const hexValue = value.startsWith('0x') ? value : `0x${value}`
        return BigInt(hexValue)
      }
      return BigInt(value)
    }

    const chainId = txData.chainId || this.chainId
    const valueBigInt = parseHexValue(txData.value || '0x0')
    const gasBigInt = parseHexValue(txData.gas || txData.gasLimit)
    const maxFeePerGasBigInt = parseHexValue(txData.maxFeePerGas)
    const maxPriorityFeePerGasBigInt = parseHexValue(
      txData.maxPriorityFeePerGas,
    )

    // Create transaction data for Trezor API (needs hex strings)
    const trezorTxData = {
      to: txData.to,
      value: toHex(valueBigInt),
      gasLimit: toHex(gasBigInt),
      nonce: toHex(txData.nonce),
      data: txData.data || '0x',
      chainId,
      maxFeePerGas: toHex(maxFeePerGasBigInt),
      maxPriorityFeePerGas: toHex(maxPriorityFeePerGasBigInt),
    } as EthereumTransactionEIP1559

    const response = await TrezorConnect.ethereumSignTransaction({
      path: this.derivationPath,
      transaction: trezorTxData,
    })

    if (!response.success) {
      throw new Error(
        (response.payload && response.payload.error) ||
          'Something happened while signing with Trezor',
      )
    }

    // Create viem-compatible transaction data for serialization
    const viemTxData = {
      type: 'eip1559' as const,
      chainId,
      nonce: txData.nonce,
      to: txData.to as Hash,
      value: valueBigInt,
      data: (txData.data || '0x') as Hash,
      gas: gasBigInt,
      maxFeePerGas: maxFeePerGasBigInt,
      maxPriorityFeePerGas: maxPriorityFeePerGasBigInt,
      v: BigInt(response.payload.v),
      r: response.payload.r as Hash,
      s: response.payload.s as Hash,
    }

    return serializeTransaction(viemTxData)
  }

  async signMessage(message: string) {
    const TrezorConnect = await loadTrezorConnect()
    await this.trezor.connect()

    const response = await TrezorConnect.ethereumSignMessage({
      path: this.derivationPath,
      message,
    })

    if (!response.success) {
      throw new Error(
        (response.payload && response.payload.error) || 'Unknown error',
      )
    }

    const signature = response.payload.signature
    return signature.startsWith('0x') ? signature : `0x${signature}`
  }

  getChain() {
    return getEvmChainConfig(this.chainId)
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
      return this.setChainId(args.params[0]?.chainId || '0x1')
    }

    if (args.method === 'eth_estimateGas') {
      const client = getViemPublicClient(this.chainId)

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

      const client = getViemPublicClient(this.chainId)

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
