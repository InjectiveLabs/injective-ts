import { getGrpcTransport, grpc, grpcPkg } from '../../utils/grpc.js'
import { GrpcWebImpl } from './IndexerGrpcWebImpl.js'

export default class BaseIndexerGrpcConsumer extends GrpcWebImpl {
  protected module: string = ''

  protected metadata?: grpcPkg.grpc.Metadata

  constructor(endpoint: string) {
    super(endpoint, {
      transport: getGrpcTransport(),
    })
  }

  public getGrpcWebImpl(endpoint: string) {
    return new BaseIndexerGrpcConsumer(endpoint)
  }

  public setMetadata(map: Record<string, string>) {
    const metadata = new grpc.Metadata()

    Object.keys(map).forEach((key) => metadata.set(key, map[key]))

    this.metadata = metadata

    return this
  }

  public clearMetadata() {
    this.metadata = undefined
  }

  protected retry<TResponse>(
    grpcCall: Function,
    retries: number = 3,
    delay: number = 1000,
  ): Promise<TResponse> {
    const retryGrpcCall = async (attempt = 1): Promise<any> => {
      try {
        return await grpcCall()
      } catch (e: any) {
        if (attempt >= retries) {
          throw e
        }

        return new Promise((resolve) =>
          setTimeout(
            () => resolve(retryGrpcCall(attempt + 1)),
            delay * attempt,
          ),
        )
      }
    }

    return retryGrpcCall()
  }
}
