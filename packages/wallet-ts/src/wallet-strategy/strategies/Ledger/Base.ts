/* eslint-disable class-methods-use-this */
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import { TypedDataUtils } from 'eth-sig-util'
import { bufferToHex, addHexPrefix } from 'ethereumjs-util'
import ledgerService from '@ledgerhq/hw-app-eth/lib/services/ledger'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import Web3 from 'web3'
import {
  ConcreteWalletStrategy,
  LedgerDerivationPathType,
  LedgerWalletInfo,
} from '../../types'
import BaseConcreteStrategy from '../Base'
import {
  DEFAULT_BASE_DERIVATION_PATH,
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from '../../constants'
import LedgerHW from './hw'

const domainHash = (message: any) =>
  TypedDataUtils.hashStruct('EIP712Domain', message.domain, message.types, true)

const messageHash = (message: any) =>
  TypedDataUtils.hashStruct(
    message.primaryType,
    message.message,
    message.types,
    true,
  )

const commonLockedErrors = (error: any) => {
  const message = error.message || error

  return !!(
    message.includes('Ledger device: Incorrect length') ||
    message.includes('Ledger device: INS_NOT_SUPPORTED') ||
    message.includes('Ledger device: CLA_NOT_SUPPORTED') ||
    message.includes('Failed to open the device') ||
    message.includes('Failed to open the device') ||
    message.includes('Ledger Device is busy') ||
    message.includes('UNKNOWN_ERROR')
  )
}

export default class LedgerBase
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private baseDerivationPath: string

  private derivationPathType: LedgerDerivationPathType

  private ledger: LedgerHW

  constructor({
    chainId,
    web3,
    ethereumChainId,
    derivationPathType,
  }: {
    ethereumChainId: EthereumChainId
    chainId: ChainId
    web3: Web3
    derivationPathType: LedgerDerivationPathType
  }) {
    super({ chainId, web3, ethereumChainId })

    this.baseDerivationPath = DEFAULT_BASE_DERIVATION_PATH
    this.derivationPathType = derivationPathType
    this.ledger = new LedgerHW()
  }

  public async getAddresses(): Promise<string[]> {
    const { baseDerivationPath, derivationPathType } = this

    try {
      const accountManager = await this.ledger.getAccountManager()
      const wallets = await accountManager.getWallets(
        baseDerivationPath,
        derivationPathType,
      )
      return wallets.map((k) => k.address)
    } catch (e: any) {
      throw new Error(
        commonLockedErrors(e)
          ? 'Please ensure your Ledger is connected, unlocked and your Ethereum app is open'
          : `Ledger: ${e.message || e}`,
      )
    }
  }

  async confirm(address: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  async sendEthereumTransaction(
    txData: any,
    options: {
      address: string
      ethereumChainId: EthereumChainId
    },
  ): Promise<string> {
    const signedTransaction = await this.signEthereumTransaction(
      txData,
      options,
    )

    try {
      const txReceipt = await this.web3.eth.sendSignedTransaction(
        addHexPrefix(signedTransaction.serialize().toString('hex')),
      )

      return txReceipt.transactionHash
    } catch (e: any) {
      throw new Error(
        commonLockedErrors(e)
          ? 'Please ensure your Ledger is connected, unlocked and your Ethereum app is open'
          : `Ledger: ${e.message || e}`,
      )
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async sendTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    throw new Error(
      'sendTransaction is not supported. Ledger only supports sending transaction to Ethereum',
    )
  }

  /**
   * When using Ethereum based wallets, the cosmos transaction
   * is being converted to EIP712 and then sent for signing
   */
  async signTransaction(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const { derivationPath } = await this.getWalletForAddress(address)
    const object = JSON.parse(eip712json)

    try {
      const ledger = await this.ledger.getInstance()
      const result = await ledger.signEIP712HashedMessage(
        derivationPath,
        bufferToHex(domainHash(object)),
        bufferToHex(messageHash(object)),
      )

      const combined = `${result.r}${result.s}${result.v.toString(16)}`

      return combined.startsWith('0x') ? combined : `0x${combined}`
    } catch (e: any) {
      throw new Error(
        commonLockedErrors(e)
          ? 'Please ensure your Ledger is connected, unlocked and your Ethereum app is open'
          : `Ledger: ${e.message || e}`,
      )
    }
  }

  private async signEthereumTransaction(
    txData: any,
    options: { address: string; ethereumChainId: EthereumChainId },
  ) {
    const chainId = parseInt(options.ethereumChainId.toString(), 10)
    const isMainnet = chainId === EthereumChainId.Mainnet
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
        txData.maxPriorityFeePerGas || '0x77359400' /* 2 Gwei in HEX */,
      ),
    }

    const tx = FeeMarketEIP1559Transaction.fromTxData(eip1559TxData, { common })
    const msg = tx.getMessageToSign(false)
    // const encodedMessage = msg
    const encodedMessageHex = msg.toString('hex')

    try {
      const ledger = await this.ledger.getInstance()
      const { derivationPath } = await this.getWalletForAddress(options.address)
      const resolution = await ledgerService.resolveTransaction(
        encodedMessageHex,
        {},
        {},
      )
      const txSig = await ledger.signTransaction(
        derivationPath,
        encodedMessageHex,
        resolution,
      )
      const signedTxData = {
        ...eip1559TxData,
        v: `0x${txSig.v}`,
        r: `0x${txSig.r}`,
        s: `0x${txSig.s}`,
      }

      return FeeMarketEIP1559Transaction.fromTxData(signedTxData, {
        common,
      })
    } catch (e: any) {
      throw new Error(
        commonLockedErrors(e)
          ? 'Please ensure your Ledger is connected, unlocked and your Ethereum app is open'
          : `Ledger: ${e.message || e}`,
      )
    }
  }

  async getNetworkId(): Promise<string> {
    return (await this.web3.eth.net.getId()).toString()
  }

  async getChainId(): Promise<string> {
    return (await this.web3.eth.getChainId()).toString()
  }

  async getEthereumTransactionReceipt(txHash: string): Promise<string> {
    return Promise.resolve(txHash)
  }

  private async getWalletForAddress(
    address: string,
  ): Promise<LedgerWalletInfo> {
    const { baseDerivationPath, derivationPathType } = this
    const accountManager = await this.ledger.getAccountManager()

    if (!accountManager.hasWalletForAddress(address)) {
      for (
        let i = 0;
        i < DEFAULT_ADDRESS_SEARCH_LIMIT / DEFAULT_NUM_ADDRESSES_TO_FETCH;
        i += 1
      ) {
        await accountManager.getWallets(baseDerivationPath, derivationPathType)

        if (accountManager.hasWalletForAddress(address)) {
          return (await accountManager.getWalletForAddress(
            address,
          )) as LedgerWalletInfo
        }
      }
    }

    return (await accountManager.getWalletForAddress(
      address,
    )) as LedgerWalletInfo
  }
}
