import { isAbortError, throwIfAborted } from '@injectivelabs/utils'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { ChainModule } from '../types/index.js'
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type { RestApiResponse } from '../types/index.js'
import type {
  AccountResponse,
  BaseAccountRestResponse,
  CosmosAccountRestResponse,
} from './../types/auth-rest.js'

/**
 * @category Chain Rest API
 */
export class ChainRestAuthApi extends BaseRestConsumer {
  /**
   * Looks up the account information for the Injective address.
   *
   * @param address address of account to look up
   */
  public async fetchAccount(
    address: string,
    params: Record<string, any> = {},
    options?: RequestOptions,
  ): Promise<AccountResponse> {
    throwIfAborted(options?.signal)
    const endpoint = `cosmos/auth/v1beta1/accounts/${address}`

    try {
      const response = await this.getWithRetry<
        RestApiResponse<AccountResponse>
      >(endpoint, params, options)

      return response.data
    } catch (e: unknown) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: ChainModule.Auth,
      })
    }
  }

  /**
   * Looks up the account information for any cosmos chain address.
   *
   * @param address address of account to look up
   */
  public async fetchCosmosAccount(
    address: string,
    params: Record<string, any> = {},
    options?: RequestOptions,
  ): Promise<BaseAccountRestResponse> {
    throwIfAborted(options?.signal)
    const endpoint = `cosmos/auth/v1beta1/accounts/${address}`

    try {
      const isInjectiveAddress =
        address.startsWith('inj') || address.startsWith('evmos')

      const response = await this.getWithRetry<
        RestApiResponse<AccountResponse | CosmosAccountRestResponse>
      >(endpoint, params, options)

      const baseAccount = isInjectiveAddress
        ? (response.data as AccountResponse).account.base_account
        : (response.data as CosmosAccountRestResponse).account

      return baseAccount
    } catch (e) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: ChainModule.Auth,
      })
    }
  }
}
