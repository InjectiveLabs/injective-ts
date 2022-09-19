import BaseRestConsumer from '../../BaseRestConsumer'
import { RestApiResponse } from '../types'
import {
  AccountResponse,
  CosmosAccountRestResponse,
  BaseAccountRestResponse,
} from './../types/auth-rest'

/**
 * @category Chain Rest API
 */
export class ChainRestAuthApi extends BaseRestConsumer {
  /**
   * Looks up the account information for the Injective address.
   *
   * @param address address of account to look up
   */
  public async fetchAccount(address: string): Promise<AccountResponse> {
    const response = (await this.client.get(
      `cosmos/auth/v1beta1/accounts/${address}`,
    )) as RestApiResponse<AccountResponse>

    return response.data
  }

  /**
   * Looks up the account information for any cosmos chain address.
   *
   * @param address address of account to look up
   */
  public async fetchCosmosAccount(
    address: string,
  ): Promise<BaseAccountRestResponse> {
    const isInjectiveAddress =
      address.startsWith('inj') || address.startsWith('evmos')
    const response = (await this.client.get(
      `cosmos/auth/v1beta1/accounts/${address}`,
    )) as RestApiResponse<AccountResponse | CosmosAccountRestResponse>

    const baseAccount = isInjectiveAddress
      ? (response.data as AccountResponse).account.base_account
      : (response.data as CosmosAccountRestResponse).account

    return baseAccount
  }
}
