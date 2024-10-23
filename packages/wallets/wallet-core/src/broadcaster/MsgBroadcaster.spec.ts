import { Network } from '@injectivelabs/networks'
import { MsgBroadcaster } from './MsgBroadcaster'
import { MsgBroadcasterOptions } from './types'
import {
  Wallet,
  WalletStrategyArguments,
  ConcreteEthereumWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import { EthereumChainId } from '@injectivelabs/ts-types'
import { PrivateKeyWalletStrategy } from '@injectivelabs/wallet-private-key'

const strategyArgs: WalletStrategyArguments = {} /** define the args */
const strategyEthArgs: ConcreteEthereumWalletStrategyArgs =
  {} /** if the wallet is an Ethereum wallet */
const strategies = {
  [Wallet.PrivateKey]: new PrivateKeyWalletStrategy(strategyEthArgs),
}

export const walletStrategy = new BaseWalletStrategy({
  ...strategyArgs,
  strategies,
})

const broadcasterArgs: MsgBroadcasterOptions =
  {} /** define the broadcaster args */
export const msgBroadcaster = new MsgBroadcaster({
  ...broadcasterArgs,
  walletStrategy,
})

describe('MsgBroadcaster', () => {
  test('prepares, simulates, signs and broadcasts a transaction', async () => {
    const privateKey = PrivateKey.fromHex(
      process.env.TEST_PRIVATE_KEY as string,
    )

    const network = Network.Devnet
    const injectiveAddress = privateKey.toBech32()

    const message = MsgSend.fromJSON({
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
      amount: {
        amount: '1',
        denom: 'inj',
      },
    })

    const response = await new MsgBroadcasterWithPk({
      network,
      privateKey,
      simulateTx: true,
    }).broadcast({ msgs: message })

    expect(response.txHash).toBeDefined()
  }, 60000)

  test.skip('prepares, simulates, signs and broadcasts a transaction with fee delegation', async () => {
    const privateKey = PrivateKey.fromHex(
      process.env.TEST_PRIVATE_KEY as string,
    )

    const network = Network.Devnet
    const injectiveAddress = privateKey.toBech32()

    const message = MsgSend.fromJSON({
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
      amount: {
        amount: '1',
        denom: 'inj',
      },
    })

    const response = await new MsgBroadcasterWithPk({
      network,
      privateKey,
      simulateTx: true,
      ethereumChainId: EthereumChainId.Sepolia,
    }).broadcastWithFeeDelegation({ msgs: message })

    expect(response.txHash).toBeDefined()
  }, 60000)

  test.skip('simulates a transaction', async () => {
    const privateKey = PrivateKey.fromHex(
      process.env.TEST_PRIVATE_KEY as string,
    )

    const network = Network.Devnet
    const injectiveAddress = privateKey.toBech32()

    const message = MsgSend.fromJSON({
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
      amount: {
        amount: '1',
        denom: 'inj',
      },
    })

    const response = await new MsgBroadcasterWithPk({
      network,
      privateKey,
    }).simulate({ msgs: message })

    expect(response.result).toBeDefined()
  }, 60000)
})
