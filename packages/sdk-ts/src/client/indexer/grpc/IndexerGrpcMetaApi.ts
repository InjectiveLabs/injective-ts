import {
  InjectiveMetaRpcPb,
  InjectiveMetaRPCClient,
} from '@injectivelabs/indexer-proto-ts-v2'
import { IndexerModule } from '../types/index.js'
import BaseIndexerGrpcConsumerV2 from '../../base/BaseIndexerGrpcConsumerV2.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcMetaApi extends BaseIndexerGrpcConsumerV2 {
  protected module: string = IndexerModule.Meta
  private client: InjectiveMetaRPCClient

  constructor(endpoint: string) {
    super(endpoint)
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
