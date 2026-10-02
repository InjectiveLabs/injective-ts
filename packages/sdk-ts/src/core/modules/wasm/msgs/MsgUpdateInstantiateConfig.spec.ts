import { expectTypeOf } from 'vitest'
import { MsgType, EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as CosmwasmWasmV1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/tx_pb'
import * as CosmwasmWasmV1TypesPb from '@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/types_pb'
import MsgExec from '../../authz/msgs/MsgExec.js'
import { MsgUpdateInstantiateConfig } from '../index.js'
import { protoTypeToAminoType } from '../../../tx/eip712/maps.js'
import { getEip712TypedDataV2 } from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from '../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import type { WasmMsgs } from '../../msgs.js'

const params: MsgUpdateInstantiateConfig['params'] = {
  sender: mockFactory.injectiveAddress,
  codeId: 1,
  newInstantiatePermission: {
    permission: CosmwasmWasmV1TypesPb.AccessType.ANY_OF_ADDRESSES,
    addresses: [mockFactory.injectiveAddress],
  },
}
const message = MsgUpdateInstantiateConfig.fromJSON(params)
const protoType = '/cosmwasm.wasm.v1.MsgUpdateInstantiateConfig'
const aminoType = 'wasm/MsgUpdateInstantiateConfig'
const proto = { ...params, codeId: 1n }
const aminoValue = {
  sender: params.sender,
  code_id: '1',
  new_instantiate_permission: {
    permission: 'AnyOfAddresses',
    addresses: params.newInstantiatePermission.addresses,
  },
}

const permissions = [
  {
    permission: CosmwasmWasmV1TypesPb.AccessType.NOBODY,
    name: 'Nobody',
    addresses: [],
  },
  {
    permission: CosmwasmWasmV1TypesPb.AccessType.EVERYBODY,
    name: 'Everybody',
    addresses: [],
  },
  {
    permission: CosmwasmWasmV1TypesPb.AccessType.ANY_OF_ADDRESSES,
    name: 'AnyOfAddresses',
    addresses: [mockFactory.injectiveAddress],
  },
]

describe('MsgUpdateInstantiateConfig', () => {
  it('exports and registers the message', () => {
    expectTypeOf<MsgUpdateInstantiateConfig>().toExtend<WasmMsgs>()
    expect(MsgType.MsgUpdateInstantiateConfig).toBe(protoType.slice(1))
    expect(protoTypeToAminoType(protoType)).toBe(aminoType)
    expect(protoTypeToAminoType(MsgType.MsgUpdateInstantiateConfig)).toBe(
      aminoType,
    )
  })

  it('generates protobuf, data, direct sign and binary representations', () => {
    expect(message.toProto()).toStrictEqual(proto)
    expect(message.toData()).toStrictEqual({ '@type': protoType, ...proto })
    expect(message.toDirectSign()).toStrictEqual({
      type: protoType,
      message: proto,
    })
    expect(
      CosmwasmWasmV1TxPb.MsgUpdateInstantiateConfig.fromBinary(
        message.toBinary(),
      ),
    ).toStrictEqual(proto)
  })

  it('generates Amino, Web3 gateway and EIP-712 v2 representations', () => {
    expect(message.toAmino()).toStrictEqual({
      type: aminoType,
      value: aminoValue,
    })
    expect(message.toWeb3Gw()).toStrictEqual({
      '@type': protoType,
      ...aminoValue,
    })
    expect(message.toEip712V2()).toStrictEqual({
      '@type': protoType,
      ...aminoValue,
    })
  })

  it('rejects unsupported EIP-712 v1 signing', () => {
    expect(() => message.toEip712()).toThrow(
      'EIP712_v1 is not supported for MsgUpdateInstantiateConfig. Please use EIP712_v2',
    )
  })

  it.each([1, '18446744073709551615', 18446744073709551615n])(
    'preserves code ID %s through signing and binary encoding',
    (codeId) => {
      const codeMessage = MsgUpdateInstantiateConfig.fromJSON({
        ...params,
        codeId,
      })
      expect(codeMessage.toAmino().value.code_id).toBe(codeId.toString())
      expect(
        CosmwasmWasmV1TxPb.MsgUpdateInstantiateConfig.fromBinary(
          codeMessage.toBinary(),
        ).codeId,
      ).toBe(BigInt(codeId))
    },
  )

  it.each(permissions)(
    'serializes $name access permissions',
    ({ permission, name, addresses }) => {
      const permissionMessage = MsgUpdateInstantiateConfig.fromJSON({
        ...params,
        newInstantiatePermission: { permission, addresses },
      })
      expect(
        permissionMessage.toAmino().value.new_instantiate_permission,
      ).toStrictEqual({ permission: name, addresses })
      const { eip712Args } = prepareEip712({ messages: permissionMessage })
      expect(
        JSON.parse(getEip712TypedDataV2(eip712Args).message.msgs),
      ).toStrictEqual([
        {
          '@type': protoType,
          ...aminoValue,
          new_instantiate_permission: { permission: name, addresses },
        },
      ])
    },
  )

  it('supports Authz binary wrapping and EIP-712 v2 signing', () => {
    const authzMessage = MsgExec.fromJSON({
      grantee: params.sender,
      msgs: message,
    })
    const wrappedMessage = authzMessage.toProto().msgs[0]
    expect(wrappedMessage.typeUrl).toBe(protoType)
    expect(
      CosmwasmWasmV1TxPb.MsgUpdateInstantiateConfig.fromBinary(
        wrappedMessage.value,
      ),
    ).toStrictEqual(proto)
    const { eip712Args } = prepareEip712({ messages: authzMessage })
    expect(
      JSON.parse(getEip712TypedDataV2(eip712Args).message.msgs),
    ).toStrictEqual([
      {
        '@type': '/cosmos.authz.v1beta1.MsgExec',
        grantee: params.sender,
        msgs: [{ '@type': protoType, ...aminoValue }],
      },
    ])
  })

  it.each(permissions)(
    'matches the live Web3 gateway for $name permissions',
    async ({ permission, addresses }) => {
      const permissionMessage = MsgUpdateInstantiateConfig.fromJSON({
        ...params,
        newInstantiatePermission: { permission, addresses },
      })
      const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
        messages: permissionMessage,
      })
      const response = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V2,
      })
      expect(getEip712TypedDataV2(eip712Args)).toStrictEqual(
        JSON.parse(response.data),
      )
    },
  )
})
