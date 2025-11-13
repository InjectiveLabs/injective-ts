import { GeneralException } from '@injectivelabs/exceptions'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import * as CosmosStakingV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/tx_pb.mjs'
import * as CosmosStakingV1Beta1StakingPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/staking_pb.mjs'
import { MsgBase } from '../../MsgBase.js'
import { createAny } from '../../../tx/index.js'
import { base64ToUint8Array } from '../../../../utils/encoding.js'
import { numberToCosmosSdkDecString } from '../../../../utils/numbers.js'

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

  export type Proto = CosmosStakingV1Beta1TxPb.MsgCreateValidator

  export type Object = Omit<
    CosmosStakingV1Beta1TxPb.MsgCreateValidator,
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

    let commission
    if (params.commission) {
      commission = CosmosStakingV1Beta1StakingPb.CommissionRates.create({
        rate: params.commission.rate,
        maxRate: params.commission.maxRate,
        maxChangeRate: params.commission.maxChangeRate,
      })
    }

    let value
    if (params.value) {
      value = CosmosBaseV1Beta1CoinPb.Coin.create({
        denom: params.value.denom,
        amount: params.value.amount,
      })
    }

    let pubkey
    if (params.pubKey) {
      pubkey = createAny(
        base64ToUint8Array(params.pubKey.value),
        params.pubKey.type,
      )
    }

    const message = CosmosStakingV1Beta1TxPb.MsgCreateValidator.create({
      description: description,
      commission: commission,
      minSelfDelegation: params.minSelfDelegation,
      delegatorAddress: params.delegatorAddress,
      validatorAddress: params.validatorAddress,
      pubkey: pubkey,
      value: value,
    })

    return message
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
      description: {
        moniker: proto.description?.moniker,
        identity: proto.description?.identity,
        website: proto.description?.website,
        security_contact: proto.description?.securityContact,
        details: proto.description?.details,
      },
      commission: {
        rate: proto.commission?.rate,
        max_rate: proto.commission?.maxRate,
        max_change_rate: proto.commission?.maxChangeRate,
      },
      min_self_delegation: proto.minSelfDelegation,
      delegator_address: proto.delegatorAddress,
      validator_address: proto.validatorAddress,
      pubkey: proto.pubkey,
      value: proto.value,
    }

    return {
      type: 'cosmos-sdk/MsgCreateValidator',
      value: message as unknown as MsgCreateValidator.Object,
    }
  }

  public toWeb3Gw() {
    const { params } = this
    const { value } = this.toAmino()

    const messageWithPubKeyType = {
      ...value,
      pubkey: {
        '@type': params.pubKey.type,
        key: params.pubKey.value,
      },
    } as unknown as MsgCreateValidator.Object

    return {
      '@type': '/cosmos.staking.v1beta1.MsgCreateValidator',
      ...messageWithPubKeyType,
    }
  }

  public toEip712(): never {
    throw new GeneralException(
      new Error(
        'EIP712_v1 is not supported for MsgCreateValidator. Please use EIP712_v2',
      ),
    )
  }

  public toEip712V2() {
    const web3gw = this.toWeb3Gw()
    const commission = web3gw.commission as any

    const messageAdjusted = {
      ...web3gw,
      commission: web3gw.commission
        ? {
            rate: numberToCosmosSdkDecString(commission.rate),
            max_rate: numberToCosmosSdkDecString(commission.max_rate),
            max_change_rate: numberToCosmosSdkDecString(
              commission.max_change_rate,
            ),
          }
        : undefined,
    }

    return messageAdjusted as unknown as MsgCreateValidator.Object
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/cosmos.staking.v1beta1.MsgCreateValidator',
      message: proto,
    }
  }

  public toBinary(): Uint8Array {
    return CosmosStakingV1Beta1TxPb.MsgCreateValidator.toBinary(this.toProto())
  }
}
