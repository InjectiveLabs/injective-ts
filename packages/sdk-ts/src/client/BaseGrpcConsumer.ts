import { grpc } from '@improbable-eng/grpc-web'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { ReactNativeTransport } from '@improbable-eng/grpc-web-react-native-transport'
import { isServerSide } from '../utils/helpers'
import { GrpcUnaryRequestException } from '@injectivelabs/exceptions'

if (isServerSide()) {
  grpc.setDefaultTransport(NodeHttpTransport())
}

/**
 * @hidden
 */
export default class BaseGrpcConsumer {
  protected module: string = ''

  protected endpoint: string

  constructor(endpoint: string, RNTransport?: boolean) {
    this.endpoint = endpoint

    if (RNTransport) {
      grpc.setDefaultTransport(ReactNativeTransport({ withCredentials: true }))
    }
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
            new GrpcUnaryRequestException(new Error(statusMessage), {
              code: status,
              contextModule: this.module,
            }),
          )
        },
      })
    })
  }
}
