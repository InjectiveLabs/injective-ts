/* eslint-disable class-methods-use-this */
import {
  ErrorType,
  WalletException,
  UnspecifiedErrorCode,
  TransactionException,
  CosmosWalletException,
} from '@injectivelabs/exceptions'
import { Magic as MagicWallet } from 'magic-sdk'
import {
  TxRaw,
  TxGrpcApi,
  DirectSignResponse,
  AminoSignResponse,
} from '@injectivelabs/sdk-ts'
import { OAuthExtension } from '@magic-ext/oauth2'
import { CosmosExtension } from '@magic-ext/cosmos'
import { AccountAddress, EthereumChainId } from '@injectivelabs/ts-types'
import {
  StdSignDoc,
  WalletAction,
  MagicProvider,
  WalletDeviceType,
  BaseConcreteStrategy,
  BrowserEip1993Provider,
  ConcreteWalletStrategy,
  SendTransactionOptions,
} from '@injectivelabs/wallet-base'

export class Magic
  extends BaseConcreteStrategy
  implements ConcreteWalletStrategy
{
  public provider: BrowserEip1993Provider | undefined

  private magicWallet: MagicWallet | undefined

  async getWalletDeviceType(): Promise<WalletDeviceType> {
    return Promise.resolve(WalletDeviceType.Browser)
  }

  async enable({
    email,
    provider,
  }: {
    email?: string
    provider?: MagicProvider
  }): Promise<boolean> {
    if (!provider) {
      return Promise.resolve(true)
    }

    try {
      if (provider === MagicProvider.Email) {
        await this.connectViaEmail(email)
      } else {
        await this.connectViaOauth(provider)
      }

      await this.pollUserLoggedInState()

      return Promise.resolve(true)
    } catch (e) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  async connectViaEmail(email?: string) {
    const magicWallet = await this.getMagicWallet()

    if (!email) {
      throw new WalletException(
        new Error('You have to pass the email for using Magic wallet'),
      )
    }

    return magicWallet.auth.loginWithMagicLink({ email })
  }

  async connectViaOauth(provider: MagicProvider) {
    const magicWallet = await this.getMagicWallet()

    return (magicWallet.oauth2 as any).loginWithRedirect({
      provider: provider,
      redirectURI: window.location.origin,
    })
  }

  public async disconnect() {
    const magicWallet = await this.getMagicWallet()

    const isUserLoggedIn = await magicWallet.user.isLoggedIn()

    if (!isUserLoggedIn) {
      return
    }

    await magicWallet.user.logout()
  }

  async getAddresses({
    provider,
  }: {
    provider: MagicProvider
  }): Promise<string[]> {
    const magicWallet = await this.getMagicWallet()

    if (!provider) {
      try {
        await (magicWallet.oauth2 as any).getRedirectResult()
      } catch {
        // fail silently
      }
    }

    try {
      const { publicAddress } = await magicWallet.user.getInfo()

      if (!publicAddress?.startsWith('inj')) {
        const address = await (magicWallet.cosmos as any).changeAddress('inj')

        return [address || '']
      }

      return [publicAddress || '']
    } catch (e: unknown) {
      throw new WalletException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.GetAccounts,
      })
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async getSessionOrConfirm(address: AccountAddress): Promise<string> {
    return Promise.resolve(
      `0x${Buffer.from(
        `Confirmation for ${address} at time: ${Date.now()}`,
      ).toString('hex')}`,
    )
  }

  async sendEthereumTransaction(
    _transaction: unknown,
    _options: { address: AccountAddress; ethereumChainId: EthereumChainId },
  ): Promise<string> {
    throw new CosmosWalletException(
      new Error(
        'sendEthereumTransaction is not supported. Leap only supports sending cosmos transactions',
      ),
      {
        code: UnspecifiedErrorCode,
        context: WalletAction.SendEthereumTransaction,
      },
    )
  }

  async sendTransaction(
    transaction: TxRaw,
    options: SendTransactionOptions,
  ): Promise<any> {
    const { endpoints, txTimeout } = options

    if (!endpoints) {
      throw new WalletException(
        new Error(
          'You have to pass endpoints.grpc within the options for using Magic wallet',
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

  async signEip712TypedData(
    eip712json: string,
    _address: AccountAddress,
  ): Promise<string> {
    const magicWallet = await this.getMagicWallet()

    const signature = await (magicWallet.cosmos as any).signTypedData(
      eip712json,
    )

    return `0x${signature}`
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
        contextModule: WalletAction.SignTransaction,
      },
    )
  }

  async signAminoCosmosTransaction(_transaction: {
    address: string
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    throw new WalletException(
      new Error('This wallet does not support signAminoCosmosTransaction'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      },
    )
  }

  async signArbitrary(
    _signer: AccountAddress,
    _data: string | Uint8Array,
  ): Promise<string> {
    throw new WalletException(
      new Error('This wallet does not support signArbitrary'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletError,
        contextModule: WalletAction.SignTransaction,
      },
    )
  }

  async getEthereumChainId(): Promise<string> {
    throw new CosmosWalletException(
      new Error('getEthereumChainId is not supported on Magic wallet'),
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

  // eslint-disable-next-line class-methods-use-this
  async getPubKey(): Promise<string> {
    throw new WalletException(
      new Error('You can only fetch PubKey from Cosmos native wallets'),
    )
  }

  private async pollUserLoggedInState(timeout = 60 * 1000): Promise<any> {
    const magicWallet = await this.getMagicWallet()
    const POLL_INTERVAL = 3 * 1000

    for (let i = 0; i <= timeout / POLL_INTERVAL; i += 1) {
      try {
        const result = await magicWallet.user.isLoggedIn()

        if (result) {
          return result
        }
      } catch (e: unknown) {
        // We throw only if the transaction failed on chain
        if (e instanceof TransactionException) {
          throw e
        }
      }

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL))
    }

    // Transaction was not included in the block in the desired timeout
    throw new WalletException(
      new Error(`User did not verify sign in - timeout of ${timeout}ms`),
      {
        context: 'Wallet',
        contextModule: 'Magic-Wallet-pollUserLoggedInState',
      },
    )
  }

  private async getMagicWallet(): Promise<MagicWallet> {
    const { metadata } = this

    if (!this.magicWallet) {
      if (!metadata?.magic?.apiKey) {
        throw new WalletException(
          new Error(
            'You have to pass the apiKey within metadata to use Magic wallet',
          ),
        )
      }

      if (!metadata?.magic?.rpcEndpoint) {
        throw new WalletException(
          new Error(
            'You have to pass the rpc url endpoint within metadata to use Magic wallet',
          ),
        )
      }

      this.magicWallet = new MagicWallet(metadata.magic.apiKey, {
        extensions: [
          new OAuthExtension(),
          new CosmosExtension({
            rpcUrl: metadata.magic.rpcEndpoint,
            chain: 'inj',
          }),
        ],
      }) as unknown as MagicWallet
    }

    return this.magicWallet
  }
}
