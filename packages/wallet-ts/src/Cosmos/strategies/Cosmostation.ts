/* eslint-disable class-methods-use-this */
import { CosmosChainId } from '@injectivelabs/ts-types'
import {
  UnspecifiedErrorCode,
  CosmosWalletException,
  TransactionException,
  ErrorType,
} from '@injectivelabs/exceptions'
import { DEFAULT_STD_FEE } from '@injectivelabs/utils'
import {
  createTxRawFromSigResponse,
  createTransactionAndCosmosSignDocForAddressAndMsg,
} from '@injectivelabs/sdk-ts'
import type { Msgs } from '@injectivelabs/sdk-ts'
import { cosmos, InstallError, Cosmos } from '@cosmostation/extension-client'
import { DirectSignResponse, makeSignDoc } from '@cosmjs/proto-signing'
import { SEND_TRANSACTION_MODE } from '@cosmostation/extension-client/cosmos'
import { ConcreteCosmosWalletStrategy } from '../types/strategy'
import { WalletAction } from '../../wallet-strategy/types/enums'
import { getEndpointsFromChainId } from '../endpoints'

const INJECTIVE_CHAIN_NAME = 'injective'

const getChainNameFromChainId = (chainId: CosmosChainId) => {
  const [chainName] = chainId.split('-')

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

  async sendTransaction(signResponse: DirectSignResponse): Promise<string> {
    const { chainName } = this
    const provider = await this.getProvider()
    const txRaw = createTxRawFromSigResponse(signResponse)

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
    memo: string
    address: string
    gas: string
    message: Msgs | Msgs[]
  }) {
    const { chainName, chainId } = this
    const provider = await this.getProvider()
    const signer = await provider.getAccount(INJECTIVE_CHAIN_NAME)
    const endpoints = getEndpointsFromChainId(chainId)

    try {
      /** Prepare the Transaction * */
      const { bodyBytes, authInfoBytes, accountNumber } =
        await createTransactionAndCosmosSignDocForAddressAndMsg({
          chainId,
          address: transaction.address,
          memo: transaction.memo,
          message: transaction.message,
          pubKey: Buffer.from(signer.publicKey).toString('base64'),
          endpoint: endpoints.rest,
          fee: {
            ...DEFAULT_STD_FEE,
            gas: transaction.gas || DEFAULT_STD_FEE.gas,
          },
        })

      /* Sign the transaction */
      const signDirectResponse = await provider.signDirect(
        chainName,
        {
          chain_id: chainId,
          body_bytes: bodyBytes,
          auth_info_bytes: authInfoBytes,
          account_number: accountNumber.toString(),
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
