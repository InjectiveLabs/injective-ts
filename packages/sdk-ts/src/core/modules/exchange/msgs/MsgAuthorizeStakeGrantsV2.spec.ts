import { Network } from '@injectivelabs/networks'
import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgAuthorizeStakeGrantsV2 from './MsgAuthorizeStakeGrantsV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgAuthorizeStakeGrantsV2['params'] = {
  injectiveAddress: mockFactory.injectiveAddress,
  grants: [
    { grantee: mockFactory.injectiveAddress2, amount: '1000000000000000000' },
  ],
}

const protoType = '/injective.exchange.v2.MsgAuthorizeStakeGrants'
const protoTypeShort = 'exchange/v2/MsgAuthorizeStakeGrants'
const protoParams = {
  sender: params.injectiveAddress,
  grants: params.grants.map(({ grantee, amount }) => ({ grantee, amount })),
}
const message = MsgAuthorizeStakeGrantsV2.fromJSON(params)

describe('MsgAuthorizeStakeGrantsV2', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto).toStrictEqual(protoParams)
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': protoType,
      ...protoParams,
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: protoTypeShort,
      value: { sender: protoParams.sender, grants: protoParams.grants },
    })
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      sender: protoParams.sender,
      grants: protoParams.grants,
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
