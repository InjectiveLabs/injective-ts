import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb'
import { protoTypeToAminoType } from '../../../tx/eip712/maps.js'
import MsgRequestConsolidatedRedemption from './MsgRequestConsolidatedRedemption.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgRequestConsolidatedRedemption['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  poolDenom: 'insurance/usdt',
  amount: { denom: 'insurance/usdt', amount: '1000' },
}

const protoType =
  '/injective.insurance.v1beta1.MsgRequestConsolidatedRedemption'
const protoTypeShort = 'insurance/MsgRequestConsolidatedRedemption'
const protoParams = {
  sender: params.injectiveAddress,
  poolDenom: 'insurance/usdt',
  shares: params.amount,
}
const protoParamsAmino = {
  sender: params.injectiveAddress,
  pool_denom: 'insurance/usdt',
  shares: params.amount,
}
const message = MsgRequestConsolidatedRedemption.fromJSON(params)

describe('MsgRequestConsolidatedRedemption', () => {
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
      InjectiveInsuranceV1Beta1TxPb.MsgRequestConsolidatedRedemption.fromBinary(
        message.toBinary(),
      ),
    ).toStrictEqual(message.toProto())
  })

  it('EIP712 v1 values and type equal the amino-json of the proto', () => {
    const eip712 = message.toEip712()
    const amino = message.toAmino()

    expect(eip712.type).toBe(amino.type)
    expect(eip712.value).toStrictEqual(amino.value)
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
      // TODO: switch to Network.Mainnet after the v1.21 mainnet upgrade
      network: Network.Testnet,
      messages: message,
    })

    it('EIP712 v1', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)
      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V1,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
      expect(message.toAmino()).toStrictEqual(
        JSON.parse(txResponse.data).message.msgs[0],
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
