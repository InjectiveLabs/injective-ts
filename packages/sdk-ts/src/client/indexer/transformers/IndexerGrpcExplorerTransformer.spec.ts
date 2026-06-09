import { it, expect, describe } from 'vitest'
import { IndexerGrpcExplorerTransformer } from './IndexerGrpcExplorerTransformer.js'
import type * as InjectiveExplorerRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_explorer_rpc_pb'

const encoder = new TextEncoder()

const encodeJson = (value: unknown) => encoder.encode(JSON.stringify(value))

const createTxDetailData = (
  overrides: Partial<InjectiveExplorerRpcPb.TxDetailData> = {},
) =>
  ({
    id: '',
    code: 0,
    memo: '',
    gasUsed: 0n,
    txType: 'injective',
    gasWanted: 0n,
    claimIds: [],
    events: [],
    gasFee: undefined,
    signatures: [],
    codespace: '',
    errorLog: '',
    txNumber: 1n,
    data: encoder.encode('/injective.Tx'),
    logs: encodeJson([]),
    blockNumber: 1n,
    messages: encodeJson([]),
    blockTimestamp: '',
    blockUnixTimestamp: 1n,
    hash: '0xe28841b1cf72062342ab0eef78cb42a48b90c8de639cc6a296c96c723fc9a079',
    ...overrides,
  }) as InjectiveExplorerRpcPb.TxDetailData

describe('IndexerGrpcExplorerTransformer', () => {
  describe('grpcContractTxV2ToTransaction', () => {
    it('returns empty logs when contract tx v2 logs payload is empty', () => {
      const transaction =
        IndexerGrpcExplorerTransformer.grpcContractTxV2ToTransaction(
          createTxDetailData({
            code: 5,
            logs: new Uint8Array(),
          }),
        )

      expect(transaction.logs).toEqual([])
      expect(transaction.txHash).toBe(
        '0xe28841b1cf72062342ab0eef78cb42a48b90c8de639cc6a296c96c723fc9a079',
      )
    })

    it('returns zero amount when contract tx v2 messages payload is empty', () => {
      const transaction =
        IndexerGrpcExplorerTransformer.grpcContractTxV2ToTransaction(
          createTxDetailData({
            messages: new Uint8Array(),
          }),
        )

      expect(transaction.amount.toString()).toBe('0')
    })

    it('returns zero amount when contract tx v2 messages payload is not an array', () => {
      const transaction =
        IndexerGrpcExplorerTransformer.grpcContractTxV2ToTransaction(
          createTxDetailData({
            messages: encodeJson({ type: 'MsgExecuteContract' }),
          }),
        )

      expect(transaction.amount.toString()).toBe('0')
    })

    it('filters malformed contract tx v2 message entries', () => {
      const transaction =
        IndexerGrpcExplorerTransformer.grpcContractTxV2ToTransaction(
          createTxDetailData({
            messages: encodeJson([
              null,
              true,
              'malformed',
              { type: 'MsgExecuteContract' },
              { value: { msg: {} } },
              { type: 'MsgExecuteContract', value: { msg: {} } },
            ]),
          }),
        )

      expect(transaction.messages).toEqual([
        {
          type: 'MsgExecuteContract',
          message: { msg: {} },
        },
      ])
    })
  })
})
