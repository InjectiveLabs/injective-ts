import { MsgBase } from '../../MsgBase.js'
import snakecaseKeys, { SnakeCaseKeys } from 'snakecase-keys'
import {
  CosmosStakingV1Beta1Tx,
  CosmosStakingV1Beta1Staking,
} from '@injectivelabs/core-proto-ts'

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

  export type Proto = CosmosStakingV1Beta1Tx.MsgEditValidator
}

/**
 * @category Messages
 */
export default class MsgEditValidator extends MsgBase<
  MsgEditValidator.Params,
  MsgEditValidator.Proto
> {
  static fromJSON(params: MsgEditValidator.Params): MsgEditValidator {
    return new MsgEditValidator(params)
  }

  public toProto() {
    const { params } = this

    const message = CosmosStakingV1Beta1Tx.MsgEditValidator.create()

    if (params.description) {
      const description = CosmosStakingV1Beta1Staking.Description.create()

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

    if (params.commissionRate) {
      message.commissionRate = params.commissionRate
    }

    if (params.minSelfDelegation) {
      message.minSelfDelegation = params.minSelfDelegation
    }

    return CosmosStakingV1Beta1Tx.MsgEditValidator.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgEditValidator',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgEditValidator',
      value:
        message as unknown as SnakeCaseKeys<CosmosStakingV1Beta1Tx.MsgEditValidator>,
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

  public toBinary(): Uint8Array {
    return CosmosStakingV1Beta1Tx.MsgEditValidator.encode(
      this.toProto(),
    ).finish()
  }
}
