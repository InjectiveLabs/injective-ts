import { Network } from '@injectivelabs/networks'
import { Wallet } from '@injectivelabs/wallet-base'
import { MsgSend } from '@injectivelabs/sdk-ts/core/modules'
import { ChainId, EvmChainId } from '@injectivelabs/ts-types'
import { PrivateKey } from '@injectivelabs/sdk-ts/core/accounts'
import { PrivateKeyWalletStrategy } from '@injectivelabs/wallet-private-key'
import { MsgBroadcaster, BaseWalletStrategy } from '@injectivelabs/wallet-core'
import type { MsgBroadcasterOptions } from '@injectivelabs/wallet-core'
import type { WalletStrategyArguments } from '@injectivelabs/wallet-base'

const strategyArgs: WalletStrategyArguments = {
  chainId: ChainId.Devnet,
  wallet: Wallet.PrivateKey,
  strategies: {
    [Wallet.PrivateKey]: new PrivateKeyWalletStrategy({
      chainId: ChainId.Devnet,
      evmOptions: {
        evmChainId: EvmChainId.Sepolia,
        rpcUrl: '',
      },
      metadata: {
        privateKey: {
          privateKey: process.env.TEST_PRIVATE_KEY as string,
        },
      },
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

describe.sequential('MsgBroadcaster', () => {
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

    const response = await msgBroadcaster.broadcastV2({
      msgs: message,
      injectiveAddress,
    })

    expect(response.txHash).toBeDefined()
  }, 60000)
})
