import { ChainId } from '@injectivelabs/ts-types'
import {
  MsgSend,
  MsgIncreasePositionMarginV2,
} from '@injectivelabs/sdk-ts/core/modules'
import { createEip712StdSignDoc } from './tx.js'

const address = 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku'
const args = {
  chainId: ChainId.Testnet,
  accountNumber: 1,
  sequence: 1,
}

describe('createEip712StdSignDoc', () => {
  it('serializes root messages with toEip712', () => {
    const msg = MsgSend.fromJSON({
      srcInjectiveAddress: address,
      dstInjectiveAddress: address,
      amount: { amount: '1', denom: 'inj' },
    })

    expect(createEip712StdSignDoc({ ...args, msgs: [msg] }).msgs).toStrictEqual(
      [msg.toEip712()],
    )
  })

  it('rejects a root message the chain cannot verify with EIP712 v1', () => {
    const msg = MsgIncreasePositionMarginV2.fromJSON({
      marketId: `0x${'1'.repeat(64)}`,
      injectiveAddress: address,
      srcSubaccountId: `0x${'2'.repeat(64)}`,
      dstSubaccountId: `0x${'2'.repeat(64)}`,
      amount: '100',
    })

    expect(() => createEip712StdSignDoc({ ...args, msgs: [msg] })).toThrow(
      'EIP712_v1 is not supported for MsgIncreasePositionMarginV2',
    )
  })
})
