import { TxRaw } from '@injectivelabs/core-proto-ts/cosmos/tx/v1beta1/tx'
import { hashToHex } from '../../../../../utils/crypto'

export class TxClient {
  /**
   * Encode a transaction to base64-encoded protobuf
   * @param tx transaction to encode
   */
  public static encode(tx: TxRaw): string {
    return Buffer.from(TxRaw.encode(tx).finish()).toString('base64')
  }

  /**
   * Decode a transaction from base64-encoded protobuf
   * @param tx transaction string to decode
   */
  public static decode(encodedTx: string): TxRaw {
    return TxRaw.decode(Buffer.from(encodedTx, 'base64'))
  }

  /**
   * Get the transaction's hash
   * @param tx transaction to hash
   */
  public static hash(tx: TxRaw): string {
    return hashToHex(TxClient.encode(tx))
  }
}
