import { RpcError } from '@protobuf-ts/runtime-rpc'
import {
  UnspecifiedErrorCode,
  TransactionException,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { GrpcWebRpcTransport } from './GrpcWebRpcTransport.js'
import type { UnaryCall, RpcOptions } from '@protobuf-ts/runtime-rpc'
import type { GrpcWebTransportAdditionalOptions } from '../../utils/grpc.js'

/**
 * BaseGrpcConsumer provides base functionality for all gRPC consumers.
 * It uses the GrpcWebRpcTransport with GrpcWebFetchTransport from @protobuf-ts/grpcweb-transport.
 */
export default class BaseGrpcConsumer {
  protected transport: GrpcWebRpcTransport
  protected module: string = ''
  protected metadata?: Record<string, string>
  protected endpoint: string
  protected options?: GrpcWebTransportAdditionalOptions

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    this.endpoint = endpoint
    this.options = options
    this.transport = new GrpcWebRpcTransport(endpoint, options)
  }

  public setMetadata(map: Record<string, string>) {
    this.metadata = map
    // Recreate transport with new metadata, preserving existing options
    this.transport = new GrpcWebRpcTransport(this.endpoint, {
      ...this.options,
      meta: this.metadata,
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
   * Extracts the ABCI error code from a gRPC error message.
   * Chain errors contain patterns like: {key:"ABCICode" value:"100"}
   */
  private getABCICodeFromMessage(message: string): number | undefined {
    const ABCICodePattern = /{key:"ABCICode"[ \t]+value:"(.*?)"}/g
    const ABCICode = ABCICodePattern.exec(message)

    if (!ABCICode || ABCICode.length < 2) {
      return undefined
    }

    return Number(ABCICode[1])
  }

  /**
   * Extracts the codespace/module from a gRPC error message.
   * Chain errors contain patterns like: {key:"Codespace" value:"exchange"}
   */
  private getCodespaceFromMessage(message: string): string | undefined {
    const codespacePattern = /{key:"Codespace"[ \t]+value:"(.*?)"}/g
    const codespace = codespacePattern.exec(message)

    if (!codespace || codespace.length < 2) {
      return undefined
    }

    return codespace[1]
  }

  /**
   * Centralized error handler for gRPC calls.
   * When the error contains chain error details (ABCI code and codespace),
   * throws a TransactionException which will map the error to a user-friendly message.
   * Otherwise throws a GrpcUnaryRequestException for generic gRPC errors.
   */
  protected handleGrpcError(e: unknown, context: string): never {
    if (e instanceof RpcError) {
      const message = e.message
      const abciCode = this.getABCICodeFromMessage(message)
      const codespace = this.getCodespaceFromMessage(message)

      // If we have chain error details, throw TransactionException
      // which will map the error to a user-friendly message
      if (abciCode && codespace) {
        throw new TransactionException(new Error(message), {
          code: grpcErrorCodeToErrorCode(Number(e.code)),
          context,
          contextModule: codespace,
          contextCode: abciCode,
        })
      }

      throw new GrpcUnaryRequestException(new Error(message), {
        code: grpcErrorCodeToErrorCode(Number(e.code)),
        context,
        contextModule: this.module,
      })
    }

    const error = e as Error
    const message = error?.message || ''
    const abciCode = this.getABCICodeFromMessage(message)
    const codespace = this.getCodespaceFromMessage(message)

    // If we have chain error details, throw TransactionException
    if (abciCode && codespace) {
      throw new TransactionException(error, {
        code: UnspecifiedErrorCode,
        context,
        contextModule: codespace,
        contextCode: abciCode,
      })
    }

    throw new GrpcUnaryRequestException(error, {
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
