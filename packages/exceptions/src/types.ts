import type { grpc } from '@improbable-eng/grpc-web'

export enum ErrorType {
  Unspecified = 'unspecified',
  GrpcUnaryRequest = 'grpc-unary-request',
  HttpGetRequest = 'http-get-request',
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
