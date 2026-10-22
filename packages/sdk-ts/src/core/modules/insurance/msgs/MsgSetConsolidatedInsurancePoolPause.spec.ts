import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectiveInsuranceV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb'
import { protoTypeToAminoType } from '../../../tx/eip712/maps.js'
import MsgSetConsolidatedInsurancePoolPause from './MsgSetConsolidatedInsurancePoolPause.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgSetConsolidatedInsurancePoolPause['params'] = {
  authority: mockFactory.injectiveAddress,
  depositDenom: 'usdt',
  paused: true,
}

const protoType =
  '/injective.insurance.v1beta1.MsgSetConsolidatedInsurancePoolPause'
const protoTypeShort = 'insurance/MsgSetConsolidatedInsurancePoolPause'
const protoParams = {
  authority: params.authority,
  depositDenom: 'usdt',
  paused: true,
}
const protoParamsAmino = {
  authority: params.authority,
  deposit_denom: 'usdt',
  paused: true,
}
const message = MsgSetConsolidatedInsurancePoolPause.fromJSON(params)

describe('MsgSetConsolidatedInsurancePoolPause', () => {
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

  it('amino omits `paused` when false (chain aminojson omits zero values)', () => {
    const resumed = MsgSetConsolidatedInsurancePoolPause.fromJSON({
      ...params,
      paused: false,
    })
    expect(resumed.toAmino().value).not.toHaveProperty('paused')
    // proto-JSON (web3Gw) always carries it
    expect(resumed.toWeb3Gw()).toHaveProperty('paused', false)
  })

  it('maps the proto type to the chain amino name', () => {
    expect(protoTypeToAminoType(protoType)).toBe(protoTypeShort)
  })

  it('round-trips through binary', () => {
    expect(
      InjectiveInsuranceV1Beta1TxPb.MsgSetConsolidatedInsurancePoolPause.fromBinary(
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

    it('EIP712 v1 matches the gateway when a zero value is omitted (paused=false)', async () => {
      const zero = MsgSetConsolidatedInsurancePoolPause.fromJSON({
        ...params,
        paused: false,
      })
      const { eip712Args: zeroArgs, prepareEip712Request: zeroRequest } =
        prepareEip712({ network: Network.Testnet, messages: zero })
      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...zeroRequest,
        eip712Version: EIP712Version.V1,
      })

      expect(getEip712TypedData(zeroArgs)).toStrictEqual(
        JSON.parse(txResponse.data),
      )
    })
  })
})
