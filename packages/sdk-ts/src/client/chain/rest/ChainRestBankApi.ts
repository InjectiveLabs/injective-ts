import BaseRestConsumer from '../../BaseRestConsumer'
import { RestApiResponse } from '../types'
import { BalancesResponse, DenomBalance } from './../types/bank-rest'

/**
 * @category Chain Rest API
 */
export class ChainRestAuthApi extends BaseRestConsumer {
  /**
   * Get address's balance
   *
   * @param address address of account to look up
   */
  public async fetchBalances(address: string): Promise<BalancesResponse> {
    const response = (await this.client.get(
      `cosmos/bank/v1beta1/balances/${address}`,
    )) as RestApiResponse<BalancesResponse>

    return response.data
  }

  /**
   * Get address's balances
   *
   * @param address address of account to look up
   */
  public async fetchBalance(
    address: string,
    denom: string,
  ): Promise<DenomBalance> {
    const response = (await this.client.get(
      `cosmos/bank/v1beta1/balances/${address}`,
    )) as RestApiResponse<BalancesResponse>

    const balance = response.data.balances.find(
      (balance) => balance.denom === denom,
    )

    if (!balance) {
      throw new Error(`The ${denom} balance was not found`)
    }

    return balance
  }
}
