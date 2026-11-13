import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import * as InjectiveExchangeV2TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/tx_pb'
import * as InjectiveExchangeV2ExchangePb from '@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v2/exchange_pb'
import { protoTypeToAminoType } from '../../../tx/eip712/maps.js'
import MsgUpdateSubaccountMarketRiskModeV2 from './MsgUpdateSubaccountMarketRiskModeV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgUpdateSubaccountMarketRiskModeV2['params'] = {
  sender: mockFactory.injectiveAddress,
  subaccountId: mockFactory.subaccountId,
  marketId: mockFactory.derivativeMarketId,
  mode: InjectiveExchangeV2ExchangePb.RiskMode.ISOLATED,
}

const protoType = '/injective.exchange.v2.MsgUpdateSubaccountMarketRiskMode'
const protoTypeShort = 'exchange/v2/MsgUpdateSubaccountMarketRiskMode'
const protoParams = {
  sender: params.sender,
  subaccountId: params.subaccountId,
  marketId: params.marketId,
  mode: InjectiveExchangeV2ExchangePb.RiskMode.ISOLATED,
}
const protoParamsAmino = {
  sender: params.sender,
  subaccount_id: params.subaccountId,
  market_id: params.marketId,
  mode: 1,
}
const message = MsgUpdateSubaccountMarketRiskModeV2.fromJSON(params)

describe('MsgUpdateSubaccountMarketRiskModeV2', () => {
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
      InjectiveExchangeV2TxPb.MsgUpdateSubaccountMarketRiskMode.fromBinary(
        message.toBinary(),
      ),
    ).toStrictEqual(message.toProto())
  })

  it('uses the full enum name in EIP712 v2 and supports unpinning', () => {
    expect(message.toEip712V2()).toHaveProperty('mode', 'RISK_MODE_ISOLATED')

    const unpin = MsgUpdateSubaccountMarketRiskModeV2.fromJSON({
      ...params,
      mode: InjectiveExchangeV2ExchangePb.RiskMode.UNSPECIFIED,
    })

    expect(unpin.toProto().mode).toBe(0)
    // amino omits the zero enum (chain aminojson), proto-JSON keeps it
    expect(unpin.toAmino().value).not.toHaveProperty('mode')
    expect(unpin.toWeb3Gw()).toHaveProperty('mode', 0)
    expect(unpin.toEip712V2()).toHaveProperty('mode', 'RISK_MODE_UNSPECIFIED')
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

    it('EIP712 v1 rejects an omitted mode when unpinning', () => {
      const zero = MsgUpdateSubaccountMarketRiskModeV2.fromJSON({
        ...params,
        mode: InjectiveExchangeV2ExchangePb.RiskMode.UNSPECIFIED,
      })
      const { eip712Args } = prepareEip712({ messages: zero })
      expect(() => getEip712TypedData(eip712Args)).toThrow(
        'Please use EIP712_v2',
      )
    })
  })
})
