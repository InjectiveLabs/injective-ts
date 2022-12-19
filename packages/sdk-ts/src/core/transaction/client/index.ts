import { TxRestApi } from './TxRestApi'
import { TxGrpcApi } from './TxGrpcApi'

export * from './TxGrpcApi'
export * from './TxRestApi'
export * from './TxClient'
export * from './types'

/**
 * @deprecated use TxRestApi and TxGrpcApi
 **/
export { TxRestApi as TxRestClient, TxGrpcApi as TxGrpcClient }
