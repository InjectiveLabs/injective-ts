import * as CosmosTxSigningV1Beta1SigningPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/tx/signing/v1beta1/signing_pb.mjs'

export const SIGN_DIRECT = CosmosTxSigningV1Beta1SigningPb.SignMode.DIRECT
export const SIGN_AMINO =
  CosmosTxSigningV1Beta1SigningPb.SignMode.LEGACY_AMINO_JSON
export const SIGN_EIP712 =
  CosmosTxSigningV1Beta1SigningPb.SignMode.LEGACY_AMINO_JSON
export const SIGN_EIP712_V2 = CosmosTxSigningV1Beta1SigningPb.SignMode.EIP712_V2
