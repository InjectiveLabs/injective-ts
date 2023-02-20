import { grpc } from '@injectivelabs/grpc-web'
import { GrpcUnaryRequestException } from '@injectivelabs/exceptions'
import { isBrowser } from '../utils/helpers'
import { getGrpcTransport } from '../utils/grpc'

if (!isBrowser()) {
  grpc.setDefaultTransport(getGrpcTransport() as grpc.TransportFactory)
}

/**
 * @hidden
 */
export default class BaseGrpcConsumer {
  protected module: string = ''

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  protected request<
    TRequest extends grpc.ProtobufMessage,
    TResponse extends grpc.ProtobufMessage,
    S extends grpc.UnaryMethodDefinition<TRequest, TResponse>,
  >(request: TRequest, service: S): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      grpc.unary(service, {
        request,
        host: this.endpoint,
        onEnd: (res) => {
          const { statusMessage, status, message } = res

          if (status === grpc.Code.OK && message) {
            return resolve(message as TResponse)
          }

          console.log(
            JSON.stringify({
              ...res,
              r: request.toObject(),
              s: service,
              e: this.endpoint,
            }),
          )

          return reject(
            new GrpcUnaryRequestException(
              new Error(statusMessage || 'The request failed.'),
              {
                code: status,
                context: this.endpoint,
                contextModule: this.module,
              },
            ),
          )
        },
      })
    })
  }
}
