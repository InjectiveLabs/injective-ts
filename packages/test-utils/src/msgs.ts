import { DEFAULT_STD_FEE } from '@injectivelabs/utils'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { mockFactory } from './mocks'

export const prepareEip712 = <T>(messages: T) => {
  const endpoints = getNetworkEndpoints(Network.Devnet)
  const msgs = Array.isArray(messages) ? messages : [messages]
  const web3Msgs = msgs.map((msg) => msg.toWeb3())
  const { tx, eip712 } = mockFactory.eip712Tx
  const { ethereumChainId } = eip712
  const eip712Args = {
    msgs,
    fee: DEFAULT_STD_FEE,
    tx: tx,
    ethereumChainId: ethereumChainId,
  }
  const prepareEip712Request = {
    ...eip712,
    chainId: ethereumChainId,
    message: web3Msgs,
    address: mockFactory.ethereumAddress,
  }

  return { endpoints, eip712Args, prepareEip712Request }
}
