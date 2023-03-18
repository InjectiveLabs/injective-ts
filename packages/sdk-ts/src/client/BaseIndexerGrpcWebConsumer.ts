import { grpc } from '@injectivelabs/grpc-web'
import { isBrowser } from '../utils/helpers'
import { getGrpcTransport } from '../utils/grpc'
import { InjectiveAccountRpc } from '@injectivelabs/indexer-proto-ts'

if (!isBrowser()) {
  grpc.setDefaultTransport(getGrpcTransport() as grpc.TransportFactory)
}

/**
 * @hidden
 */
export default class BaseIndexerGrpcWebConsumer extends InjectiveAccountRpc.GrpcWebImpl {
  protected module: string = ''

  constructor(endpoint: string) {
    super(endpoint, { transport: getGrpcTransport() })
  }
}

export const getGrpcIndexerWebImpl = (endpoint: string) =>
  new BaseIndexerGrpcWebConsumer(endpoint)
