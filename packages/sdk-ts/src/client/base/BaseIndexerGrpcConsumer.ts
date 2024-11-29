import { getGrpcTransport } from '../../utils/grpc.js'
import { GrpcWebImpl } from './IndexerGrpcWebImpl.js'

export default class BaseIndexerGrpcConsumer extends GrpcWebImpl {
  protected module: string = ''

  constructor(endpoint: string) {
    super(endpoint, {
      transport: getGrpcTransport(),
    })
  }

  public getGrpcWebImpl(endpoint: string) {
    return new BaseIndexerGrpcConsumer(endpoint)
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
