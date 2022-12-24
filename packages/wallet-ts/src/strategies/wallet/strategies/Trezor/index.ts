/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import { addHexPrefix } from 'ethereumjs-util'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import Common, { Chain, Hardfork } from '@ethereumjs/common'
import TrezorConnect from 'trezor-connect'
import {
  ErrorType,
  TrezorException,
  UnspecifiedErrorCode,
  WalletException,
} from '@injectivelabs/exceptions'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { TxResponse } from '@injectivelabs/sdk-ts'
import { TIP_IN_GWEI } from '../../../../utils/constants'
import {
  ConcreteWalletStrategy,
  EthereumWalletStrategyArgs,
} from '../../../types'
import { TrezorWalletInfo } from '../../types'
import BaseConcreteStrategy from '../Base'
import {
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from '../../constants'
import TrezorHW from './hw'
import { transformTypedData } from './utils'
import { WalletAction, WalletDeviceType } from '../../../../types/enums'

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

const getNetworkFromChainId = (chainId: EthereumChainId): Chain => {
  if (chainId === EthereumChainId.Goerli) {
    return Chain.Goerli
  }

  if (chainId === EthereumChainId.Kovan) {
    return Chain.Kovan
  }

  return Chain.Mainnet
}

export default class Trezor
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private trezor: TrezorHW

  constructor(args: EthereumWalletStrategyArgs) {
    super(args)
    this.trezor = new TrezorHW()
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Hardware)
  }

  public async getAddresses(): Promise<string[]> {
    try {
      await this.trezor.connect()
      const accountManager = await this.trezor.getAccountManager()
      const wallets = await accountManager.getWallets()

      return wallets.map((k) => k.address)
    } catch (e: unknown) {
      throw new TrezorException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
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
    options: { address: string; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    const signedTransaction = await this.signEthereumTransaction(
      txData,
      options,
    )

    try {
      const txReceipt = await this.getWeb3().eth.sendSignedTransaction(
        addHexPrefix(signedTransaction.serialize().toString('hex')),
      )

      return txReceipt.transactionHash
    } catch (e: unknown) {
      throw new TrezorException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEthereumTransaction,
      })
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async sendTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<TxResponse> {
    throw new TrezorException(
      new Error(
        'sendTransaction is not supported. Trezor only supports sending transaction to Ethereum',
      ),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
      },
    )
  }

  /** @deprecated */
  async signTransaction(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    return this.signEip712TypedData(eip712json, address)
  }

  async signEip712TypedData(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const object = JSON.parse(eip712json)
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

    try {
      await this.trezor.connect()
      const { derivationPath } = await this.getWalletForAddress(address)
      const response = await TrezorConnect.ethereumSignTypedData({
        path: derivationPath,
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

      if (!response.success) {
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(
          (response.payload && response.payload.error) || 'Unknown error',
        )
      }

      return response.payload.signature
    } catch (e: unknown) {
      throw new TrezorException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async signCosmosTransaction(_transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse> {
    throw new WalletException(
      new Error('This wallet does not support signing Cosmos transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
      },
    )
  }

  async getNetworkId(): Promise<string> {
    return (await this.getWeb3().eth.net.getId()).toString()
  }

  async getChainId(): Promise<string> {
    return (await this.getWeb3().eth.getChainId()).toString()
  }

  async getEthereumTransactionReceipt(txHash: string): Promise<string> {
    return Promise.resolve(txHash)
  }

  // eslint-disable-next-line class-methods-use-this
  async getPubKey(): Promise<string> {
    throw new WalletException(
      new Error('You can only fetch PubKey from Cosmos native wallets'),
    )
  }

  private async signEthereumTransaction(
    txData: any,
    options: { address: string; ethereumChainId: EthereumChainId },
  ) {
    const chainId = parseInt(options.ethereumChainId.toString(), 10)
    const nonce = await this.getWeb3().eth.getTransactionCount(options.address)

    const common = new Common({
      chain: getNetworkFromChainId(chainId),
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
        txData.maxPriorityFeePerGas || TIP_IN_GWEI.toString(16),
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
        throw new TrezorException(
          new Error(
            (response.payload && response.payload.error) ||
              'Something happened while signing with Trezor',
          ),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
            contextModule: WalletAction.SignEthereumTransaction,
          },
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
    } catch (e: unknown) {
      if (e instanceof TrezorException) {
        throw e
      }

      throw new TrezorException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignEthereumTransaction,
      })
    }
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
}
