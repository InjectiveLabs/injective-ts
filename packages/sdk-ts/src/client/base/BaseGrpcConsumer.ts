import { RpcError } from '@protobuf-ts/runtime-rpc'
import {
  UnspecifiedErrorCode,
  TransactionException,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { GrpcStatusCode } from '../../types/stream.js'
import { GrpcWebRpcTransport } from './GrpcWebRpcTransport.js'
import type { UnaryCall, RpcOptions } from '@protobuf-ts/runtime-rpc'
import type { GrpcWebTransportAdditionalOptions } from '../../types'

const GRPC_STATUS_CODE_BY_NAME: Partial<Record<string, GrpcStatusCode>> = {
  OK: GrpcStatusCode.OK,
  CANCELLED: GrpcStatusCode.CANCELLED,
  UNKNOWN: GrpcStatusCode.UNKNOWN,
  INVALID_ARGUMENT: GrpcStatusCode.INVALID_ARGUMENT,
  DEADLINE_EXCEEDED: GrpcStatusCode.DEADLINE_EXCEEDED,
  NOT_FOUND: GrpcStatusCode.NOT_FOUND,
  ALREADY_EXISTS: GrpcStatusCode.ALREADY_EXISTS,
  PERMISSION_DENIED: GrpcStatusCode.PERMISSION_DENIED,
  RESOURCE_EXHAUSTED: GrpcStatusCode.RESOURCE_EXHAUSTED,
  FAILED_PRECONDITION: GrpcStatusCode.FAILED_PRECONDITION,
  ABORTED: GrpcStatusCode.ABORTED,
  OUT_OF_RANGE: GrpcStatusCode.OUT_OF_RANGE,
  UNIMPLEMENTED: GrpcStatusCode.UNIMPLEMENTED,
  INTERNAL: GrpcStatusCode.INTERNAL,
  UNAVAILABLE: GrpcStatusCode.UNAVAILABLE,
  DATA_LOSS: GrpcStatusCode.DATA_LOSS,
  UNAUTHENTICATED: GrpcStatusCode.UNAUTHENTICATED,
}

const GRPC_STATUS_NAME_BY_CODE: Partial<Record<GrpcStatusCode, string>> =
  Object.entries(GRPC_STATUS_CODE_BY_NAME).reduce(
    (statusNameMap, [statusName, statusCode]) => {
      if (statusCode === undefined) {
        return statusNameMap
      }

      statusNameMap[statusCode] = statusName

      return statusNameMap
    },
    {} as Partial<Record<GrpcStatusCode, string>>,
  )

const GRPC_RETRYABLE_STATUS_CODES = new Set<GrpcStatusCode>([
  GrpcStatusCode.UNAVAILABLE,
  GrpcStatusCode.DEADLINE_EXCEEDED,
  GrpcStatusCode.RESOURCE_EXHAUSTED,
  GrpcStatusCode.ABORTED,
])

/**
 * BaseGrpcConsumer provides base functionality for all gRPC consumers.
 * It uses the GrpcWebRpcTransport with GrpcWebFetchTransport from @protobuf-ts/grpcweb-transport.
 */
export default class BaseGrpcConsumer {
  private _client: unknown
  protected endpoint: string
  protected module: string = ''
  protected transport: GrpcWebRpcTransport
  protected metadata?: Record<string, string>
  protected options?: GrpcWebTransportAdditionalOptions

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    this.options = options
    this.endpoint = endpoint
    this.transport = new GrpcWebRpcTransport(endpoint, options)
  }

  public setMetadata(map: Record<string, string>) {
    this.metadata = map
    // Recreate transport with new metadata, preserving existing options
    this.transport = new GrpcWebRpcTransport(this.endpoint, {
      ...this.options,
      meta: this.metadata,
    })

    // Invalidate cached client so initClient creates a new client with updated transport
    this._client = undefined

    return this
  }

  /**
   * @deprecated Manage options within the constructor instead
   */
  public clearMetadata() {
    this.metadata = undefined
    // Recreate transport without metadata, preserving existing options
    this.transport = new GrpcWebRpcTransport(this.endpoint, this.options)
    // Invalidate cached client so initClient creates a new client with updated transport
    this._client = undefined
  }

  public getTransport(): GrpcWebRpcTransport {
    return this.transport
  }

  /**
   * Lazily initializes and returns the gRPC client.
   * Call this from a getter in subclasses to avoid constructor boilerplate.
   *
   * @example
   * private get client() {
   *   return this.initClient(MyGrpcClient)
   * }
   */
  protected initClient<TClient>(
    ClientClass: new (transport: GrpcWebRpcTransport) => TClient,
  ): TClient {
    if (!this._client) {
      this._client = new ClientClass(this.transport)
    }

    return this._client as TClient
  }

  /**
   * Builds RpcOptions with metadata
   * @deprecated Options should be managed externally and passed into the constructor instead
   */
  protected getRpcOptions(): RpcOptions {
    const options: RpcOptions = {
      meta: this.metadata || {},
    }

    return options
  }

  /**
   * Converts gRPC status names or numeric status values into numeric codes.
   */
  private getGrpcStatusCode(code: unknown): GrpcStatusCode | undefined {
    if (typeof code === 'number') {
      return Number.isFinite(code) ? (code as GrpcStatusCode) : undefined
    }

    if (typeof code !== 'string') {
      return undefined
    }

    const numericCode = Number(code)

    if (Number.isFinite(numericCode)) {
      return numericCode as GrpcStatusCode
    }

    return GRPC_STATUS_CODE_BY_NAME[code]
  }

  /**
   * Converts gRPC status names or numeric status values into status names.
   */
  private getGrpcStatusName(code: unknown): string | undefined {
    const statusCode = this.getGrpcStatusCode(code)

    if (statusCode !== undefined) {
      return GRPC_STATUS_NAME_BY_CODE[statusCode] || `${statusCode}`
    }

    if (typeof code !== 'string') {
      return undefined
    }

    const trimmedCode = code.trim()

    return trimmedCode.length > 0 ? trimmedCode : undefined
  }

  /**
   * Builds a short, useful fallback when protobuf-ts provides an empty message.
   */
  private getRpcErrorMessage(e: RpcError, context: string): string {
    if (e.message.trim().length > 0) {
      return e.message
    }

    const methodName = e.methodName || context
    const serviceName = e.serviceName || this.module
    const statusName = this.getGrpcStatusName(e.code)
    const target = serviceName ? `${methodName} on ${serviceName}` : methodName

    return statusName
      ? `${target} failed with ${statusName}`
      : `${target} failed`
  }

  /**
   * Adds RPC method/service details to exception context when available.
   */
  private getRpcErrorContext(e: RpcError, context: string): string {
    const rpcTarget = [e.serviceName, e.methodName].filter(Boolean).join('/')
    const contextDetails = [
      `baseUrl: ${this.endpoint}`,
      rpcTarget ? `rpc: ${rpcTarget}` : undefined,
    ].filter((detail): detail is string => Boolean(detail))

    return `${context} (${contextDetails.join(', ')})`
  }

  /**
   * Adds the base URL to generic exception context.
   */
  private getGrpcErrorContext(context: string): string {
    return `${context} (baseUrl: ${this.endpoint})`
  }

  /**
   * Determines whether a gRPC error is safe to retry.
   */
  private isRetryableGrpcError(e: unknown): boolean {
    if (!(e instanceof RpcError)) {
      return false
    }

    const statusCode = this.getGrpcStatusCode(e.code)

    return (
      statusCode !== undefined && GRPC_RETRYABLE_STATUS_CODES.has(statusCode)
    )
  }

  /**
   * Retry a gRPC call with backoff, only for retryable gRPC statuses.
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
        if (attempt >= retries || !this.isRetryableGrpcError(e)) {
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
      const grpcStatusCode = this.getGrpcStatusCode(e.code)
      const abciCode = this.getABCICodeFromMessage(message)
      const codespace = this.getCodespaceFromMessage(message)

      // If we have chain error details, throw TransactionException
      // which will map the error to a user-friendly message
      if (abciCode && codespace) {
        throw new TransactionException(new Error(message), {
          code:
            grpcStatusCode !== undefined
              ? grpcErrorCodeToErrorCode(grpcStatusCode)
              : UnspecifiedErrorCode,
          context,
          contextModule: codespace,
          contextCode: abciCode,
        })
      }

      throw new GrpcUnaryRequestException(
        new Error(this.getRpcErrorMessage(e, context)),
        {
          code:
            grpcStatusCode !== undefined
              ? grpcErrorCodeToErrorCode(grpcStatusCode)
              : UnspecifiedErrorCode,
          context: this.getRpcErrorContext(e, context),
          contextModule: this.module,
        },
      )
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
      context: this.getGrpcErrorContext(context),
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
   * @param options.noRetry - Set to true for non-idempotent RPCs (e.g. broadcast,
   * prepare-auto-sign) where retrying after a server-side success could cause
   * duplicate side effects. Defaults to false (retry with exponential backoff).
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
    options?: { noRetry?: boolean },
  ): Promise<TResponse> {
    const executeCall = async () => {
      const call = clientMethod(request, this.getRpcOptions())

      return (await call).response
    }

    try {
      return options?.noRetry
        ? await executeCall()
        : await this.retry(executeCall)
    } catch (e: unknown) {
      // Derive context from method name if not provided
      const errorContext = clientMethod.name || 'UnknownMethod'

      this.handleGrpcError(e, errorContext.replace('bound', '').trim())
    }
  }
}
