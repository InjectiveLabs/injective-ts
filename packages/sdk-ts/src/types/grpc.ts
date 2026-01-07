import type { GrpcWebOptions } from '@protobuf-ts/grpcweb-transport'

export type GrpcWebTransportAdditionalOptions = Omit<
  GrpcWebOptions,
  'baseUrl'
> & {
  meta?: Record<string, string>
}
