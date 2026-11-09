import { hashTypedData } from 'viem'
import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { getEip712TypedData } from './eip712.js'
import MsgVote from '../../modules/gov/msgs/MsgVote.js'
import MsgSend from '../../modules/bank/msgs/MsgSend.js'
import MsgSubmitGenericProposal from '../../modules/gov/msgs/MsgSubmitGenericProposal.js'
import MsgCreateSpotLimitOrder from '../../modules/exchange/msgs/MsgCreateSpotLimitOrder.js'
import { IndexerGrpcWeb3GwApi } from './../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import type { TypedDataDefinition } from 'viem'

const address = mockFactory.injectiveAddress
const send = MsgSend.fromJSON({
  srcInjectiveAddress: address,
  dstInjectiveAddress: mockFactory.injectiveAddress2,
  amount: { amount: '1', denom: 'inj' },
})

// The chain's amino-json omits an empty string, so it declares no type for it, on every
// message and not only the exchange ones. The values may still carry the empty string:
// the hash only covers declared fields, so the hash is what must match the gateway's.
describe('EIP712 v1 of a message with empty strings', () => {
  it.each([
    [
      'a gov vote with an empty metadata',
      MsgVote.fromJSON({
        proposalId: 1,
        metadata: '',
        vote: 1,
        voter: address,
      }),
    ],
    [
      'a gov proposal with an empty metadata',
      MsgSubmitGenericProposal.fromJSON({
        title: 'Test Proposal',
        summary: 'Test Summary',
        expedited: true,
        proposer: address,
        metadata: '',
        messages: [send],
        deposit: { amount: '1', denom: 'inj' },
      }),
    ],
    [
      'a v1 spot order with an empty fee recipient and cid',
      MsgCreateSpotLimitOrder.fromJSON({
        marketId: mockFactory.injUsdtSpotMarket.marketId,
        subaccountId: mockFactory.subaccountId,
        injectiveAddress: address,
        orderType: 1,
        feeRecipient: '',
        price: '1500000',
        quantity: '100',
        cid: '',
      }),
    ],
  ] as const)('hashes like the gateway for %s', async (_name, message) => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      network: Network.Testnet,
      messages: message,
    })
    const txResponse = await new IndexerGrpcWeb3GwApi(
      endpoints.indexer,
    ).prepareEip712Request({
      ...prepareEip712Request,
      eip712Version: EIP712Version.V1,
    })

    expect(
      hashTypedData(
        getEip712TypedData(eip712Args) as unknown as TypedDataDefinition,
      ),
    ).toBe(hashTypedData(JSON.parse(txResponse.data) as TypedDataDefinition))
  })
})
