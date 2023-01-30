import {
  InjectiveMetaRPCClientImpl,
  InfoRequest,
  PingRequest,
  VersionRequest,
} from '@injectivelabs/indexer-proto-ts/injective_meta_rpc'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcMetaApi {
  protected module: string = IndexerModule.Meta

  protected client: InjectiveMetaRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveMetaRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchPing() {
    const request = PingRequest.create()

    try {
      const response = await this.client.Ping(request)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchVersion() {
    const request = VersionRequest.create()

    try {
      const response = await this.client.Version(request)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchInfo() {
    const request = InfoRequest.create()

    try {
      const response = await this.client.Info(request)

      return response
    } catch (e: unknown) {
      if (e instanceof GrpcUnaryRequestException) {
        throw e
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
