import { GeneralException } from '@injectivelabs/exceptions'
import snakecaseKeys from 'snakecase-keys'
import { snakeToPascal } from '@injectivelabs/utils'
import {
  isNumber,
  numberToCosmosSdkDecString,
  amountToCosmosSdkDecAmount,
} from '../../../utils/numbers.js'
import { TypedDataField } from './types.js'

const msgExecuteContractType = 'wasm/MsgExecuteContract'

/**
 *  ONLY USED FOR EIP712_V1
 *
 * Function used to generate EIP712 types based on a message object
 * and its structure (recursive)
 */
export const objectKeysToEip712Types = ({
  object,
  messageType,
  primaryType = 'MsgValue',
}: {
  object: Record<string, any>
  messageType?: string
  primaryType?: string
}) => {
  const numberFieldsWithStringValue = [
    'order_mask',
    'order_type',
    'oracle_type',
    'round',
    'oracle_scale_factor',
    'expiry',
    'option',
    'proposal_id',
    'creation_height',
  ]
  const stringFieldsWithNumberValue = [
    'timeout_timestamp',
    'revision_height',
    'revision_number',
  ]
  const stringFieldsToOmitIfEmpty = ['cid']
  const fieldsToOmitIfEmpty = ['admin_info']
  const output = new Map<string, TypedDataField[]>()
  const types = new Array<TypedDataField>()

  for (const property in snakecaseKeys(object)) {
    const propertyValue = snakecaseKeys(object)[property]

    if (property === '@type') {
      continue
    }

    if (fieldsToOmitIfEmpty.includes(property) && !propertyValue) {
      continue
    }

    const type = typeof propertyValue

    if (type === 'boolean') {
      types.push({ name: property, type: 'bool' })
    } else if (
      type === 'number' ||
      type === 'bigint' ||
      numberFieldsWithStringValue.includes(property)
    ) {
      types.push({
        name: property,
        type: numberTypeToReflectionNumberType(property, messageType),
      })
    } else if (type === 'string') {
      if (stringFieldsToOmitIfEmpty.includes(property) && !propertyValue) {
        continue
      }

      if (stringFieldsWithNumberValue.includes(property)) {
        types.push({
          name: property,
          type: stringTypeToReflectionStringType(property),
        })

        continue
      }

      types.push({ name: property, type: 'string' })
    } else if (type === 'object') {
      if (Array.isArray(propertyValue) && propertyValue.length === 0) {
        throw new GeneralException(new Error('Array with length 0 found'))
      } else if (Array.isArray(propertyValue) && propertyValue.length > 0) {
        const arrayFirstType = typeof propertyValue[0]
        const isPrimitive =
          arrayFirstType === 'boolean' ||
          arrayFirstType === 'number' ||
          arrayFirstType === 'string'

        if (isPrimitive) {
          for (const arrayEntry in propertyValue) {
            if (typeof arrayEntry !== arrayFirstType) {
              throw new GeneralException(
                new Error('Array with different types found'),
              )
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
          const propertyType = getObjectEip712PropertyType({
            property: snakeToPascal(property),
            parentProperty: primaryType,
            messageType,
          })
          const recursiveOutput = objectKeysToEip712Types({
            object: propertyValue[0],
            primaryType: propertyType,
            messageType,
          })
          const recursiveTypes = recursiveOutput.get(propertyType)

          types.push({ name: property, type: `${propertyType}[]` })
          output.set(propertyType, recursiveTypes!)

          for (const key of recursiveOutput.keys()) {
            if (key !== primaryType) {
              output.set(key, recursiveOutput.get(key)!)
            }
          }
        } else {
          throw new GeneralException(
            new Error('Array with elements of unknown type found'),
          )
        }
      } else if (propertyValue instanceof Date) {
        types.push({ name: property, type: 'string' })
      } else {
        const propertyType = getObjectEip712PropertyType({
          property: snakeToPascal(property),
          parentProperty: primaryType,
          messageType,
        })
        const recursiveOutput = objectKeysToEip712Types({
          object: propertyValue,
          primaryType: propertyType,
          messageType,
        })
        const recursiveTypes = recursiveOutput.get(propertyType)

        types.push({ name: property, type: propertyType })
        output.set(propertyType, recursiveTypes!)

        for (const key of recursiveOutput.keys()) {
          if (key !== primaryType) {
            output.set(key, recursiveOutput.get(key)!)
          }
        }
      }
    } else {
      throw new GeneralException(new Error(`Type ${property} not found`))
    }
  }

  output.set(primaryType, types)

  return output
}
/**
 * JavaScript doesn't know the exact number types that
 * we represent these fields on chain so we have to map
 * them in their chain representation from the number value
 * that is available in JavaScript
 */
export const numberTypeToReflectionNumberType = (
  property?: string,
  messageType?: string,
) => {
  if (messageType == 'cosmos-sdk/MsgSubmitProposal' && property === 'status') {
    return 'int32'
  }

  switch (property) {
    case 'order_mask':
      return 'int32'
    case 'timeout_timestamp':
      return 'timeout_timestamp'
    case 'revision_number':
      return 'uint64'
    case 'revision_height':
      return 'uint64'
    case 'order_type':
      return 'int32'
    case 'admin_permissions':
      return 'uint32'
    case 'oracle_scale_factor':
      return 'uint32'
    case 'oracle_type':
      return 'int32'
    case 'exponent':
      return 'uint32'
    case 'round':
      return 'uint64'
    case 'oracle_scale_factor':
      return 'uint64'
    case 'expiry':
      return 'int64'
    case 'creation_height':
      return 'int64'
    case 'option':
      return 'int32'
    case 'proposal_id':
      return 'uint64'
    default:
      return 'uint64'
  }
}
/**
 * JavaScript doesn't know the exact string types that
 * we represent these fields on chain so we have to map
 * them in their chain representation from the string value
 * that is available in JavaScript
 */
export const stringTypeToReflectionStringType = (property?: string) => {
  switch (property) {
    case 'timeout_timestamp':
      return 'uint64'
    case 'revision_number':
      return 'uint64'
    case 'revision_height':
      return 'uint64'
    default:
      return 'uint64'
  }
}

/**
 * ONLY USED FOR EIP712_V1
 *
 * We need to represent some of the values in a proper format acceptable by the chain.
 *
 * 1. We need to represent some values from a number to string
 * This needs to be done for every number value except for maps (ex: vote option)
 *
 * 2. We need to convert every `sdk.Dec` value from a raw value to shifted by 1e18 value
 * ex: 0.01 -> 0.01000000000000000000, 1 -> 1.000000000000000000
 *
 * 3. For some fields, like 'amount' in the 'MsgIncreasePositionMargin' we have
 * to also specify the Message type to apply the sdk.Dec conversion because there
 * are other amount fields in other messages as well and we don't want to affect them
 */
export const mapValuesToProperValueType = <T extends Record<string, unknown>>(
  object: T,
  messageTypeUrl?: string,
): T => {
  const numberToStringKeys = [
    'proposal_id',
    'remaining',
    'round',
    'oracle_scale_factor',
    'timeout_timestamp',
    'revision_height',
    'revision_number',
    'expiry',
  ]
  const stringToNumberKeysTypeMaps = {
    'cosmos-sdk/MsgSubmitProposal': ['oracle_scale_factor'],
  }
  const sdkDecKeys = ['price', 'quantity', 'margin', 'trigger_price']
  const sdkDecKeyWithTypeMaps = {
    'exchange/MsgIncreasePositionMargin': ['amount'],
  }
  const nullableStringsTypeMaps = {
    'wasmx/MsgExecuteContractCompat': ['funds'],
  }
  const amountToCosmosSdkDecAmountTypeMaps = {
    'cosmos-sdk/MsgSubmitProposal': [
      'initial_margin_ratio',
      'maintenance_margin_ratio',
      'min_notional',
      'min_price_tick_size',
      'min_quantity_tick_size',
      'maker_fee_rate',
      'taker_fee_rate',
      'relayer_fee_share_rate',
    ],
    'cosmos-sdk/MsgEditValidator': ['commission_rate'],
  }

  // const dateTypesMap = {
  //   'cosmos-sdk/MsgGrant': ['expiration'],
  // }

  const nullableStrings = ['uri', 'uri_hash']

  return Object.keys(object).reduce((result, key) => {
    const value = object[key]

    if (!value) {
      // Message Type Specific checks
      if (messageTypeUrl) {
        const typeInMap = Object.keys(nullableStringsTypeMaps).find(
          (key) => key === messageTypeUrl,
        )

        if (typeInMap) {
          const nullableStringKeys =
            nullableStringsTypeMaps[
              typeInMap as keyof typeof nullableStringsTypeMaps
            ]

          if (nullableStringKeys.includes(key)) {
            return {
              ...result,
              [key]: value,
            }
          }
        }
      }

      if (nullableStrings.includes(key)) {
        return {
          ...result,
          [key]: value,
        }
      }

      return result
    }

    if (typeof value === 'object') {
      if (value instanceof Date) {
        return {
          ...result,
          [key]: value.toJSON().split('.')[0] + 'Z',
        }
      }

      if (Array.isArray(value)) {
        return {
          ...result,
          [key]: value.every((i) => typeof i === 'string')
            ? value
            : value.map((item) =>
                mapValuesToProperValueType(
                  item as Record<string, unknown>,
                  messageTypeUrl,
                ),
              ),
        }
      }

      return {
        ...result,
        [key]: mapValuesToProperValueType(
          value as Record<string, unknown>,
          messageTypeUrl,
        ),
      }
    }

    if (isNumber(value as string | number)) {
      // Message Type Specific checks
      if (messageTypeUrl) {
        let typeInMap = Object.keys(amountToCosmosSdkDecAmountTypeMaps).find(
          (key) => key === messageTypeUrl,
        )

        if (typeInMap) {
          const cosmosSdkDecKeys =
            amountToCosmosSdkDecAmountTypeMaps[
              typeInMap as keyof typeof amountToCosmosSdkDecAmountTypeMaps
            ]

          if (cosmosSdkDecKeys.includes(key)) {
            return {
              ...result,
              [key]: amountToCosmosSdkDecAmount(value.toString()).toFixed(),
            }
          }
        }

        typeInMap = Object.keys(stringToNumberKeysTypeMaps).find(
          (key) => key === messageTypeUrl,
        )

        if (typeInMap) {
          const stringToNumberKeys =
            stringToNumberKeysTypeMaps[
              typeInMap as keyof typeof stringToNumberKeysTypeMaps
            ]

          if (stringToNumberKeys.includes(key)) {
            return {
              ...result,
              [key]: Number(value),
            }
          }
        }
      }

      if (numberToStringKeys.includes(key)) {
        return {
          ...result,
          [key]: value.toString(),
        }
      }
    }

    if (typeof value === 'string') {
      if (sdkDecKeys.includes(key)) {
        return {
          ...result,
          [key]: numberToCosmosSdkDecString(value),
        }
      }

      // Message Type Specific checks
      if (messageTypeUrl) {
        const typeInMap = Object.keys(sdkDecKeyWithTypeMaps).find(
          (key) => key === messageTypeUrl,
        )

        if (typeInMap) {
          const sdkDecKeys =
            sdkDecKeyWithTypeMaps[
              typeInMap as keyof typeof sdkDecKeyWithTypeMaps
            ]

          if (sdkDecKeys.includes(key)) {
            return {
              ...result,
              [key]: numberToCosmosSdkDecString(value),
            }
          }
        }
      }
    }

    return {
      ...result,
      [key]: value,
    }
  }, {} as T)
}

export const getObjectEip712PropertyType = ({
  property,
  parentProperty,
  messageType,
}: {
  property: string
  parentProperty: string
  messageType?: string
}) => {
  if (messageType === msgExecuteContractType) {
    return appendWasmTypePrefixToPropertyType(property, parentProperty)
  }

  return appendTypePrefixToPropertyType(property, parentProperty)
}

/**
 * Append Wasm Type prefix to a Level0 EIP712 type
 * including its parent property type
 */
const appendWasmTypePrefixToPropertyType = (
  property: string,
  parentProperty: string = '',
) => {
  const cosmWasmMsgPrefix = 'CosmwasmInnerMsgMarker'
  const propertyWithoutTypePrefix = property.replace('Type', '')

  if (propertyWithoutTypePrefix === 'Msg') {
    return cosmWasmMsgPrefix
  }

  const parentPropertyWithoutTypePrefix = parentProperty.replace(
    cosmWasmMsgPrefix,
    '',
  )

  return `${parentPropertyWithoutTypePrefix + propertyWithoutTypePrefix}Value`
}

/**
 * Append Type prefix to a Level0 EIP712 type
 * including its parent property type
 */
const appendTypePrefixToPropertyType = (
  property: string,
  parentProperty: string = '',
) => {
  const propertyWithoutTypePrefix = property.replace('Type', '')
  const parentPropertyWithoutTypePrefix =
    parentProperty === 'MsgValue' ? '' : parentProperty.replace('Type', '')

  return `Type${parentPropertyWithoutTypePrefix + propertyWithoutTypePrefix}`
}

/**
 * Mapping a path type to amino type for messages
 */
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
    case 'injective.exchange.v1beta1.MsgTransferAndExecute':
      return 'exchange/MsgTransferAndExecute'

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

    // Token factory
    case 'injective.tokenfactory.v1beta1.MsgCreateDenom':
      return 'injective/tokenfactory/create-denom'
    case 'injective.tokenfactory.v1beta1.MsgMint':
      return 'injective/tokenfactory/mint'
    case 'injective.tokenfactory.v1beta1.MsgBurn':
      return 'injective/tokenfactory/burn'
    case 'injective.tokenfactory.v1beta1.MsgSetDenomMetadata':
      return 'injective/tokenfactory/set-denom-metadata'

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
    case 'cosmos.gov.v1.MsgDeposit':
      return 'cosmos-sdk/v1/MsgDeposit'
    case 'cosmos.gov.v1beta1.MsgVote':
      return 'cosmos-sdk/MsgVote'
    case 'cosmos.gov.v1.MsgVote':
      return 'cosmos-sdk/v1/MsgVote'
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

    // feegrant
    case 'cosmos.feegrant.v1beta1.MsgGrantAllowance':
      return 'cosmos-sdk/MsgGrantAllowance'
    case 'cosmos.feegrant.v1beta1.MsgRevokeAllowance':
      return 'cosmos-sdk/MsgRevokeAllowance'

    default:
      throw new GeneralException(new Error('Unknown message type: ' + type))
  }
}
