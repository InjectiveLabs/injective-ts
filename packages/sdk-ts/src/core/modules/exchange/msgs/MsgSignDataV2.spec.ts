import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'
import MsgSignDataV2 from './MsgSignDataV2.js'
import {
  getEip712TypedData,
  getEip712TypedDataV2,
} from '../../../tx/eip712/eip712.js'

const params: MsgSignDataV2['params'] = {
  sender: mockFactory.injectiveAddress,
  data: 'test-data',
}

const message = MsgSignDataV2.fromJSON(params)

describe('MsgSignDataV2', () => {
  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    const { eip712Args } = prepareEip712({ messages: message })

    it('EIP712 v1 structure is valid', () => {
      const eip712TypedData = getEip712TypedData(eip712Args)

      expect(eip712TypedData.primaryType).toStrictEqual('Tx')
      expect(eip712TypedData.domain).toBeDefined()
      expect((eip712TypedData.message.msgs[0] as any).type).toStrictEqual(
        'sign/MsgSignData',
      )
    })

    it('EIP712 v2 structure is valid', () => {
      const eip712TypedData = getEip712TypedDataV2(eip712Args)

      expect(eip712TypedData.primaryType).toStrictEqual('Tx')
      expect(eip712TypedData.domain).toBeDefined()
      const parsedMsgs = JSON.parse(eip712TypedData.message.msgs as string)
      expect(parsedMsgs[0]['@type']).toStrictEqual(
        '/injective.exchange.v2.MsgSignData',
      )
    })
  })
})
