import type { RpcOptions } from '@protobuf-ts/runtime-rpc'
import type { GrpcWebOptions } from '@protobuf-ts/grpcweb-transport'

export type GrpcWebTransportAdditionalOptions = Omit<
  GrpcWebOptions,
  'baseUrl'
> & {
  meta?: Record<string, string>
} & RpcOptions

export interface CallOptions {
  signal?: AbortSignal
}

export type GrpcCallOptions = CallOptions
