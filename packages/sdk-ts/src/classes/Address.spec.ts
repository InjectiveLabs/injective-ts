import { Address } from './Address'

const injectiveAddress = 'inj1hkhdaj2a2clmq5jq6mspsggqs32vynpk228q3r'
const ethereumAddress = '0xbdaedec95d563fb05240d6e01821008454c24c36'

describe('Address', () => {
  it('creates an instance of the Address class using an injective address', () => {
    const address = Address.fromBech32(injectiveAddress)

    expect(address.toBech32()).toEqual(injectiveAddress)
    expect(address.toHex()).toEqual(ethereumAddress)
  })

  it('creates an instance of the Address class using an ethereum address', () => {
    const address = Address.fromHex(ethereumAddress)

    expect(address.toBech32()).toEqual(injectiveAddress)
    expect(address.toHex()).toEqual(ethereumAddress)
    expect(address.getEthereumAddress()).toEqual(ethereumAddress)
  })

  it('creates an instance of the Address class using an ethereum address without 0x', () => {
    const address = Address.fromHex(ethereumAddress.slice(2))

    expect(address.toBech32()).toEqual(injectiveAddress)
    expect(address.toHex()).toEqual(ethereumAddress)
    expect(address.getEthereumAddress()).toEqual(ethereumAddress)
  })

  it('can compare two injective addresses', () => {
    const address = Address.fromHex(ethereumAddress)
    const address1 = Address.fromBech32(injectiveAddress)

    expect(address.compare(address1)).toEqual(true)
  })

  it('returns the correct subaccount id for an injective address', () => {
    const address = Address.fromBech32(injectiveAddress)
    const defaultSubaccountIdIndex = 0

    expect(address.getSubaccountId()).toEqual(
      ethereumAddress + '0'.repeat(23) + defaultSubaccountIdIndex,
    )
  })
})
