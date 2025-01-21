import {
  $grpc,
  Code,
  Metadata,
  TransportFactory,
  UnaryMethodDefinition as $UnaryMethodDefinition,
} from '@injectivelabs/grpc-web'
import { BrowserHeaders } from 'browser-headers'

interface UnaryMethodDefinitionR extends $UnaryMethodDefinition<any, any> {
  requestStream: any
  responseStream: any
}

type UnaryMethodDefinition = UnaryMethodDefinitionR

export interface Rpc {
  unary<T extends UnaryMethodDefinition>(
    methodDesc: T,
    request: any,
    metadata: Metadata | undefined,
  ): Promise<any>
}

export class GrpcWebError extends Error {
  constructor(
    message: string,
    public code: Code,
    public metadata: Metadata,
  ) {
    super(message)
  }
}

export class GrpcWebImpl {
  private host: string
  private options: {
    transport?: TransportFactory
    debug?: boolean
    setCookieMetadata?: boolean
    metadata?: Metadata
    upStreamRetryCodes?: number[]
  }

  constructor(
    host: string,
    options: {
      transport?: TransportFactory
      debug?: boolean
      setCookieMetadata?: boolean
      metadata?: Metadata
      upStreamRetryCodes?: number[]
    },
  ) {
    this.host = host
    this.options = options
  }

  unary<T extends UnaryMethodDefinition>(
    methodDesc: T,
    _request: any,
    metadata: Metadata | undefined,
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType }
    const actualMetadata = new BrowserHeaders({
      ...(metadata?.headersMap || {}),
      ...(this.options?.metadata?.headersMap || {}),
    })

    return new Promise((resolve, reject) => {
      $grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: actualMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: (response) => {
          if (response.status === $grpc.Code.OK) {
            return resolve(response.message!.toObject())
          }

          return reject(
            new GrpcWebError(
              response.statusMessage,
              response.status,
              response.trailers,
            ),
          )
        },
      })
    })
  }
}
