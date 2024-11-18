import { Network } from '@injectivelabs/networks'
import { PrivateKey } from '../../accounts/PrivateKey.js'
import { MsgSend } from '../../modules/bank/index.js'
import { MsgBroadcasterWithPk } from './MsgBroadcasterWithPk.js'
import { EthereumChainId } from '@injectivelabs/ts-types'

describe('MsgBroadcasterWithPk', () => {
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
