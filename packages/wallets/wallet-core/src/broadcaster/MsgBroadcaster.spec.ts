import {
  MsgSend,
  PrivateKey,
  MsgBroadcasterWithPk,
} from '@injectivelabs/sdk-ts'
import {
  Wallet,
  WalletStrategyArguments,
  ConcreteEvmWalletStrategyArgs,
} from '@injectivelabs/wallet-base'
import { Network } from '@injectivelabs/networks'
import { EvmChainId } from '@injectivelabs/ts-types'
import { BaseWalletStrategy } from '@injectivelabs/wallet-core'
import { PrivateKeyWalletStrategy } from '@injectivelabs/wallet-private-key'
import { MsgBroadcaster } from './MsgBroadcaster.js'
import { MsgBroadcasterOptions } from './types.js'

const strategyArgs: WalletStrategyArguments = {} as any /** define the args */
const strategyEthArgs: ConcreteEvmWalletStrategyArgs =
  {} as any /** if the wallet is an Ethereum wallet */
const strategies = {
  [Wallet.PrivateKey]: new PrivateKeyWalletStrategy(strategyEthArgs),
}

export const walletStrategy = new BaseWalletStrategy({
  ...strategyArgs,
  strategies,
}) as any

const broadcasterArgs: MsgBroadcasterOptions =
  {} as any /** define the broadcaster args */
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
      evmChainId: EvmChainId.Sepolia,
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
