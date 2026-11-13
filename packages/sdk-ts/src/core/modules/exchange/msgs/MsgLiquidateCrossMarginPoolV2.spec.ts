import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgLiquidateCrossMarginPoolV2 from './MsgLiquidateCrossMarginPoolV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgLiquidateCrossMarginPoolV2['params'] = {
  sender: mockFactory.injectiveAddress,
  subaccountId: mockFactory.subaccountId,
  quoteDenom: 'inj',
}

const protoType = '/injective.exchange.v2.MsgLiquidateCrossMarginPool'
const protoTypeShort = 'exchange/v2/MsgLiquidateCrossMarginPool'
const message = MsgLiquidateCrossMarginPoolV2.fromJSON(params)

describe('MsgLiquidateCrossMarginPoolV2', () => {
  it('generates proper proto', () => {
    expect(message.toProto()).toStrictEqual({ ...params, rfqAction: '' })
  })

  it('generates proper data', () => {
    expect(message.toData()).toStrictEqual({
      '@type': protoType,
      ...params,
      rfqAction: '',
    })
  })

  describe('rfqAction', () => {
    const withAction = MsgLiquidateCrossMarginPoolV2.fromJSON({
      ...params,
      rfqAction: 'buy',
    })

    it('is sent in proto and binary', () => {
      expect(withAction.toProto().rfqAction).toBe('buy')
      expect(withAction.toBinary()).not.toStrictEqual(message.toBinary())
    })

    it('is omitted from amino when empty and included when set', () => {
      expect(message.toAmino().value).not.toHaveProperty('rfq_action')
      expect(withAction.toAmino().value).toHaveProperty('rfq_action', 'buy')
    })

    it('is always present in web3Gw (proto-JSON)', () => {
      expect(message.toWeb3Gw()).toHaveProperty('rfq_action', '')
      expect(withAction.toWeb3Gw()).toHaveProperty('rfq_action', 'buy')
    })
  })

  it('generates proper amino', () => {
    expect(message.toAmino()).toStrictEqual({
      type: protoTypeShort,
      value: {
        sender: params.sender,
        subaccount_id: params.subaccountId,
        quote_denom: params.quoteDenom,
      },
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
