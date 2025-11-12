import { GeneralException } from '@injectivelabs/exceptions'
import * as CosmosFeegrantV1Beta1FeegrantPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/feegrant/v1beta1/feegrant_pb.mjs'
import type * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'

export type AllowedMsgAllowance = Omit<
  CosmosFeegrantV1Beta1FeegrantPb.AllowedMsgAllowance,
  'allowance'
> & {
  allowance:
    | CosmosFeegrantV1Beta1FeegrantPb.BasicAllowance
    | CosmosFeegrantV1Beta1FeegrantPb.PeriodicAllowance
}

export type Allowance =
  | CosmosFeegrantV1Beta1FeegrantPb.BasicAllowance
  | CosmosFeegrantV1Beta1FeegrantPb.PeriodicAllowance
  | AllowedMsgAllowance
  | undefined

export const AllowanceTypes = {
  BasicAllowance: 'spendLimit',
  PeriodicAllowance: 'periodSpendLimit',
  AllowedMsgAllowance: 'allowedMessages',
} as const

export type AllowanceTypes =
  (typeof AllowanceTypes)[keyof typeof AllowanceTypes]

function isBasicAllowance(
  allowance: Allowance,
): allowance is CosmosFeegrantV1Beta1FeegrantPb.BasicAllowance {
  if (!allowance) {
    return false
  }

  return AllowanceTypes.BasicAllowance in allowance
}

function isPeriodicAllowance(
  allowance: Allowance,
): allowance is CosmosFeegrantV1Beta1FeegrantPb.PeriodicAllowance {
  if (!allowance) {
    return false
  }

  return AllowanceTypes.PeriodicAllowance in allowance
}

function isAllowedMsgAllowance(
  allowance: Allowance,
): allowance is AllowedMsgAllowance {
  if (!allowance) {
    return false
  }

  return AllowanceTypes.AllowedMsgAllowance in allowance
}

function encodeBasicAllowance(
  allowance: CosmosFeegrantV1Beta1FeegrantPb.BasicAllowance,
): GoogleProtobufAnyPb.Any {
  return {
    typeUrl: '/cosmos.feegrant.v1beta1.BasicAllowance',
    value: Buffer.from(
      CosmosFeegrantV1Beta1FeegrantPb.BasicAllowance.toBinary(allowance),
    ),
  }
}

function encodePeriodicAllowance(
  allowance: CosmosFeegrantV1Beta1FeegrantPb.PeriodicAllowance,
): GoogleProtobufAnyPb.Any {
  return {
    typeUrl: '/cosmos.feegrant.v1beta1.PeriodicAllowance',
    value: Buffer.from(
      CosmosFeegrantV1Beta1FeegrantPb.PeriodicAllowance.toBinary(allowance),
    ),
  }
}

function encodeAllowedMsgAllowance(
  allowance: AllowedMsgAllowance,
): GoogleProtobufAnyPb.Any | undefined {
  let internalAllowance: GoogleProtobufAnyPb.Any

  if (isBasicAllowance(allowance.allowance as Allowance)) {
    internalAllowance = encodeBasicAllowance(
      allowance.allowance as unknown as CosmosFeegrantV1Beta1FeegrantPb.BasicAllowance,
    )
  } else if (isPeriodicAllowance(allowance.allowance as Allowance)) {
    internalAllowance = encodePeriodicAllowance(
      allowance.allowance as unknown as CosmosFeegrantV1Beta1FeegrantPb.PeriodicAllowance,
    )
  } else {
    throw new Error(
      `AllowedMsgAllowance: Cannot cast allowance into 'BasicAllowance' or 'PeriodicAllowance': ${JSON.stringify(
        allowance.allowance,
      )}`,
    )
  }

  return {
    typeUrl: '/cosmos.feegrant.v1beta1.AllowedMsgAllowance',
    value: Buffer.from(
      CosmosFeegrantV1Beta1FeegrantPb.AllowedMsgAllowance.toBinary({
        allowedMessages: allowance.allowedMessages,
        allowance: internalAllowance,
      }),
    ),
  }
}

export function encodeAllowance(
  allowance: Allowance,
): GoogleProtobufAnyPb.Any | undefined {
  if (isBasicAllowance(allowance)) {
    return encodeBasicAllowance(
      allowance as CosmosFeegrantV1Beta1FeegrantPb.BasicAllowance,
    )
  }

  if (isPeriodicAllowance(allowance)) {
    return encodePeriodicAllowance(
      allowance as CosmosFeegrantV1Beta1FeegrantPb.PeriodicAllowance,
    )
  }

  if (isAllowedMsgAllowance(allowance)) {
    return encodeAllowedMsgAllowance(allowance as AllowedMsgAllowance)
  }

  throw new GeneralException(
    new Error(
      `Cannot cast allowance into 'BasicAllowance', 'PeriodicAllowance' or 'AllowedMsgAllowance': ${JSON.stringify(
        allowance,
      )}`,
    ),
  )
}
