import {
  GoogleProtobufAny,
  CosmosFeegrantV1Beta1Feegrant,
} from '@injectivelabs/core-proto-ts'
import { GeneralException } from '@injectivelabs/exceptions'

export type AllowedMsgAllowance = Omit<
  CosmosFeegrantV1Beta1Feegrant.AllowedMsgAllowance,
  'allowance'
> & {
  allowance:
    | CosmosFeegrantV1Beta1Feegrant.BasicAllowance
    | CosmosFeegrantV1Beta1Feegrant.PeriodicAllowance
}

export type Allowance =
  | CosmosFeegrantV1Beta1Feegrant.BasicAllowance
  | CosmosFeegrantV1Beta1Feegrant.PeriodicAllowance
  | AllowedMsgAllowance
  | undefined

export enum AllowanceTypes {
  BasicAllowance = 'spendLimit',
  PeriodicAllowance = 'periodSpendLimit',
  AllowedMsgAllowance = 'allowedMessages',
}

function isBasicAllowance(
  allowance: Allowance,
): allowance is CosmosFeegrantV1Beta1Feegrant.BasicAllowance {
  if (!allowance) {
    return false
  }

  return AllowanceTypes.BasicAllowance in allowance
}

function isPeriodicAllowance(
  allowance: Allowance,
): allowance is CosmosFeegrantV1Beta1Feegrant.PeriodicAllowance {
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
  allowance: CosmosFeegrantV1Beta1Feegrant.BasicAllowance,
): GoogleProtobufAny.Any {
  return {
    typeUrl: '/cosmos.feegrant.v1beta1.BasicAllowance',
    value: Buffer.from(
      CosmosFeegrantV1Beta1Feegrant.BasicAllowance.encode(allowance).finish(),
    ),
  }
}

function encodePeriodicAllowance(
  allowance: CosmosFeegrantV1Beta1Feegrant.PeriodicAllowance,
): GoogleProtobufAny.Any {
  return {
    typeUrl: '/cosmos.feegrant.v1beta1.PeriodicAllowance',
    value: Buffer.from(
      CosmosFeegrantV1Beta1Feegrant.PeriodicAllowance.encode(
        allowance,
      ).finish(),
    ),
  }
}

function encodeAllowedMsgAllowance(
  allowance: AllowedMsgAllowance,
): GoogleProtobufAny.Any | undefined {
  let internalAllowance: GoogleProtobufAny.Any

  if (isBasicAllowance(allowance.allowance as Allowance)) {
    internalAllowance = encodeBasicAllowance(
      allowance.allowance as unknown as CosmosFeegrantV1Beta1Feegrant.BasicAllowance,
    )
  } else if (isPeriodicAllowance(allowance.allowance as Allowance)) {
    internalAllowance = encodePeriodicAllowance(
      allowance.allowance as unknown as CosmosFeegrantV1Beta1Feegrant.PeriodicAllowance,
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
      CosmosFeegrantV1Beta1Feegrant.AllowedMsgAllowance.encode({
        allowedMessages: allowance.allowedMessages,
        allowance: internalAllowance,
      }).finish(),
    ),
  }
}

export function encodeAllowance(
  allowance: Allowance,
): GoogleProtobufAny.Any | undefined {
  if (isBasicAllowance(allowance)) {
    return encodeBasicAllowance(
      allowance as CosmosFeegrantV1Beta1Feegrant.BasicAllowance,
    )
  }

  if (isPeriodicAllowance(allowance)) {
    return encodePeriodicAllowance(
      allowance as CosmosFeegrantV1Beta1Feegrant.PeriodicAllowance,
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
