import { RpcError } from '@protobuf-ts/runtime-rpc'
import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { GrpcWebRpcTransport } from './GrpcWebRpcTransport.js'
import type { UnaryCall, RpcOptions } from '@protobuf-ts/runtime-rpc'

/**
 * BaseGrpcConsumer provides base functionality for all gRPC consumers.
 * It uses the GrpcWebRpcTransport with GrpcWebFetchTransport from @protobuf-ts/grpcweb-transport.
 */
export default class BaseGrpcConsumer {
  protected transport: GrpcWebRpcTransport
  protected module: string = ''
  protected metadata?: Record<string, string>
  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.transport = new GrpcWebRpcTransport(endpoint, {
      headers: {},
    })
  }

  public setMetadata(map: Record<string, string>) {
    this.metadata = map
    // Recreate transport with new metadata
    this.transport = new GrpcWebRpcTransport(this.endpoint, {
      headers: this.metadata,
    })
    return this
  }

  public clearMetadata() {
    this.metadata = undefined
  }

  public getTransport(): GrpcWebRpcTransport {
    return this.transport
  }

  /**
   * Builds RpcOptions with metadata
   */
  protected getRpcOptions(): RpcOptions {
    const options: RpcOptions = {
      meta: this.metadata || {},
    }

    return options
  }

  /**
   * Retry a gRPC call with exponential backoff
   */
  protected retry<TResponse>(
    grpcCall: () => Promise<TResponse>,
    retries: number = 3,
    delay: number = 1000,
  ): Promise<TResponse> {
    const retryGrpcCall = async (attempt = 1): Promise<TResponse> => {
      try {
        return await grpcCall()
      } catch (e: unknown) {
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

  /**
   * Centralized error handler for gRPC calls
   * Converts RpcError to GrpcUnaryRequestException with proper error codes
   */
  protected handleGrpcError(e: unknown, context: string): never {
    if (e instanceof RpcError) {
      throw new GrpcUnaryRequestException(new Error(e.message), {
        code: grpcErrorCodeToErrorCode(Number(e.code)),
        context,
        contextModule: this.module,
      })
    }

    throw new GrpcUnaryRequestException(e as Error, {
      code: UnspecifiedErrorCode,
      context,
      contextModule: this.module,
    })
  }

  /**
   * Generic wrapper for gRPC calls with retry and error handling
   * Simplifies the common pattern of: retry -> await response -> handle errors
   *
   * Usage with explicit type parameter:
   * ```typescript
   * const response = await this.executeGrpcCall<QueryParamsRequest, QueryParamsResponse>(
   *   request,
   *   this.client.params.bind(this.client),
   * )
   * ```
   * @template TRequest - The request message type
   * @template TResponse - The response message type
   */
  protected async executeGrpcCall<
    TRequest extends object = object,
    TResponse extends object = object,
  >(
    request: TRequest,
    clientMethod: (
      req: TRequest,
      options?: RpcOptions,
    ) => UnaryCall<TRequest, TResponse>,
  ): Promise<TResponse> {
    try {
      return await this.retry(async () => {
        const call = clientMethod(request, this.getRpcOptions())
        return await call.response
      })
    } catch (e: unknown) {
      // Derive context from method name if not provided
      const errorContext = clientMethod.name || 'UnknownMethod'
      this.handleGrpcError(e, errorContext)
    }
  }
}
