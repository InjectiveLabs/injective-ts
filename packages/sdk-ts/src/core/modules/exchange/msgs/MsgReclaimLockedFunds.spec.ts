import MsgReclaimLockedFunds from './MsgReclaimLockedFunds.js'
import { mockFactory, prepareEip712 } from '@injectivelabs/utils/test-utils'

const params: MsgReclaimLockedFunds['params'] = {
  sender: mockFactory.injectiveAddress,
  lockedAccountPubKey: mockFactory.subaccountId,
  signature: new Uint8Array([1, 2, 3]),
}

const message = MsgReclaimLockedFunds.fromJSON(params)

describe('MsgReclaimLockedFunds', () => {
  describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
    it('EIP712 v1', async () => {
      expect(() =>
        prepareEip712({
          messages: message,
        }),
      ).toThrow()
    })

    it('EIP712 v2', async () => {
      expect(() =>
        prepareEip712({
          messages: message,
        }),
      ).toThrow()
    })
  })
})
