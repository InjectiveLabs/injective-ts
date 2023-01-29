import { grpc } from '@improbable-eng/grpc-web'
import { isBrowser } from '../utils/helpers'
import { getGrpcTransport } from '../utils/grpc'
import { GrpcWebImpl } from '@injectivelabs/core-proto-ts/tendermint/abci/types'

if (!isBrowser()) {
  grpc.setDefaultTransport(getGrpcTransport() as grpc.TransportFactory)
}

/**
 * @hidden
 */
export default class BaseGrpcWebConsumer extends GrpcWebImpl {
  protected module: string = ''

  constructor(endpoint: string) {
    super(endpoint, { transport: getGrpcTransport() })
  }
}

export const getGrpcWebImpl = (endpoint: string) =>
  new BaseGrpcWebConsumer(endpoint)
