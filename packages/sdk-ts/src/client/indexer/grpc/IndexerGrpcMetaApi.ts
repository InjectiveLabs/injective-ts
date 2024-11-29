import {
  GrpcUnaryRequestException,
  UnspecifiedErrorCode,
} from '@injectivelabs/exceptions'
import { InjectiveMetaRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerModule } from '../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcMetaApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Meta

  protected client: InjectiveMetaRpc.InjectiveMetaRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveMetaRpc.InjectiveMetaRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchPing() {
    const request = InjectiveMetaRpc.PingRequest.create()

    try {
      const response = await this.retry<InjectiveMetaRpc.PingResponse>(() =>
        this.client.Ping(request),
      )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Ping',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Ping',
        contextModule: this.module,
      })
    }
  }

  async fetchVersion() {
    const request = InjectiveMetaRpc.VersionRequest.create()

    try {
      const response = await this.retry<InjectiveMetaRpc.VersionResponse>(() =>
        this.client.Version(request),
      )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Version',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Version',
        contextModule: this.module,
      })
    }
  }

  async fetchInfo() {
    const request = InjectiveMetaRpc.InfoRequest.create()

    request.timestamp = Date.now().toString()

    try {
      const response = await this.retry<InjectiveMetaRpc.InfoResponse>(() =>
        this.client.Info(request),
      )

      return response
    } catch (e: unknown) {
      if (e instanceof InjectiveMetaRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Info',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Info',
        contextModule: this.module,
      })
    }
  }
}
