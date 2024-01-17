import { Network } from '@injectivelabs/networks'
import { Token, TokenFactory } from '../../src'

describe('TokenMetadata', () => {
  const tokenFactory = TokenFactory.make(Network.Mainnet)

  test('luna token metadata', () => {
    const LUNADenom =
      'ibc/B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395'

    const tokenMeta = tokenFactory.toToken(LUNADenom) as Token

    expect(tokenMeta.ibc).toEqual({
      decimals: 6,
      isNative: true,
      symbol: 'LUNA',
      baseDenom: 'uluna',
      path: 'transfer/channel-4',
      channelId: 'channel-4',
      hash: 'B8AF5D92165F35AB31F3FC7C7B444B9D240760FA5D406C49D24862BD0284E395',
    })
  })

  describe('CHZ Token', () => {
    const CHZFactoryDenom =
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1q6kpxy6ar5lkxqudjvryarrrttmakwsvzkvcyh'
    const CHZPeggyDenom = 'peggy0x3506424F91fD33084466F402d5D97f05F8e3b4AF'

    test('fetches correct info for cw20 format', () => {
      const tokenMeta = tokenFactory.toToken(CHZFactoryDenom) as Token

      expect(tokenMeta.decimals).toBe(8)
      expect(tokenMeta.name).toBe('Chiliz')
      expect(tokenMeta.symbol).toBe('CHZ')
    })

    test('fetches correct info for peggy format', () => {
      const tokenMeta = tokenFactory.toToken(CHZPeggyDenom) as Token

      expect(tokenMeta.decimals).toBe(18)
      expect(tokenMeta.name).toBe('Chiliz')
      expect(tokenMeta.symbol).toBe('CHZ')
    })
  })

  describe('SOL Token', () => {
    test('fetches undefined for fake factory denom', () => {
      const tokenMeta = tokenFactory.toToken('factory/inj1/sol')

      expect(tokenMeta).toBe(undefined)
    })

    test('fetches token meta for symbol', () => {
      const tokenMeta = tokenFactory.toToken('SOL')

      expect(tokenMeta).toBeDefined()
    })

    test('fetches token meta for factory denom with cw20 address', () => {
      const tokenMeta = tokenFactory.toToken(
        'factory/inj1/inj1sthrn5ep8ls5vzz8f9gp89khhmedahhdkqa8z3',
      )

      expect(tokenMeta).toBeDefined()
    })

    test('fetches token meta for cw20 address', () => {
      const tokenMeta = tokenFactory.toToken(
        'inj1sthrn5ep8ls5vzz8f9gp89khhmedahhdkqa8z3',
      )

      expect(tokenMeta).toBeDefined()
    })
  })

  describe('USDC token', () => {
    const USDCetFactoryDenom =
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj1q6zlut7gtkzknkk773jecujwsdkgq882akqksk'
    const USDCsoFactoryDenom =
      'factory/inj14ejqjyq8um4p3xfqj74yld5waqljf88f9eneuk/inj12pwnhtv7yat2s30xuf4gdk9qm85v4j3e60dgvu'
    const USDCPeggyDenom = 'peggy0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

    test('fetches correct value for peggyUsdc', () => {
      const tokenMeta = tokenFactory.toToken(USDCPeggyDenom) as Token

      expect(tokenMeta).toEqual(
        expect.objectContaining({
          erc20: {
            decimals: 6,
            symbol: 'USDC',
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          },
        }),
      )
    })

    test('fetches correct value for Usdcet', () => {
      const tokenMeta = tokenFactory.toToken(USDCetFactoryDenom) as Token

      expect(tokenMeta).toEqual(
        expect.objectContaining({
          cw20: {
            decimals: 6,
            symbol: 'USDCet',
            source: 'ethereum-wormhole',
            address: 'inj1q6zlut7gtkzknkk773jecujwsdkgq882akqksk',
          },
        }),
      )
    })

    test('fetches correct value for Usdcso', () => {
      const tokenMeta = tokenFactory.toToken(USDCsoFactoryDenom) as Token

      expect(tokenMeta).toEqual(
        expect.objectContaining({
          cw20: {
            decimals: 6,
            symbol: 'USDCso',
            source: 'solana',
            address: 'inj12pwnhtv7yat2s30xuf4gdk9qm85v4j3e60dgvu',
          },
        }),
      )
    })

    test('fetches correct decimal value for peggy format', () => {
      const tokenMeta = tokenFactory.toToken(USDCPeggyDenom) as Token

      expect(tokenMeta).toEqual(
        expect.objectContaining({
          erc20: {
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            decimals: 6,
            symbol: 'USDC',
          },
        }),
      )
    })
  })
})
