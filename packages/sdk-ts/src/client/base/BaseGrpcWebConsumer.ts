import { getGrpcTransport } from '../../utils/grpc.js'
import { GrpcWebImpl } from './GrpcWebImpl.js'

/**
 * @hidden
 */
export default class BaseGrpcWebConsumer extends GrpcWebImpl {
  protected module: string = ''

  constructor(endpoint: string) {
    super(endpoint, {
      transport: getGrpcTransport(),
      setCookieMetadata: true
    })
  }

  static getGrpcWebImpl = (endpoint: string) =>
    new BaseGrpcWebConsumer(endpoint)
}
