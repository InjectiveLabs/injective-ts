import { grpc } from '@injectivelabs/grpc-web'
import { isBrowser } from '../utils/helpers'
import { getGrpcTransport } from '../utils/grpc'
import { InjectiveAccountRpc } from '@injectivelabs/indexer-proto-ts'

if (!isBrowser()) {
  grpc.setDefaultTransport(getGrpcTransport() as grpc.TransportFactory)
}

export default class BaseGrpcConsumer extends InjectiveAccountRpc.GrpcWebImpl {
  protected module: string = ''

  constructor(endpoint: string) {
    super(endpoint, { transport: getGrpcTransport() })
  }

  public getGrpcWebImpl(endpoint: string) {
    return new BaseGrpcConsumer(endpoint)
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
