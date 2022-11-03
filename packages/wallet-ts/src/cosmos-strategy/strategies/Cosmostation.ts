/* eslint-disable class-methods-use-this */
import { CosmosChainId } from '@injectivelabs/ts-types'
import {
  UnspecifiedErrorCode,
  CosmosWalletException,
  TransactionException,
  ErrorType,
} from '@injectivelabs/exceptions'
import {
  createCosmosSignDocFromTransaction,
  createTxRawFromSigResponse,
} from '@injectivelabs/sdk-ts'
import { DirectSignResponse, makeSignDoc } from '@cosmjs/proto-signing'
import { cosmos, InstallError, Cosmos } from '@cosmostation/extension-client'
import { SEND_TRANSACTION_MODE } from '@cosmostation/extension-client/cosmos'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { ConcreteCosmosWalletStrategy } from '../types/strategy'
import { WalletAction } from '../../types/enums'

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

  return chainName
}

export default class Cosmostation implements ConcreteCosmosWalletStrategy {
  public chainName: string

  public provider?: Cosmos

  public chainId: CosmosChainId

  constructor(args: { chainId: CosmosChainId }) {
    this.chainId = args.chainId
    this.chainName = getChainNameFromChainId(args.chainId)
  }

  async isChainIdSupported(chainId?: CosmosChainId): Promise<boolean> {
    const actualChainId = chainId || this.chainId
    const provider = await this.getProvider()

    const supportedChainIds = await provider.getSupportedChainIds()

    return !!supportedChainIds.official.find(
      (chainId) => chainId === actualChainId,
    )
  }

  async getAddresses(): Promise<string[]> {
    const { chainName } = this
    const provider = await this.getProvider()

    try {
      const accounts = await provider.requestAccount(chainName)

      return [accounts.address]
    } catch (e: unknown) {
      if ((e as any).code === 4001) {
        throw new CosmosWalletException(
          new Error('The user rejected the request'),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletError,
            contextModule: WalletAction.GetAccounts,
          },
        )
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  async sendTransaction(
    transaction: DirectSignResponse | TxRaw,
  ): Promise<string> {
    const { chainName } = this
    const provider = await this.getProvider()
    const txRaw =
      transaction instanceof TxRaw
        ? transaction
        : createTxRawFromSigResponse(transaction)

    try {
      const response = await provider.sendTransaction(
        chainName,
        txRaw.serializeBinary(),
        SEND_TRANSACTION_MODE.ASYNC,
      )

      return response.tx_response.txhash
    } catch (e: unknown) {
      throw new TransactionException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.ChainError,
        contextModule: WalletAction.SendTransaction,
      })
    }
  }

  async signTransaction(transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
  }) {
    const { chainName, chainId } = this
    const provider = await this.getProvider()
    const signDoc = createCosmosSignDocFromTransaction(transaction)

    try {
      /* Sign the transaction */
      const signDirectResponse = await provider.signDirect(
        chainName,
        {
          chain_id: chainId,
          body_bytes: signDoc.bodyBytes,
          auth_info_bytes: signDoc.authInfoBytes,
          account_number: transaction.accountNumber.toString(),
        },
        { fee: false, memo: true },
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
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
      })
    }
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
