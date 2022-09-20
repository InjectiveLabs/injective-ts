import {
  InfoRequest,
  InfoResponse,
  PingRequest,
  PingResponse,
  VersionRequest,
  VersionResponse,
} from '@injectivelabs/indexer-api/injective_meta_rpc_pb'
import { InjectiveMetaRPC } from '@injectivelabs/indexer-api/injective_meta_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'
import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcMetaApi extends BaseConsumer {
  protected module: string = IndexerModule.Meta

  async fetchPing() {
    const request = new PingRequest()

    try {
      const response = await this.request<
        PingRequest,
        PingResponse,
        typeof InjectiveMetaRPC.Ping
      >(request, InjectiveMetaRPC.Ping)

      return response.toObject()
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
    const request = new VersionRequest()

    try {
      const response = await this.request<
        VersionRequest,
        VersionResponse,
        typeof InjectiveMetaRPC.Version
      >(request, InjectiveMetaRPC.Version)

      return response.toObject()
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
    const request = new InfoRequest()

    try {
      const response = await this.request<
        InfoRequest,
        InfoResponse,
        typeof InjectiveMetaRPC.Info
      >(request, InjectiveMetaRPC.Info)

      return response.toObject()
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
