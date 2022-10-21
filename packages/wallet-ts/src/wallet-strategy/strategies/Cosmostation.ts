/* eslint-disable class-methods-use-this */
import {
  AccountAddress,
  ChainId,
  EthereumChainId,
  CosmosChainId,
} from '@injectivelabs/ts-types'
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
import { DirectSignResponse, makeSignDoc } from '@cosmjs/proto-signing'
import { cosmos, InstallError, Cosmos } from '@cosmostation/extension-client'
import { SEND_TRANSACTION_MODE } from '@cosmostation/extension-client/cosmos'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { ConcreteWalletStrategy } from '../types'
import BaseConcreteStrategy from './Base'
import { getEndpointsFromChainId } from '../../cosmos/endpoints'
import { WalletAction } from '../../types/enums'
import { CosmosWalletSignTransactionArgs } from '../../types/strategy'

const INJECTIVE_CHAIN_NAME = 'injective'

export default class Cosmostation
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private provider?: Cosmos

  constructor(args: { ethereumChainId: EthereumChainId; chainId: ChainId }) {
    super(args)
    this.chainId = args.chainId || CosmosChainId.Injective
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
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEthereumTransaction,
      },
    )
  }

  async sendTransaction(
    transaction: DirectSignResponse | TxRaw,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<string> {
    const provider = await this.getProvider()
    const txRaw =
      transaction instanceof TxRaw
        ? transaction
        : createTxRawFromSigResponse(transaction)

    try {
      const response = await provider.sendTransaction(
        INJECTIVE_CHAIN_NAME,
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

  async signTransaction(
    transaction: CosmosWalletSignTransactionArgs,
    address: AccountAddress,
  ) {
    const { chainId } = this
    const provider = await this.getProvider()
    const signer = await provider.getAccount(INJECTIVE_CHAIN_NAME)
    const endpoints = getEndpointsFromChainId(chainId)

    try {
      /** Prepare the Transaction * */
      const { bodyBytes, authInfoBytes, accountNumber } =
        await createTransactionAndCosmosSignDocForAddressAndMsg({
          address,
          chainId,
          memo: transaction.memo,
          message: transaction.message,
          pubKey: Buffer.from(signer.publicKey).toString('base64'),
          endpoint: endpoints.rest,
          fee: {
            ...DEFAULT_STD_FEE,
            gas: transaction.gas || DEFAULT_STD_FEE.gas,
            payer: transaction.feePayer || '',
          },
        })

      /* Sign the transaction */
      const signDirectResponse = await provider.signDirect(
        INJECTIVE_CHAIN_NAME,
        {
          chain_id: chainId,
          body_bytes: bodyBytes,
          auth_info_bytes: authInfoBytes,
          account_number: accountNumber.toString(),
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
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendTransaction,
      })
    }
  }

  async getNetworkId(): Promise<string> {
    throw new CosmosWalletException(
      new Error('getNetworkId is not supported on Cosmostation'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetNetworkId,
      },
    )
  }

  async getChainId(): Promise<string> {
    throw new CosmosWalletException(
      new Error('getChainId is not supported on Cosmostation'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
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
        contextModule: WalletAction.GetEthereumTransactionReceipt,
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
