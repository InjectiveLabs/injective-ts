import { Network } from '@injectivelabs/networks'
import { EvmChainId } from '@injectivelabs/ts-types'
import {
  toBigNumber,
  DEFAULT_EXCHANGE_LIMIT,
  DEFAULT_BLOCK_TIME_IN_SECONDS,
} from '@injectivelabs/utils'
import { TxGrpcApi } from '../api/TxGrpcApi.js'
import { MsgSend } from '../../modules/bank/index.js'
import MsgExec from '../../modules/authz/msgs/MsgExec.js'
import { PrivateKey } from '../../accounts/PrivateKey.js'
import { MsgBroadcasterWithPk } from './MsgBroadcasterWithPk.js'
import { CosmosTxV1Beta1TxPb } from '../../../proto/cosmos-tx.js'
import { IndexerGrpcTransactionApi } from '../../../client/index.js'

afterEach(() => {
  vi.restoreAllMocks()
})

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
  it.each([false, true])(
    'simulates authz wrappers while keeping direct exchange gas fixed (authz: %s)',
    async (authz) => {
      const privateKey = PrivateKey.fromHex(
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      )
      const message = {
        toBinary: () => new Uint8Array(),
        toDirectSign: () => ({
          type: '/injective.exchange.v2.MsgWithdraw',
          message: {},
        }),
      } as any
      const broadcaster = new MsgBroadcasterWithPk({
        network: Network.Devnet,
        privateKey,
        simulateTx: true,
        useFixedGas: true,
      })
      vi.spyOn(broadcaster as any, 'getAccountDetails').mockResolvedValue({
        accountNumber: 1,
        sequence: 1,
        address: privateKey.toBech32(),
      })
      vi.spyOn(broadcaster as any, 'getTimeoutHeight').mockResolvedValue(
        toBigNumber(100),
      )
      const simulateTxRaw = vi
        .spyOn(broadcaster as any, 'simulateTxRaw')
        .mockResolvedValue({ gasInfo: { gasUsed: '327054' } })

      const { txRaw } = await (broadcaster as any).prepareTxForBroadcast({
        msgs: authz
          ? MsgExec.fromJSON({ grantee: privateKey.toBech32(), msgs: message })
          : message,
      })

      expect(simulateTxRaw).toHaveBeenCalledTimes(authz ? 1 : 0)
      const authInfo = CosmosTxV1Beta1TxPb.AuthInfo.fromBinary(
        txRaw.authInfoBytes,
      )

      expect(authInfo.fee?.gasLimit).toBe(authz ? 359759n : 320000n)
    },
  )

  it('keeps simulation enabled for fixed-gas messages by default', async () => {
    const privateKey = PrivateKey.fromHex(
      '0x0000000000000000000000000000000000000000000000000000000000000001',
    )
    const message = {
      toBinary: () => new Uint8Array(),
      toDirectSign: () => ({
        type: '/injective.exchange.v2.MsgWithdraw',
        message: {},
      }),
    } as any
    const broadcaster = new MsgBroadcasterWithPk({
      network: Network.Devnet,
      privateKey,
      simulateTx: true,
    })
    vi.spyOn(broadcaster as any, 'getAccountDetails').mockResolvedValue({
      accountNumber: 1,
      sequence: 1,
      address: privateKey.toBech32(),
    })
    vi.spyOn(broadcaster as any, 'getTimeoutHeight').mockResolvedValue(
      toBigNumber(100),
    )
    const simulateTxRaw = vi
      .spyOn(broadcaster as any, 'simulateTxRaw')
      .mockResolvedValue({ gasInfo: { gasUsed: '100' } })

    await (broadcaster as any).prepareTxForBroadcast({ msgs: message })

    expect(simulateTxRaw).toHaveBeenCalledOnce()
  })

  it.each([false, true])(
    'uses gateway estimation only for authz wrappers (authz: %s)',
    async (authz) => {
      const privateKey = PrivateKey.fromHex(
        '0x0000000000000000000000000000000000000000000000000000000000000001',
      )
      const message = {
        toDirectSign: () => ({
          type: '/injective.exchange.v2.MsgWithdraw',
          message: {},
        }),
        toWeb3: () => ({ '@type': '/injective.exchange.v2.MsgWithdraw' }),
        toBinary: () => new Uint8Array(),
      } as any
      vi.spyOn(PrivateKey.prototype, 'signTypedData').mockResolvedValue(
        new Uint8Array([1]),
      )
      const prepareTxRequest = vi
        .spyOn(IndexerGrpcTransactionApi.prototype, 'prepareTxRequest')
        .mockResolvedValue({ data: '{}' } as any)
      vi.spyOn(
        IndexerGrpcTransactionApi.prototype,
        'broadcastTxRequest',
      ).mockResolvedValue({
        txHash: 'FIXED_GAS_HASH',
      } as any)
      vi.spyOn(TxGrpcApi.prototype, 'fetchTxPoll').mockResolvedValue({} as any)

      await new MsgBroadcasterWithPk({
        network: Network.Devnet,
        privateKey,
        evmChainId: EvmChainId.Sepolia,
        simulateTx: true,
        useFixedGas: true,
      }).broadcastWithFeeDelegation({
        msgs: authz
          ? MsgExec.fromJSON({ grantee: privateKey.toBech32(), msgs: message })
          : message,
      })

      expect(prepareTxRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          gasLimit: authz ? DEFAULT_EXCHANGE_LIMIT : 320000,
          estimateGas: authz,
        }),
      )
    },
  )

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
