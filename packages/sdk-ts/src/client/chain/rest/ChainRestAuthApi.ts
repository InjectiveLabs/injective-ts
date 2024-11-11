import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import { ChainModule, RestApiResponse } from '../types/index.js'
import {
  AccountResponse,
  CosmosAccountRestResponse,
  BaseAccountRestResponse,
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
  ): Promise<AccountResponse> {
    const endpoint = `cosmos/auth/v1beta1/accounts/${address}`

    try {
      const response = await this.retry<RestApiResponse<AccountResponse>>(() =>
        this.get(endpoint, params),
      )

      return response.data
    } catch (e: unknown) {
      if (e instanceof HttpRequestException) {
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
  ): Promise<BaseAccountRestResponse> {
    const endpoint = `cosmos/auth/v1beta1/accounts/${address}`

    try {
      const isInjectiveAddress =
        address.startsWith('inj') || address.startsWith('evmos')

      const response = await this.retry<
        RestApiResponse<AccountResponse | CosmosAccountRestResponse>
      >(() => this.get(endpoint, params))

      const baseAccount = isInjectiveAddress
        ? (response.data as AccountResponse).account.base_account
        : (response.data as CosmosAccountRestResponse).account

      return baseAccount
    } catch (e) {
      if (e instanceof HttpRequestException) {
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
