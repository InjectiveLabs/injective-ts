import { BigNumberInBase } from '@injectivelabs/utils'
import { mockFactory } from '@injectivelabs/test-utils'
import MsgBid from './MsgBid.js'
import snakecaseKeys from 'snakecase-keys'

const params: MsgBid['params'] = {
  round: 1,
  injectiveAddress: mockFactory.injectiveAddress,
  amount: {
    amount: new BigNumberInBase(1).toFixed(),
    denom: 'inj',
  },
}

const protoType = '/injective.auction.v1beta1.MsgBid'
const protoTypeAmino = 'auction/MsgBid'
const protoParams = {
  sender: params.injectiveAddress,
  bidAmount: params.amount,
  round: params.round.toString(),
}
const aminoParams = snakecaseKeys(protoParams)

const message = MsgBid.fromJSON(params)

describe('MsgBid', () => {
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
      type: protoTypeAmino,
      value: aminoParams,
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
      type: protoTypeAmino,
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
      '@type': protoType,
      ...aminoParams,
    })
  })
})
