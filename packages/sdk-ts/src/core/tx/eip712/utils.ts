import { EthereumChainId } from '@injectivelabs/ts-types'
import {
  BigNumberInBase,
  DEFAULT_GAS_LIMIT,
  DEFAULT_STD_FEE,
} from '@injectivelabs/utils'
import { Eip712ConvertFeeArgs, Eip712ConvertTxArgs } from './types.js'

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

export const getEip712DomainV2 = (ethereumChainId: EthereumChainId) => {
  return {
    domain: {
      name: 'Injective Web3',
      version: '1.0.0',
      chainId: '0x' + new BigNumberInBase(ethereumChainId).toString(16),
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      salt: '0',
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

export const getDefaultEip712TypesV2 = () => {
  return {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
        { name: 'salt', type: 'string' },
      ],
      Tx: [
        { name: 'context', type: 'string' },
        { name: 'msgs', type: 'string' },
      ],
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
      fee: DEFAULT_STD_FEE,
    }
  }

  const { amount, gas, feePayer } = {
    amount: params.amount || DEFAULT_STD_FEE.amount,
    gas: params.gas || DEFAULT_GAS_LIMIT.toFixed(),
    feePayer: params.feePayer,
  }

  return {
    fee: {
      ...(feePayer && { feePayer }),
      gas,
      amount,
    },
  }
}

export const getEip712FeeV2 = (
  params?: Eip712ConvertFeeArgs,
): {
  fee: {
    amount: { denom: string; amount: string }[]
    gas: number
    payer?: string
  }
} => {
  if (!params) {
    return {
      fee: {
        amount: [
          {
            denom: DEFAULT_STD_FEE.amount[0].denom,
            amount: DEFAULT_STD_FEE.amount[0].amount,
          },
        ],
        gas: Number(DEFAULT_STD_FEE.gas),
      },
    }
  }

  const amountFromParams = (params.amount || DEFAULT_STD_FEE.amount)[0]
  const { amount, gas, payer } = {
    amount: [
      {
        denom: amountFromParams.denom,
        amount: amountFromParams.amount,
      },
    ],
    gas: Number(params.gas || DEFAULT_GAS_LIMIT.toFixed()),
    payer: params.feePayer,
  }

  return {
    fee: {
      amount,
      gas,
      ...(payer && { payer }),
    },
  }
}

export const getTypesIncludingFeePayer = ({
  fee,
  types,
}: {
  fee?: Eip712ConvertFeeArgs
  types: ReturnType<typeof getDefaultEip712Types>
}) => {
  if (!fee) {
    return types
  }

  if (!fee.feePayer) {
    return types
  }

  types.types['Fee'].unshift({ name: 'feePayer', type: 'string' })

  return types
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

export const getEipTxContext = ({
  accountNumber,
  sequence,
  fee,
  timeoutHeight,
  chainId,
  memo,
}: Eip712ConvertTxArgs & { fee?: Eip712ConvertFeeArgs }): {
  account_number: number
  chain_id: string
  sequence: number
  fee: Record<string, any>
  timeout_height: number
  memo: string
} => {
  return {
    account_number: Number(accountNumber),
    chain_id: chainId,
    ...getEip712FeeV2(fee),
    memo: memo || '',
    sequence: Number(sequence),
    timeout_height: Number(timeoutHeight),
  }
}
