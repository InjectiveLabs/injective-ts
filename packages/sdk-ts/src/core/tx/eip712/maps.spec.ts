import { objectKeysToEip712Types } from './maps.js'

describe('objectKeysToEip712Types', () => {
  it('drops an empty order_hash and types order_mask as int32', () => {
    const types = objectKeysToEip712Types({
      object: {
        market_id: 'market',
        subaccount_id: 'subaccount',
        order_hash: '',
        order_mask: 1,
        cid: 'order-1',
      },
    })

    expect(types.get('MsgValue')).toEqual([
      { name: 'market_id', type: 'string' },
      { name: 'subaccount_id', type: 'string' },
      { name: 'order_mask', type: 'int32' },
      { name: 'cid', type: 'string' },
    ])
  })
})
