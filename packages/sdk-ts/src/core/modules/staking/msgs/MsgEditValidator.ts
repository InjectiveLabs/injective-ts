import { toChainFormat } from '@injectivelabs/utils'
import * as CosmosStakingV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/tx_pb'
import * as CosmosStakingV1Beta1StakingPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/staking_pb'
import { MsgBase } from '../../MsgBase.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

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

  export type Proto = CosmosStakingV1Beta1TxPb.MsgEditValidator
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

    let description
    if (params.description) {
      description = CosmosStakingV1Beta1StakingPb.Description.create({
        moniker: params.description.moniker,
        identity: params.description.identity,
        website: params.description.website,
        securityContact: params.description.securityContact,
        details: params.description.details,
      })
    }

    const message = CosmosStakingV1Beta1TxPb.MsgEditValidator.create({
      description,
      validatorAddress: params.validatorAddress,
      commissionRate: params.commissionRate,
      minSelfDelegation: params.minSelfDelegation,
    })

    return message
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
      description: {
        moniker: proto.description?.moniker,
        identity: proto.description?.identity,
        website: proto.description?.website,
        security_contact: proto.description?.securityContact,
        details: proto.description?.details,
      },
      validator_address: proto.validatorAddress,
      commission_rate: proto.commissionRate,
      min_self_delegation: proto.minSelfDelegation,
    }

    return {
      type: 'cosmos-sdk/MsgEditValidator',
      value: message,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgEditValidator',
      ...value,
    }
  }

  public toEip712() {
    const { type, value } = this.toAmino()

    const messageAdjusted = {
      ...value,
      commission_rate: toChainFormat(value.commission_rate || '0').toFixed(),
    }

    return {
      type,
      value: messageAdjusted,
    }
  }

  public toEip712V2() {
    const web3gw = this.toWeb3Gw()

    const messageAdjusted = {
      ...web3gw,
      commission_rate: numberToCosmosSdkDecString(
        web3gw.commission_rate || '0',
      ),
    }

    return messageAdjusted
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgEditValidator',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosStakingV1Beta1TxPb.MsgEditValidator.toBinary(this.toProto())
  }
}
