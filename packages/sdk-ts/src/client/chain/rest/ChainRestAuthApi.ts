import BaseRestConsumer from '../../BaseRestConsumer'
import { RestApiResponse } from '../types'
import { AccountResponse } from './../types/auth-rest'

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
}
