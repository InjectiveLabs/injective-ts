/* eslint-disable class-methods-use-this */
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
  TxResponse,
  createTxRawFromSigResponse,
  createSignDocFromTransaction,
} from '@injectivelabs/sdk-ts'
import { DirectSignResponse, makeSignDoc } from '@cosmjs/proto-signing'
import { cosmos, InstallError, Cosmos } from '@cosmostation/extension-client'
import { SEND_TRANSACTION_MODE } from '@cosmostation/extension-client/cosmos'
import { ConcreteWalletStrategy } from '../../types'
import BaseConcreteStrategy from './Base'
import { WalletAction, WalletDeviceType } from '../../../types/enums'
import { CosmosTxV1Beta1Tx } from '@injectivelabs/sdk-ts'

const INJECTIVE_CHAIN_NAME = 'injective'

export default class Cosmostation
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private provider?: Cosmos

  constructor(args: { chainId: ChainId }) {
    super(args)
    this.chainId = args.chainId || CosmosChainId.Injective
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async getAddresses(): Promise<string[]> {
    const provider = await this.getProvider()

    try {
      const accounts = await provider.requestAccount(INJECTIVE_CHAIN_NAME)

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

  async confirm(address: AccountAddress): Promise<string> {
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
    const provider = await this.getProvider()
    const txRaw = createTxRawFromSigResponse(transaction)

    try {
      const response = await provider.sendTransaction(
        INJECTIVE_CHAIN_NAME,
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

  /** @deprecated * */
  async signTransaction(
    transaction: {
      txRaw: CosmosTxV1Beta1Tx.TxRaw
      chainId: string
      accountNumber: number
    },
    address: AccountAddress,
  ) {
    return this.signCosmosTransaction({ ...transaction, address })
  }

  async signCosmosTransaction(transaction: {
    txRaw: CosmosTxV1Beta1Tx.TxRaw
    chainId: string
    address: string
    accountNumber: number
  }) {
    const { chainId } = this
    const provider = await this.getProvider()
    const signDoc = createSignDocFromTransaction(transaction)

    try {
      /* Sign the transaction */
      const signDirectResponse = await provider.signDirect(
        INJECTIVE_CHAIN_NAME,
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
    const provider = await this.getProvider()

    try {
      const account = await provider.requestAccount(INJECTIVE_CHAIN_NAME)

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

  async signArbitrary(signer: string, data: string | Uint8Array): Promise<string> {
    try {
      const provider = await this.getProvider()

      if (data instanceof Uint8Array) {
        const decoder = new TextDecoder('utf-8')
        data = decoder.decode(data)
      }

      const signature = await provider.signMessage(
        INJECTIVE_CHAIN_NAME,
        signer,
        data as string,
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

  private async getProvider(): Promise<Cosmos> {
    if (this.provider) {
      return this.provider
    }

    try {
      const provider = await cosmos()

      this.provider = provider

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
        type: ErrorType.WalletError,
      })
    }
  }
}
