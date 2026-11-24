import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import { protoTypeToAminoType } from '../../../tx/eip712/maps.js'
import MsgSetOutflowGuardBlockedV2 from './MsgSetOutflowGuardBlockedV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgSetOutflowGuardBlockedV2['params'] = {
  sender: mockFactory.injectiveAddress,
  blocked: true,
}

const protoType = '/injective.exchange.v2.MsgSetOutflowGuardBlocked'
const protoTypeShort = 'exchange/v2/MsgSetOutflowGuardBlocked'
const protoParams = {
  sender: params.sender,
  blocked: true,
}
const message = MsgSetOutflowGuardBlockedV2.fromJSON(params)

describe('MsgSetOutflowGuardBlockedV2', () => {
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
      value: protoParams,
    })
  })

  it('generates proper web3Gw', () => {
    expect(message.toWeb3Gw()).toStrictEqual({
      '@type': protoType,
      ...protoParams,
    })
  })

  it('amino omits `blocked` when false (chain aminojson omits zero values)', () => {
    const cleared = MsgSetOutflowGuardBlockedV2.fromJSON({
      ...params,
      blocked: false,
    })

    expect(cleared.toAmino().value).not.toHaveProperty('blocked')
    expect(cleared.toWeb3Gw()).toHaveProperty('blocked', false)
  })

  it('maps the proto type to the chain amino name', () => {
    expect(protoTypeToAminoType(protoType)).toBe(protoTypeShort)
  })

  it('round-trips through binary', () => {
    expect(
      InjectiveExchangeV2TxPb.MsgSetOutflowGuardBlocked.fromBinary(
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

  it('EIP712 v1 rejects an omitted blocked flag when clearing', () => {
    const cleared = MsgSetOutflowGuardBlockedV2.fromJSON({
      ...params,
      blocked: false,
    })
    const { eip712Args } = prepareEip712({ messages: cleared })

    expect(() => getEip712TypedData(eip712Args)).toThrow('Please use EIP712_v2')
  })

  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
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
