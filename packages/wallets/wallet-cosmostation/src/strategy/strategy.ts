/* eslint-disable class-methods-use-this */
import {
  toUtf8,
  TxResponse,
  AminoSignResponse,
  DirectSignResponse,
  createTxRawFromSigResponse,
  createSignDocFromTransaction,
} from '@injectivelabs/sdk-ts'
import {
  ChainId,
  CosmosChainId,
  AccountAddress,
  EthereumChainId,
} from '@injectivelabs/ts-types'
import {
  ErrorType,
  UnspecifiedErrorCode,
  CosmosWalletException,
  TransactionException,
} from '@injectivelabs/exceptions'
import {
  StdSignDoc,
  WalletAction,
  WalletDeviceType,
  BaseConcreteStrategy,
  ConcreteWalletStrategy,
  type ConcreteCosmosWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import { CosmosTxV1Beta1Tx } from '@injectivelabs/sdk-ts'
import { InstallError, Cosmos } from '@cosmostation/extension-client'
import { makeSignDoc } from '@cosmjs/proto-signing'
import { SEND_TRANSACTION_MODE } from '@cosmostation/extension-client/cosmos.js'
import { CosmostationWallet } from './../wallet.js'

const getChainNameFromChainId = (chainId: CosmosChainId | ChainId) => {
  const [chainName] = chainId.split('-')

  if (chainName.includes('cosmoshub')) {
    return 'cosmos'
  }

  if (chainName.includes('core')) {
    return 'persistence'
  }

  if (chainName.includes('evmos')) {
    return 'evmos'
  }

  if (chainId.includes('ssc') || chainId.includes('fetch')) {
    return chainId
  }

  return chainName
}

export class Cosmostation
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private cosmostationWallet?: Cosmos
  public chainName: string

  constructor(args: { chainId: ChainId | CosmosChainId }) {
    super(args as ConcreteCosmosWalletStrategyArgs)

    this.chainId = args.chainId || CosmosChainId.Injective
    this.chainName = getChainNameFromChainId(this.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async enable(): Promise<boolean> {
    return Promise.resolve(true)
  }

  async getAddresses(): Promise<string[]> {
    const cosmostationWallet = await this.getCosmostationWallet()

    try {
      const accounts = await cosmostationWallet.requestAccount(this.chainName)

      return [accounts.address]
    } catch (e: unknown) {
      if ((e as any).code === 4001) {
        throw new CosmosWalletException(
          new Error('The user rejected the request'),
          {
            code: UnspecifiedErrorCode,
            context: WalletAction.GetAccounts,
          },
        )
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  async getSessionOrConfirm(address?: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  // eslint-disable-next-line class-methods-use-this
  async sendEthereumTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    throw new CosmosWalletException(
      new Error(
        'sendEthereumTransaction is not supported. Cosmostation only supports sending cosmos transactions',
      ),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendEthereumTransaction,
      },
    )
  }

  async sendTransaction(
    transaction: DirectSignResponse | CosmosTxV1Beta1Tx.TxRaw,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<TxResponse> {
    const cosmostationWallet = await this.getCosmostationWallet()
    const txRaw = createTxRawFromSigResponse(transaction)

    try {
      const response = await cosmostationWallet.sendTransaction(
        this.chainName,
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
        SEND_TRANSACTION_MODE.SYNC,
      )

      return {
        ...response.tx_response,
        gasUsed: parseInt((response.tx_response.gas_used || '0') as string, 10),
        gasWanted: parseInt(
          (response.tx_response.gas_wanted || '0') as string,
          10,
        ),
        height: parseInt((response.tx_response.height || '0') as string, 10),
        txHash: response.tx_response.txhash as string,
        rawLog: response.tx_response.raw_log as string,
      } as TxResponse
    } catch (e: unknown) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new TransactionException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      })
    }
  }

  async signAminoCosmosTransaction(_transaction: {
    address: string
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    throw new CosmosWalletException(
      new Error('This wallet does not support signing using amino'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      },
    )
  }

  async signCosmosTransaction(transaction: {
    txRaw: CosmosTxV1Beta1Tx.TxRaw
    chainId: string
    address: string
    accountNumber: number
  }) {
    const { chainId } = this
    const cosmostationWallet = await this.getCosmostationWallet()
    const signDoc = createSignDocFromTransaction(transaction)

    try {
      /* Sign the transaction */
      const signDirectResponse = await cosmostationWallet.signDirect(
        this.chainName,
        {
          chain_id: chainId,
          body_bytes: signDoc.bodyBytes,
          auth_info_bytes: signDoc.authInfoBytes,
          account_number: signDoc.accountNumber.toString(),
        },
        { fee: true, memo: true },
      )

      return {
        signed: makeSignDoc(
          signDirectResponse.signed_doc.body_bytes,
          signDirectResponse.signed_doc.auth_info_bytes,
          signDirectResponse.signed_doc.chain_id,
          parseInt(signDirectResponse.signed_doc.account_number, 10),
        ),
        signature: {
          signature: signDirectResponse.signature,
        },
      } as DirectSignResponse
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      })
    }
  }

  async getPubKey(): Promise<string> {
    const cosmostationWallet = await this.getCosmostationWallet()

    try {
      const account = await cosmostationWallet.requestAccount(this.chainName)

      return Buffer.from(account.publicKey).toString('base64')
    } catch (e: unknown) {
      if ((e as any).code === 4001) {
        throw new CosmosWalletException(
          new Error('The user rejected the request'),
          {
            code: UnspecifiedErrorCode,
            context: WalletAction.GetAccounts,
          },
        )
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  async signEip712TypedData(
    _eip712TypedData: string,
    _address: AccountAddress,
  ): Promise<string> {
    throw new CosmosWalletException(
      new Error('This wallet does not support signing Ethereum transactions'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      },
    )
  }

  async signArbitrary(
    signer: string,
    data: string | Uint8Array,
  ): Promise<string> {
    try {
      const cosmostationWallet = await this.getCosmostationWallet()

      const signature = await cosmostationWallet.signMessage(
        this.chainName,
        signer,
        toUtf8(data),
      )

      return signature.signature
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SignArbitrary,
      })
    }
  }

  async getEthereumChainId(): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEthereumChainId is not supported on Cosmostation'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetChainId,
      },
    )
  }

  async getEthereumTransactionReceipt(_txHash: string): Promise<string> {
    throw new CosmosWalletException(
      new Error(
        'getEthereumTransactionReceipt is not supported on Cosmostation',
      ),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        context: WalletAction.GetEthereumTransactionReceipt,
      },
    )
  }

  private async getCosmostationWallet(): Promise<Cosmos> {
    if (this.cosmostationWallet) {
      return this.cosmostationWallet
    }

    const cosmostationWallet = new CosmostationWallet(this.chainId)

    try {
      const provider = await cosmostationWallet.getCosmostationWallet()

      this.cosmostationWallet = provider

      return provider
    } catch (e) {
      if (e instanceof InstallError) {
        throw new CosmosWalletException(
          new Error('Please install the Cosmostation extension'),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletNotInstalledError,
          },
        )
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
      })
    }
  }
}
