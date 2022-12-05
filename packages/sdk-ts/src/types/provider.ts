import { DirectSignResponse } from '@cosmjs/proto-signing'
import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { ChainId } from '@injectivelabs/ts-types'

export interface InjectiveWalletProvider {
  /**
   * The the accounts from the wallet (addresses)
   */
  getAddresses(): Promise<string[]>

  /**
   * Get the PubKey from the wallet
   * in base64 for Cosmos native wallets
   */
  getPubKey(): Promise<string>

  /**
   * Sends Cosmos transaction. Returns a transaction hash
   * @param transaction should implement TransactionConfig
   * @param options
   */
  sendTransaction(
    transaction: DirectSignResponse | TxRaw,
    options: { address: string; chainId: ChainId },
  ): Promise<string>

  signTransaction(
    transaction: { txRaw: TxRaw; chainId: string; accountNumber: number },
    address: string,
  ): Promise<DirectSignResponse>

  /**
   * Sign a cosmos transaction using the wallet provider
   *
   * @param transaction
   * @param address - injective address
   */
  signCosmosTransaction(transaction: {
    txRaw: TxRaw
    accountNumber: number
    chainId: string
    address: string
  }): Promise<DirectSignResponse>
}
