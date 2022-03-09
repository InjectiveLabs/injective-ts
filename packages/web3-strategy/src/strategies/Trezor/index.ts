/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import { AccountAddress, ChainId } from '@injectivelabs/ts-types'
import { addHexPrefix } from 'ethereumjs-util'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import TrezorConnect from 'trezor-connect'
import {
  ConcreteStrategyOptions,
  ConcreteWeb3Strategy,
  TrezorWalletInfo,
} from '../../types'
import BaseConcreteStrategy from '../Base'
import {
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from '../../constants'
import TrezorHW from './hw'
import { transformTypedData } from './utils'

export default class Trezor
  extends BaseConcreteStrategy
  implements ConcreteWeb3Strategy
{
  private trezor: TrezorHW

  constructor({
    chainId,
    options,
  }: {
    chainId: ChainId
    options: ConcreteStrategyOptions
  }) {
    super({ chainId, options })

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
    const { derivationPath } = await this.getWalletForAddress(address)
    const object = JSON.parse(eip712json)
    const dataWithHashes = transformTypedData(object)
    const {
      types: { EIP712Domain = [], ...otherTypes } = {},
      message = {},
      domain = {},
      primaryType,
      domain_separator_hash,
      message_hash,
    } = dataWithHashes

    try {
      await this.trezor.connect()
      const response = await TrezorConnect.ethereumSignTypedData({
        path: derivationPath,
        data: {
          types: { EIP712Domain, ...otherTypes },
          message,
          domain,
          primaryType,
        },
        metamask_v4_compat: true,
        domain_separator_hash,
        message_hash,
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
      value: '',
      chainId,
      nonce: addHexPrefix(nonce.toString(16)),
      gas: addHexPrefix(txData.gas),
      gasLimit: addHexPrefix(txData.gas),
      maxFeePerGas: addHexPrefix(txData.gasPrice || txData.maxFeePerGas),
      maxPriorityFeePerGas: addHexPrefix(
        txData.maxPriorityFeePerGas || '0xB2D05E00' /* 3 Gwei in HEX */,
      ),
    }

    try {
      await this.trezor.connect()
      const { derivationPath } = await this.getWalletForAddress(options.address)
      const response = await TrezorConnect.ethereumSignTransaction({
        path: derivationPath,
        transaction: eip1559TxData,
      })

      if (!response.success) {
        throw new Error(
          (response.payload && response.payload.error) ||
            'Something happened while signing with Trezor',
        )
      }

      const signedTxData = {
        ...eip1559TxData,
        v: `0x${response.payload.v}`,
        r: `0x${response.payload.r}`,
        s: `0x${response.payload.s}`,
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
