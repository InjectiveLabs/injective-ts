import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import {
  DEFAULT_BRIDGE_FEE_DENOM,
  DEFAULT_BRIDGE_FEE_PRICE,
} from '@injectivelabs/utils'
import { IndexerGrpcWeb3GwApi } from './IndexerGrpcWeb3GwApi.js'
import type { EvmChainId, AccountAddress } from '@injectivelabs/ts-types'
import type { InjectiveExchangeRpcPb } from '@injectivelabs/indexer-proto-ts-v2'

const endpoints = getNetworkEndpoints(Network.Mainnet)
const indexerGrpcWeb3GwApi = new IndexerGrpcWeb3GwApi(endpoints.indexer)

describe('IndexerGrpcWeb3GwApi', () => {
  test('prepareEip712Request', async () => {
    try {
      const args = {
        address: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z' as AccountAddress,
        chainId: 1 as EvmChainId,
        message: { test: 'eip712 message' },
        estimateGas: false,
        gasLimit: 250000,
        feeDenom: DEFAULT_BRIDGE_FEE_DENOM,
        feePrice: DEFAULT_BRIDGE_FEE_PRICE,
        memo: 'eip712 memo',
        sequence: 123,
        accountNumber: 456,
        timeoutHeight: 789,
        eip712Version: 'v2',
      }

      const response = await indexerGrpcWeb3GwApi.prepareEip712Request(args)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<InjectiveExchangeRpcPb.PrepareEip712Response>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcWeb3GwApi.prepareEip712Request => ' + (e as any).message,
      )
    }
  })

  test('prepareEip712Request with minimal args', async () => {
    try {
      const args = {
        address: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z' as AccountAddress,
        chainId: 1 as EvmChainId,
        message: { test: 'minimal message' },
      }

      const response = await indexerGrpcWeb3GwApi.prepareEip712Request(args)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<InjectiveExchangeRpcPb.PrepareEip712Response>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcWeb3GwApi.prepareEip712Request with minimal args => ' +
          (e as any).message,
      )
    }
  })

  test('prepareEip712Request with numeric memo', async () => {
    try {
      const args = {
        address: 'inj17gkuet8f6pssxd8nycm3qr9d9y699rupv6397z' as AccountAddress,
        chainId: 1 as EvmChainId,
        message: { test: 'numeric memo message' },
        memo: 12345,
      }

      const response = await indexerGrpcWeb3GwApi.prepareEip712Request(args)

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<InjectiveExchangeRpcPb.PrepareEip712Response>(
          response,
        ),
      )
    } catch (e) {
      console.error(
        'IndexerGrpcWeb3GwApi.prepareEip712Request with numeric memo => ' +
          (e as any).message,
      )
    }
  })
})
