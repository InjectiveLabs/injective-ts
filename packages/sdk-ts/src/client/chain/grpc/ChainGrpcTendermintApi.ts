import { CosmosBaseTendermintV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainModule } from '../types/index.js'
import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
/**
 * @category Chain Grpc API
 */
export class ChainGrpcTendermintApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Tendermint

  protected client: CosmosBaseTendermintV1Beta1Query.ServiceClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new CosmosBaseTendermintV1Beta1Query.ServiceClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchLatestBlock() {
    const request =
      CosmosBaseTendermintV1Beta1Query.GetLatestBlockRequest.create()

    try {
      const response =
        await this.retry<CosmosBaseTendermintV1Beta1Query.GetLatestBlockResponse>(
          () => this.client.GetLatestBlock(request, this.metadata),
        )

      return response.sdkBlock || response.block
    } catch (e: unknown) {
      if (e instanceof CosmosBaseTendermintV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'TendermintApi.fetchLatestBlock',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TendermintApi.fetchLatestBlock',
        contextModule: this.module,
      })
    }
  }

  async fetchBlock(height: number | string) {
    const request =
      CosmosBaseTendermintV1Beta1Query.GetBlockByHeightRequest.create()

    request.height = height.toString()
    try {
      const response =
        await this.retry<CosmosBaseTendermintV1Beta1Query.GetBlockByHeightResponse>(
          () => this.client.GetBlockByHeight(request, this.metadata),
        )

      return response.sdkBlock || response.block
    } catch (e: unknown) {
      if (e instanceof CosmosBaseTendermintV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'TendermintApi.fetchBlock',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'TendermintApi.fetchBlock',
        contextModule: this.module,
      })
    }
  }
}
