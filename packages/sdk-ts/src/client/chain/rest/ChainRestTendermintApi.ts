import {
  HttpRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import BaseRestConsumer from '../../base/BaseRestConsumer'
import { ChainModule, RestApiResponse } from '../types'
import {
  BlockLatestRestResponse,
  NodeInfoRestResponse,
} from './../types/tendermint-rest'

/**
 * @category Chain Rest API
 */
export class ChainRestTendermintApi extends BaseRestConsumer {
  async fetchLatestBlock(
    params: Record<string, any> = {},
  ): Promise<BlockLatestRestResponse['block']> {
    const endpoint = `cosmos/base/tendermint/v1beta1/blocks/latest`

    try {
      const response = await this.retry<
        RestApiResponse<BlockLatestRestResponse>
      >(() => this.get(endpoint, params))

      return response.data.block
    } catch (e) {
      if (e instanceof HttpRequestException) {
        throw e
      }

      throw new HttpRequestException(new Error(e as any), {
        code: UnspecifiedErrorCode,
        context: `${this.endpoint}/${endpoint}`,
        contextModule: ChainModule.Tendermint,
      })
    }
  }

  async fetchNodeInfo(params: Record<string, any> = {}): Promise<{
    nodeInfo: NodeInfoRestResponse['default_node_info']
    applicationVersion: NodeInfoRestResponse['application_version']
  }> {
    const endpoint = `cosmos/base/tendermint/v1beta1/node_info`

    try {
      const response = await this.retry<RestApiResponse<NodeInfoRestResponse>>(
        () => this.get(endpoint, params),
      )

      return {
        nodeInfo: response.data.default_node_info,
        applicationVersion: response.data.application_version,
      }
    } catch (e) {
      if (e instanceof HttpRequestException) {
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
