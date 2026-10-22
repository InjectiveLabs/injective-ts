import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb'
import { protoTypeToAminoType } from '../../../tx/eip712/maps.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import MsgUnderwriteConsolidatedInsurancePool from './MsgUnderwriteConsolidatedInsurancePool.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgUnderwriteConsolidatedInsurancePool['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  amount: { denom: 'usdt', amount: '1000000' },
  minSharesOut: '1',
}

const protoType =
  '/injective.insurance.v1beta1.MsgUnderwriteConsolidatedInsurancePool'
const protoTypeShort = 'insurance/MsgUnderwriteConsolidatedInsurancePool'
const protoParams = {
  sender: params.injectiveAddress,
  deposit: params.amount,
  minSharesOut: '1',
}
const protoParamsAmino = {
  sender: params.injectiveAddress,
  deposit: params.amount,
  min_shares_out: '1',
}
const message = MsgUnderwriteConsolidatedInsurancePool.fromJSON(params)

describe('MsgUnderwriteConsolidatedInsurancePool', () => {
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
      InjectiveInsuranceV1Beta1TxPb.MsgUnderwriteConsolidatedInsurancePool.fromBinary(
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

    // EIP712 v1 is not supported: the chain/web3gw typed-data generator fails with
    // "invalid Go type math.Int for field ..." for cosmossdk.io/math.Int fields
    it('EIP712 v1 throws, use toEip712V2', () => {
      expect(() => getEip712TypedData(eip712Args)).toThrow(
        'EIP712_v1 is not supported for MsgUnderwriteConsolidatedInsurancePool. Please use EIP712_v2',
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
