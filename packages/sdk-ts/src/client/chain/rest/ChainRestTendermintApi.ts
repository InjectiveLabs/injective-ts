import BaseRestConsumer from '../../BaseRestConsumer'
import { RestApiResponse } from '../types'
import {
  BlockLatestRestResponse,
  NodeInfoRestResponse,
} from './../types/tendermint-rest'

/**
 * @category Chain Rest API
 */
export class ChainRestTendermintApi extends BaseRestConsumer {
  async fetchLatestBlock(): Promise<BlockLatestRestResponse['block']> {
    const response = (await this.client.get(
      `cosmos/base/tendermint/v1beta1/blocks/latest`,
    )) as RestApiResponse<BlockLatestRestResponse>

    return response.data.block
  }

  async fetchNodeInfo(): Promise<{
    nodeInfo: NodeInfoRestResponse['default_node_info']
    applicationVersion: NodeInfoRestResponse['application_version']
  }> {
    const response = (await this.client.get(
      `cosmos/base/tendermint/v1beta1/node_info`,
    )) as RestApiResponse<NodeInfoRestResponse>

    return {
      nodeInfo: response.data.default_node_info,
      applicationVersion: response.data.application_version,
    }
  }
}
