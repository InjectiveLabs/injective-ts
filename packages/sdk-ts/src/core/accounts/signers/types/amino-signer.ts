import {
  Algo as CosmjsAlgo,
  AccountData as CosmjsAccountData,
  OfflineAminoSigner as CosmjsOfflineAminoSigner,
} from '@cosmjs/amino'

export type Algo = CosmjsAlgo | 'eth_secp256k1'

export interface AccountData extends Omit<CosmjsAccountData, 'algo'> {
  algo: Algo
}

export interface OfflineAminoSigner
  extends Omit<CosmjsOfflineAminoSigner, 'getAccounts'> {
  readonly getAccounts: () => Promise<readonly AccountData[]>
}
