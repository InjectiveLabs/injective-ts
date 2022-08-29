import { EthereumChainId } from '@injectivelabs/ts-types'
import { BigNumberInBase } from '@injectivelabs/utils'
import snakecaseKeys from 'snakecase-keys'
import { DEFAULT_GAS_LIMIT, DEFAULT_STD_FEE } from '../utils'
import { Msgs } from './msgs'

export type Eip712ConvertTxArgs = {
  accountNumber: string
  sequence: string
  timeoutHeight: string
  chainId: string
  memo?: string
}

export type Eip712ConvertFeeArgs = {
  amount?: string
  denom?: string
  gas?: number
  feePayer?: string
}

export interface TypedDataField {
  name: string
  type: string
}

export type MapOfTypedDataField = Map<string, TypedDataField[]>

export const getEip712Domain = (ethereumChainId: EthereumChainId) => {
  return {
    domain: {
      name: 'Injective Web3',
      version: '1.0.0',
      chainId: '0x' + new BigNumberInBase(ethereumChainId).toString(16),
      salt: '0',
      verifyingContract: 'cosmos',
    },
  }
}

export const getDefaultEip712Types = () => {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'string' },
        { name: 'salt', type: 'string' },
      ],
      Tx: [
        { name: 'account_number', type: 'string' },
        { name: 'chain_id', type: 'string' },
        { name: 'fee', type: 'Fee' },
        { name: 'memo', type: 'string' },
        { name: 'msgs', type: 'Msg[]' },
        { name: 'sequence', type: 'string' },
        { name: 'timeout_height', type: 'string' },
      ],
      Fee: [
        { name: 'amount', type: 'Coin[]' },
        { name: 'gas', type: 'string' },
      ],
      Coin: [
        { name: 'denom', type: 'string' },
        { name: 'amount', type: 'string' },
      ],
      Msg: [
        { name: 'type', type: 'string' },
        { name: 'value', type: 'MsgValue' },
      ],
    },
  }
}

export const getEip712Tx = ({
  msgs,
  tx,
  fee,
  ethereumChainId,
}: {
  msgs: Msgs | Msgs[]
  tx: Eip712ConvertTxArgs
  fee?: Eip712ConvertFeeArgs
  ethereumChainId: EthereumChainId
}) => {
  const actualMsgs = Array.isArray(msgs) ? msgs : [msgs]
  const [msg] = actualMsgs

  const msgTypes = msg.toEip712Types()
  const types = getDefaultEip712Types()
  const actualTypes = {
    types: {
      ...types.types,
      ...Object.fromEntries(msgTypes),
    },
  }

  const eip712Msgs = actualMsgs.map((m) => m.toEip712())

  if (fee && fee.feePayer) {
    types.types['Fee'].push({ name: 'feePayer', type: 'string' })
  }

  return {
    primaryType: 'Tx',
    ...actualTypes,
    ...getEip712Domain(ethereumChainId),
    message: {
      ...getEipTxDetails(tx),
      ...getEip712Fee(fee),
      msgs: eip712Msgs,
    },
  }
}

export const getEip712Fee = (
  params?: Eip712ConvertFeeArgs,
): {
  fee: {
    amount: { amount: string; denom: string }[]
    gas: string
    feePayer?: string
  }
} => {
  if (!params) {
    return {
      fee: {
        ...DEFAULT_STD_FEE,
        gas: DEFAULT_GAS_LIMIT.toFixed(),
      },
    }
  }

  const { amount, denom, gas, feePayer } = params
  const actualGas = new BigNumberInBase(gas || DEFAULT_GAS_LIMIT).toFixed()

  if (!amount || !denom) {
    return {
      fee: {
        ...DEFAULT_STD_FEE,
        gas: actualGas,
        feePayer,
      },
    }
  }

  return {
    fee: {
      amount: [{ amount: amount, denom: denom }],
      gas: actualGas,
      feePayer: feePayer,
    },
  }
}

export const getEipTxDetails = ({
  accountNumber,
  sequence,
  timeoutHeight,
  chainId,
  memo,
}: Eip712ConvertTxArgs): {
  account_number: string
  chain_id: string
  sequence: string
  timeout_height: string
  memo: string
} => {
  return {
    account_number: accountNumber,
    chain_id: chainId,
    timeout_height: timeoutHeight,
    memo: memo || '',
    sequence,
  }
}

export const objectKeysToEip712Types = (
  object: Record<string, any>,
  primaryType = 'MsgValue',
) => {
  const output = new Map<string, TypedDataField[]>()
  const types = new Array<TypedDataField>()

  for (const property in snakecaseKeys(object)) {
    if (property === '@type' || property === 'type') {
      continue
    }

    const val = snakecaseKeys(object)[property]
    const type = typeof val

    if (type === 'boolean') {
      types.push({ name: property, type: 'bool' })
    } else if (type === 'number' || type === 'bigint') {
      types.push({ name: property, type: getNumberType(property) })
    } else if (type === 'string') {
      types.push({ name: property, type: 'string' })
    } else if (type === 'object') {
      if (Array.isArray(val) && val.length === 0) {
        throw new Error('Array with length 0 found')
      } else if (Array.isArray(val) && val.length > 0) {
        const arrayFirstType = typeof val[0]
        const isPrimitive =
          arrayFirstType === 'boolean' ||
          arrayFirstType === 'number' ||
          arrayFirstType === 'string'

        if (isPrimitive) {
          for (const arrayEntry in val) {
            if (typeof arrayEntry !== arrayFirstType) {
              throw new Error('Array with different types found')
            }
          }

          if (arrayFirstType === 'boolean') {
            types.push({ name: property, type: 'bool[]' })
          } else if (arrayFirstType === 'number') {
            types.push({ name: property, type: 'number[]' })
          } else if (arrayFirstType === 'string') {
            types.push({ name: property, type: 'string[]' })
          }
        } else if (arrayFirstType === 'object') {
          const recursiveOutput = objectKeysToEip712Types(val[0], primaryType)
          const recursiveTypes = recursiveOutput.get(primaryType)
          const propertyType = `Type${
            property.charAt(0).toUpperCase() + property.substring(1)
          }`

          types.push({ name: property, type: `${propertyType}[]` })
          output.set(propertyType, recursiveTypes!)

          for (const key in recursiveOutput) {
            if (key !== primaryType) {
              output.set(key, recursiveOutput.get(key)!)
            }
          }
        } else {
          throw new Error('Array with elements of unknown type found')
        }
      } else {
        const recursiveOutput = objectKeysToEip712Types(val, primaryType)
        const recursiveTypes = recursiveOutput.get(primaryType)
        const propertyType = `Type${
          property.charAt(0).toUpperCase() + property.substring(1)
        }`

        types.push({ name: property, type: propertyType })
        output.set(propertyType, recursiveTypes!)

        for (const key in recursiveOutput) {
          if (key !== primaryType) {
            output.set(key, recursiveOutput.get(key)!)
          }
        }
      }
    } else {
      throw new Error(`Type ${property} not found`)
    }
  }

  output.set(primaryType, types)

  return output
}

export const protoTypeToAminoType = (type: string): string => {
  const actualType = type.startsWith('/') ? type.substring(1) : type

  switch (actualType) {
    // Exchange
    case 'injective.exchange.v1beta1.MsgDeposit':
      return 'exchange/MsgDeposit'
    case 'injective.exchange.v1beta1.MsgWithdraw':
      return 'exchange/MsgWithdraw'
    case 'injective.exchange.v1beta1.MsgInstantSpotMarketLaunch':
      return 'exchange/MsgInstantSpotMarketLaunch'
    case 'injective.exchange.v1beta1.MsgInstantPerpetualMarketLaunch':
      return 'exchange/MsgInstantPerpetualMarketLaunch'
    case 'injective.exchange.v1beta1.MsgInstantExpiryFuturesMarketLaunch':
      return 'exchange/MsgInstantExpiryFuturesMarketLaunch'
    case 'injective.exchange.v1beta1.MsgCreateSpotLimitOrder':
      return 'exchange/MsgCreateSpotLimitOrder'
    case 'injective.exchange.v1beta1.MsgBatchCreateSpotLimitOrders':
      return 'exchange/MsgBatchCreateSpotLimitOrders'
    case 'injective.exchange.v1beta1.MsgCreateSpotMarketOrder':
      return 'exchange/MsgCreateSpotMarketOrder'
    case 'injective.exchange.v1beta1.MsgCancelSpotOrder':
      return 'exchange/MsgCancelSpotOrder'
    case 'injective.exchange.v1beta1.MsgBatchCancelSpotOrders':
      return 'exchange/MsgBatchCancelSpotOrders'
    case 'injective.exchange.v1beta1.MsgCreateDerivativeLimitOrder':
      return 'exchange/MsgCreateDerivativeLimitOrder'
    case 'injective.exchange.v1beta1.MsgBatchCreateDerivativeLimitOrders':
      return 'exchange/MsgBatchCreateDerivativeLimitOrders'
    case 'injective.exchange.v1beta1.MsgCreateDerivativeMarketOrder':
      return 'exchange/MsgCreateDerivativeMarketOrder'
    case 'injective.exchange.v1beta1.MsgCancelDerivativeOrder':
      return 'exchange/MsgCancelDerivativeOrder'
    case 'injective.exchange.v1beta1.MsgBatchCancelDerivativeOrders':
      return 'exchange/MsgBatchCancelDerivativeOrders'
    case 'injective.exchange.v1beta1.MsgBatchCancelBinaryOptionsOrders':
      return 'exchange/MsgBatchCancelBinaryOptionsOrders'
    case 'injective.exchange.v1beta1.MsgSubaccountTransfer':
      return 'exchange/MsgSubaccountTransfer'
    case 'injective.exchange.v1beta1.MsgExternalTransfer':
      return 'exchange/MsgExternalTransfer'
    case 'injective.exchange.v1beta1.MsgIncreasePositionMargin':
      return 'exchange/MsgIncreasePositionMargin'
    case 'injective.exchange.v1beta1.MsgLiquidatePosition':
      return 'exchange/MsgLiquidatePosition'
    case 'injective.exchange.v1beta1.MsgBatchUpdateOrders':
      return 'exchange/MsgBatchUpdateOrders'
    case 'injective.exchange.v1beta1.MsgExec':
      return 'exchange/MsgExec'
    case 'injective.exchange.v1beta1.MsgRegisterAsDMM':
      return 'exchange/MsgRegisterAsDMM'
    case 'injective.exchange.v1beta1.MsgInstantBinaryOptionsMarketLaunch':
      return 'exchange/MsgInstantBinaryOptionsMarketLaunch'
    case 'injective.exchange.v1beta1.MsgCreateBinaryOptionsLimitOrder':
      return 'exchange/MsgCreateBinaryOptionsLimitOrder'
    case 'injective.exchange.v1beta1.MsgCreateBinaryOptionsMarketOrder':
      return 'exchange/MsgCreateBinaryOptionsMarketOrder'
    case 'injective.exchange.v1beta1.MsgCancelBinaryOptionsOrder':
      return 'exchange/MsgCancelBinaryOptionsOrder'
    case 'injective.exchange.v1beta1.MsgAdminUpdateBinaryOptionsMarket':
      return 'exchange/MsgAdminUpdateBinaryOptionsMarket'
    case 'injective.exchange.v1beta1.ExchangeEnableProposal':
      return 'exchange/ExchangeEnableProposal'
    case 'injective.exchange.v1beta1.BatchExchangeModificationProposal':
      return 'exchange/BatchExchangeModificationProposal'
    case 'injective.exchange.v1beta1.SpotMarketParamUpdateProposal':
      return 'exchange/SpotMarketParamUpdateProposal'
    case 'injective.exchange.v1beta1.SpotMarketLaunchProposal':
      return 'exchange/SpotMarketLaunchProposal'
    case 'injective.exchange.v1beta1.PerpetualMarketLaunchProposal':
      return 'exchange/PerpetualMarketLaunchProposal'
    case 'injective.exchange.v1beta1.ExpiryFuturesMarketLaunchProposal':
      return 'exchange/ExpiryFuturesMarketLaunchProposal'
    case 'injective.exchange.v1beta1.DerivativeMarketParamUpdateProposal':
      return 'exchange/DerivativeMarketParamUpdateProposal'
    case 'injective.exchange.v1beta1.MarketForcedSettlementProposal':
      return 'exchange/MarketForcedSettlementProposal'
    case 'injective.exchange.v1beta1.UpdateDenomDecimalsProposal':
      return 'exchange/UpdateDenomDecimalsProposal'
    case 'injective.exchange.v1beta1.TradingRewardCampaignLaunchProposal':
      return 'exchange/TradingRewardCampaignLaunchProposal'
    case 'injective.exchange.v1beta1.TradingRewardCampaignUpdateProposal':
      return 'exchange/TradingRewardCampaignUpdateProposal'
    case 'injective.exchange.v1beta1.TradingRewardPendingPointsUpdateProposal':
      return 'exchange/TradingRewardPendingPointsUpdateProposal'
    case 'injective.exchange.v1beta1.FeeDiscountProposal':
      return 'exchange/FeeDiscountProposal'
    case 'injective.exchange.v1beta1.BatchCommunityPoolSpendProposal':
      return 'exchange/BatchCommunityPoolSpendProposal'
    case 'injective.exchange.v1beta1.BinaryOptionsMarketParamUpdateProposal':
      return 'exchange/BinaryOptionsMarketParamUpdateProposal'
    case 'injective.exchange.v1beta1.BinaryOptionsMarketLaunchProposal':
      return 'exchange/BinaryOptionsMarketLaunchProposal'

    case 'injective.exchange.v1beta1.CreateSpotLimitOrderAuthz':
      return 'exchange/CreateSpotLimitOrderAuthz'
    case 'injective.exchange.v1beta1.CreateSpotMarketOrderAuthz':
      return 'exchange/CreateSpotMarketOrderAuthz'
    case 'injective.exchange.v1beta1.BatchCreateSpotLimitOrdersAuthz':
      return 'exchange/BatchCreateSpotLimitOrdersAuthz'
    case 'injective.exchange.v1beta1.CancelSpotOrderAuthz':
      return 'exchange/CancelSpotOrderAuthz'
    case 'injective.exchange.v1beta1.BatchCancelSpotOrdersAuthz':
      return 'exchange/BatchCancelSpotOrdersAuthz'
    case 'injective.exchange.v1beta1.CreateDerivativeLimitOrderAuthz':
      return 'exchange/CreateDerivativeLimitOrderAuthz'
    case 'injective.exchange.v1beta1.CreateDerivativeMarketOrderAuthz':
      return 'exchange/CreateDerivativeMarketOrderAuthz'
    case 'injective.exchange.v1beta1.BatchCreateDerivativeLimitOrdersAuthz':
      return 'exchange/BatchCreateDerivativeLimitOrdersAuthz'
    case 'injective.exchange.v1beta1.CancelDerivativeOrderAuthz':
      return 'exchange/CancelDerivativeOrderAuthz'
    case 'injective.exchange.v1beta1.BatchCancelDerivativeOrdersAuthz':
      return 'exchange/BatchCancelDerivativeOrdersAuthz'
    case 'injective.exchange.v1beta1.BatchUpdateOrdersAuthz':
      return 'exchange/BatchUpdateOrdersAuthz'

    // Auction
    case 'injective.auction.v1beta1.MsgBid':
      return 'auction/MsgBid'

    // Insurance
    case 'injective.insurance.v1beta1.MsgCreateInsuranceFund':
      return 'insurance/MsgCreateInsuranceFund'
    case 'injective.insurance.v1beta1.MsgUnderwrite':
      return 'insurance/MsgUnderwrite'
    case 'injective.insurance.v1beta1.MsgRequestRedemption':
      return 'insurance/MsgRequestRedemption'

    // Peggy
    case 'injective.peggy.v1beta1.MsgSetOrchestratorAddresses':
      return 'peggy/MsgSetOrchestratorAddresses'
    case 'injective.peggy.v1beta1.MsgValsetConfirm':
      return 'peggy/MsgValsetConfirm'
    case 'injective.peggy.v1beta1.MsgSendToEth':
      return 'peggy/MsgSendToEth'
    case 'injective.peggy.v1beta1.MsgCancelSendToEth':
      return 'peggy/MsgCancelSendToEth'
    case 'injective.peggy.v1beta1.MsgRequestBatch':
      return 'peggy/MsgRequestBatch'
    case 'injective.peggy.v1beta1.MsgConfirmBatch':
      return 'peggy/MsgConfirmBatch'
    case 'injective.peggy.v1beta1.Valset':
      return 'peggy/Valset'
    case 'injective.peggy.v1beta1.MsgDepositClaim':
      return 'peggy/MsgDepositClaim'
    case 'injective.peggy.v1beta1.MsgWithdrawClaim':
      return 'peggy/MsgWithdrawClaim'
    case 'injective.peggy.v1beta1.MsgERC20DeployedClaim':
      return 'peggy/MsgERC20DeployedClaim'
    case 'injective.peggy.v1beta1.MsgValsetUpdatedClaim':
      return 'peggy/MsgValsetUpdatedClaim'
    case 'injective.peggy.v1beta1.OutgoingTxBatch':
      return 'peggy/OutgoingTxBatch'
    case 'injective.peggy.v1beta1.OutgoingTransferTx':
      return 'peggy/OutgoingTransferTx'
    case 'injective.peggy.v1beta1.ERC20Token':
      return 'peggy/ERC20Token'
    case 'injective.peggy.v1beta1.IDSet':
      return 'peggy/IDSet'
    case 'injective.peggy.v1beta1.Attestation':
      return 'peggy/Attestation'
    case 'injective.peggy.v1beta1.MsgSubmitBadSignatureEvidence':
      return 'peggy/MsgSubmitBadSignatureEvidence'
    case 'injective.peggy.v1beta1.BlacklistEthereumAddressesProposal':
      return 'peggy/BlacklistEthereumAddressesProposal'
    case 'injective.peggy.v1beta1.RevokeEthereumBlacklistProposal':
      return 'peggy/RevokeEthereumBlacklistProposal'

    // WasmX
    case 'injective.wasmx.v1beta1.ContractRegistrationRequestProposal':
      return 'wasmx/ContractRegistrationRequestProposal'
    case 'injective.wasmx.v1beta1.BatchContractRegistrationRequestProposal':
      return 'wasmx/BatchContractRegistrationRequestProposal'

    // Auth
    case 'cosmos.auth.v1beta1.MsgUpdateParams':
      return 'cosmos-sdk/x/auth/MsgUpdateParams'

    // Authz
    case 'cosmos.authz.v1beta1.MsgGrant':
      return 'cosmos-sdk/MsgGrant'
    case 'cosmos.authz.v1beta1.MsgRevoke':
      return 'cosmos-sdk/MsgRevoke'
    case 'cosmos.authz.v1beta1.MsgExec':
      return 'cosmos-sdk/MsgExec'

    // Bank
    case 'cosmos.bank.v1beta1.MsgSend':
      return 'cosmos-sdk/MsgSend'
    case 'cosmos.bank.v1beta1.MsgMultiSend':
      return 'cosmos-sdk/MsgMultiSend'
    case 'cosmos.bank.v1beta1.MsgUpdateParams':
      return 'cosmos-sdk/x/bank/MsgUpdateParams'

    // Distribution
    case 'cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward':
      return 'cosmos-sdk/MsgWithdrawDelegationReward'
    case 'cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission':
      return 'cosmos-sdk/MsgWithdrawValCommission'
    case 'cosmos.distribution.v1beta1.MsgSetWithdrawAddress':
      return 'cosmos-sdk/MsgModifyWithdrawAddress'
    case 'cosmos.distribution.v1beta1.MsgFundCommunityPool':
      return 'cosmos-sdk/MsgFundCommunityPool'
    case 'cosmos.distribution.v1beta1.MsgUpdateParams':
      return 'cosmos-sdk/distribution/MsgUpdateParams'

    // Gov
    case 'cosmos.gov.v1beta1.MsgSubmitProposal':
      return 'cosmos-sdk/MsgSubmitProposal'
    case 'cosmos.gov.v1beta1.MsgDeposit':
      return 'cosmos-sdk/MsgDeposit'
    case 'cosmos.gov.v1beta1.MsgVote':
      return 'cosmos-sdk/MsgVote'
    case 'cosmos.gov.v1beta1.MsgVoteWeighted':
      return 'cosmos-sdk/MsgVoteWeighted'

    // Staking
    case 'cosmos.staking.v1beta1.MsgCreateValidator':
      return 'cosmos-sdk/MsgCreateValidator'
    case 'cosmos.staking.v1beta1.MsgEditValidator':
      return 'cosmos-sdk/MsgEditValidator'
    case 'cosmos.staking.v1beta1.MsgDelegate':
      return 'cosmos-sdk/MsgDelegate'
    case 'cosmos.staking.v1beta1.MsgUndelegate':
      return 'cosmos-sdk/MsgUndelegate'
    case 'cosmos.staking.v1beta1.MsgBeginRedelegate':
      return 'cosmos-sdk/MsgBeginRedelegate'
    case 'cosmos.staking.v1beta1.MsgCancelUnbondingDelegation':
      return 'cosmos-sdk/MsgCancelUnbondingDelegation'
    case 'cosmos.staking.v1beta1.MsgUpdateParams':
      return 'cosmos-sdk/x/staking/MsgUpdateParams'

    // IBC
    case 'ibc.applications.transfer.v1.MsgTransfer':
      return 'cosmos-sdk/MsgTransfer'

    default:
      throw new Error('Unknown message type: ' + type)
  }
}

export const getNumberType = (property?: string) => {
  if (!property) {
    return 'uint256'
  }

  switch (true) {
    case ['order_mask'].includes(property):
      return 'int32'
    default:
      'uint256'
  }

  return 'uint256'
}
