import { expectTypeOf } from 'vitest'
import { Network } from '@injectivelabs/networks'
import { MsgType, EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import MsgUpdateSwapParamsV2 from './MsgUpdateSwapParamsV2.js'
import { protoTypeToAminoType } from '../../../tx/eip712/maps.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import type { ExchangeV2Msgs } from '../../msgs.js'

const params: MsgUpdateSwapParamsV2['params'] = {
  sender: mockFactory.injectiveAddress,
  swapParams: {
    enabled: true,
    allowedMarkets: ['0xmarket'],
  },
}

const message = MsgUpdateSwapParamsV2.fromJSON(params)
const protoType = '/injective.exchange.v2.MsgUpdateSwapParams'
const protoTypeShort = 'exchange/v2/MsgUpdateSwapParams'
const aminoValue = {
  sender: params.sender,
  swap_params: {
    enabled: params.swapParams.enabled,
    allowed_markets: params.swapParams.allowedMarkets,
  },
}

describe('MsgUpdateSwapParamsV2', () => {
  it('is supported by the exchange message union and Amino mapping', () => {
    expectTypeOf<MsgUpdateSwapParamsV2>().toExtend<ExchangeV2Msgs>()
    expect(protoTypeToAminoType(MsgType.MsgUpdateSwapParamsV2)).toBe(
      protoTypeShort,
    )
  })

  it('generates proper direct sign data and binary', () => {
    expect(message.toDirectSign()).toStrictEqual({
      type: protoType,
      message: params,
    })
    expect(
      InjectiveExchangeV2TxPb.MsgUpdateSwapParams.fromBinary(
        message.toBinary(),
      ),
    ).toStrictEqual(params)
  })

  it.each([true, false])(
    'supports an empty market allowlist with enabled=%s',
    (enabled) => {
      const emptyAllowlistParams = {
        sender: params.sender,
        swapParams: { enabled, allowedMarkets: [] },
      }
      const emptyAllowlistMessage =
        MsgUpdateSwapParamsV2.fromJSON(emptyAllowlistParams)
      const { eip712Args } = prepareEip712({ messages: emptyAllowlistMessage })

      expect(
        InjectiveExchangeV2TxPb.MsgUpdateSwapParams.fromBinary(
          emptyAllowlistMessage.toBinary(),
        ),
      ).toStrictEqual(emptyAllowlistParams)
      // representation behind web3Gw / EIP712 keeps the empty allowlist
      expect(
        emptyAllowlistMessage.toAminoRaw().value.swap_params,
      ).toStrictEqual({
        enabled,
        allowed_markets: [],
      })
      // chain aminojson omits empty arrays and `false`
      expect(emptyAllowlistMessage.toAmino().value.swap_params).toStrictEqual(
        enabled ? { enabled } : {},
      )
      // the chain lists the bool but omits an empty array from the v1 types
      expect(
        Object.fromEntries(emptyAllowlistMessage.toEip712Types()),
      ).toMatchObject({
        TypeSwapParams: [{ name: 'enabled', type: 'bool' }],
      })
      expect(
        JSON.parse(getEip712TypedDataV2(eip712Args).message.msgs),
      ).toStrictEqual([emptyAllowlistMessage.toWeb3Gw()])
    },
  )

  it('generates proper proto', () => {
    expect(message.toProto()).toStrictEqual(params)
  })

  it('generates proper data', () => {
    expect(message.toData()).toStrictEqual({
      '@type': protoType,
      ...params,
    })
  })

  it('generates proper amino', () => {
    expect(message.toAmino()).toStrictEqual({
      type: protoTypeShort,
      value: aminoValue,
    })
  })

  it('generates proper web3Gw and EIP712 v2', () => {
    expect(message.toWeb3Gw()).toStrictEqual({
      '@type': protoType,
      ...aminoValue,
    })
    expect(message.toEip712V2()).toStrictEqual({
      '@type': protoType,
      ...aminoValue,
    })
  })

  it('generates proper EIP712 v1', () => {
    expect(message.toEip712()).toStrictEqual({
      type: protoTypeShort,
      value: aminoValue,
    })
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

    it('EIP712 v1 - MsgUpdateSwapParams reaches Web3Gw', async () => {
      const eip712TypedData = getEip712TypedData(eip712Args)
      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V1,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })

    it('EIP712 v2 - MsgUpdateSwapParams reaches Web3Gw', async () => {
      const eip712TypedData = getEip712TypedDataV2(eip712Args)
      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...prepareEip712Request,
        eip712Version: EIP712Version.V2,
      })

      expect(eip712TypedData).toStrictEqual(JSON.parse(txResponse.data))
    })

    it('EIP712 v1 rejects the omitted field (enabled=false with an empty allowlist)', () => {
      const variant = MsgUpdateSwapParamsV2.fromJSON({
        ...params,
        swapParams: { enabled: false, allowedMarkets: [] },
      })
      const { eip712Args } = prepareEip712({ messages: variant })
      expect(() => getEip712TypedData(eip712Args)).toThrow(
        'Please use EIP712_v2',
      )
    })

    it('EIP712 v1 matches the gateway (enabled=true with an empty allowlist)', async () => {
      const variant = MsgUpdateSwapParamsV2.fromJSON({
        ...params,
        swapParams: { enabled: true, allowedMarkets: [] },
      })
      const { eip712Args: variantArgs, prepareEip712Request: variantRequest } =
        prepareEip712({ network: Network.Testnet, messages: variant })
      const txResponse = await new IndexerGrpcWeb3GwApi(
        endpoints.indexer,
      ).prepareEip712Request({
        ...variantRequest,
        eip712Version: EIP712Version.V1,
      })

      expect(getEip712TypedData(variantArgs)).toStrictEqual(
        JSON.parse(txResponse.data),
      )
    })

    it('EIP712 v1 rejects the omitted field (enabled=false with an allowlist)', () => {
      const variant = MsgUpdateSwapParamsV2.fromJSON({
        ...params,
        swapParams: { enabled: false, allowedMarkets: ['0xmarket'] },
      })
      const { eip712Args } = prepareEip712({ messages: variant })
      expect(() => getEip712TypedData(eip712Args)).toThrow(
        'Please use EIP712_v2',
      )
    })
  })
})
