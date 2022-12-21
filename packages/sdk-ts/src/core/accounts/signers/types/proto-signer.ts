import {
  Algo as CosmjsAlgo,
  AccountData as CosmjsAccountData,
  OfflineDirectSigner as CosmjsOfflineDirectSigner,
} from '@cosmjs/proto-signing'

export type Algo = CosmjsAlgo | 'eth_secp256k1'

export interface AccountData extends Omit<CosmjsAccountData, 'algo'> {
  algo: Algo
}

export interface OfflineDirectSigner
  extends Omit<CosmjsOfflineDirectSigner, 'getAccounts'> {
  readonly getAccounts: () => Promise<readonly AccountData[]>
}
