import {
  ErrorType,
  UnspecifiedErrorCode,
  CosmosWalletException,
} from '@injectivelabs/exceptions'
import type {
  ChainId,
  CosmosChainId,
  TestnetCosmosChainId,
} from '@injectivelabs/ts-types'
import type {
  CosmostationCosmos,
  CosmostationAccount,
  CosmostationSupportedChainIdsResponse,
} from './types.js'

/**
 * Get the Cosmostation cosmos provider from window.
 * Throws if the extension is not installed.
 */
export function getCosmostationProvider(): CosmostationCosmos {
  if (typeof window === 'undefined' || !window.cosmostation?.cosmos) {
    throw new CosmosWalletException(
      new Error('Please install the Cosmostation extension'),
      {
        code: UnspecifiedErrorCode,
        type: ErrorType.WalletNotInstalledError,
      },
    )
  }

  return window.cosmostation.cosmos
}

/**
 * Request an account from the Cosmostation extension.
 */
export async function requestAccount(
  chainName: string,
): Promise<CosmostationAccount> {
  const provider = getCosmostationProvider()

  return provider.request<CosmostationAccount>({
    method: 'cos_requestAccount',
    params: { chainName },
  })
}

/**
 * Get account info without prompting the user (if already connected).
 */
export async function getAccount(
  chainName: string,
): Promise<CosmostationAccount> {
  const provider = getCosmostationProvider()

  return provider.request<CosmostationAccount>({
    method: 'cos_account',
    params: { chainName },
  })
}

/**
 * Get supported chain IDs from the extension.
 */
export async function getSupportedChainIds(): Promise<CosmostationSupportedChainIdsResponse> {
  const provider = getCosmostationProvider()

  return provider.request<CosmostationSupportedChainIdsResponse>({
    method: 'cos_supportedChainIds',
  })
}

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
    const chainName = actualChainId.split('-')

    // Ensure extension is installed
    getCosmostationProvider()

    try {
      const supportedChainIds = await getSupportedChainIds()

      return !!supportedChainIds.official.find(
        (chainId) => chainId === actualChainId,
      )
    } catch {
      throw new CosmosWalletException(
        new Error(
          `Cosmostation doesn't support ${
            chainName[0] || actualChainId
          } network. Please use another Cosmos wallet`,
        ),
      )
    }
  }

  async getCosmostationProvider(): Promise<CosmostationCosmos> {
    return getCosmostationProvider()
  }
}
