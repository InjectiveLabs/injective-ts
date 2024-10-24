import { Network } from '@injectivelabs/networks'
import {
  MsgBroadcaster,
  BaseWalletStrategy,
  MsgBroadcasterOptions,
} from '@injectivelabs/wallet-core'
import { Wallet, WalletStrategyArguments } from '@injectivelabs/wallet-base'
import { MsgSend, PrivateKey } from '@injectivelabs/sdk-ts'
import { ChainId, EthereumChainId } from '@injectivelabs/ts-types'
import { PrivateKeyWalletStrategy } from '@injectivelabs/wallet-private-key'

const strategyArgs: WalletStrategyArguments = {
  chainId: ChainId.Devnet,
  wallet: Wallet.PrivateKey,
  strategies: {
    [Wallet.PrivateKey]: new PrivateKeyWalletStrategy({
      chainId: ChainId.Devnet,
      ethereumOptions: {
        ethereumChainId: EthereumChainId.Sepolia,
        rpcUrl: '',
      },
      privateKey: process.env.TEST_PRIVATE_KEY as string,
    }),
  },
}
const walletStrategy = new BaseWalletStrategy(strategyArgs)

const broadcasterArgs: MsgBroadcasterOptions = {
  walletStrategy,
  simulateTx: true,
  network: Network.Devnet,
}
const msgBroadcaster = new MsgBroadcaster(broadcasterArgs)

describe('MsgBroadcaster', () => {
  test('prepares, simulates, signs and broadcasts a transaction', async () => {
    const pk = PrivateKey.fromHex(process.env.TEST_PRIVATE_KEY as string)
    const injectiveAddress = pk.toBech32()

    const message = MsgSend.fromJSON({
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
      amount: {
        amount: '1',
        denom: 'inj',
      },
    })

    const response = await msgBroadcaster.broadcast({ msgs: message })

    expect(response.txHash).toBeDefined()
  }, 60000)
})
