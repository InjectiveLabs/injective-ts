import { MsgEditValidator as BaseMsgEditValidator } from '@injectivelabs/core-proto-ts/cosmos/staking/v1beta1/tx'
import { MsgBase } from '../../MsgBase'
import { Description } from '@injectivelabs/core-proto-ts/cosmos/staking/v1beta1/staking'

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

  export interface Data extends BaseMsgEditValidator {
    '@type': '/cosmos.staking.v1beta1.MsgEditValidator'
  }

  export interface Amino extends BaseMsgEditValidator {
    type: 'cosmos-sdk/MsgEditValidator'
  }

  export interface Web3 extends BaseMsgEditValidator {
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

    const message = BaseMsgEditValidator.create()

    if (params.commissionRate) {
      message.commissionRate = params.commissionRate
    }

    if (params.minSelfDelegation) {
      message.minSelfDelegation = params.minSelfDelegation
    }

    if (params.description) {
      const description = Description.create()

      if (params.description.moniker) {
        description.moniker = params.description.moniker
      }

      if (params.description.identity) {
        description.identity = params.description.identity
      }

      if (params.description.website) {
        description.website = params.description.website
      }

      if (params.description.securityContact) {
        description.securityContact = params.description.securityContact
      }

      if (params.description.details) {
        description.details = params.description.details
      }

      message.description = description
    }

    message.validatorAddress = params.validatorAddress

    return BaseMsgEditValidator.fromPartial(message)
  }

  public toData(): MsgEditValidator.Data {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgEditValidator',
      ...proto,
    }
  }

  public toAmino(): MsgEditValidator.Amino {
    const proto = this.toProto()

    return {
      type: 'cosmos-sdk/MsgEditValidator',
      ...proto,
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

  public toBinary(): Uint8Array {
    return BaseMsgEditValidator.encode(this.toProto()).finish()
  }
}
