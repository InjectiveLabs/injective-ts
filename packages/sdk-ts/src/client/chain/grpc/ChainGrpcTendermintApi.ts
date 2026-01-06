import * as CosmosBaseTendermintV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/tendermint/v1beta1/query_pb'
import { ServiceClient as CosmosBaseTendermintV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/tendermint/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
/**
 * @category Chain Grpc API
 */
export class ChainGrpcTendermintApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Tendermint

  private get client() {
    return this.initClient(CosmosBaseTendermintV1Beta1QueryClient)
  }

  async fetchLatestBlock() {
    const request =
      CosmosBaseTendermintV1Beta1QueryPb.GetLatestBlockRequest.create()

    const response = await this.executeGrpcCall<
      CosmosBaseTendermintV1Beta1QueryPb.GetLatestBlockRequest,
      CosmosBaseTendermintV1Beta1QueryPb.GetLatestBlockResponse
    >(request, this.client.getLatestBlock.bind(this.client))

    return response.sdkBlock || response.block
  }

  async fetchBlock(height: number | string) {
    const request =
      CosmosBaseTendermintV1Beta1QueryPb.GetBlockByHeightRequest.create()

    request.height = BigInt(height.toString())

    const response = await this.executeGrpcCall<
      CosmosBaseTendermintV1Beta1QueryPb.GetBlockByHeightRequest,
      CosmosBaseTendermintV1Beta1QueryPb.GetBlockByHeightResponse
    >(request, this.client.getBlockByHeight.bind(this.client))

    return response.sdkBlock || response.block
  }
}
