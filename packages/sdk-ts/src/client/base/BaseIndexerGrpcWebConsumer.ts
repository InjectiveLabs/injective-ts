import { getGrpcTransport } from '../../utils/grpc.js'
import { GrpcWebImpl } from './IndexerGrpcWebImpl.js'

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
