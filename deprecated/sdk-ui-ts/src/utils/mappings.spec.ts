import { getValidatorLogoWithVendorPathPrefix } from './helpers'

describe('validator logos helper function', () => {
  describe('getValidatorLogoWithVendorPathPrefix', () => {
    it('returns correct value from operator address', () => {
      const address = 'injvaloper10zxm0rklrnurd999xgr4ss8v2q9qsjlfhhk9mk'

      const validatorLogo = getValidatorLogoWithVendorPathPrefix(address)
      expect(validatorLogo).toMatch(
        '/vendor/@injectivelabs/sdk-ui-ts/injvaloper10zxm0rklrnurd999xgr4ss8v2q9qsjlfhhk9mk.jpg',
      )
    })

    it('returns correct value from consensus address', () => {
      const address = 'injvalcons1nx802hvk40x02mlh8qya3nuuep2sejtgxn838l'

      const validatorLogo = getValidatorLogoWithVendorPathPrefix(address)
      expect(validatorLogo).toMatch(
        '/vendor/@injectivelabs/sdk-ui-ts/injvaloper10zxm0rklrnurd999xgr4ss8v2q9qsjlfhhk9mk.webp',
      )
    })

    it('returns correct value from non-existent address', () => {
      const address = 'inj12345678'

      const validatorLogo = getValidatorLogoWithVendorPathPrefix(address)
      expect(validatorLogo).toMatch(
        '/vendor/@injectivelabs/sdk-ui-ts/unknown.png',
      )
    })
  })
})
