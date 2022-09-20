import { ErrorCode, ErrorContextCode } from './codes'

export * from './modules'
export * from './codes'

export enum HttpRequestMethod {
  Get = 'GET',
  Post = 'POST',
  Options = 'OPTIONS',
}

export enum ErrorType {
  Unspecified = 'unspecified',
  ChainError = 'chain-error',
  ExecutionError = 'execution-error',
  NotFoundError = 'not-found-error',
  ValidationError = 'validation-error',
  WalletError = 'wallet-error',
  WalletNotInstalledError = 'wallet-not-installed-error',
  GrpcUnaryRequest = 'grpc-unary-request',
  HttpRequest = 'http-request',
  Web3 = 'web3',
}

export interface ErrorContext {
  code?: ErrorCode
  type?: ErrorType
  contextModule?: string

  /**
   * Needed when we get a code error from a Http/Grpc Request
   * and we need to specify the error code for the particular message
   * for example why the transaction has failed
   * */
  contextCode?: ErrorContextCode
}

export interface Exception {
  /**
   * The type of the Error
   */
  type: ErrorType

  /**
   * Error specific code (HttpStatus, GrpcStatus, etc)
   */
  code: ErrorCode

  /**
   * The name of the error (the name of the instance of the Exception)
   */
  name: string

  /**
   * Providing more context as to where the exception was thrown
   * (ex: on-chain module, etc)
   */
  contextModule?: string

  /**
   * Providing more context as to why the exception was thrown
   * (ex: on-chain error code, etc)
   */
  contextCode?: ErrorContextCode

  /**
   * Parsed message of the exception
   */
  message: string

  /**
   * The original stack of the error
   */
  stack?: string

  /**
   * The original message of the error
   */
  errorMessage: string

  parse?(): void

  parseError(error: Error): void

  parseContext(context?: ErrorContext): void

  setType(type: ErrorType): void

  setCode(code: ErrorCode): void

  setStack(stack: string): void

  setName(name: string): void

  setMessage(message: string): void

  setContextModule(contextModule: string): void

  toOriginalError(): Error

  toError(): Error

  toString(): string
}
