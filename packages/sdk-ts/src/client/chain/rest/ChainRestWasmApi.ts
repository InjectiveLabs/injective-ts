import { isAbortError, throwIfAborted } from '@injectivelabs/utils'
import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { ChainModule } from '../types/index.js'
import BaseRestConsumer from '../../base/BaseRestConsumer.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type { RestApiResponse } from '../types/index.js'

export type SmartContractStateResponse = unknown

/**
 * @category Chain Wasm API
 */
export class ChainRestWasmApi extends BaseRestConsumer {
  public async fetchSmartContractState(
    contractAddress: string,
    query: string,
    params: Record<string, any> = {},
    options?: RequestOptions,
  ): Promise<SmartContractStateResponse> {
    throwIfAborted(options?.signal)
    const endpoint = `cosmwasm/wasm/v1/contract/${contractAddress}/smart/${query}`

    try {
      const response = await this.retry<
        RestApiResponse<SmartContractStateResponse>
      >((requestConfig) => this.get(endpoint, params, requestConfig), options)

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
}
