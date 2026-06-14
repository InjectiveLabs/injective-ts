import { CosmosTxV1Beta1TxPb } from '@injectivelabs/sdk-ts/proto/cosmos-tx'

export const createCosmosSignDocFromSignDoc = (
  signDoc: CosmosTxV1Beta1TxPb.SignDoc,
): any => {
  return CosmosTxV1Beta1TxPb.SignDoc.create({
    bodyBytes: signDoc.bodyBytes,
    authInfoBytes: signDoc.authInfoBytes,
    accountNumber: BigInt(signDoc.accountNumber),
    chainId: signDoc.chainId,
  })
}
