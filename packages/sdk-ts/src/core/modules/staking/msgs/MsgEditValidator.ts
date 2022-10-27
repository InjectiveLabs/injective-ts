import { MsgEditValidator as BaseMsgEditValidator } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/tx_pb'
import { MsgBase } from '../../MsgBase'
import { Description } from '@injectivelabs/chain-api/cosmos/staking/v1beta1/staking_pb'

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

  export interface DirectSign {
    type: '/cosmos.staking.v1beta1.MsgEditValidator'
    message: BaseMsgEditValidator
  }

  export interface Data extends BaseMsgEditValidator.AsObject {
    '@type': '/cosmos.staking.v1beta1.MsgEditValidator'
  }

  export interface Amino extends BaseMsgEditValidator.AsObject {
    type: 'cosmos-sdk/MsgEditValidator'
  }

  export interface Web3 extends BaseMsgEditValidator.AsObject {
    '@type': '/cosmos.authz.v1beta1.MsgEditValidator'
  }

  export type Proto = BaseMsgEditValidator
}

/**
 * @category Messages
 */
export default class MsgEditValidator extends MsgBase<
  MsgEditValidator.Params,
  MsgEditValidator.Data,
  MsgEditValidator.Proto,
  MsgEditValidator.Amino,
  MsgEditValidator.DirectSign
> {
  static fromJSON(params: MsgEditValidator.Params): MsgEditValidator {
    return new MsgEditValidator(params)
  }

  public toProto(): MsgEditValidator.Proto {
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

  public toData(): MsgEditValidator.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgEditValidator',
      ...proto.toObject(),
    }
  }

  public toAmino(): MsgEditValidator.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgEditValidator',
      ...proto.toObject(),
    }
  }

  public toWeb3(): MsgEditValidator.Web3 {
    const amino = this.toAmino()
    const { type, ...rest } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgEditValidator',
      ...rest,
    } as unknown as MsgEditValidator.Web3
  }

  public toDirectSign(): MsgEditValidator.DirectSign {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgEditValidator',
      message: proto,
    }
  }
}
