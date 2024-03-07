import { TxRestApi } from '../api/TxRestApi'
import { TxGrpcApi } from '../api/TxGrpcApi'

export * from './TxGrpcApi'
export * from './TxRestApi'
export * from './utils'

/**
 * @deprecated use TxRestApi and TxGrpcApi
 **/
export { TxRestApi as TxRestClient, TxGrpcApi as TxGrpcClient }
