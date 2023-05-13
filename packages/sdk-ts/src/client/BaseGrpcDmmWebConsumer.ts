import { grpc } from '@injectivelabs/grpc-web'
import { isBrowser } from '../utils/helpers'
import { getGrpcTransport } from '../utils/grpc'
import { InjectiveDmmRpc } from '@injectivelabs/dmm-proto-ts'

if (!isBrowser()) {
  grpc.setDefaultTransport(getGrpcTransport() as grpc.TransportFactory)
}

/**
 * @hidden
 */
export default class BaseDmmGrpcWebConsumer extends InjectiveDmmRpc.GrpcWebImpl {
  protected module: string = ''

  constructor(endpoint: string) {
    super(endpoint, { transport: getGrpcTransport() })
  }
}

export const getGrpcDmmWebImpl = (endpoint: string) =>
  new BaseDmmGrpcWebConsumer(endpoint)
