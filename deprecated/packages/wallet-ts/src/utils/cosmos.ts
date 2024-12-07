import { CosmosTxV1Beta1Tx } from '@injectivelabs/sdk-ts'

export const createCosmosSignDocFromSignDoc = (
  signDoc: CosmosTxV1Beta1Tx.SignDoc,
): any => {
  return CosmosTxV1Beta1Tx.SignDoc.fromPartial({
    bodyBytes: signDoc.bodyBytes,
    authInfoBytes: signDoc.authInfoBytes,
    accountNumber: BigInt(signDoc.accountNumber).toString(),
    chainId: signDoc.chainId,
  })
}
