import type { grpc } from '@improbable-eng/grpc-web'

export enum HttpRequestMethod {
  Get = 'GET',
  Post = 'POST',
  Options = 'OPTIONS',
}

export enum ErrorType {
  Unspecified = 'unspecified',
  ExecutionError = 'execution-error',
  NotFoundError = 'not-found-error',
  ValidationError = 'validation-error',
  WalletError = 'wallet-error',
  WalletNotInstalledError = 'wallet-not-installed-error',
  GrpcUnaryRequest = 'grpc-unary-request',
  HttpRequest = 'http-request',
  Web3 = 'web3',
}

export enum ChainErrorCode {}

export type IndexerApiErrorCode = number

export const UnspecifiedErrorCode = -1

export type ErrorCode =
  | ChainErrorCode
  | IndexerApiErrorCode
  | typeof UnspecifiedErrorCode
  | grpc.Code

export interface ErrorContext {
  code?: ErrorCode
  type?: ErrorType
  contextModule?: string
}
