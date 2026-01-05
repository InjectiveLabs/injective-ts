import {
  type GrpcWebOptions,
  GrpcWebFetchTransport,
} from '@protobuf-ts/grpcweb-transport'
import type { RpcTransport } from '@protobuf-ts/runtime-rpc'

type GrpcWebTransportAdditionalOptions = Omit<GrpcWebOptions, 'baseUrl'>

/**
 * Creates a gRPC-Web transport using @protobuf-ts/grpcweb-transport.
 * This transport works in browser, Node.js, and React Native environments.
 *
 * @param baseUrl - The base URL of the gRPC-Web endpoint
 * @param options - Optional configuration for the transport
 * @returns A configured RpcTransport instance
 */
export const getGrpcWebTransport = (
  baseUrl: string,
  options?: GrpcWebTransportAdditionalOptions,
): RpcTransport => {
  return new GrpcWebFetchTransport({
    baseUrl,
    ...options,
  })
}

/**
 * Re-export GrpcWebFetchTransport for direct use
 */
export { GrpcWebFetchTransport, type GrpcWebTransportAdditionalOptions }
