import { hashToHex } from '../../../../utils/crypto'
import { CosmosTxV1Beta1Tx } from '@injectivelabs/core-proto-ts'

export class TxClient {
  /**
   * Encode a transaction to base64-encoded protobuf
   * @param tx transaction to encode
   */
  public static encode(tx: CosmosTxV1Beta1Tx.TxRaw): string {
    return Buffer.from(CosmosTxV1Beta1Tx.TxRaw.encode(tx).finish()).toString(
      'base64',
    )
  }

  /**
   * Decode a transaction from base64-encoded protobuf
   * @param tx transaction string to decode
   */
  public static decode(encodedTx: string): CosmosTxV1Beta1Tx.TxRaw {
    return CosmosTxV1Beta1Tx.TxRaw.decode(Buffer.from(encodedTx, 'base64'))
  }

  /**
   * Get the transaction's hash
   * @param tx transaction to hash
   */
  public static hash(tx: CosmosTxV1Beta1Tx.TxRaw): string {
    return hashToHex(TxClient.encode(tx))
  }
}
