import { grpc, grpcPkg } from '../../utils/grpc.js'
import { BrowserHeaders } from 'browser-headers'
import { Observable } from 'rxjs'
import { share } from 'rxjs/operators'

interface UnaryMethodDefinitionR extends grpcPkg.grpc.UnaryMethodDefinition<any, any> {
  requestStream: any
  responseStream: any
}

type UnaryMethodDefinition = UnaryMethodDefinitionR

export interface Rpc {
  unary<T extends UnaryMethodDefinition>(
    methodDesc: T,
    request: any,
    metadata: grpcPkg.grpc.Metadata | undefined,
  ): Promise<any>
  invoke<T extends UnaryMethodDefinition>(
    methodDesc: T,
    request: any,
    metadata: grpcPkg.grpc.Metadata | undefined,
  ): Observable<any>
}

export class GrpcWebError extends Error {
  constructor(
    message: string,
    public code: grpcPkg.grpc.Code,
    public metadata: grpcPkg.grpc.Metadata,
  ) {
    super(message)
  }
}

export class GrpcWebImpl {
  private host: string
  private options: {
    transport?: grpcPkg.grpc.TransportFactory
    streamingTransport?: grpcPkg.grpc.TransportFactory
    debug?: boolean
    metadata?: grpcPkg.grpc.Metadata
    upStreamRetryCodes?: number[]
  }

  constructor(
    host: string,
    options: {
      transport?: grpcPkg.grpc.TransportFactory
      streamingTransport?: grpcPkg.grpc.TransportFactory
      debug?: boolean
      metadata?: grpcPkg.grpc.Metadata
      upStreamRetryCodes?: number[]
    },
  ) {
    this.host = host
    this.options = options
  }

  unary<T extends UnaryMethodDefinition>(
    methodDesc: T,
    _request: any,
    metadata: grpcPkg.grpc.Metadata | undefined,
  ): Promise<any> {
    const request = { ..._request, ...methodDesc.requestType }
    const metadataWithCookieMetadata = new BrowserHeaders({
      ...(metadata?.headersMap || {}),
      ...(this.options?.metadata?.headersMap || {}),
    })

    return new Promise((resolve, reject) => {
      grpc.unary(methodDesc, {
        request,
        host: this.host,
        metadata: metadataWithCookieMetadata,
        transport: this.options.transport,
        debug: this.options.debug,
        onEnd: (response) => {
          if (response.status === grpc.Code.OK) {
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

  invoke<T extends UnaryMethodDefinition>(
    methodDesc: T,
    _request: any,
    metadata: grpcPkg.grpc.Metadata | undefined,
  ): Observable<any> {
    const upStreamCodes = this.options.upStreamRetryCodes || []
    const DEFAULT_TIMEOUT_TIME: number = 3_000
    const request = { ..._request, ...methodDesc.requestType }
    const actualMetadata = new BrowserHeaders({
      ...(metadata?.headersMap || {}),
      ...(this.options?.metadata?.headersMap || {}),
    })

    return new Observable((observer) => {
      const upStream = () => {
        const client = grpc.invoke(methodDesc, {
          host: this.host,
          request,
          transport: this.options.streamingTransport || this.options.transport,
          metadata: actualMetadata,
          debug: this.options.debug,
          onMessage: (next) => observer.next(next),
          onEnd: (
            code: grpcPkg.grpc.Code,
            message: string,
            trailers: grpcPkg.grpc.Metadata,
          ) => {
            if (code === 0) {
              observer.complete()
            } else if (upStreamCodes.includes(code)) {
              setTimeout(upStream, DEFAULT_TIMEOUT_TIME)
            } else {
              const err = new Error(message) as any
              err.code = code
              err.metadata = trailers
              observer.error(err)
            }
          },
        })
        observer.add(() => client.close())
      }
      upStream()
    }).pipe(share())
  }
}
