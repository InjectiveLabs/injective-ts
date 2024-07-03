/* eslint-disable class-methods-use-this */
import { CosmosChainId } from '@injectivelabs/ts-types'
import {
  ErrorType,
  TransactionException,
  UnspecifiedErrorCode,
  CosmosWalletException,
} from '@injectivelabs/exceptions'
import {
  TxResponse,
  createTxRawFromSigResponse,
  createSignDocFromTransaction,
} from '@injectivelabs/sdk-ts'
import { DirectSignResponse, makeSignDoc } from '@cosmjs/proto-signing'
import { InstallError, Cosmos } from '@cosmostation/extension-client'
import { SEND_TRANSACTION_MODE } from '@cosmostation/extension-client/cosmos'
import { AminoSignResponse, StdSignDoc } from '@keplr-wallet/types'
import { ConcreteCosmosWalletStrategy } from '../../types/strategy'
import { CosmostationWallet } from './../../../utils/wallets/cosmostation'
import { WalletAction, WalletDeviceType } from '../../../types/enums'
import { CosmosTxV1Beta1Tx } from '@injectivelabs/sdk-ts'

const getChainNameFromChainId = (chainId: CosmosChainId) => {
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

export default class Cosmostation implements ConcreteCosmosWalletStrategy {
  public chainName: string

  public cosmostationWallet?: Cosmos

  public chainId: CosmosChainId

  constructor(args: { chainId: CosmosChainId }) {
    this.chainId = args.chainId
    this.chainName = getChainNameFromChainId(args.chainId)
  }

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async enable() {
    return await CosmostationWallet.isChainIdSupported(this.chainId)
  }

  async getAddresses(): Promise<string[]> {
    const { chainName } = this
    const cosmostationWallet = await this.getCosmostationWallet()

    try {
      const accounts = await cosmostationWallet.requestAccount(chainName)

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

      if (e instanceof CosmosWalletException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      })
    }
  }

  async sendTransaction(
    transaction: DirectSignResponse | CosmosTxV1Beta1Tx.TxRaw,
  ): Promise<TxResponse> {
    const { chainName } = this
    const cosmostationWallet = await this.getCosmostationWallet()
    const txRaw = createTxRawFromSigResponse(transaction)

    try {
      const response = await cosmostationWallet.sendTransaction(
        chainName,
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
        SEND_TRANSACTION_MODE.ASYNC,
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

  async signTransaction(transaction: {
    txRaw: CosmosTxV1Beta1Tx.TxRaw
    accountNumber: number
    chainId: string
  }) {
    const { chainName, chainId } = this
    const cosmostationWallet = await this.getCosmostationWallet()
    const signDoc = createSignDocFromTransaction(transaction)

    try {
      /* Sign the transaction */
      const signDirectResponse = await cosmostationWallet.signDirect(
        chainName,
        {
          chain_id: chainId,
          body_bytes: signDoc.bodyBytes,
          auth_info_bytes: signDoc.authInfoBytes,
          account_number: transaction.accountNumber.toString(),
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
          pub_key: signDirectResponse.pub_key,
        },
      } as DirectSignResponse
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendTransaction,
      })
    }
  }

  async signAminoTransaction(_transaction: {
    address: string
    stdSignDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    throw new CosmosWalletException(
      new Error('signAminoTransaction not supported on Cosmostation'),
    )
  }

  async getPubKey(): Promise<string> {
    const { chainName } = this
    const cosmostationWallet = await this.getCosmostationWallet()

    try {
      const account = await cosmostationWallet.requestAccount(chainName)

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
