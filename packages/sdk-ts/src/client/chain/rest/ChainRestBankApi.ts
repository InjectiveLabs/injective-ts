import { StatusCodes } from 'http-status-codes'
import { isAbortError, throwIfAborted } from '@injectivelabs/utils'
import {
  ErrorType,
  GeneralException,
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { ChainModule } from '../types/index.js'
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type { RestApiResponse } from '../types/index.js'
import type {
  DenomBalance,
  BalancesResponse,
  DenomOwnersResponse,
} from './../types/bank-rest.js'

/**
 * @category Chain Rest API
 */
export class ChainRestBankApi extends BaseRestConsumer {
  /**
   * Get address's balance
   *
   * @param address address of account to look up
   */
  public async fetchBalances(
    address: string,
    params: Record<string, any> = {},
    options?: RequestOptions,
  ): Promise<BalancesResponse> {
    throwIfAborted(options?.signal)
    const endpoint = `cosmos/bank/v1beta1/balances/${address}`

    try {
      const response = await this.retry<RestApiResponse<BalancesResponse>>(
        (requestConfig) => this.get(endpoint, params, requestConfig),
        undefined,
        undefined,
        options,
      )

      return response.data
    } catch (e) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: ChainModule.Bank,
      })
    }
  }

  /**
   * Get address's balances
   *
   * @param address address of account to look up
   */
  public async fetchBalance(
    address: string,
    denom: string,
    params: Record<string, any> = {},
    options?: RequestOptions,
  ): Promise<DenomBalance> {
    throwIfAborted(options?.signal)
    const endpoint = `cosmos/bank/v1beta1/balances/${address}`

    try {
      const response = await this.retry<RestApiResponse<BalancesResponse>>(
        (requestConfig) => this.get(endpoint, params, requestConfig),
        undefined,
        undefined,
        options,
      )

      const balance = response.data.balances.find(
        (balance) => balance.denom === denom,
      )

      if (!balance) {
        throw new GeneralException(
          new Error(`The ${denom} balance was not found`),
          {
            code: StatusCodes.NOT_FOUND,
            type: ErrorType.NotFoundError,
          },
        )
      }

      return balance
    } catch (e) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      if (e instanceof GeneralException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: ChainModule.Bank,
      })
    }
  }

  public async fetchDenomOwners(
    denom: string,
    params: Record<string, any> = {},
    options?: RequestOptions,
  ): Promise<DenomOwnersResponse['denom_owners']> {
    throwIfAborted(options?.signal)
    const endpoint = `cosmos/bank/v1beta1/denom_owners/${denom}`

    try {
      const response = await this.retry<RestApiResponse<DenomOwnersResponse>>(
        (requestConfig) => this.get(endpoint, params, requestConfig),
        undefined,
        undefined,
        options,
      )

      return response.data.denom_owners
    } catch (e) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      if (e instanceof GeneralException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: ChainModule.Bank,
      })
    }
  }
}
