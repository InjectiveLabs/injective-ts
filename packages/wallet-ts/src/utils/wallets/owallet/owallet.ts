
/* eslint-disable class-methods-use-this */
import type {
  OWallet,
  StdSignDoc,
  AminoSignResponse,
  OfflineAminoSigner,
  Window as OWalletWindow,
} from '@owallet/types'
import type { EncodeObject, OfflineDirectSigner } from '@cosmjs/proto-signing'
import { BroadcastMode } from '@cosmjs/launchpad'
import { SigningStargateClient, StdFee } from '@cosmjs/stargate'
import {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
} from '@injectivelabs/ts-types'
import {
  ErrorType,
  CosmosWalletException,
  TransactionException,
  UnspecifiedErrorCode,
  WalletErrorActionModule,
  GeneralException,
} from '@injectivelabs/exceptions'
import { CosmosTxV1Beta1Tx } from '@injectivelabs/sdk-ts'

const $window = (typeof window !== 'undefined' ? window : {}) as OWalletWindow

export class OWalletBase {
  private chainId: CosmosChainId | TestnetCosmosChainId | ChainId

  constructor(chainId: CosmosChainId | TestnetCosmosChainId | ChainId) {
    this.chainId = chainId
  }

  static async isChainIdSupported(chainId: CosmosChainId): Promise<boolean> {
    return new OWalletBase(chainId).checkChainIdSupport()
  }

  public async getOWallet() {
    const { chainId } = this
    const owallet = this.getOWalletBase()

    try {
      await owallet.enable(chainId)

      return owallet as OWallet
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message))
    }
  }

  public async chainNotSupported() {
    const { chainId } = this
    const chainName = chainId.split('-')

    throw new CosmosWalletException(
      new Error(
        `OWallet may not support ${
          chainName[0] || chainId
        } network. Please check if the chain can be added.`,
      ),
      { context: 'https://chains.owallet.app/' },
    )
  }

  public async getAccounts() {
    const { chainId } = this
    const owallet = this.getOWalletBase()

    try {
      return owallet.getOfflineSigner(chainId).getAccounts()
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: WalletErrorActionModule.GetAccounts,
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
    const owallet = await this.getOWallet()

    try {
      return owallet.getKey(this.chainId)
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'OWallet',
      })
    }
  }

  public async getOfflineSigner(): Promise<OfflineDirectSigner> {
    const { chainId } = this
    const owallet = await this.getOWallet()

    try {
      return owallet.getOfflineSigner(chainId) as unknown as OfflineDirectSigner
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'OWallet',
      })
    }
  }

  public async getOfflineAminoSigner(): Promise<OfflineAminoSigner> {
    const { chainId } = this
    const owallet = await this.getOWallet()

    try {
      return owallet.getOfflineSignerOnlyAmino(
        chainId,
      ) as unknown as OfflineAminoSigner
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'OWallet',
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
  public async broadcastTx(txRaw: CosmosTxV1Beta1Tx.TxRaw): Promise<string> {
    const { chainId } = this
    const owallet = await this.getOWallet()

    try {
      const result = await owallet.sendTx(
        chainId,
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
        BroadcastMode.Sync,
      )

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error('Transaction failed to be broadcasted'),
          { context: 'OWallet' },
        )
      }

      return Buffer.from(result).toString('hex')
    } catch (e) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'OWallet',
        contextModule: 'broadcast-tx',
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
    txRaw: CosmosTxV1Beta1Tx.TxRaw,
  ): Promise<string> {
    const { chainId } = this
    const owallet = await this.getOWallet()

    try {
      const result = await owallet.sendTx(
        chainId,
        CosmosTxV1Beta1Tx.TxRaw.encode(txRaw).finish(),
        BroadcastMode.Block,
      )

      if (!result || result.length === 0) {
        throw new TransactionException(
          new Error('Transaction failed to be broadcasted'),
          { context: 'OWallet' },
        )
      }

      return Buffer.from(result).toString('hex')
    } catch (e) {
      if (e instanceof TransactionException) {
        throw e
      }

      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'OWallet',
        contextModule: 'broadcast-tx-block',
      })
    }
  }

  public async signAndBroadcastAminoUsingCosmjs(
    messages: EncodeObject[],
    stdFee: StdFee,
    endpoints: { rest: string; rpc: string },
  ) {
    const { chainId } = this
    const owallet = await this.getOWallet()

    if (!endpoints.rpc) {
      throw new GeneralException(new Error(`Please provide rpc endpoint`))
    }

    const offlineSigner = owallet.getOfflineSignerOnlyAmino(chainId)
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

  public async signEIP712CosmosTx({
    eip712,
    signDoc,
  }: {
    eip712: any
    signDoc: StdSignDoc
  }): Promise<AminoSignResponse> {
    const { chainId } = this
    const owallet = await this.getOWallet()
    const key = await this.getKey()

    try {
      return owallet.experimentalSignEIP712CosmosTx_v0(
        chainId,
        key.bech32Address,
        eip712,
        signDoc,
      )
    } catch (e: unknown) {
      throw new CosmosWalletException(new Error((e as any).message), {
        context: 'OWallet',
        contextModule: 'sign-eip712-cosmos-tx',
      })
    }
  }

  public async checkChainIdSupport() {
    const { chainId } = this
    const owallet = this.getOWalletBase()
    const chainName = chainId.split('-')

    try {
      return !!(await owallet.getKey(chainId))
    } catch (e) {
      throw new CosmosWalletException(
        new Error(
          `OWallet may not support ${
            chainName[0] || chainId
          } network. Please check if the chain can be added.`,
        ),
        { context: 'https://chains.owallet.app/' },
      )
    }
  }

  private getOWalletBase() {
    if (!$window) {
      throw new CosmosWalletException(
        new Error('Please install OWallet extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: 'OWallet',
        },
      )
    }

    if (!$window.owallet) {
      throw new CosmosWalletException(
        new Error('Please install OWallet extension'),
        {
          code: UnspecifiedErrorCode,
          type: ErrorType.WalletNotInstalledError,
          context: 'OWallet',
        },
      )
    }

    return $window.owallet!
  }

  public disableGasCheck() {
    const owallet = this.getOWalletBase()

    // Temporary disable tx gas check for fee delegation purposes
    owallet.defaultOptions = {
      ...owallet.defaultOptions,
      sign: {
        ...owallet.defaultOptions.sign,
        disableBalanceCheck: true,
      },
    }
  }

  public enableGasCheck() {
    const owallet = this.getOWalletBase()

    // Temporary disable tx gas check for fee delegation purposes
    owallet.defaultOptions = {
      ...owallet.defaultOptions,
      sign: {
        ...owallet.defaultOptions.sign,
        disableBalanceCheck: false,
      },
    }
  }
}
