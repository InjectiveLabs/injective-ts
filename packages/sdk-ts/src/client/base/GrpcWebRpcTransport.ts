import {
  getGrpcWebTransport,
  type GrpcWebTransportAdditionalOptions,
} from '../../utils/grpc.js'
import type {
  UnaryCall,
  RpcOptions,
  MethodInfo,
  RpcTransport,
  ServerStreamingCall,
  ClientStreamingCall,
  DuplexStreamingCall,
} from '@protobuf-ts/runtime-rpc'

/**
 * GrpcWebRpcTransport provides a simple wrapper around GrpcWebFetchTransport
 * from @protobuf-ts/grpcweb-transport for use with protobuf-ts generated clients.
 *
 * This transport works in browser, Node.js, and React Native environments.
 */
export class GrpcWebRpcTransport implements RpcTransport {
  private transport: RpcTransport

  constructor(baseUrl: string, options?: GrpcWebTransportAdditionalOptions) {
    this.transport = getGrpcWebTransport(baseUrl, options)
  }

  mergeOptions(options?: Partial<RpcOptions>): RpcOptions {
    return this.transport.mergeOptions(options)
  }

  unary<I extends object, O extends object>(
    method: MethodInfo<I, O>,
    input: I,
    options: RpcOptions,
  ): UnaryCall<I, O> {
    return this.transport.unary(method, input, options)
  }

  serverStreaming<I extends object, O extends object>(
    method: MethodInfo<I, O>,
    input: I,
    options: RpcOptions,
  ): ServerStreamingCall<I, O> {
    return this.transport.serverStreaming(method, input, options)
  }

  clientStreaming<I extends object, O extends object>(
    method: MethodInfo<I, O>,
    options: RpcOptions,
  ): ClientStreamingCall<I, O> {
    return this.transport.clientStreaming(method, options)
  }

  duplex<I extends object, O extends object>(
    method: MethodInfo<I, O>,
    options: RpcOptions,
  ): DuplexStreamingCall<I, O> {
    return this.transport.duplex(method, options)
  }
}
