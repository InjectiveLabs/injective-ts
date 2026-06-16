import { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import { PrivateKey as PrivateKeySigner } from '@injectivelabs/sdk-ts/core/accounts'
import {
  TxGrpcApi,
  getInjectiveSignerAddress,
} from '@injectivelabs/sdk-ts/core/tx'
import {
  WalletAction,
  WalletDeviceType,
  BaseConcreteStrategy,
} from '@injectivelabs/wallet-base'
import {
  toUtf8,
  uint8ArrayToHex,
  uint8ArrayToBase64,
  stringToUint8Array,
} from '@injectivelabs/sdk-ts/utils'
import {
  ErrorType,
  WalletException,
  MetamaskException,
  UnspecifiedErrorCode,
  TransactionException,
} from '@injectivelabs/exceptions'
import type { AccountAddress } from '@injectivelabs/ts-types'
import type { TxResponse } from '@injectivelabs/sdk-ts/core/tx'
import type {
  TxRaw,
  AminoSignResponse,
  DirectSignResponse,
} from '@injectivelabs/sdk-ts/types'
import type {
  StdSignDoc,
  ConcreteWalletStrategy,
  SendTransactionOptions,
} from '@injectivelabs/wallet-base'

export class PrivateKeyWallet
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  private privateKey?: PrivateKeySigner | undefined

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Other)
  }

  async enable(): Promise<boolean> {
    return Promise.resolve(true)
  }

  public async disconnect() {
    this.listeners = {}
  }

  async getAddresses(): Promise<string[]> {
    const pk = this.getPrivateKey()

    try {
      return Promise.resolve([pk.toAddress().toHex()])
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  async getAddressesInfo(): Promise<
    { address: string; derivationPath: string; baseDerivationPath: string }[]
  > {
    throw new WalletException(
      new Error('getAddressesInfo is not implemented'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      },
    )
  }

  async getSessionOrConfirm(address: AccountAddress): Promise<string> {
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
    throw new WalletException(
      new Error('This wallet does not support sending Evm transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SendEvmTransaction,
      },
    )
  }

  async sendTransaction(
    transaction: TxRaw,
    options: SendTransactionOptions,
  ): Promise<TxResponse> {
    const { endpoints, txTimeout, txInclusion, onBroadcast } = options

    if (!endpoints) {
      throw new WalletException(
        new Error(
          'You have to pass endpoints within the options for using Ethereum native wallets',
        ),
      )
    }

    const txApi = new TxGrpcApi(endpoints.grpc)
    const response = await txApi.broadcast(transaction, {
      txTimeout,
      ...txInclusion,
      onBroadcast,
    })

    if (response.code !== 0) {
      throw new TransactionException(new Error(response.rawLog), {
        code: UnspecifiedErrorCode,
        contextCode: response.code,
        contextModule: response.codespace,
      })
    }

    return response
  }

  async signEip712TypedData(
    eip712json: string,
    address: AccountAddress,
  ): Promise<string> {
    const pk = this.getPrivateKey()

    if (getInjectiveSignerAddress(address) !== pk.toAddress().toBech32()) {
      throw new WalletException(
        new Error('Signer address does not match the private key address'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.SignTransaction,
        },
      )
    }

    try {
      const signature = await pk.signTypedData(JSON.parse(eip712json))

      return `0x${uint8ArrayToHex(signature)}`
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      })
    }
  }

  async signAminoCosmosTransaction(_transaction: {
    address: string
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    throw new WalletException(
      new Error('This wallet does not support signing Cosmos transactions'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      },
    )
  }

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
        contextModule: WalletAction.SignTransaction,
      },
    )
  }

  async signArbitrary(
    signer: AccountAddress,
    data: string | Uint8Array,
  ): Promise<string> {
    const pk = this.getPrivateKey()

    if (getInjectiveSignerAddress(signer) !== pk.toAddress().toBech32()) {
      throw new WalletException(
        new Error('Signer address does not match the private key address'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletError,
          contextModule: WalletAction.SignArbitrary,
        },
      )
    }

    try {
      const signature = await pk.signHashed(stringToUint8Array(toUtf8(data)))

      return `0x${uint8ArrayToBase64(signature)}`
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignArbitrary,
      })
    }
  }

  async getEthereumChainId(): Promise<string> {
    try {
      return Promise.resolve(
        (this.chainId === ChainId.Mainnet
          ? EvmChainId.Mainnet
          : EvmChainId.Sepolia
        ).toString(16),
      )
    } catch (e: unknown) {
      throw new MetamaskException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetChainId,
      })
    }
  }

  async getEvmTransactionReceipt(_txHash: string): Promise<string> {
    throw new WalletException(new Error('Not supported'))
  }

  async getPubKey(): Promise<string> {
    const pk = this.getPrivateKey()

    return pk.toPublicKey().toBase64()
  }

  async onChainIdChanged(_callback: (chain: string) => void): Promise<void> {
    //
  }

  async onAccountChange(
    _callback: (account: AccountAddress | string[]) => void,
  ): Promise<void> {
    //
  }

  protected getPrivateKey(): PrivateKeySigner {
    if (!this.privateKey) {
      if (!this.metadata?.privateKey?.privateKey) {
        throw new WalletException(
          new Error('Please provide private key in the constructor'),
          {
            code: UnspecifiedErrorCode,
            type: ErrorType.WalletNotInstalledError,
            contextModule: WalletAction.GetAccounts,
          },
        )
      }

      this.privateKey = PrivateKeySigner.fromHex(
        this.metadata.privateKey.privateKey,
      )
    }

    return this.privateKey
  }
}
