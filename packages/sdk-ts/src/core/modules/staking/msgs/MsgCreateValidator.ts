import { MsgBase } from '../../MsgBase'
import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  CosmosStakingV1Beta1Tx,
  CosmosStakingV1Beta1Staking,
} from '@injectivelabs/core-proto-ts'
import { createAny } from '../../tx'

export declare namespace MsgCreateValidator {
  export interface Params {
    description: {
      moniker: string
      identity: string
      website: string
      securityContact?: string
      details: string
    }
    value: {
      amount: string
      denom: string
    }
    pubKey: {
      type: string
      value: string
    }
    delegatorAddress: string
    validatorAddress: string
    commission: {
      maxChangeRate: string
      rate: string
      maxRate: string
    }
    minSelfDelegation?: string
  }

  export type Proto = CosmosStakingV1Beta1Tx.MsgCreateValidator

  export type Object = Omit<
    CosmosStakingV1Beta1Tx.MsgCreateValidator,
    'pubKey'
  > & {
    pubKey: any
  }
}

/**
 * @category Messages
 */
export default class MsgCreateValidator extends MsgBase<
  MsgCreateValidator.Params,
  MsgCreateValidator.Proto,
  MsgCreateValidator.Object
> {
  static fromJSON(params: MsgCreateValidator.Params): MsgCreateValidator {
    return new MsgCreateValidator(params)
  }

  public toProto() {
    const { params } = this

    const message = CosmosStakingV1Beta1Tx.MsgCreateValidator.create()

    message.delegatorAddress = params.delegatorAddress
    message.validatorAddress = params.validatorAddress

    if (params.commission) {
      const commissionRate =
        CosmosStakingV1Beta1Staking.CommissionRates.create()
      commissionRate.maxChangeRate = commissionRate.maxChangeRate
      commissionRate.rate = commissionRate.rate
      commissionRate.maxRate = commissionRate.maxRate
    }

    if (params.minSelfDelegation) {
      message.minSelfDelegation = params.minSelfDelegation
    }

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

    if (params.pubKey) {
      const pubKeyAny = createAny(
        Buffer.from(params.pubKey.value, 'base64'),
        params.pubKey.type,
      )

      message.pubkey = pubKeyAny
    }

    if (params.value) {
      const value = CosmosBaseV1Beta1Coin.Coin.create()
      value.denom = params.value.denom
      value.amount = params.value.amount

      message.value = value
    }

    return CosmosStakingV1Beta1Tx.MsgCreateValidator.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/cosmos.staking.v1beta1.MsgCreateValidator',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'cosmos-sdk/MsgCreateValidator',
      value: message as unknown as MsgCreateValidator.Object,
    }
  }

  public toWeb3() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/cosmos.staking.v1beta1.MsgCreateValidator',
      ...value,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgCreateValidator',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosStakingV1Beta1Tx.MsgCreateValidator.encode(
      this.toProto(),
    ).finish()
  }
}
