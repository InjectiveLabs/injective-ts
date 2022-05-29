import { grpc } from '@improbable-eng/grpc-web'
import { GrpcException } from '@injectivelabs/exceptions'
import { isServerSide } from '@injectivelabs/utils'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'

if (isServerSide()) {
  grpc.setDefaultTransport(NodeHttpTransport())
}

export default class BaseConsumer {
  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  protected request<
    TRequest extends grpc.ProtobufMessage,
    TResponse extends grpc.ProtobufMessage,
    S extends grpc.UnaryMethodDefinition<TRequest, TResponse>
  >(request: TRequest, service: S): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      grpc.unary(service, {
        request,
        host: this.endpoint,
        onEnd: (res) => {
          const { statusMessage, status, message } = res

          if (status === grpc.Code.OK && message) {
            resolve(message as TResponse)
          }

          reject(new GrpcException(statusMessage))
        },
      })
    })
  }
}
