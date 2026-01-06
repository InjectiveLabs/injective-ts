import * as InjectiveMetaRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_meta_rpc_pb'
import { InjectiveMetaRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_meta_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { GrpcWebTransportAdditionalOptions } from '../../../types'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcMetaApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Meta
  private client: InjectiveMetaRPCClient

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    super(endpoint, options)
    this.client = new InjectiveMetaRPCClient(this.transport)
  }

  async fetchPing() {
    const request = InjectiveMetaRpcPb.PingRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveMetaRpcPb.PingRequest,
      InjectiveMetaRpcPb.PingResponse
    >(request, this.client.ping.bind(this.client))

    return response
  }

  async fetchVersion() {
    const request = InjectiveMetaRpcPb.VersionRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveMetaRpcPb.VersionRequest,
      InjectiveMetaRpcPb.VersionResponse
    >(request, this.client.version.bind(this.client))

    return response
  }

  async fetchInfo() {
    const request = InjectiveMetaRpcPb.InfoRequest.create()

    request.timestamp = BigInt(Date.now())

    const response = await this.executeGrpcCall<
      InjectiveMetaRpcPb.InfoRequest,
      InjectiveMetaRpcPb.InfoResponse
    >(request, this.client.info.bind(this.client))

    return response
  }
}
