import {
  Network,
  getNetworkInfo,
  NetworkEndpoints,
  getNetworkEndpoints,
} from '@injectivelabs/networks'
import { ChainId, Coin, EvmChainId } from '@injectivelabs/ts-types'
import BigNumber from '../classes/BigNumber.js'
import { mockFactory } from './mocks/index.js'
import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } from '../constants.js'

export const prepareEip712 = <T>({
  messages,
  gas = DEFAULT_GAS_LIMIT,
  network = Network.Mainnet,
  injectiveAddress = mockFactory.injectiveAddress,
  ethereumAddress = mockFactory.ethereumAddress,
  endpoints = {},
  accountNumber = 1,
  sequence = 1,
  timeoutHeight = 999_999_999,
  memo = '',
}: {
  ethereumAddress?: string
  messages: T
  network?: Network
  gas?: number | string
  accountNumber?: number
  sequence?: number
  timeoutHeight?: number
  memo?: string
  endpoints?: Partial<NetworkEndpoints>
  injectiveAddress?: string
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
    fee: { amount: Coin[]; gas: string; payer: string }
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
      payer: injectiveAddress,
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
    chainId: eip712.evmChainId,
    message: web3Msgs,
    gasLimit: gas,
    address: ethereumAddress,
  }

  return { endpoints: actualEndpoints, eip712Args, prepareEip712Request }
}
