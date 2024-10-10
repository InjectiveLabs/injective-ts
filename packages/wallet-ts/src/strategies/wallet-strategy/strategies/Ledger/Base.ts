/* eslint-disable class-methods-use-this */
import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import { bufferToHex, addHexPrefix } from 'ethereumjs-util'
import { Common, Chain, Hardfork } from '@ethereumjs/common'
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import {
  ErrorType,
  GeneralException,
  LedgerException,
  TransactionException,
  UnspecifiedErrorCode,
  WalletException,
} from '@injectivelabs/exceptions'
import { DirectSignResponse } from '@cosmjs/proto-signing'
import { TxGrpcApi, TxRaw, TxResponse, toUtf8 } from '@injectivelabs/sdk-ts'
import { TIP_IN_GWEI } from '../../../../utils/constants'
import {
  ConcreteWalletStrategy,
  EthereumWalletStrategyArgs,
  WalletStrategyEthereumOptions,
} from '../../../types'
import {
  LedgerDerivationPathType,
  LedgerWalletInfo,
  SendTransactionOptions,
} from '../../types'
import BaseConcreteStrategy from '../Base'
import {
  DEFAULT_BASE_DERIVATION_PATH,
  DEFAULT_ADDRESS_SEARCH_LIMIT,
  DEFAULT_NUM_ADDRESSES_TO_FETCH,
} from '../../constants'
import LedgerHW from './hw'
import { domainHash, messageHash } from './utils'
import { WalletAction, WalletDeviceType } from '../../../../types/enums'
import { getKeyFromRpcUrl } from '../../../../utils/alchemy'
import { Alchemy, Network as AlchemyNetwork } from 'alchemy-sdk'

const getNetworkFromChainId = (chainId: EthereumChainId): Chain => {
  if (chainId === EthereumChainId.Goerli) {
    return Chain.Goerli
  }

  if (chainId === EthereumChainId.Sepolia) {
    return Chain.Sepolia
  }

  if (chainId === EthereumChainId.Kovan) {
    return Chain.Goerli
  }

  return Chain.Mainnet
}

export default class LedgerBase
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private baseDerivationPath: string

  private derivationPathType: LedgerDerivationPathType

  private ledger: LedgerHW

  private ethereumOptions: WalletStrategyEthereumOptions

  private alchemy: Alchemy | undefined

  constructor(
    args: EthereumWalletStrategyArgs & {
      derivationPathType: LedgerDerivationPathType
    },
  ) {
    super(args)

    this.baseDerivationPath = DEFAULT_BASE_DERIVATION_PATH
    this.derivationPathType = args.derivationPathType
    this.ledger = new LedgerHW()
    this.ethereumOptions = args.ethereumOptions
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Hardware)
  }

  async enable(): Promise<boolean> {
    return Promise.resolve(true)
  }

  public async disconnect() {
    this.ledger = await this.ledger.refresh()
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
    } catch (e: unknown) {
      throw new LedgerException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  async getSessionOrConfirm(address: AccountAddress): Promise<string> {
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
      const alchemy = await this.getAlchemy()
      const txReceipt = await alchemy.core.sendTransaction(
        addHexPrefix(signedTransaction.serialize().toString('hex')),
      )

      return txReceipt.hash
    } catch (e: unknown) {
      throw new LedgerException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEthereumTransaction,
      })
    }
  }

  async sendTransaction(
    transaction: TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse> {
    const { endpoints, txTimeout } = options

    if (!endpoints) {
      throw new WalletException(
        new Error(
          'You have to pass endpoints.grpc within the options for using Ethereum native wallets',
        ),
      )
    }

    const txApi = new TxGrpcApi(endpoints.grpc)
    const response = await txApi.broadcast(transaction, { txTimeout })

    if (response.code !== 0) {
      throw new TransactionException(new Error(response.rawLog), {
        code: UnspecifiedErrorCode,
        contextCode: response.code,
        contextModule: response.codespace,
      })
    }

    return response
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
    } catch (e: unknown) {
      throw new LedgerException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  async signAminoCosmosTransaction(_transaction: {
    signDoc: any
    accountNumber: number
    chainId: string
    address: string
  }): Promise<string> {
    throw new WalletException(
      new Error('This wallet does not support signing Cosmos transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
      },
    )
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

  async signArbitrary(
    signer: AccountAddress,
    data: string | Uint8Array,
  ): Promise<string> {
    try {
      const { derivationPath } = await this.getWalletForAddress(signer)

      const ledger = await this.ledger.getInstance()
      const result = await ledger.signPersonalMessage(
        derivationPath,
        Buffer.from(toUtf8(data), 'utf8').toString('hex'),
      )

      const combined = `${result.r}${result.s}${result.v.toString(16)}`

      return combined.startsWith('0x') ? combined : `0x${combined}`
    } catch (e: unknown) {
      throw new LedgerException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  async getEthereumChainId(): Promise<string> {
    const alchemy = await this.getAlchemy()
    const alchemyProvider = await alchemy.config.getProvider()

    return alchemyProvider.network.chainId.toString()
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
    const alchemy = await this.getAlchemy()
    const chainId = parseInt(options.ethereumChainId.toString(), 10)
    const nonce = await alchemy.core.getTransactionCount(options.address)

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

    const tx = FeeMarketEIP1559Transaction.fromTxData(eip1559TxData, { common })
    const msg = tx.getMessageToSign(false)
    // const encodedMessage = msg
    const encodedMessageHex = msg.toString('hex')

    try {
      const ledger = await this.ledger.getInstance()
      const { derivationPath } = await this.getWalletForAddress(options.address)
      const ledgerService = await import(
        '@ledgerhq/hw-app-eth/lib/services/ledger'
      )
      const resolution = await ledgerService.default.resolveTransaction(
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
    } catch (e: unknown) {
      throw new LedgerException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignEthereumTransaction,
      })
    }
  }

  private async getWalletForAddress(
    address: string,
  ): Promise<LedgerWalletInfo> {
    try {
      const { baseDerivationPath, derivationPathType } = this
      const accountManager = await this.ledger.getAccountManager()

      if (!accountManager.hasWalletForAddress(address)) {
        for (
          let i = 0;
          i < DEFAULT_ADDRESS_SEARCH_LIMIT / DEFAULT_NUM_ADDRESSES_TO_FETCH;
          i += 1
        ) {
          await accountManager.getWallets(
            baseDerivationPath,
            derivationPathType,
          )

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
    } catch (e) {
      throw new LedgerException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  private async getAlchemy() {
    if (this.alchemy) {
      return this.alchemy
    }

    const { rpcUrl, ethereumChainId } = this.ethereumOptions

    if (!rpcUrl) {
      throw new GeneralException(
        new Error('Please pass rpcUrl within the ethereumOptions'),
      )
    }

    this.alchemy = new Alchemy({
      apiKey: getKeyFromRpcUrl(rpcUrl),
      network:
        ethereumChainId === EthereumChainId.Mainnet
          ? AlchemyNetwork.ETH_MAINNET
          : AlchemyNetwork.ETH_SEPOLIA,
    })

    return this.alchemy
  }
}
