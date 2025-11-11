import snakecaseKeys from 'snakecase-keys'
import { toChainFormat } from '@injectivelabs/utils'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgFundCommunityPool from './MsgFundCommunityPool.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgFundCommunityPool['params'] = {
  amount: [
    {
      denom: 'inj',
      amount: toChainFormat(1).toFixed(),
    },
    {
      denom: 'peggy0xdAC17F958D2ee523a2206206994597C13D831ec7',
      amount: toChainFormat(1, 6).toFixed(),
    },
  ],
  depositor: mockFactory.injectiveAddress,
}

const protoType = '/cosmos.distribution.v1beta1.MsgFundCommunityPool'
const protoTypeShort = 'cosmos-sdk/MsgFundCommunityPool'
const protoParams = {
  amount: [params.amount[0], params.amount[1]],
  depositor: params.depositor,
}
const aminoParams = snakecaseKeys(protoParams)

const message = MsgFundCommunityPool.fromJSON(params)

describe('MsgFundCommunityPool', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual(protoParams)
  })

  it('generates proper data', () => {
    const data = message.toData()
    const proto = message.toProto()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...proto,
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()
    const proto = message.toProto()

    expect(amino).toStrictEqual({
      type: protoTypeShort,
      value: {
        depositor: proto.depositor,
        amount: proto.amount,
      },
    })
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      ...aminoParams,
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
