import { CosmosTxSigningV1Beta1Signing } from '@injectivelabs/core-proto-ts'

export const SIGN_DIRECT =
  CosmosTxSigningV1Beta1Signing.SignMode.SIGN_MODE_DIRECT
export const SIGN_AMINO =
  CosmosTxSigningV1Beta1Signing.SignMode.SIGN_MODE_LEGACY_AMINO_JSON
export const SIGN_EIP712 =
  CosmosTxSigningV1Beta1Signing.SignMode.SIGN_MODE_LEGACY_AMINO_JSON
export const SIGN_EIP712_V2 =
  CosmosTxSigningV1Beta1Signing.SignMode.SIGN_MODE_EIP712_V2
