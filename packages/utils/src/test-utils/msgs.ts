import {
  Network,
  getNetworkInfo,
  getNetworkEndpoints,
} from '@injectivelabs/networks'
import { mockFactory } from './mocks/index.js'
import BigNumber from '../classes/BigNumber.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } from '../constants.js'
import type { NetworkEndpoints } from '@injectivelabs/networks'
import type { Coin, ChainId, EvmChainId } from '@injectivelabs/ts-types'

export const prepareEip712 = <T>({
  messages,
  memo = '',
  granter = '',
  payer = '',
  sequence = 1,
  accountNumber = 1,
  endpoints = {},
  gas = DEFAULT_GAS_LIMIT,
  network = Network.Mainnet,
  timeoutHeight = 999_999_999,
  ethereumAddress = mockFactory.ethereumAddress,
}: {
  messages: T
  memo?: string
  payer?: string
  granter?: string
  network?: Network
  sequence?: number
  accountNumber?: number
  timeoutHeight?: number
  gas?: number | string
  ethereumAddress?: string
  endpoints?: Partial<NetworkEndpoints>
}): {
  endpoints: NetworkEndpoints
  eip712Args: {
    msgs: any
    tx: {
      memo: string
      chainId: ChainId
      sequence: string
      evmChainId: EvmChainId
      accountNumber: string
      timeoutHeight: string
    }
    evmChainId: EvmChainId
    fee: { amount: Coin[]; gas: string; payer?: string; granter?: string }
  }
  prepareEip712Request: {
    chainId: EvmChainId
    message: any[]
    address: string
    memo: string
    sequence: number
    accountNumber: number
    evmChainId: EvmChainId
    timeoutHeight: number
  }
} => {
  const chainInfo = getNetworkInfo(network)
  const actualEndpoints = { ...getNetworkEndpoints(network), ...endpoints }
  const msgs = Array.isArray(messages) ? messages : [messages]
  const web3Msgs = msgs.map((msg) => msg.toWeb3())

  const { tx, eip712 } = mockFactory.eip712Tx({
    ...chainInfo,
    accountNumber,
    sequence,
    timeoutHeight,
    memo,
  })

  const eip712Args = {
    msgs,
    fee: {
      amount: [
        {
          denom: 'inj',
          amount: new BigNumber(gas.toString())
            .times(DEFAULT_GAS_PRICE)
            .toFixed(),
        },
      ],
      gas: gas.toString(),
      ...(granter && { granter }),
      ...(payer && { payer }),
    },
    tx: {
      ...tx,
      sequence: sequence.toString(),
      timeoutHeight: timeoutHeight.toString(),
      accountNumber: accountNumber.toString(),
    },
    evmChainId: eip712.evmChainId,
  }

  const prepareEip712Request = {
    ...eip712,
    granter,
    chainId: eip712.evmChainId,
    message: web3Msgs,
    gasLimit: gas,
    address: ethereumAddress,
  }

  return { endpoints: actualEndpoints, eip712Args, prepareEip712Request }
}
