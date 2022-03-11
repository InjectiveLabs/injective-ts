/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import { addHexPrefix } from 'ethereumjs-util'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import TrezorConnect from 'trezor-connect'
import Web3 from 'web3'
import { ConcreteWeb3Strategy, TrezorWalletInfo } from '../../types'
import BaseConcreteStrategy from '../Base'
import {
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from '../../constants'
import TrezorHW from './hw'
import { transformTypedData } from './utils'

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

export default class Trezor
  extends BaseConcreteStrategy
  implements ConcreteWeb3Strategy
{
  private trezor: TrezorHW

  constructor({ chainId, web3 }: { chainId: ChainId; web3: Web3 }) {
    super({ chainId, web3 })

    this.trezor = new TrezorHW()
  }

  public async getAddresses(): Promise<string[]> {
    try {
      await this.trezor.connect()
      const accountManager = await this.trezor.getAccountManager()
      const wallets = await accountManager.getWallets()

      return wallets.map((k) => k.address)
    } catch (e: any) {
      throw new Error(`Trezor: ${e.message || e}`)
    }
  }

  async confirm(address: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  async sendTransaction(
    txData: any,
    options: { address: string; chainId: ChainId },
  ): Promise<string> {
    const signedTransaction = await this.signTransaction(txData, options)

    try {
      const txReceipt = await this.web3.eth.sendSignedTransaction(
        addHexPrefix(signedTransaction.serialize().toString('hex')),
      )

      return txReceipt.transactionHash
    } catch (e: any) {
      throw new Error(`Trezor: ${e.message || e}`)
    }
  }

  async signTypedDataV4(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const object = JSON.parse(eip712json)
    const compatibleObject = {
      ...object,
      domain: {
        ...object.domain,
        chainId: parseInt(object.domain.chainId, 16),
        salt: Date.now().toString(),
      },
    }
    const dataWithHashes = transformTypedData(compatibleObject)

    try {
      await this.trezor.connect()
      const { derivationPath } = await this.getWalletForAddress(address)
      const response = await TrezorConnect.ethereumSignTypedData({
        path: derivationPath,
        data: dataWithHashes,
        message_hash: dataWithHashes.message_hash,
        domain_separator_hash: dataWithHashes.domain_separator_hash,
        metamask_v4_compat: false,
      })

      if (!response.success) {
        throw new Error(
          (response.payload && response.payload.error) || 'Unknown error',
        )
      }

      return response.payload.signature
    } catch (e: any) {
      throw new Error(`Trezor: ${e.message || e}`)
    }
  }

  private async signTransaction(
    txData: any,
    options: { address: string; chainId: ChainId },
  ) {
    const chainId = parseInt(options.chainId.toString(), 10)
    const isMainnet = chainId === ChainId.Mainnet
    const nonce = await this.web3.eth.getTransactionCount(options.address)

    const common = new Common({
      chain: isMainnet ? Chain.Mainnet : Chain.Kovan,
      hardfork: Hardfork.London,
    })

    const eip1559TxData = {
      from: txData.from,
      data: txData.data,
      to: txData.to,
      nonce: addHexPrefix(nonce.toString(16)),
      gas: addHexPrefix(txData.gas),
      gasLimit: addHexPrefix(txData.gas),
      maxFeePerGas: addHexPrefix(txData.gasPrice || txData.maxFeePerGas),
      maxPriorityFeePerGas: addHexPrefix(
        txData.maxPriorityFeePerGas || '0xB2D05E00' /* 3 Gwei in HEX */,
      ),
    }
    const tx = FeeMarketEIP1559Transaction.fromTxData(eip1559TxData, {
      common,
    })

    const transaction = {
      ...tx.toJSON(),
      chainId,
    } as EthereumTransactionEIP1559

    try {
      await this.trezor.connect()
      const { derivationPath } = await this.getWalletForAddress(options.address)
      const response = await TrezorConnect.ethereumSignTransaction({
        path: derivationPath,
        transaction,
      })

      if (!response.success) {
        throw new Error(
          (response.payload && response.payload.error) ||
            'Something happened while signing with Trezor',
        )
      }

      const signedTxData = {
        ...eip1559TxData,
        v: `${response.payload.v}`,
        r: `${response.payload.r}`,
        s: `${response.payload.s}`,
      }

      return FeeMarketEIP1559Transaction.fromTxData(signedTxData, {
        common,
      })
    } catch (e: any) {
      throw new Error(`Trezor: ${e.message || e}`)
    }
  }

  async getNetworkId(): Promise<string> {
    return (await this.web3.eth.net.getId()).toString()
  }

  async getChainId(): Promise<string> {
    return (await this.web3.eth.getChainId()).toString()
  }

  async getTransactionReceipt(txHash: string): Promise<string> {
    return Promise.resolve(txHash)
  }

  private async getWalletForAddress(
    address: string,
  ): Promise<TrezorWalletInfo> {
    const accountManager = await this.trezor.getAccountManager()

    if (!accountManager.hasWalletForAddress(address)) {
      for (
        let i = 0;
        i < DEFAULT_ADDRESS_SEARCH_LIMIT / DEFAULT_NUM_ADDRESSES_TO_FETCH;
        i += 1
      ) {
        await accountManager.getWallets()

        if (accountManager.hasWalletForAddress(address)) {
          return (await accountManager.getWalletForAddress(
            address,
          )) as TrezorWalletInfo
        }
      }
    }

    return (await accountManager.getWalletForAddress(
      address,
    )) as TrezorWalletInfo
  }

  isWeb3Connected = (): boolean => true

  isMetamask = (): boolean => false
}
