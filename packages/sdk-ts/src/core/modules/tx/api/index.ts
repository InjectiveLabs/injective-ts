import { TxRestApi } from '../api/TxRestApi'
import { TxGrpcApi } from '../api/TxGrpcApi'

export * from './TxGrpcApi'
export * from './TxRestApi'

/**
 * @deprecated use TxRestApi and TxGrpcApi
 **/
export { TxRestApi as TxRestClient, TxGrpcApi as TxGrpcClient }
