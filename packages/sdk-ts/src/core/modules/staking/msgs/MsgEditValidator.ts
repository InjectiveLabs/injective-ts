import { MsgEditValidator as BaseMsgEditValidator } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase'
import { Description } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/staking_pb'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'

export declare namespace MsgEditValidator {
  export interface Params {
    description: {
      moniker: string
      identity: string
      website: string
      securityContact?: string
      details: string
    }
    validatorAddress: string
    commissionRate?: string
    minSelfDelegation?: string
  }

  export type Proto = BaseMsgEditValidator

  export type Object = BaseMsgEditValidator.AsObject
}

/**
 * @category Messages
 */
export default class MsgEditValidator extends MsgBase<
  MsgEditValidator.Params,
  MsgEditValidator.Proto,
  MsgEditValidator.Object
> {
  static fromJSON(params: MsgEditValidator.Params): MsgEditValidator {
    return new MsgEditValidator(params)
  }

  public toProto() {
    const { params } = this

    const message = new BaseMsgEditValidator()

    if (params.commissionRate) {
      message.setCommissionRate(params.commissionRate)
    }

    if (params.minSelfDelegation) {
      message.setMinSelfDelegation(params.minSelfDelegation)
    }

    if (params.description) {
      const description = new Description()

      if (params.description.moniker) {
        description.setMoniker(params.description.moniker)
      }

      if (params.description.identity) {
        description.setIdentity(params.description.identity)
      }

      if (params.description.website) {
        description.setWebsite(params.description.website)
      }

      if (params.description.securityContact) {
        description.setSecurityContact(params.description.securityContact)
      }

      if (params.description.details) {
        description.setDetails(params.description.details)
      }

      message.setDescription(description)
    }

    message.setValidatorAddress(params.validatorAddress)

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgEditValidator',
      ...proto.toObject(),
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto.toObject()),
    }

    return {
      type: 'cosmos-sdk/MsgEditValidator',
      value: message as unknown as SnakeCaseKeys<MsgEditValidator.Object>,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgEditValidator',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgEditValidator',
      message: proto,
    }
  }
}
