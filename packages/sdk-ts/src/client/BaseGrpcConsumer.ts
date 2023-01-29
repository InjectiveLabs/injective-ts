import { grpc } from '@improbable-eng/grpc-web'
import { GrpcUnaryRequestException } from '@injectivelabs/exceptions'
import { isBrowser } from '../utils/helpers'
import { getGrpcTransport } from '../utils/grpc'

if (!isBrowser()) {
  grpc.setDefaultTransport(getGrpcTransport() as grpc.TransportFactory)
}

interface UnaryMethodDefinition extends grpc.UnaryMethodDefinition<any, any> {
  requestStream: any
  responseStream: any
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

export const getRpcInterface = (endpoint: string, contextModule = '') => {
  return {
    unary<S extends UnaryMethodDefinition>(
      method: S,
      request: any,
      _metadata: grpc.Metadata | undefined,
    ): Promise<any> {
      return new Promise((resolve, reject) => {
        grpc.unary(method, {
          request,
          host: endpoint,
          onEnd: (res) => {
            const { statusMessage, status, message } = res

            if (status === grpc.Code.OK && message) {
              return resolve(message)
            }

            return reject(
              new GrpcUnaryRequestException(
                new Error(statusMessage || 'The request failed.'),
                {
                  code: status,
                  context: endpoint,
                  contextModule: contextModule,
                },
              ),
            )
          },
        })
      })
    },
  }
}
