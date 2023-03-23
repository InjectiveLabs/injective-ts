import { Network } from '@injectivelabs/networks'
import { Token, TokenFactory } from '../../src'

describe('token meta retrieved properly for', () => {
  const tokenFactory = TokenFactory.make(Network.Mainnet)

  it('luna token', () => {
    const LUNADenom =
      'ibc/B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395'

    const tokenMeta = tokenFactory.toToken(LUNADenom) as Token

    expect(tokenMeta.ibc).toEqual({
      decimals: 6,
      isNative: true,
      baseDenom: 'uluna',
      path: 'transfer/channel-4',
      channelId: 'channel-4',
      hash: 'B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395',
      tokenType: 'ibc',
    })
  })

  describe('chz token', () => {
    const CHZFactoryDenom =
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1q6kpxy6ar5lkxqudjvryarrrttmakwsvzkvcyh'
    const CHZPeggyDenom = 'peggy0x3506424F91fD33084466F402d5D97f05F8e3b4AF'

    it('fetches correct decimal value for cw20 format', () => {
      const tokenMeta = tokenFactory.toToken(CHZFactoryDenom) as Token

      expect(tokenMeta.decimals).toBe(8)
    })

    it('fetches correct decimal value for peggy format', () => {
      const tokenMeta = tokenFactory.toToken(CHZPeggyDenom) as Token

      expect(tokenMeta.decimals).toBe(18)
    })
  })

  describe('usdc token', () => {
    const USDCetFactoryDenom =
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1q6zlut7gtkzknkk773jecujwsdkgq882akqksk'
    const USDCsoFactoryDenom =
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj12pwnhtv7yat2s30xuf4gdk9qm85v4j3e60dgvu'
    const USDCPeggyDenom = 'peggy0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

    it('fetches correct value for peggyUsdc', () => {
      const tokenMeta = tokenFactory.toToken(USDCetFactoryDenom) as Token

      expect(tokenMeta).toEqual(
        expect.objectContaining({
          cw20: {
            decimals: 6,
            symbol: 'USDCet',
            source: 'ethereum-wormhole',
            address: 'inj1q6zlut7gtkzknkk773jecujwsdkgq882akqksk',
            tokenType: 'cw20',
          },
        }),
      )
    })

    it('fetches correct value for Usdcet', () => {
      const tokenMeta = tokenFactory.toToken(USDCetFactoryDenom) as Token

      expect(tokenMeta).toEqual(
        expect.objectContaining({
          cw20: {
            decimals: 6,
            symbol: 'USDCet',
            source: 'ethereum-wormhole',
            address: 'inj1q6zlut7gtkzknkk773jecujwsdkgq882akqksk',
            tokenType: 'cw20',
          },
        }),
      )
    })

    it('fetches correct value for Usdcso', () => {
      const tokenMeta = tokenFactory.toToken(USDCsoFactoryDenom) as Token

      expect(tokenMeta).toEqual(
        expect.objectContaining({
          cw20: {
            decimals: 6,
            symbol: 'USDCso',
            source: 'solana',
            address: 'inj12pwnhtv7yat2s30xuf4gdk9qm85v4j3e60dgvu',
            tokenType: 'cw20',
          },
        }),
      )
    })

    it('fetches correct decimal value for peggy format', () => {
      const tokenMeta = tokenFactory.toToken(USDCPeggyDenom) as Token

      expect(tokenMeta).toEqual(
        expect.objectContaining({
          erc20: {
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            decimals: 6,
            symbol: 'USDC',
            tokenType: 'erc20',
          },
        }),
      )
    })
  })
})
