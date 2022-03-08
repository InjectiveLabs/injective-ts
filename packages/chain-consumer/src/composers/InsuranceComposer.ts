import { AccountAddress, ComposerResponse } from '@injectivelabs/ts-types'
import {
  MsgCreateInsuranceFund,
  MsgRequestRedemption,
  MsgUnderwrite,
} from '@injectivelabs/chain-api/injective/insurance/v1beta1/tx_pb'
import { Coin } from '@injectivelabs/chain-api/cosmos/base/v1beta1/coin_pb'
import { OracleTypeMap } from '@injectivelabs/chain-api/injective/oracle/v1beta1/oracle_pb'
import { getWeb3GatewayMessage } from '@injectivelabs/utils'

export class InsuranceComposer {
  static underwrite({
    marketId,
    amount,
    denom,
    injectiveAddress,
  }: {
    marketId: string
    denom: string
    amount: string
    injectiveAddress: AccountAddress
  }): ComposerResponse<MsgUnderwrite, MsgUnderwrite.AsObject> {
    const deposit = new Coin()
    deposit.setAmount(amount)
    deposit.setDenom(denom)

    const message = new MsgUnderwrite()
    message.setDeposit(deposit)
    message.setMarketId(marketId)
    message.setSender(injectiveAddress)

    const type = '/injective.insurance.v1beta1.MsgUnderwrite'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }

  static requestRedemption({
    marketId,
    amount,
    denom,
    injectiveAddress,
  }: {
    marketId: string
    denom: string
    amount: string
    injectiveAddress: AccountAddress
  }): ComposerResponse<MsgRequestRedemption, MsgRequestRedemption.AsObject> {
    const amountToRedeem = new Coin()
    amountToRedeem.setAmount(amount)
    amountToRedeem.setDenom(denom)

    const message = new MsgRequestRedemption()
    message.setAmount(amountToRedeem)
    message.setMarketId(marketId)
    message.setSender(injectiveAddress)

    const type = '/injective.insurance.v1beta1.MsgRequestRedemption'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }

  static createInsuranceFund({
    fund,
    deposit,
    injectiveAddress,
  }: {
    fund: {
      ticker: string
      quoteDenom: string
      oracleBase: string
      oracleQuote: string
      oracleType: OracleTypeMap[keyof OracleTypeMap]
      expiry?: number
    }
    deposit: {
      amount: string
      denom: string
    }
    injectiveAddress: AccountAddress
  }): ComposerResponse<
    MsgCreateInsuranceFund,
    MsgCreateInsuranceFund.AsObject
  > {
    const initialDeposit = new Coin()
    initialDeposit.setAmount(deposit.amount)
    initialDeposit.setDenom(deposit.denom)

    const message = new MsgCreateInsuranceFund()
    message.setTicker(fund.ticker)
    message.setQuoteDenom(fund.quoteDenom)
    message.setOracleBase(fund.oracleBase)
    message.setOracleQuote(fund.oracleQuote)
    message.setOracleType(fund.oracleType)
    message.setSender(injectiveAddress)
    message.setInitialDeposit(initialDeposit)
    message.setExpiry(fund.expiry ? fund.expiry : -1)

    const type = '/injective.insurance.v1beta1.MsgCreateInsuranceFund'

    return {
      web3GatewayMessage: getWeb3GatewayMessage(message.toObject(), type),
      directBroadcastMessage: {
        message,
        type,
      },
    }
  }
}
