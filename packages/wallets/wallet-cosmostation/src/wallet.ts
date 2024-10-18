import {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
} from '@injectivelabs/ts-types'
import {
  ErrorType,
  UnspecifiedErrorCode,
  CosmosWalletException,
} from '@injectivelabs/exceptions'
import { cosmos, InstallError } from '@cosmostation/extension-client'

export class CosmostationWallet {
  private chainId: CosmosChainId | TestnetCosmosChainId | ChainId

  constructor(chainId: CosmosChainId | TestnetCosmosChainId | ChainId) {
    this.chainId = chainId
  }

  static async isChainIdSupported(chainId: CosmosChainId): Promise<boolean> {
    return new CosmostationWallet(chainId).checkChainIdSupport()
  }

  public async checkChainIdSupport() {
    const { chainId: actualChainId } = this
    const provider = await this.getCosmostationWallet()
    const chainName = actualChainId.split('-')

    try {
      const supportedChainIds = await provider.getSupportedChainIds()

      return !!supportedChainIds.official.find(
        (chainId) => chainId === actualChainId,
      )
    } catch (e) {
      throw new CosmosWalletException(
        new Error(
          `Cosmostation doesn't support ${
            chainName[0] || actualChainId
          } network. Please use another Cosmos wallet`,
        ),
      )
    }
  }

  async getCosmostationWallet() {
    try {
      const provider = await cosmos()

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
