import { GrpcWebFetchTransport } from '@protobuf-ts/grpcweb-transport'
import type { RpcTransport } from '@protobuf-ts/runtime-rpc'

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
  options?: {
    /**
     * Custom fetch implementation (useful for Node.js or React Native)
     */
    fetch?: typeof fetch
    /**
     * Additional headers to include with every request
     */
    headers?: Record<string, string>
    /**
     * Timeout in milliseconds
     */
    timeout?: number
    /**
     * Whether to include credentials (cookies) with requests
     */
    credentials?: RequestCredentials
  },
): RpcTransport => {
  return new GrpcWebFetchTransport({
    baseUrl,
    ...options,
  })
}

/**
 * Re-export GrpcWebFetchTransport for direct use
 */
export { GrpcWebFetchTransport }
