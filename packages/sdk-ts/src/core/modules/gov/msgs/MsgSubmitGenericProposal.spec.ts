import { Network } from '@injectivelabs/networks'
import { toChainFormat } from '@injectivelabs/utils'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import { MsgSend } from '../../bank/index.js'
import MsgSubmitGenericProposal from './MsgSubmitGenericProposal.js'
import { MsgIncreasePositionMarginV2 } from '../../exchange/index.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import MsgSetConsolidatedInsurancePoolPause from '../../insurance/msgs/MsgSetConsolidatedInsurancePoolPause.js'

const params: MsgSubmitGenericProposal['params'] = {
  title: 'Test Proposal',
  summary: 'Test Summary',
  expedited: false,
  proposer: mockFactory.injectiveAddress,
  metadata: 'Test Metadata',
  messages: [
    MsgSend.fromJSON({
      srcInjectiveAddress: mockFactory.injectiveAddress,
      dstInjectiveAddress: mockFactory.injectiveAddress,
      amount: {
        amount: toChainFormat(1).toFixed(),
        denom: 'inj',
      },
    }),
  ],
  deposit: {
    amount: toChainFormat(1).toFixed(),
    denom: 'inj',
  },
}

const message = MsgSubmitGenericProposal.fromJSON(params)

describe('MsgSubmitGenericProposal', () => {
  describe('with an inner V2 exchange message', () => {
    const inner = MsgIncreasePositionMarginV2.fromJSON({
      marketId: mockFactory.derivativeMarketId,
      injectiveAddress: mockFactory.injectiveAddress,
      srcSubaccountId: mockFactory.subaccountId,
      dstSubaccountId: mockFactory.subaccountId,
      amount: '100',
    })
    const proposal = MsgSubmitGenericProposal.fromJSON({
      ...params,
      messages: [inner],
    })

    it('amino embeds the chain-format amino of the inner message', () => {
      const [aminoInner] = proposal.toAmino().value.messages

      expect(aminoInner).toStrictEqual(inner.toAmino())
      expect(aminoInner.value.amount).toBe('100000000000000000000')
    })

    it('EIP712 v2 embeds the EIP712 v2 values of the inner message', async () => {
      const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
        network: Network.Testnet,
        messages: proposal,
      })
      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V2,
      })

      expect(getEip712TypedDataV2(eip712Args)).toStrictEqual(
        JSON.parse(txResponse.data),
      )
    })

    it('web3Gw keeps the inner proto-JSON (human-readable decimals)', () => {
      expect(proposal.toWeb3Gw().messages).toStrictEqual([inner.toWeb3Gw()])
      expect(inner.toWeb3Gw().amount).toBe('100')
    })
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      messages: message,
    })

    it('EIP712 v1 rejects an omitted expedited flag', () => {
      expect(() => getEip712TypedData(eip712Args)).toThrow(
        'msgs[0].value.expedited',
      )
    })

    it('EIP712 v2', async () => {
      const eip712TypedData = getEip712TypedDataV2(eip712Args)

      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V2,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })
  })

  describe('with an inner message that omits a zero value', () => {
    const proposal = MsgSubmitGenericProposal.fromJSON({
      ...params,
      expedited: true,
      messages: [
        MsgSetConsolidatedInsurancePoolPause.fromJSON({
          authority: mockFactory.injectiveAddress,
          depositDenom: 'usdt',
          paused: false,
        }),
      ],
    })

    it('EIP712 v1 types declare the omitted field, so signing it is rejected', () => {
      expect(JSON.stringify([...proposal.toEip712Types()])).toContain(
        '"paused"',
      )

      const { eip712Args } = prepareEip712({ messages: proposal })

      expect(() => getEip712TypedData(eip712Args)).toThrow('paused')
    })
  })
})
