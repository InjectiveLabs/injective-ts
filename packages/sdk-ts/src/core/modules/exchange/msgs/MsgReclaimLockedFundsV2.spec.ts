import { EIP712Version } from '@injectivelabs/ts-types'
import { mockFactory } from '@injectivelabs/utils/test-utils'
import { prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgReclaimLockedFundsV2 from './MsgReclaimLockedFundsV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'
import { IndexerGrpcWeb3GwApi } from './../../../../client/indexer/grpc/IndexerGrpcWeb3GwApi.js'

const params: MsgReclaimLockedFundsV2['params'] = {
  sender: mockFactory.injectiveAddress,
  lockedAccountPubKey: 'dGVzdC1wdWJrZXk=',
  signature: new Uint8Array([1, 2, 3]),
}

const protoType = '/injective.exchange.v2.MsgReclaimLockedFunds'
const protoTypeShort = 'exchange/MsgReclaimLockedFunds'
const message = MsgReclaimLockedFundsV2.fromJSON(params)

describe('MsgReclaimLockedFundsV2', () => {
  it('generates proper data', () => {
    const data = message.toData()

    expect(data['@type']).toStrictEqual(protoType)
    expect(data.sender).toStrictEqual(params.sender)
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino.type).toStrictEqual(protoTypeShort)
    expect(amino.value.sender).toStrictEqual(params.sender)
    expect(amino.value.lockedAccountPubKey).toStrictEqual(
      params.lockedAccountPubKey,
    )
  })

  it('generates proper web3Gw', () => {
    const web3 = message.toWeb3Gw()

    expect(web3).toStrictEqual({
      '@type': protoType,
      sender: params.sender,
      lockedAccountPubKey: params.lockedAccountPubKey,
      signature: 'AQID',
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
