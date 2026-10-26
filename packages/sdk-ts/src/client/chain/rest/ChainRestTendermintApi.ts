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
  NodeInfoRestResponse,
  BlockLatestRestResponse,
} from './../types/tendermint-rest.js'

/**
 * @category Chain Rest API
 */
export class ChainRestTendermintApi extends BaseRestConsumer {
  async fetchLatestBlock(
    params: Record<string, any> = {},
    options?: RequestOptions,
  ): Promise<BlockLatestRestResponse['block']> {
    throwIfAborted(options?.signal)
    const endpoint = `cosmos/base/tendermint/v1beta1/blocks/latest`

    try {
      const response = await this.retry<
        RestApiResponse<BlockLatestRestResponse>
      >(
        (requestConfig) => this.get(endpoint, params, requestConfig),
        undefined,
        undefined,
        options,
      )

      return response.data.sdk_block || response.data.block
    } catch (e) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: ChainModule.Tendermint,
      })
    }
  }

  async fetchBlock(
    height: number | string,
    params: Record<string, any> = {},
    options?: RequestOptions,
  ): Promise<BlockLatestRestResponse['block']> {
    throwIfAborted(options?.signal)
    const endpoint = `cosmos/base/tendermint/v1beta1/blocks/${height}`

    try {
      const response = await this.retry<
        RestApiResponse<BlockLatestRestResponse>
      >(
        (requestConfig) => this.get(endpoint, params, requestConfig),
        undefined,
        undefined,
        options,
      )

      return response.data.sdk_block || response.data.block
    } catch (e) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: ChainModule.Tendermint,
      })
    }
  }

  async fetchNodeInfo(
    params: Record<string, any> = {},
    options?: RequestOptions,
  ): Promise<{
    nodeInfo: NodeInfoRestResponse['default_node_info']
    applicationVersion: NodeInfoRestResponse['application_version']
  }> {
    throwIfAborted(options?.signal)
    const endpoint = `cosmos/base/tendermint/v1beta1/node_info`

    try {
      const response = await this.retry<RestApiResponse<NodeInfoRestResponse>>(
        (requestConfig) => this.get(endpoint, params, requestConfig),
        undefined,
        undefined,
        options,
      )

      return {
        nodeInfo: response.data.default_node_info,
        applicationVersion: response.data.application_version,
      }
    } catch (e) {
      if (isAbortError(e) || e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: ChainModule.Tendermint,
      })
    }
  }
}
