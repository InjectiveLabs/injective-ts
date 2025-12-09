import { makeSignDoc } from '@cosmjs/proto-signing'
import { CosmosChainId } from '@injectivelabs/ts-types'
import { CosmosTxV1Beta1TxPb } from '@injectivelabs/sdk-ts'
import {
  uint8ArrayToHex,
  stringToUint8Array,
  uint8ArrayToBase64,
} from '@injectivelabs/sdk-ts/utils'
import {
  createTxRawFromSigResponse,
  createSignDocFromTransaction,
} from '@injectivelabs/sdk-ts/core/tx'
import {
  ErrorType,
  UnspecifiedErrorCode,
  TransactionException,
  CosmosWalletException,
} from '@injectivelabs/exceptions'
import {
  WalletAction,
  WalletDeviceType,
  BaseConcreteStrategy,
  type onAccountChangeCallback,
  type ConcreteCosmosWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import { requestAccount, getCosmostationProvider } from './../wallet.js'
import {
  SEND_TRANSACTION_MODE,
  type CosmostationCosmos,
  type CosmostationAccount,
  type CosmostationSignDirectDoc,
  type CosmostationSignAminoResponse,
  type CosmostationSignDirectResponse,
  type CosmostationSignMessageResponse,
  type CosmostationSendTransactionResponse,
} from './../types.js'
import type { OfflineSigner } from '@cosmjs/proto-signing'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'
import type {
  ChainId,
  EvmChainId,
  AccountAddress,
} from '@injectivelabs/ts-types'
import type {
  StdSignDoc,
  ConcreteWalletStrategy,
} from '@injectivelabs/wallet-base'
import type {
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts/types'

/**
 * Get an offline signer from the Cosmostation extension.
 * This uses the vanilla window.cosmostation API directly.
 */
async function getExtensionOfflineSigner(chainId: string): Promise<{
  getAccounts: () => Promise<
    { address: string; pubkey: Uint8Array; algo: string }[]
  >
  signAmino: (
    signerAddress: string,
    signDoc: any,
  ) => Promise<{ signed: any; signature: { pub_key: any; signature: string } }>
  signDirect: (
    signerAddress: string,
    signDoc: any,
  ) => Promise<{ signed: any; signature: { pub_key: any; signature: string } }>
}> {
  const provider = getCosmostationProvider()

  return {
    getAccounts: async () => {
      const response = await provider.request<CosmostationAccount>({
        method: 'cos_account',
        params: { chainName: chainId },
      })
      return [
        {
          address: response.address,
          pubkey: response.publicKey,
          algo: 'secp256k1',
        },
      ]
    },
    signAmino: async (_signerAddress: string, signDoc: any) => {
      const response = await provider.request<CosmostationSignAminoResponse>({
        method: 'cos_signAmino',
        params: {
          chainName: chainId,
          doc: signDoc,
          isEditFee: true,
          isEditMemo: true,
        },
      })
      return {
        signed: response.signed_doc,
        signature: { pub_key: response.pub_key, signature: response.signature },
      }
    },
    signDirect: async (_signerAddress: string, signDoc: any) => {
      const doc: CosmostationSignDirectDoc = {
        account_number: String(signDoc.accountNumber),
        auth_info_bytes: signDoc.authInfoBytes,
        body_bytes: signDoc.bodyBytes,
        chain_id: signDoc.chainId,
      }
      const response = await provider.request<CosmostationSignDirectResponse>({
        method: 'cos_signDirect',
        params: {
          chainName: chainId,
          doc,
          isEditFee: true,
          isEditMemo: true,
        },
      })
      return {
        signed: {
          accountNumber: response.signed_doc.account_number,
          chainId: response.signed_doc.chain_id,
          authInfoBytes: response.signed_doc.auth_info_bytes,
          bodyBytes: response.signed_doc.body_bytes,
        },
        signature: { pub_key: response.pub_key, signature: response.signature },
      }
    },
  }
}

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
  private cosmostationProvider?: CosmostationCosmos
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
    this.getProvider()

    try {
      const account = await requestAccount(this.chainName)

      return [account.address]
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

  async getAddressesInfo(): Promise<
    { address: string; derivationPath: string; baseDerivationPath: string }[]
  > {
    throw new CosmosWalletException(
      new Error('getAddressesInfo is not implemented'),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.GetAccounts,
      },
    )
  }

  async getSessionOrConfirm(address?: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${uint8ArrayToHex(
        stringToUint8Array(
          `Confirmation for ${address} at time: ${Date.now()}`,
        ),
      )}`,
    )
  }

  async sendEvmTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; evmChainId: EvmChainId },
  ): Promise<string> {
    throw new CosmosWalletException(
      new Error(
        'sendEvmTransaction is not supported. Cosmostation only supports sending cosmos transactions',
      ),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendEvmTransaction,
      },
    )
  }

  async sendTransaction(
    transaction: DirectSignResponse | CosmosTxV1Beta1TxPb.TxRaw,
    _options: { address: AccountAddress; chainId: ChainId },
  ): Promise<TxResponse> {
    const provider = this.getProvider()
    const txRaw = createTxRawFromSigResponse(transaction)
    const txBytes = uint8ArrayToBase64(
      CosmosTxV1Beta1TxPb.TxRaw.toBinary(txRaw),
    )

    try {
      const response =
        await provider.request<CosmostationSendTransactionResponse>({
          method: 'cos_sendTransaction',
          params: {
            chainName: this.chainName,
            txBytes,
            mode: SEND_TRANSACTION_MODE.SYNC,
          },
        })

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
        timestamp: '',
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
    txRaw: CosmosTxV1Beta1TxPb.TxRaw
    chainId: string
    address: string
    accountNumber: number
  }) {
    const { chainId } = this
    const provider = this.getProvider()
    const signDoc = createSignDocFromTransaction(transaction)

    const doc: CosmostationSignDirectDoc = {
      chain_id: chainId,
      body_bytes: signDoc.bodyBytes,
      auth_info_bytes: signDoc.authInfoBytes,
      account_number: signDoc.accountNumber.toString(),
    }

    try {
      /* Sign the transaction */
      const signDirectResponse =
        await provider.request<CosmostationSignDirectResponse>({
          method: 'cos_signDirect',
          params: {
            chainName: this.chainName,
            doc,
            isEditFee: true,
            isEditMemo: true,
          },
        })

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
    try {
      const account = await requestAccount(this.chainName)

      return uint8ArrayToBase64(account.publicKey)
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
      new Error('This wallet does not support signing Evm transactions'),
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
      const provider = this.getProvider()

      // Convert data to string - the vanilla API expects a string message
      const message =
        data instanceof Uint8Array ? new TextDecoder().decode(data) : data

      const response = await provider.request<CosmostationSignMessageResponse>({
        method: 'cos_signMessage',
        params: {
          chainName: this.chainName,
          signer,
          message,
        },
      })

      return response.signature
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

  async getEvmTransactionReceipt(_txHash: string): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEvmTransactionReceipt is not supported on Cosmostation'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        context: WalletAction.GetEvmTransactionReceipt,
      },
    )
  }

  public async getOfflineSigner(chainId: string): Promise<OfflineSigner> {
    return (await getExtensionOfflineSigner(
      chainId,
    )) as unknown as OfflineSigner
  }

  /**
   * Subscribe to account change events.
   */
  public onAccountChange(callback: onAccountChangeCallback): void {
    const provider = this.getProvider()
    const handler = async () => {
      try {
        const account = await requestAccount(this.chainName)
        callback(account.address)
      } catch {
        // Silently ignore errors during account change detection
      }
    }
    provider.on('cosmostation_keystorechange', handler)
  }

  /**
   * Unsubscribe from account change events.
   */
  public offAccountChange(callback: onAccountChangeCallback): void {
    const provider = this.getProvider()
    // Note: The vanilla API requires the exact handler reference to remove.
    // Since we wrap the callback, we cast to any for compatibility.
    provider.off('cosmostation_keystorechange', callback as any)
  }

  private getProvider(): CosmostationCosmos {
    if (this.cosmostationProvider) {
      return this.cosmostationProvider
    }

    try {
      const provider = getCosmostationProvider()
      this.cosmostationProvider = provider
      return provider
    } catch (e) {
      if (
        e instanceof CosmosWalletException &&
        e.type === ErrorType.WalletNotInstalledError
      ) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
      })
    }
  }
}
