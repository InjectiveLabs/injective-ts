import { IndexerModule } from '../types'
import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { InjectiveMetaRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcMetaApi {
  protected module: string = IndexerModule.Meta

  protected client: InjectiveMetaRpc.InjectiveMetaRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveMetaRpc.InjectiveMetaRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  async fetchPing() {
    const request = InjectiveMetaRpc.PingRequest.create()

    try {
      const response = await this.client.Ping(request)

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchVersion() {
    const request = InjectiveMetaRpc.VersionRequest.create()

    try {
      const response = await this.client.Version(request)

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }

  async fetchInfo() {
    const request = InjectiveMetaRpc.InfoRequest.create()

    request.timestamp = Date.now().toString()

    try {
      const response = await this.client.Info(request)

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        contextModule: this.module,
      })
    }
  }
}
