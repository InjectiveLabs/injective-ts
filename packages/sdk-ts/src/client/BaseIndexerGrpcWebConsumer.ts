import { grpc } from '@improbable-eng/grpc-web'
import { isBrowser } from '../utils/helpers'
import { getGrpcTransport } from '../utils/grpc'
import { GrpcWebImpl } from '@injectivelabs/indexer-proto-ts/injective_accounts_rpc'

if (!isBrowser()) {
  grpc.setDefaultTransport(getGrpcTransport() as grpc.TransportFactory)
}

/**
 * @hidden
 */
export default class BaseIndexerGrpcWebConsumer extends GrpcWebImpl {
  protected module: string = ''

  constructor(endpoint: string) {
    super(endpoint, { transport: getGrpcTransport() })
  }
}

export const getGrpcIndexerWebImpl = (endpoint: string) =>
  new BaseIndexerGrpcWebConsumer(endpoint)
