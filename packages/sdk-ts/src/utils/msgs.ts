import {
  toBigNumber,
  DEFAULT_GAS_LIMIT,
  DEFAULT_IBC_GAS_LIMIT,
  DEFAULT_EXCHANGE_LIMIT,
} from '@injectivelabs/utils'
import { OrderTypeMap } from '../types/light.js'
import type { Msgs } from '../core/modules/msgs.js'

// chain v1.21 fixed_gas.go constants + 120k ante offset
const fixedExchangeGas = {
  MsgCreateDerivativeLimitOrder: {
    gas: 560000,
    postOnlyGas: 620000,
    hasOrder: true,
  },
  MsgCreateDerivativeMarketOrder: { gas: 550000, hasOrder: true },
  MsgCancelDerivativeOrder: { gas: 372000 },
  MsgCreateSpotLimitOrder: {
    gas: 540000,
    postOnlyGas: 590000,
    hasOrder: true,
  },
  MsgCreateSpotMarketOrder: { gas: 540000, hasOrder: true },
  MsgCancelSpotOrder: { gas: 362000 },
  MsgDeposit: { gas: 330000 },
  MsgWithdraw: { gas: 320000 },
  MsgSubaccountTransfer: { gas: 220000 },
  MsgExternalTransfer: { gas: 300000 },
  MsgIncreasePositionMargin: { gas: 350000 },
  MsgDecreasePositionMargin: { gas: 360000 },
} as const

// chain v1.21 AddressOrderAdmissionGas: charged per retained order after the GTB multiplier
// ponytail: also added for atomic market orders (chain skips them), 12k overpay
const orderAdmissionGas = 12000

const batchAnteGas = 120000
const batchAnteGasPerOrder = 3000
// chain v1.21 charges each batch cancel as a full MsgCancel*OrderGas
const batchExchangeGasPerOrder = {
  MsgBatchCancelSpotOrders: 242000,
  MsgBatchCancelDerivativeOrders: 252000,
} as const

const fixedExchangeType = /^\/injective\.exchange\.v(?:1beta1|2)\.(Msg\w+)$/
const postOnlyOrderTypes = new Set<number>([
  OrderTypeMap.BUY_PO,
  OrderTypeMap.SELL_PO,
])

type ExchangeOrderMessage = {
  order: {
    orderType: number
    expirationBlock?: bigint
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const getExchangeOrder = (
  message: unknown,
): ExchangeOrderMessage['order'] | undefined => {
  if (!isRecord(message) || !isRecord(message.order)) {
    return undefined
  }

  const { orderType, expirationBlock } = message.order

  if (
    typeof orderType !== 'number' ||
    (expirationBlock !== undefined && typeof expirationBlock !== 'bigint')
  ) {
    return undefined
  }

  return { orderType, expirationBlock }
}

const isFixedExchangeMessage = (
  messageType: string,
): messageType is keyof typeof fixedExchangeGas =>
  Object.prototype.hasOwnProperty.call(fixedExchangeGas, messageType)

const isFixedBatchExchangeMessage = (
  messageType: string,
): messageType is keyof typeof batchExchangeGasPerOrder =>
  Object.prototype.hasOwnProperty.call(batchExchangeGasPerOrder, messageType)

export const getFixedGasLimitBasedOnMessage = (
  msgs: Msgs | Msgs[],
): number | undefined => {
  const messages = Array.isArray(msgs) ? msgs : [msgs]

  if (!messages.length) {
    return undefined
  }

  let gas = 0

  for (const msg of messages) {
    const directSign = msg.toDirectSign()
    const match = directSign.type.match(fixedExchangeType)
    const messageType = match?.[1]

    if (!messageType) {
      return undefined
    }

    if (isFixedBatchExchangeMessage(messageType)) {
      if (messages.length > 1) {
        return undefined
      }

      if (
        !isRecord(directSign.message) ||
        !Array.isArray(directSign.message.data) ||
        directSign.message.data.length === 0
      ) {
        return undefined
      }

      gas +=
        batchAnteGas +
        directSign.message.data.length *
          (batchAnteGasPerOrder + batchExchangeGasPerOrder[messageType])
      continue
    }

    if (!isFixedExchangeMessage(messageType)) {
      return undefined
    }

    const policy = fixedExchangeGas[messageType]
    const order =
      'hasOrder' in policy ? getExchangeOrder(directSign.message) : undefined

    if ('hasOrder' in policy && !order) {
      return undefined
    }

    const isPostOnly =
      order?.orderType !== undefined && postOnlyOrderTypes.has(order.orderType)
    const baseGas =
      isPostOnly && 'postOnlyGas' in policy ? policy.postOnlyGas : policy.gas
    const hasExpirationBlock = (order?.expirationBlock ?? 0n) > 0n

    gas +=
      (hasExpirationBlock ? baseGas + baseGas / 10 : baseGas) +
      ('hasOrder' in policy ? orderAdmissionGas : 0)
  }

  return gas
}

export const getGasOptionsBasedOnMessage = ({
  msgs,
  gas,
  simulateTx,
  useFixedGas = false,
  fixedGasBufferCoefficient = 1,
}: {
  msgs: Msgs | Msgs[]
  gas?: number
  simulateTx: boolean
  useFixedGas?: boolean
  fixedGasBufferCoefficient?: number
}) => {
  const messages = Array.isArray(msgs) ? msgs : [msgs]
  const explicitGas = gas || undefined
  const fixedGasLimit =
    useFixedGas && explicitGas === undefined
      ? getFixedGasLimitBasedOnMessage(messages)
      : undefined
  const gasLimit =
    explicitGas ??
    (fixedGasLimit === undefined
      ? getGasPriceBasedOnMessage(messages)
      : Math.ceil(fixedGasLimit * fixedGasBufferCoefficient))

  if (
    fixedGasLimit !== undefined &&
    (!Number.isFinite(fixedGasBufferCoefficient) ||
      fixedGasBufferCoefficient <= 0 ||
      !Number.isSafeInteger(gasLimit))
  ) {
    throw new RangeError(
      'fixedGasBufferCoefficient must produce a positive safe integer gas limit',
    )
  }

  const estimateGas =
    simulateTx &&
    (!useFixedGas || (explicitGas === undefined && fixedGasLimit === undefined))

  return {
    gas: gasLimit.toString(),
    gasLimit,
    estimateGas,
  }
}

export const getGasPriceBasedOnMessage = (msgs: Msgs[]): number => {
  const messages = Array.isArray(msgs) ? msgs : [msgs]
  const messageType = messages[0].toDirectSign().type

  if (messageType.includes('MsgPrivilegedExecuteContract')) {
    return toBigNumber(DEFAULT_GAS_LIMIT)
      .times(6)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (messageType.includes('MsgExecuteContract')) {
    return toBigNumber(DEFAULT_GAS_LIMIT)
      .times(3)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (messageType.includes('exchange')) {
    return toBigNumber(DEFAULT_EXCHANGE_LIMIT)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (messageType.includes('wasm')) {
    return toBigNumber(DEFAULT_GAS_LIMIT)
      .times(1.5)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (messageType.includes('authz')) {
    return toBigNumber(DEFAULT_EXCHANGE_LIMIT)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (
    messageType.includes('gov') &&
    (messageType.includes('MsgDeposit') ||
      messageType.includes('MsgSubmitProposal'))
  ) {
    return toBigNumber(DEFAULT_GAS_LIMIT)
      .times(15)
      .times(messages.length)
      .decimalPlaces(0)
      .toNumber()
  }

  if (messageType.includes('MsgTransfer')) {
    return toBigNumber(DEFAULT_IBC_GAS_LIMIT).times(messages.length).toNumber()
  }

  return toBigNumber(DEFAULT_GAS_LIMIT).times(messages.length).toNumber()
}
