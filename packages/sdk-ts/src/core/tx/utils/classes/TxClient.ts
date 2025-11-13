import * as CosmosTxV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/v1beta1/tx_pb.mjs'
import { hashToHex } from '../../../../utils/crypto.js'
import {
  uint8ArrayToBase64,
  base64ToUint8Array,
} from '../../../../utils/encoding.js'

export class TxClient {
  /**
   * Encode a transaction to base64-encoded protobuf
   * @param tx transaction to encode
   */
  public static encode(tx: CosmosTxV1Beta1TxPb.TxRaw): string {
    return uint8ArrayToBase64(CosmosTxV1Beta1TxPb.TxRaw.toBinary(tx))
  }

  /**
   * Decode a transaction from base64-encoded protobuf
   * @param tx transaction string to decode
   */
  public static decode(encodedTx: string): CosmosTxV1Beta1TxPb.TxRaw {
    return CosmosTxV1Beta1TxPb.TxRaw.fromBinary(base64ToUint8Array(encodedTx))
  }

  /**
   * Get the transaction's hash
   * @param tx transaction to hash
   */
  public static hash(tx: CosmosTxV1Beta1TxPb.TxRaw): string {
    return hashToHex(TxClient.encode(tx))
  }
}
