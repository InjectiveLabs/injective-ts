import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb'
import { protoTypeToAminoType } from '../../../tx/eip712/maps.js'
import MsgSubmitGenericProposal from '../../gov/msgs/MsgSubmitGenericProposal.js'
import MsgCreateConsolidatedInsurancePool from './MsgCreateConsolidatedInsurancePool.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgCreateConsolidatedInsurancePool['params'] = {
  authority: mockFactory.injectiveAddress,
  depositDenom: 'usdt',
  quoteDecimals: 6,
  maxDrawPerMarket: '1000000',
  redemptionNoticePeriodSeconds: 86400,
}

const protoType =
  '/injective.insurance.v1beta1.MsgCreateConsolidatedInsurancePool'
const protoTypeShort = 'insurance/MsgCreateConsolidatedInsurancePool'
const protoParams = {
  authority: params.authority,
  depositDenom: 'usdt',
  quoteDecimals: 6,
  maxDrawPerMarket: '1000000',
  redemptionNoticePeriodSeconds: 86400n,
}
const protoParamsAmino = {
  authority: params.authority,
  deposit_denom: 'usdt',
  quote_decimals: 6,
  max_draw_per_market: '1000000',
  redemption_notice_period_seconds: '86400',
}
const message = MsgCreateConsolidatedInsurancePool.fromJSON(params)

describe('MsgCreateConsolidatedInsurancePool', () => {
  it('generates proper proto', () => {
    expect(message.toProto()).toStrictEqual(protoParams)
  })

  it('generates proper data', () => {
    expect(message.toData()).toStrictEqual({
      '@type': protoType,
      ...protoParams,
    })
  })

  it('generates proper amino', () => {
    expect(message.toAmino()).toStrictEqual({
      type: protoTypeShort,
      value: protoParamsAmino,
    })
  })

  it('generates proper web3Gw', () => {
    expect(message.toWeb3Gw()).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
  })

  it('maps the proto type to the chain amino name', () => {
    expect(protoTypeToAminoType(protoType)).toBe(protoTypeShort)
  })

  it('round-trips through binary', () => {
    expect(
      InjectiveInsuranceV1Beta1TxPb.MsgCreateConsolidatedInsurancePool.fromBinary(
        message.toBinary(),
      ),
    ).toStrictEqual(message.toProto())
  })

  it('accepts the notice period as a string', () => {
    expect(
      MsgCreateConsolidatedInsurancePool.fromJSON({
        ...params,
        redemptionNoticePeriodSeconds: '86400',
      }).toProto(),
    ).toStrictEqual(protoParams)
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      // TODO: switch to Network.Mainnet after the v1.21 mainnet upgrade
      network: Network.Testnet,
      messages: message,
    })

    // EIP712 v1 is not supported: the chain/web3gw typed-data generator fails with
    // "invalid Go type math.Int for field ..." for cosmossdk.io/math.Int fields
    it('EIP712 v1 throws, use toEip712V2', () => {
      expect(() => getEip712TypedData(eip712Args)).toThrow(
        'EIP712_v1 is not supported for MsgCreateConsolidatedInsurancePool. Please use EIP712_v2',
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

  describe('inside an expedited proposal (governance creates the pool)', () => {
    const proposal = MsgSubmitGenericProposal.fromJSON({
      title: 'Create pool',
      summary: 'Create pool',
      expedited: true,
      proposer: mockFactory.injectiveAddress,
      metadata: 'Test Metadata',
      messages: [message],
      deposit: { amount: '1', denom: 'inj' },
    })
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      network: Network.Testnet,
      messages: proposal,
    })

    it('EIP712 v1 types the integers like the chain', () => {
      const fields = [...proposal.toEip712Types().values()]
        .flat()
        .filter(({ name }) =>
          ['quote_decimals', 'redemption_notice_period_seconds'].includes(name),
        )

      expect(fields).toStrictEqual([
        { name: 'quote_decimals', type: 'uint32' },
        { name: 'redemption_notice_period_seconds', type: 'int64' },
      ])
    })

    it('EIP712 v1 matches the Web3Gw (chain)', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)
      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V1,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })
  })
})
