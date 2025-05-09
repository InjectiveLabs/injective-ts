import { DEFAULT_GAS_LIMIT, DEFAULT_GAS_PRICE } from '../constants.js'
import { BigNumberInBase } from '../classes/index.js'
import {
  Network,
  getNetworkInfo,
  NetworkEndpoints,
  getNetworkEndpoints,
} from '@injectivelabs/networks'
import { mockFactory } from './mocks/index.js'
import { ChainId, Coin, EthereumChainId } from '@injectivelabs/ts-types'

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
      ethereumChainId: EthereumChainId
      accountNumber: string
      timeoutHeight: string
    }
    ethereumChainId: EthereumChainId
    fee: { amount: Coin[]; gas: string; payer: string }
  }
  prepareEip712Request: {
    chainId: EthereumChainId
    message: any[]
    address: string
    memo: string
    sequence: number
    accountNumber: number
    ethereumChainId: EthereumChainId
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
          amount: new BigNumberInBase(gas.toString())
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
    ethereumChainId: eip712.ethereumChainId,
  }
  const prepareEip712Request = {
    ...eip712,
    chainId: eip712.ethereumChainId,
    message: web3Msgs,
    gasLimit: gas,
    address: ethereumAddress,
  }

  return { endpoints: actualEndpoints, eip712Args, prepareEip712Request }
}
