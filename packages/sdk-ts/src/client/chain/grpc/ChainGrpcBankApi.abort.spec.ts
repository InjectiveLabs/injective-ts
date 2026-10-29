import { AbortError } from '@injectivelabs/utils'
import { vi, test, expect, describe, afterEach } from 'vitest'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb'
import * as CosmosBankV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/query_pb'
import * as CosmosBaseQueryV1Beta1PaginationPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/query/v1beta1/pagination_pb'
import { ChainGrpcBankApi } from './ChainGrpcBankApi.js'

const api = new ChainGrpcBankApi('http://localhost:1')

describe('ChainGrpcBankApi cancellation', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('no-argument queries forward RequestOptions through executeGrpcCall', async () => {
    const options = { signal: new AbortController().signal }
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue({
        params: { sendEnabled: [], defaultSendEnabled: false },
      })

    await api.fetchModuleParams(options)

    expect(executeGrpcCall).toHaveBeenCalledTimes(1)
    expect(executeGrpcCall.mock.calls[0][2]).toBe(options)
  })

  test('dictionary-argument queries keep RequestOptions positional', async () => {
    const options = { signal: new AbortController().signal }
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue(
        CosmosBankV1Beta1QueryPb.QueryBalanceResponse.create({
          balance: CosmosBaseV1Beta1CoinPb.Coin.create({
            denom: 'inj',
            amount: '1',
          }),
        }),
      )

    const balance = await api.fetchBalance(
      { accountAddress: 'inj1account', denom: 'inj' },
      options,
    )

    expect(balance).toMatchObject({ denom: 'inj', amount: '1' })
    expect(executeGrpcCall.mock.calls[0][2]).toBe(options)
  })

  test('scalar-argument queries forward RequestOptions', async () => {
    const options = { signal: new AbortController().signal }
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue(
        CosmosBankV1Beta1QueryPb.QuerySupplyOfResponse.create({
          amount: CosmosBaseV1Beta1CoinPb.Coin.create({
            denom: 'inj',
            amount: '2',
          }),
        }),
      )

    const supply = await api.fetchSupplyOf('inj', options)

    expect(supply).toMatchObject({ denom: 'inj', amount: '2' })
    expect(executeGrpcCall.mock.calls[0][2]).toBe(options)
  })

  test('options follow existing optional positional arguments', async () => {
    const options = { signal: new AbortController().signal }
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValue(
        CosmosBankV1Beta1QueryPb.QueryAllBalancesResponse.create(),
      )

    await api.fetchBalances('inj1account', { limit: 1 }, options)

    expect((executeGrpcCall.mock.calls[0][0] as any).pagination.limit).toBe(1n)
    expect(executeGrpcCall.mock.calls[0][2]).toBe(options)
  })

  test('a pre-aborted signal rejects without calling the network and preserves the reason', async () => {
    const controller = new AbortController()
    const reason = new Error('caller cancelled the query')
    controller.abort(reason)
    const executeGrpcCall = vi.spyOn(api as any, 'executeGrpcCall')

    await expect(
      api.fetchSupplyOf('inj', { signal: controller.signal }),
    ).rejects.toMatchObject({
      name: 'AbortError',
      code: 'ERR_CANCELED',
      reason,
    })
    expect(executeGrpcCall).not.toHaveBeenCalled()
  })

  test('fetchAllTotalSupply forwards options to every paginated page', async () => {
    const options = { signal: new AbortController().signal }
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockResolvedValueOnce(
        CosmosBankV1Beta1QueryPb.QueryTotalSupplyResponse.create({
          supply: [
            CosmosBaseV1Beta1CoinPb.Coin.create({
              denom: 'inj',
              amount: '1',
            }),
          ],
          pagination: CosmosBaseQueryV1Beta1PaginationPb.PageResponse.create({
            nextKey: new Uint8Array([1]),
          }),
        }),
      )
      .mockResolvedValueOnce(
        CosmosBankV1Beta1QueryPb.QueryTotalSupplyResponse.create({
          supply: [
            CosmosBaseV1Beta1CoinPb.Coin.create({
              denom: 'usdt',
              amount: '2',
            }),
          ],
          pagination: CosmosBaseQueryV1Beta1PaginationPb.PageResponse.create(),
        }),
      )

    const response = await api.fetchAllTotalSupply({ limit: 1 }, options)

    expect(executeGrpcCall).toHaveBeenCalledTimes(2)
    expect(executeGrpcCall.mock.calls[0][2]).toBe(options)
    expect(executeGrpcCall.mock.calls[1][2]).toBe(options)
    expect(response.supply).toEqual([
      expect.objectContaining({ denom: 'inj', amount: '1' }),
      expect.objectContaining({ denom: 'usdt', amount: '2' }),
    ])
  })

  test('an abort observed between pages stops pagination', async () => {
    const controller = new AbortController()
    const options = { signal: controller.signal }
    const executeGrpcCall = vi
      .spyOn(api as any, 'executeGrpcCall')
      .mockImplementation(async () => {
        const response =
          CosmosBankV1Beta1QueryPb.QueryTotalSupplyResponse.create({
            supply: [
              CosmosBaseV1Beta1CoinPb.Coin.create({
                denom: 'inj',
                amount: '1',
              }),
            ],
            pagination: CosmosBaseQueryV1Beta1PaginationPb.PageResponse.create({
              nextKey: new Uint8Array([1]),
            }),
          })

        controller.abort('stopped after first page')

        return response
      })

    await expect(
      api.fetchAllTotalSupply({ limit: 1 }, options),
    ).rejects.toEqual(
      expect.objectContaining({
        name: 'AbortError',
        reason: 'stopped after first page',
      }),
    )
    expect(executeGrpcCall).toHaveBeenCalledTimes(1)
  })

  test('AbortError instances are never converted into query results', async () => {
    const abortError = new AbortError('not a not-found error')
    vi.spyOn(api as any, 'executeGrpcCall').mockRejectedValue(abortError)

    await expect(api.fetchModuleParams()).rejects.toBe(abortError)
  })
})
