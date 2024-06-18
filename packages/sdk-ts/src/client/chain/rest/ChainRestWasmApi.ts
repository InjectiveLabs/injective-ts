import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import BaseRestConsumer from '../../base/BaseRestConsumer'
import { ChainModule, RestApiResponse } from '../types'

export type SmartContractStateResponse = unknown

/**
 * @category Chain Wasm API
 */
export class ChainRestWasmApi extends BaseRestConsumer {
  public async fetchSmartContractState(
    contractAddress: string,
    query: string,
    params: Record<string, any> = {},
  ): Promise<SmartContractStateResponse> {
    const endpoint = `cosmwasm/wasm/v1/contract/${contractAddress}/smart/${query}`

    try {
      const response = await this.retry<
        RestApiResponse<SmartContractStateResponse>
      >(() => this.get(endpoint, params))

      return response.data
    } catch (e) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error((e as any).message), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: ChainModule.Bank,
      })
    }
  }
}
