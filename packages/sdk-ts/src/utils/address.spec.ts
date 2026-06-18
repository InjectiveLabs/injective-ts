import {
  getSubaccountId,
  getEthereumAddress,
  getChecksumAddress,
  getInjectiveAddress,
  getDefaultSubaccountId,
} from '../../src/utils/index.js'

describe('address helper functions', () => {
  it('getInjectiveAddress returns correct value', () => {
    const ethereumAddress = '0xaf79152ac5df276d9a8e1e2e22822f9713474902'
    const injectiveAddress = getInjectiveAddress(ethereumAddress)

    expect(injectiveAddress).toMatch(
      'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku',
    )
  })

  it('getInjectiveAddress accepts hex without a prefix', () => {
    const ethereumAddress = 'af79152ac5df276d9a8e1e2e22822f9713474902'
    const injectiveAddress = getInjectiveAddress(ethereumAddress)

    expect(injectiveAddress).toMatch(
      'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku',
    )
  })

  it('getInjectiveAddress rejects invalid ethereum addresses', () => {
    expect(() => getInjectiveAddress('0x1234')).toThrow(
      'Invalid Ethereum address',
    )
    expect(() => getInjectiveAddress('0xzzzz')).toThrow('Invalid hex string')
  })

  it('getEthereumAddress returns correct value', () => {
    const injectiveAddress = 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku'
    const ethereumAddress = getEthereumAddress(injectiveAddress)

    expect(ethereumAddress).toMatch(
      '0xaf79152ac5df276d9a8e1e2e22822f9713474902',
    )
  })

  it('getDefaultSubaccountId returns correct value', () => {
    const injectiveAddress = 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku'
    const defaultSubaccountId = getDefaultSubaccountId(injectiveAddress)

    expect(defaultSubaccountId).toMatch(
      '0xaf79152ac5df276d9a8e1e2e22822f9713474902000000000000000000000000',
    )
  })

  it('getDefaultSubaccountId rejects ethereum addresses', () => {
    const ethereumAddress = '0xaf79152ac5df276d9a8e1e2e22822f9713474902'

    expect(() => getDefaultSubaccountId(ethereumAddress)).toThrow()
  })

  it('getSubaccountId returns a 32-byte hex value for double digit nonce', () => {
    const injectiveAddress = 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku'
    const subaccountId = getSubaccountId(injectiveAddress, 10)

    expect(subaccountId).toHaveLength(66)
    expect(subaccountId).toBe(
      '0xaf79152ac5df276d9a8e1e2e22822f971347490200000000000000000000000a',
    )
  })

  it('getSubaccountId rejects nonce values outside one byte', () => {
    const injectiveAddress = 'inj14au322k9munkmx5wrchz9q30juf5wjgz2cfqku'

    expect(() => getSubaccountId(injectiveAddress, 256)).toThrow(
      'Invalid nonce',
    )
  })

  it('getChecksumAddress returns correct value', () => {
    const ethereumAddress =
      '0xaf79152ac5df276d9a8e1e2e22822f9713474902'.toLowerCase()

    expect(getChecksumAddress(ethereumAddress)).toMatch(
      '0xAF79152AC5dF276D9A8e1E2E22822f9713474902',
    )
  })
})
