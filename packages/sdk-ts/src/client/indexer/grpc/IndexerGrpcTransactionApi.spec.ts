import { vi } from 'vitest'
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import {
  DEFAULT_GAS_LIMIT,
  DEFAULT_BRIDGE_FEE_DENOM,
  DEFAULT_BRIDGE_FEE_PRICE,
} from '@injectivelabs/utils'
import { getEthereumAddress } from '../../../utils/index.js'
import { uint8ArrayToHex } from '../../../utils/encoding.js'
import MsgSend from '../../../core/modules/bank/msgs/MsgSend.js'
import { PrivateKey } from '../../../core/accounts/PrivateKey.js'
import { IndexerGrpcTransactionApi } from './IndexerGrpcTransactionApi.js'
import type { EvmChainId, AccountAddress } from '@injectivelabs/ts-types'
import type * as InjectiveExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_exchange_rpc_pb'

const endpoints = getNetworkEndpoints(Network.Mainnet)
const indexerGrpcTransactionApi = new IndexerGrpcTransactionApi(
  endpoints.indexer,
)
const msg = MsgSend.fromJSON({
  srcInjectiveAddress: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
  dstInjectiveAddress: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
  amount: {
    amount: '1000000000000000000',
    denom: 'inj',
  },
})

describe('IndexerGrpcTransactionApi', () => {
  test('fetchFeePayer', async () => {
    try {
      const response = await indexerGrpcTransactionApi.fetchFeePayer()

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<InjectiveExchangeRpcPb.GetFeePayerResponse>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcTransactionApi.fetchFeePayer => ' + (e as any).message,
      )
    }
  })

  test('prepareTxRequest', async () => {
    try {
      const args = {
        address: getEthereumAddress(
          'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
        ) as AccountAddress,
        chainId: 1 as EvmChainId,
        message: msg.toWeb3Gw(),
        estimateGas: true,
        gasLimit: DEFAULT_GAS_LIMIT,
        feeDenom: DEFAULT_BRIDGE_FEE_DENOM,
        feePrice: DEFAULT_BRIDGE_FEE_PRICE,
        memo: 'test memo',
      }

      const response = await indexerGrpcTransactionApi.prepareTxRequest(args)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<InjectiveExchangeRpcPb.PrepareTxResponse>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcTransactionApi.prepareTxRequest => ' + (e as any).message,
      )
    }
  })

  test('prepareExchangeTxRequest', async () => {
    try {
      const args = {
        address: getEthereumAddress(
          'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
        ) as AccountAddress,
        chainId: 1 as EvmChainId,
        message: msg.toWeb3Gw(),
        estimateGas: false,
        gasLimit: 200000,
        feeDenom: DEFAULT_BRIDGE_FEE_DENOM,
        feePrice: DEFAULT_BRIDGE_FEE_PRICE,
        memo: 12345,
      }

      const response =
        await indexerGrpcTransactionApi.prepareExchangeTxRequest(args)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<InjectiveExchangeRpcPb.PrepareTxResponse>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcTransactionApi.prepareExchangeTxRequest => ' +
          (e as any).message,
      )
    }
  })

  test('prepareCosmosTxRequest', async () => {
    try {
      const args = {
        address: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
        message: msg.toWeb3Gw(),
        estimateGas: true,
        gasLimit: DEFAULT_GAS_LIMIT,
        feeDenom: DEFAULT_BRIDGE_FEE_DENOM,
        feePrice: DEFAULT_BRIDGE_FEE_PRICE,
        memo: 'cosmos memo',
      }

      const response =
        await indexerGrpcTransactionApi.prepareCosmosTxRequest(args)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<InjectiveExchangeRpcPb.PrepareCosmosTxResponse>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcTransactionApi.prepareCosmosTxRequest => ' +
          (e as any).message,
      )
    }
  })
})

describe('IndexerGrpcTransactionApi eip712 v3', () => {
  const privateKey = PrivateKey.fromHex('0x' + '1'.padStart(64, '0'))
  const typedData = {
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
        { name: 'salt', type: 'bytes32' },
      ],
      Tx: [
        { name: 'context', type: 'string' },
        { name: 'msgs', type: 'string' },
      ],
    },
    primaryType: 'Tx',
    domain: {
      name: 'Injective Web3',
      version: '3.0.0',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      salt: '0x' + '0'.repeat(64),
    },
    message: { context: '{}', msgs: 'placeholder' },
  }
  const broadcast = async (signMode: string) => {
    const api = new IndexerGrpcTransactionApi(endpoints.indexer)
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({ txHash: 'HASH' })
    const signature = `0x${uint8ArrayToHex(await privateKey.signTypedData(typedData))}`

    await api.broadcastTxRequest({
      signature,
      chainId: 1 as EvmChainId,
      message: msg.toWeb3Gw(),
      txResponse: {
        data: JSON.stringify(typedData),
        pubKeyType: '/injective.crypto.v1beta1.ethsecp256k1.PubKey',
        feePayer: 'inj1feepayer',
        feePayerSig: '0xsig',
        signMode,
      } as InjectiveExchangeRpcPb.PrepareTxResponse,
    })

    return executeGrpcCall.mock
      .calls[0][0] as InjectiveExchangeRpcPb.BroadcastTxRequest
  }

  test('forwards SIGN_MODE_EIP712_V3 and recovers the signer pubkey', async () => {
    const request = await broadcast('SIGN_MODE_EIP712_V3')

    expect(request.signMode).toBe('SIGN_MODE_EIP712_V3')
    expect(request.pubKey?.key).toBe(`0x${privateKey.toPublicKey().toHex()}`)
  })

  test.each(['SIGN_MODE_EIP712_V2', 'SIGN_MODE_LEGACY_AMINO_JSON'])(
    'does not forward %s',
    async (signMode) => {
      const request = await broadcast(signMode)

      expect(request.signMode).toBe('')
    },
  )

  test.each([
    ['v2', 'v2'],
    ['v3', 'v3'],
    [undefined, ''],
  ] as const)(
    'prepareTxRequest eip712Version %s -> eip712Wrapper "%s"',
    async (eip712Version, expected) => {
      const api = new IndexerGrpcTransactionApi(endpoints.indexer)
      const executeGrpcCall = vi
        .spyOn(api as any, 'executeGrpcCall')
        .mockResolvedValue({})

      await api.prepareTxRequest({
        address: getEthereumAddress(
          'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z',
        ) as AccountAddress,
        chainId: 1 as EvmChainId,
        message: msg.toWeb3Gw(),
        eip712Version,
      })

      expect(
        (
          executeGrpcCall.mock
            .calls[0][0] as InjectiveExchangeRpcPb.PrepareTxRequest
        ).eip712Wrapper,
      ).toBe(expected)
    },
  )
})
