import * as InjectiveTxFeesV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/txfees/v1beta1/query_pb'
import { QueryClient as InjectiveTxFeesV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/txfees/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcTxFeesTransformer } from '../transformers/index.js'
import type { GrpcWebTransportAdditionalOptions } from '../../../types'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcTxFeesApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.TxFees
  private client: InjectiveTxFeesV1Beta1QueryClient

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    super(endpoint, options)
    this.client = new InjectiveTxFeesV1Beta1QueryClient(this.transport)
  }

  async fetchModuleParams() {
    const request = InjectiveTxFeesV1Beta1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveTxFeesV1Beta1QueryPb.QueryParamsRequest,
      InjectiveTxFeesV1Beta1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client))

    return ChainGrpcTxFeesTransformer.moduleParamsResponseToModuleParams(
      response,
    )
  }

  async fetchEipBaseFee() {
    const request =
      InjectiveTxFeesV1Beta1QueryPb.QueryEipBaseFeeRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveTxFeesV1Beta1QueryPb.QueryEipBaseFeeRequest,
      InjectiveTxFeesV1Beta1QueryPb.QueryEipBaseFeeResponse
    >(request, this.client.getEipBaseFee.bind(this.client))

    return ChainGrpcTxFeesTransformer.eipBaseFeeResponseToEipBaseFee(response)
  }
}
