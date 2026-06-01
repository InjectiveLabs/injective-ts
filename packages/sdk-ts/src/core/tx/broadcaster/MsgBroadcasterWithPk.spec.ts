import { Network } from '@injectivelabs/networks'
import { EvmChainId } from '@injectivelabs/ts-types'
import { DEFAULT_BLOCK_TIME_IN_SECONDS } from '@injectivelabs/utils'
import { TxGrpcApi } from '../api/TxGrpcApi.js'
import { MsgSend } from '../../modules/bank/index.js'
import { PrivateKey } from '../../accounts/PrivateKey.js'
import { MsgBroadcasterWithPk } from './MsgBroadcasterWithPk.js'
import { IndexerGrpcTransactionApi } from '../../../client/index.js'

// TODO
describe.skip('MsgBroadcasterWithPk', () => {
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

describe('MsgBroadcasterWithPk fee delegation', () => {
  test('forwards txTimeout to transaction polling', async () => {
    const txTimeout = 11
    const privateKey = PrivateKey.fromHex(
      '0x0000000000000000000000000000000000000000000000000000000000000001',
    )
    const injectiveAddress = privateKey.toBech32()
    const message = MsgSend.fromJSON({
      srcInjectiveAddress: injectiveAddress,
      dstInjectiveAddress: injectiveAddress,
      amount: {
        amount: '1',
        denom: 'inj',
      },
    })
    const txResponse = {
      txHash: 'FEE_DELEGATION_HASH',
      height: 1,
      code: 0,
      rawLog: '',
      gasWanted: 1,
      gasUsed: 1,
      timestamp: '',
      codespace: '',
    }

    vi.spyOn(PrivateKey.prototype, 'signTypedData').mockResolvedValue(
      new Uint8Array([1, 2, 3]),
    )
    vi.spyOn(
      IndexerGrpcTransactionApi.prototype,
      'prepareTxRequest',
    ).mockResolvedValue({
      data: '{}',
    } as any)
    vi.spyOn(
      IndexerGrpcTransactionApi.prototype,
      'broadcastTxRequest',
    ).mockResolvedValue({
      txHash: txResponse.txHash,
    } as any)
    const fetchTxPoll = vi
      .spyOn(TxGrpcApi.prototype, 'fetchTxPoll')
      .mockResolvedValue(txResponse)

    const response = await new MsgBroadcasterWithPk({
      network: Network.Devnet,
      privateKey,
      evmChainId: EvmChainId.Sepolia,
      txTimeout,
    }).broadcastWithFeeDelegation({ msgs: message })

    expect(response).toBe(txResponse)
    expect(fetchTxPoll).toHaveBeenCalledWith(
      expect.objectContaining({
        txHash: txResponse.txHash,
      }),
    )
    expect(fetchTxPoll.mock.calls[0]?.[0].timeout).toBeCloseTo(
      txTimeout * DEFAULT_BLOCK_TIME_IN_SECONDS * 1000,
    )
  })
})
