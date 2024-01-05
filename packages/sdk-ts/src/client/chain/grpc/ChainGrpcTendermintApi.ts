import { CosmosBaseTendermintV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer'
import { ChainModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
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
          () => this.client.GetLatestBlock(request),
        )

      return response.block || response.sdkBlock
    } catch (e: unknown) {
      if (e instanceof CosmosBaseTendermintV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
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
}
