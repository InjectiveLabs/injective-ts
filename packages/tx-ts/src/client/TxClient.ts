import { TxRaw } from '@injectivelabs/chain-api/cosmos/tx/v1beta1/tx_pb'
import { hashToHex } from '../utils/crypto'

export class TxClient {
  /**
   * Encode a transaction to base64-encoded protobuf
   * @param tx transaction to encode
   */
  public static encode(tx: TxRaw): string {
    return Buffer.from(tx.serializeBinary()).toString('base64')
  }

  /**
   * Decode a transaction from base64-encoded protobuf
   * @param tx transaction string to decode
   */
  public static decode(encodedTx: string): TxRaw {
    return TxRaw.deserializeBinary(Buffer.from(encodedTx, 'base64'))
  }

  /**
   * Get the transaction's hash
   * @param tx transaction to hash
   */
  public static hash(tx: TxRaw): string {
    return hashToHex(TxClient.encode(tx))
  }
}
