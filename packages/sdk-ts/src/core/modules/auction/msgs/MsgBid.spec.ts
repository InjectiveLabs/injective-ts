import { MsgBid as BaseMsgBid } from '@injectivelabs/chain-api/injective/auction/v1beta1/tx_pb'
import { BigNumberInBase } from '@injectivelabs/utils'
import MsgBid from './MsgBid'

const params: MsgBid['params'] = {
  round: 1,
  injectiveAddress: 'inj1qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqe2hm49',
  amount: {
    amount: new BigNumberInBase(1).toFixed(),
    denom: 'inj',
  },
}

const message = MsgBid.fromJSON(params)

describe.only('MsgBid', () => {
  it('generates proper proto', () => {
    const proto = message.toProto()

    expect(proto instanceof BaseMsgBid).toBe(true)
    expect(proto.toObject()).toStrictEqual({
      sender: params.injectiveAddress,
      bidAmount: params.amount,
      round: params.round,
    })
  })

  it('generates proper data', () => {
    const data = message.toData()

    expect(data).toStrictEqual({
      '@type': '/injective.auction.v1beta1.MsgBid',
      sender: params.injectiveAddress,
      bidAmount: params.amount,
      round: params.round,
    })
  })

  it('generates proper amino', () => {
    const amino = message.toAmino()

    expect(amino).toStrictEqual({
      type: 'auction/MsgBid',
      sender: params.injectiveAddress,
      bidAmount: params.amount,
      round: params.round,
    })
  })

  it('generates proper Eip712 types', () => {
    const eip712Types = message.toEip712Types()

    expect(Object.fromEntries(eip712Types)).toStrictEqual({
      TypeBidAmount: [
        { name: 'denom', type: 'string' },
        { name: 'amount', type: 'string' },
      ],
      MsgValue: [
        { name: 'sender', type: 'string' },
        { name: 'bid_amount', type: 'TypeBidAmount' },
        { name: 'round', type: 'uint64' },
      ],
    })
  })

  it('generates proper Eip712 values', () => {
    const eip712 = message.toEip712()

    expect(eip712).toStrictEqual({
      type: 'auction/MsgBid',
      value: {
        sender: params.injectiveAddress,
        bid_amount: params.amount,
        round: params.round.toString(),
      },
    })
  })

  it('generates proper web3', () => {
    const web3 = message.toWeb3()

    expect(web3).toStrictEqual({
      '@type': '/injective.auction.v1beta1.MsgBid',
      sender: params.injectiveAddress,
      bidAmount: params.amount,
      round: params.round,
    })
  })
})
