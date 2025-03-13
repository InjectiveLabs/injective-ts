import {
  getEthereumAddress,
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
})
