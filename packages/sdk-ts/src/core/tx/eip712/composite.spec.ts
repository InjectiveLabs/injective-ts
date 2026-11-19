import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { getEip712TypedData } from './eip712.js'
import MsgExec from '../../modules/authz/msgs/MsgExec.js'
import MsgUpdateSwapParamsV2 from '../../modules/exchange/msgs/MsgUpdateSwapParamsV2.js'
import MsgSubmitGenericProposal from '../../modules/gov/msgs/MsgSubmitGenericProposal.js'
import MsgBatchUpdateOrdersV2 from '../../modules/exchange/msgs/MsgBatchUpdateOrdersV2.js'
import { IndexerGrpcWeb3GwApi } from './../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import MsgDecreasePositionMarginV2 from '../../modules/exchange/msgs/MsgDecreasePositionMarginV2.js'
import MsgIncreasePositionMarginV2 from '../../modules/exchange/msgs/MsgIncreasePositionMarginV2.js'
import MsgCreateConsolidatedInsurancePool from '../../modules/insurance/msgs/MsgCreateConsolidatedInsurancePool.js'

const sender = mockFactory.injectiveAddress

type Child = MsgBatchUpdateOrdersV2 | MsgUpdateSwapParamsV2

const batchUpdate = MsgBatchUpdateOrdersV2.fromJSON({
  injectiveAddress: sender,
  subaccountId: mockFactory.subaccountId,
  spotOrdersToCreate: [
    {
      orderType: 1,
      marketId: mockFactory.injUsdtSpotMarket.marketId,
      feeRecipient: mockFactory.injectiveAddress2,
      price: '1500000',
      quantity: '100',
      cid: 'test-cid',
      expirationBlock: '100',
    },
  ],
})
const emptyAllowlistSwap = MsgUpdateSwapParamsV2.fromJSON({
  sender,
  swapParams: { enabled: true, allowedMarkets: [] },
})

const execOf = (msg: Child) =>
  MsgExec.fromJSON({ grantee: sender, msgs: [msg] })
const proposalOf = (msg: Child) =>
  MsgSubmitGenericProposal.fromJSON({
    title: 'Test Proposal',
    summary: 'Test Summary',
    expedited: true,
    proposer: sender,
    metadata: 'Test Metadata',
    messages: [msg],
    deposit: { amount: '1', denom: 'inj' },
  })

// Children own their schema rules (an empty list is omitted from their types), and
// the wrapper nests their types under the path of the field that holds them
describe('EIP712 v1 schema of a wrapped message', () => {
  describe.each([
    ['MsgExec', execOf, 'TypeMsgsValue'],
    ['an expedited proposal', proposalOf, 'TypeMessagesValue'],
  ] as const)('inside %s', (_, wrap, prefix) => {
    it('keeps the unused lists of a batch update out of the types', () => {
      const types = wrap(batchUpdate).toEip712Types()

      expect(
        types.get(`${prefix}SpotOrdersToCreate`)?.map(({ name }) => name),
      ).toContain('expiration_block')
      expect(types.has(`${prefix}DerivativeOrdersToCreate`)).toBe(false)
    })

    it('keeps the empty allowlist of a swap out of the types', () => {
      expect(
        wrap(emptyAllowlistSwap).toEip712Types().get(`${prefix}SwapParams`),
      ).toStrictEqual([{ name: 'enabled', type: 'bool' }])
    })
  })

  it('matches the gateway for a swap with an empty allowlist in a proposal', async () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      network: Network.Testnet,
      messages: proposalOf(emptyAllowlistSwap),
    })
    const txResponse = await new IndexerGrpcWeb3GwApi(
      endpoints.indexer,
    ).prepareEip712Request({
      ...prepareEip712Request,
      eip712Version: EIP712Version.V1,
    })

    expect(getEip712TypedData(eip712Args)).toStrictEqual(
      JSON.parse(txResponse.data),
    )
  })
})

// The chain cannot type these on their own (LegacyDec / math.Int fields), but the gateway
// prepares and hashes them inside MsgExec, so only a root message is rejected
describe('EIP712 v1 of a restricted message nested in MsgExec', () => {
  const margin = {
    marketId: mockFactory.derivativeMarketId,
    injectiveAddress: sender,
    srcSubaccountId: mockFactory.subaccountId,
    dstSubaccountId: mockFactory.subaccountId,
    amount: '100',
  }

  it.each([
    [
      'MsgIncreasePositionMarginV2',
      MsgIncreasePositionMarginV2.fromJSON(margin),
    ],
    [
      'MsgDecreasePositionMarginV2',
      MsgDecreasePositionMarginV2.fromJSON(margin),
    ],
    [
      'MsgCreateConsolidatedInsurancePool',
      MsgCreateConsolidatedInsurancePool.fromJSON({
        authority: sender,
        depositDenom: 'usdt',
        quoteDecimals: 6,
        maxDrawPerMarket: '1000000',
        redemptionNoticePeriodSeconds: 86400,
      }),
    ],
  ] as const)('matches the gateway for %s', async (_name, child) => {
    expect(() => child.assertEip712V1Supported()).toThrow(
      'EIP712_v1 is not supported',
    )

    const exec = MsgExec.fromJSON({ grantee: sender, msgs: [child] })
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      network: Network.Testnet,
      messages: exec,
    })
    const txResponse = await new IndexerGrpcWeb3GwApi(
      endpoints.indexer,
    ).prepareEip712Request({
      ...prepareEip712Request,
      eip712Version: EIP712Version.V1,
    })

    expect(getEip712TypedData(eip712Args)).toStrictEqual(
      JSON.parse(txResponse.data),
    )
  })
})
