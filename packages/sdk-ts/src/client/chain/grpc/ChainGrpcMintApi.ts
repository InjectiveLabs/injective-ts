import { toHumanReadable } from '@injectivelabs/utils'
import * as CosmosMintV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/mint/v1beta1/query_pb.mjs'
import { QueryClient as CosmosMintV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/mint/v1beta1/query_pb.client.mjs'
import { ChainModule } from '../types/index.js'
import { uint8ArrayToString } from '../../../utils/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcMintTransformer } from './../transformers/ChainGrpcMintTransformer.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcMintApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Mint
  private client: CosmosMintV1Beta1QueryClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new CosmosMintV1Beta1QueryClient(this.transport)
  }

  async fetchModuleParams() {
    const request = CosmosMintV1Beta1QueryPb.QueryParamsRequest.create()

    const response = await this.executeGrpcCall<
      CosmosMintV1Beta1QueryPb.QueryParamsRequest,
      CosmosMintV1Beta1QueryPb.QueryParamsResponse
    >(request, this.client.params.bind(this.client))

    return ChainGrpcMintTransformer.moduleParamsResponseToModuleParams(response)
  }

  async fetchInflation() {
    const request = CosmosMintV1Beta1QueryPb.QueryInflationRequest.create()

    const response = await this.executeGrpcCall<
      CosmosMintV1Beta1QueryPb.QueryInflationRequest,
      CosmosMintV1Beta1QueryPb.QueryInflationResponse
    >(request, this.client.inflation.bind(this.client))

    return {
      inflation: toHumanReadable(uint8ArrayToString(response.inflation)),
    }
  }

  async fetchAnnualProvisions() {
    const request =
      CosmosMintV1Beta1QueryPb.QueryAnnualProvisionsRequest.create()

    const response = await this.executeGrpcCall<
      CosmosMintV1Beta1QueryPb.QueryAnnualProvisionsRequest,
      CosmosMintV1Beta1QueryPb.QueryAnnualProvisionsResponse
    >(request, this.client.annualProvisions.bind(this.client))

    return {
      annualProvisions: toHumanReadable(
        uint8ArrayToString(response.annualProvisions),
      ).toFixed(),
    }
  }
}
