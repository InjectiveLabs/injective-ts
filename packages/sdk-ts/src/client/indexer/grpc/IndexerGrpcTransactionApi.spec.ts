import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import {
  DEFAULT_GAS_LIMIT,
  DEFAULT_BRIDGE_FEE_DENOM,
  DEFAULT_BRIDGE_FEE_PRICE,
} from '@injectivelabs/utils'
import { getEthereumAddress } from '../../../utils/index.js'
import MsgSend from '../../../core/modules/bank/msgs/MsgSend.js'
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
