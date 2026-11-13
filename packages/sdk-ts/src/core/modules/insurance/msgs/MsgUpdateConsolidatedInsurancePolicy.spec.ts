import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb'
import { protoTypeToAminoType } from '../../../tx/eip712/maps.js'
import MsgUpdateConsolidatedInsurancePolicy from './MsgUpdateConsolidatedInsurancePolicy.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgUpdateConsolidatedInsurancePolicy['params'] = {
  authority: mockFactory.injectiveAddress,
  marketId: mockFactory.derivativeMarketId,
  maxDraw: '5000000',
}

const protoType =
  '/injective.insurance.v1beta1.MsgUpdateConsolidatedInsurancePolicy'
const protoTypeShort = 'insurance/MsgUpdateConsolidatedInsurancePolicy'
const protoParams = {
  authority: params.authority,
  marketId: params.marketId,
  maxDraw: '5000000',
}
const protoParamsAmino = {
  authority: params.authority,
  market_id: params.marketId,
  max_draw: '5000000',
}
const message = MsgUpdateConsolidatedInsurancePolicy.fromJSON(params)

describe('MsgUpdateConsolidatedInsurancePolicy', () => {
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
      InjectiveInsuranceV1Beta1TxPb.MsgUpdateConsolidatedInsurancePolicy.fromBinary(
        message.toBinary(),
      ),
    ).toStrictEqual(message.toProto())
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      // TODO: switch to Network.Mainnet after the v1.21 mainnet upgrade
      network: Network.Testnet,
      messages: message,
    })

    it('EIP712 v1 throws, use toEip712V2', () => {
      expect(() => getEip712TypedData(eip712Args)).toThrow(
        'EIP712_v1 is not supported for MsgUpdateConsolidatedInsurancePolicy. Please use EIP712_v2',
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
})
