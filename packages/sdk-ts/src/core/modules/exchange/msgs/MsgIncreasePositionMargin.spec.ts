import MsgIncreasePositionMargin from './MsgIncreasePositionMargin.js'
import snakecaseKeys from 'snakecase-keys'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'
import { EIP712Version } from '@injectivelabs/ts-types'

const params: MsgIncreasePositionMargin['params'] = {
  marketId: mockFactory.injUsdtDerivativeMarket.marketId,
  injectiveAddress: mockFactory.injectiveAddress,
  srcSubaccountId: mockFactory.subaccountId,
  dstSubaccountId: mockFactory.subaccountId2,
  amount: '1000',
}

const protoType = '/injective.exchange.v1beta1.MsgIncreasePositionMargin'
const protoTypeShort = 'exchange/MsgIncreasePositionMargin'
const protoParams = {
  marketId: params.marketId,
  sender: params.injectiveAddress,
  sourceSubaccountId: params.srcSubaccountId,
  destinationSubaccountId: params.dstSubaccountId,
  amount: params.amount,
}
const protoParamsAmino = snakecaseKeys(protoParams)
const message = MsgIncreasePositionMargin.fromJSON(params)

describe('MsgIncreasePositionMargin', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual({
      ...protoParams,
      amount: '1000000000000000000000',
    })
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParams,
      amount: '1000000000000000000000',
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeShort,
      value: protoParamsAmino,
    })
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...protoParamsAmino,
    })
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
