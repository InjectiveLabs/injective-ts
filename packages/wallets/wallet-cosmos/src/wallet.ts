import { capitalize } from '@injectivelabs/utils'
import { CosmosTxV1Beta1TxPb } from '@injectivelabs/sdk-ts'
import { uint8ArrayToHex } from '@injectivelabs/sdk-ts/utils'
import { Wallet, BroadcastMode } from '@injectivelabs/wallet-base'
import {
  ErrorType,
  GeneralException,
  UnspecifiedErrorCode,
  TransactionException,
  CosmosWalletException,
  WalletErrorActionModule,
} from '@injectivelabs/exceptions'
import { loadSigningStargateClient } from './lib.js'
import type { StdFee } from '@cosmjs/stargate'
import type { EncodeObject } from '@cosmjs/proto-signing'
import type { OfflineSigner } from '@cosmjs/proto-signing'
import type { Wallet as WalletType } from '@injectivelabs/wallet-base'
import type {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
} from '@injectivelabs/ts-types'
import type {
  Keplr,
  StdSignDoc,
  AminoSignResponse,
  OfflineAminoSigner,
  BroadcastMode as BroadcastModeType,
} from '@keplr-wallet/types'

const getWindow = () =>
  (typeof window !== 'undefined' ? window : {}) as Window & {
    keplr?: Keplr
    ninji?: Keplr
    leap?: Keplr
    owallet?: Keplr
    cosmostation?: {
      cosmos: {
        request<T>(message: { method: string; params?: unknown }): Promise<T>
      }
      providers: { keplr?: Keplr }
    }
  }

export class CosmosWallet {
  public wallet: Wallet
  private chainId: CosmosChainId | TestnetCosmosChainId | ChainId

  constructor({
    wallet,
    chainId,
  }: {
    wallet: Wallet
    chainId: CosmosChainId | TestnetCosmosChainId | ChainId
  }) {
    this.wallet = wallet
    this.chainId = chainId
  }

  public async isChainIdSupported(chainId: CosmosChainId): Promise<boolean> {
    const { wallet } = this

    return new CosmosWallet({ chainId, wallet }).checkChainIdSupport()
  }

  public async getCosmosWallet() {
    const { chainId } = this
    const cosmos = this.getCosmos()

    try {
      await cosmos.enable(chainId)

      return cosmos as Keplr
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message))
    }
  }

  public async chainNotSupported() {
    const { chainId, wallet } = this
    const chainName = chainId.split('-')

    const context =
      wallet === Wallet.Keplr
        ? 'https://chains.keplr.app/'
        : wallet === Wallet.OWallet
          ? 'https://owallet.io/'
          : undefined

    throw new CosmosWalletException(
      new Error(
        `${capitalize(wallet)} may not support ${
          chainName[0] || chainId
        } network. Please check if the chain can be added.`,
      ),
      context ? { context } : {},
    )
  }

  public async getAccounts() {
    const { chainId } = this
    const cosmos = this.getCosmos()

    try {
      return cosmos.getOfflineSigner(chainId).getAccounts()
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: WalletErrorActionModule.GetAccounts,
      })
    }
  }

  public async getKey(): Promise<{
    name: string
    algo: string
    isNanoLedger: boolean
    pubKey: Uint8Array
    address: Uint8Array
    bech32Address: string
  }> {
    const { wallet, chainId } = this
    const cosmosWallet = await this.getCosmosWallet()

    try {
      return cosmosWallet.getKey(chainId)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: wallet,
      })
    }
  }

  public async getOfflineSigner(chainId?: string): Promise<OfflineSigner> {
    const { wallet } = this

    try {
      return this.getCosmos().getOfflineSigner(
        chainId || this.chainId,
      ) as OfflineSigner
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        contextModule: wallet,
      })
    }
  }

  public async getOfflineAminoSigner(): Promise<OfflineAminoSigner> {
    const { chainId, wallet } = this

    if (!([Wallet.Keplr, Wallet.OWallet] as WalletType[]).includes(wallet)) {
      throw new CosmosWalletException(
        new Error(
          `getOfflineAminoSigner is not support on ${capitalize(wallet)}`,
        ),
      )
    }

    const cosmosWallet = await this.getCosmosWallet()

    try {
      return cosmosWallet.getOfflineSignerOnlyAmino(
        chainId,
      ) as unknown as OfflineAminoSigner
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: wallet,
      })
    }
  }

  /**
   * This method is used to broadcast a transaction to the network.
   * Since it uses the `Sync` mode, it will not wait for the transaction to be included in a block,
   * so we have to make sure the transaction is included in a block after its broadcasted
   *
   * @param txRaw - raw transaction to broadcast
   * @returns tx hash
   */
  public async broadcastTx(txRaw: CosmosTxV1Beta1TxPb.TxRaw): Promise<string> {
    const { chainId, wallet } = this
    const cosmosWallet = await this.getCosmosWallet()

    try {
      const result = await cosmosWallet.sendTx(
        chainId,
        CosmosTxV1Beta1TxPb.TxRaw.toBinary(txRaw),
        BroadcastMode.Sync as BroadcastModeType,
      )

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error('Transaction failed to be broadcasted'),
          { contextModule: wallet },
        )
      }

      return uint8ArrayToHex(result)
    } catch (e) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'broadcast-tx',
        contextModule: wallet,
      })
    }
  }

  /**
   * This method is used to broadcast a transaction to the network.
   * Since it uses the `Block` mode, and it will wait for the transaction to be included in a block,
   *
   * @param txRaw - raw transaction to broadcast
   * @returns tx hash
   */
  public async broadcastTxBlock(
    txRaw: CosmosTxV1Beta1TxPb.TxRaw,
  ): Promise<string> {
    const { chainId, wallet } = this
    const cosmosWallet = await this.getCosmosWallet()

    try {
      const result = await cosmosWallet.sendTx(
        chainId,
        CosmosTxV1Beta1TxPb.TxRaw.toBinary(txRaw),
        BroadcastMode.Block as BroadcastModeType,
      )

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error('Transaction failed to be broadcasted'),
          { contextModule: wallet },
        )
      }

      return uint8ArrayToHex(result)
    } catch (e) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'broadcast-tx',
        contextModule: wallet,
      })
    }
  }

  public async signAndBroadcastAminoUsingCosmjs(
    messages: EncodeObject[],
    stdFee: StdFee,
    endpoints: { rest: string; rpc: string },
  ) {
    const { chainId, wallet } = this
    const cosmosWallet = await this.getCosmosWallet()

    if (!([Wallet.Keplr, Wallet.OWallet] as WalletType[]).includes(wallet)) {
      throw new CosmosWalletException(
        new Error(
          `signAndBroadcastAminoUsingCosmjs is not support on ${capitalize(
            wallet,
          )}`,
        ),
      )
    }

    if (!endpoints.rpc) {
      throw new GeneralException(new Error(`Please provide rpc endpoint`))
    }

    const SigningStargateClient = await loadSigningStargateClient()

    const offlineSigner = cosmosWallet.getOfflineSignerOnlyAmino(chainId)
    const [account] = await offlineSigner.getAccounts()
    const client = await SigningStargateClient.connectWithSigner(
      endpoints.rpc,
      offlineSigner,
    )

    const txResponse = await client.signAndBroadcast(
      account.address,
      messages,
      stdFee,
    )

    return txResponse
  }

  public async signArbitrary({
    data,
    signer,
  }: {
    signer: string
    data: string | Uint8Array
  }) {
    const { chainId, wallet } = this
    const cosmosWallet = await this.getCosmosWallet()

    if (
      !([Wallet.Keplr, Wallet.Cosmostation] as WalletType[]).includes(wallet)
    ) {
      throw new CosmosWalletException(
        new Error(`signArbitrary is not supported on ${capitalize(wallet)}`),
      )
    }

    try {
      const signature = await cosmosWallet.signArbitrary(chainId, signer, data)

      return signature.signature
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: wallet,
        contextModule: 'sign-arbitrary',
      })
    }
  }

  public async signEIP712CosmosTx({
    eip712,
    signDoc,
  }: {
    eip712: any
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    const { chainId, wallet } = this
    const cosmosWallet = await this.getCosmosWallet()
    const key = await this.getKey()

    try {
      return cosmosWallet.experimentalSignEIP712CosmosTx_v0(
        chainId,
        key.bech32Address,
        eip712,
        signDoc,
      )
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: wallet,
        contextModule: 'sign-eip712-cosmos-tx',
      })
    }
  }

  public async checkChainIdSupport() {
    const { chainId, wallet } = this
    const chainName = chainId.split('-')

    // Cosmostation has a dedicated API for checking chain support
    if (wallet === Wallet.Cosmostation) {
      return this.checkCosmostationChainSupport()
    }

    const cosmos = this.getCosmos()

    try {
      return !!(await cosmos.getKey(chainId))
    } catch {
      throw new CosmosWalletException(
        new Error(
          `${capitalize(wallet)} doesn't support ${
            chainName[0] || chainId
          } network. Please use another Cosmos wallet`,
        ),
      )
    }
  }

  private async checkCosmostationChainSupport(): Promise<boolean> {
    const { chainId } = this
    const $window = getWindow()
    const chainName = chainId.split('-')

    if (!$window.cosmostation?.cosmos) {
      throw new CosmosWalletException(
        new Error('Please install the Cosmostation extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: Wallet.Cosmostation,
        },
      )
    }

    try {
      const supportedChainIds = await $window.cosmostation.cosmos.request<{
        official: string[]
        unofficial: string[]
      }>({ method: 'cos_supportedChainIds' })

      const isSupported = supportedChainIds.official.includes(chainId)

      if (!isSupported) {
        throw new CosmosWalletException(
          new Error(
            `Cosmostation doesn't support ${
              chainName[0] || chainId
            } network. Please use another Cosmos wallet`,
          ),
        )
      }

      return true
    } catch (e) {
      if (e instanceof CosmosWalletException) throw e
      throw new CosmosWalletException(new Error((e as any).message))
    }
  }

  private getCosmos() {
    const { wallet } = this
    const $window = getWindow()

    if (!$window) {
      throw new CosmosWalletException(
        new Error(`Please install ${capitalize(wallet)} extension`),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: wallet,
        },
      )
    }

    let cosmos = undefined

    if (wallet === Wallet.OWallet) {
      cosmos = $window.owallet
    }

    if (wallet === Wallet.Keplr) {
      cosmos = $window.keplr
    }

    if (wallet === Wallet.Ninji) {
      cosmos = $window.ninji
    }

    if (wallet === Wallet.Leap) {
      cosmos = $window.leap
    }

    if (wallet === Wallet.Cosmostation) {
      cosmos = $window.cosmostation?.providers?.keplr
    }

    if (!cosmos) {
      throw new CosmosWalletException(
        new Error(`Please install ${capitalize(wallet)} extension`),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          contextModule: wallet,
        },
      )
    }

    return cosmos! as Keplr
  }

  public async disableGasCheck() {
    const { wallet } = this
    const cosmosWallet = await this.getCosmosWallet()

    if (!([Wallet.Keplr, Wallet.OWallet] as WalletType[]).includes(wallet)) {
      throw new CosmosWalletException(
        new Error(`disableGasCheck is not support on ${capitalize(wallet)}`),
      )
    }

    // Temporary disable tx gas check for fee delegation purposes
    cosmosWallet.defaultOptions = {
      ...cosmosWallet.defaultOptions,
      sign: {
        ...cosmosWallet.defaultOptions.sign,
        disableBalanceCheck: true,
      },
    }
  }

  public async enableGasCheck() {
    const { wallet } = this
    const cosmosWallet = await this.getCosmosWallet()

    if (!([Wallet.Keplr, Wallet.OWallet] as WalletType[]).includes(wallet)) {
      throw new CosmosWalletException(
        new Error(`EnableGasCheck is not support on ${capitalize(wallet)}`),
      )
    }

    // Temporary disable tx gas check for fee delegation purposes
    cosmosWallet.defaultOptions = {
      ...cosmosWallet.defaultOptions,
      sign: {
        ...cosmosWallet.defaultOptions.sign,
        disableBalanceCheck: false,
      },
    }
  }
}
