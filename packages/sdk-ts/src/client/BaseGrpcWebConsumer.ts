import { grpc } from '@injectivelabs/grpc-web'
import { isBrowser } from '../utils/helpers'
import { getGrpcTransport } from '../utils/grpc'
import { TendermintAbciTypes } from '@injectivelabs/core-proto-ts'

if (!isBrowser()) {
  grpc.setDefaultTransport(getGrpcTransport() as grpc.TransportFactory)
}

/**
 * @hidden
 */
export default class BaseGrpcWebConsumer extends TendermintAbciTypes.GrpcWebImpl {
  protected module: string = ''

  constructor(endpoint: string) {
    super(endpoint, { transport: getGrpcTransport() })
  }
}

export const getGrpcWebImpl = (endpoint: string) =>
  new BaseGrpcWebConsumer(endpoint)
